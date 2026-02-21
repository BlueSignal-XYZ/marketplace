"""Low-level SPI driver for SX1262 LoRa transceiver.

Pin assignment on the WQM-1 HAT:
  MOSI  = GPIO 10  (SPI0)
  MISO  = GPIO 9   (SPI0)
  SCLK  = GPIO 11  (SPI0)
  NSS   = GPIO 8   (SPI0 CE0)
  DIO1  = GPIO 17  (TX/RX interrupt)
  BUSY  = GPIO 22  (module busy status)
  NRESET= GPIO 27  (hardware reset)

This module wraps spidev + RPi.GPIO for register-level access.
The LoRaWAN MAC layer in lorawan.py builds on top of this.
"""

import time
import logging

log = logging.getLogger("wqm.sx1262")

CMD_SET_SLEEP = 0x84
CMD_SET_STANDBY = 0x80
CMD_SET_TX = 0x83
CMD_SET_RX = 0x82
CMD_WRITE_REGISTER = 0x0D
CMD_READ_REGISTER = 0x1D
CMD_WRITE_BUFFER = 0x0E
CMD_READ_BUFFER = 0x1E
CMD_SET_DIO_IRQ_PARAMS = 0x08
CMD_CLR_IRQ_STATUS = 0x02
CMD_GET_IRQ_STATUS = 0x12
CMD_SET_PACKET_TYPE = 0x8A
CMD_SET_RF_FREQUENCY = 0x86
CMD_SET_PA_CONFIG = 0x95
CMD_SET_TX_PARAMS = 0x8E
CMD_SET_MODULATION_PARAMS = 0x8B
CMD_SET_PACKET_PARAMS = 0x8C
CMD_SET_BUFFER_BASE_ADDRESS = 0x8F

PACKET_TYPE_LORA = 0x01
STDBY_RC = 0x00


class SX1262:
    """SPI driver for the SX1262 LoRa transceiver on SPI0."""

    def __init__(self, spi_bus=0, spi_cs=0, dio1_pin=17, busy_pin=22, reset_pin=27):
        self.spi_bus = spi_bus
        self.spi_cs = spi_cs
        self.dio1_pin = dio1_pin
        self.busy_pin = busy_pin
        self.reset_pin = reset_pin
        self._spi = None
        self._gpio = None

    def init(self):
        """Initialize SPI and GPIO, reset the module."""
        try:
            import spidev
            import RPi.GPIO as GPIO

            self._gpio = GPIO
            GPIO.setmode(GPIO.BCM)
            GPIO.setup(self.busy_pin, GPIO.IN)
            GPIO.setup(self.dio1_pin, GPIO.IN)
            GPIO.setup(self.reset_pin, GPIO.OUT)

            self._spi = spidev.SpiDev()
            self._spi.open(self.spi_bus, self.spi_cs)
            self._spi.max_speed_hz = 2_000_000
            self._spi.mode = 0

            self.reset()
            self._wait_busy()
            self._set_standby()
            log.info("SX1262 initialized on SPI%d.%d", self.spi_bus, self.spi_cs)

        except ImportError as e:
            log.error("SX1262 init failed — missing library: %s", e)
            raise
        except Exception as e:
            log.error("SX1262 init failed: %s", e)
            raise

    def reset(self):
        """Hardware reset via NRESET pin."""
        if self._gpio is None:
            return
        self._gpio.output(self.reset_pin, self._gpio.LOW)
        time.sleep(0.01)
        self._gpio.output(self.reset_pin, self._gpio.HIGH)
        time.sleep(0.02)

    def _wait_busy(self, timeout: float = 1.0):
        if self._gpio is None:
            return
        start = time.time()
        while self._gpio.input(self.busy_pin):
            if time.time() - start > timeout:
                log.warning("SX1262 BUSY timeout")
                break
            time.sleep(0.001)

    def _spi_transfer(self, data: list) -> list:
        self._wait_busy()
        result = self._spi.xfer2(data)
        return result

    def _set_standby(self):
        self._spi_transfer([CMD_SET_STANDBY, STDBY_RC])

    def set_frequency(self, freq_hz: int):
        """Set RF frequency in Hz."""
        frf = int((freq_hz << 25) / 32_000_000)
        self._spi_transfer([
            CMD_SET_RF_FREQUENCY,
            (frf >> 24) & 0xFF,
            (frf >> 16) & 0xFF,
            (frf >> 8) & 0xFF,
            frf & 0xFF,
        ])

    def set_lora_params(self, sf=7, bw=125, cr=5, preamble=8):
        """Configure LoRa modulation parameters."""
        self._spi_transfer([CMD_SET_PACKET_TYPE, PACKET_TYPE_LORA])

        bw_map = {125: 0x04, 250: 0x05, 500: 0x06}
        bw_val = bw_map.get(bw, 0x04)

        self._spi_transfer([
            CMD_SET_MODULATION_PARAMS,
            sf, bw_val, cr - 4, 0x00,
        ])

    def set_tx_power(self, power_dbm: int):
        """Set transmit power (2-22 dBm)."""
        power_dbm = max(2, min(22, power_dbm))
        self._spi_transfer([CMD_SET_PA_CONFIG, 0x04, 0x07, 0x00, 0x01])
        self._spi_transfer([CMD_SET_TX_PARAMS, power_dbm, 0x04])

    def transmit(self, data: bytes, timeout_ms: int = 5000) -> bool:
        """Transmit a LoRa packet."""
        self._spi_transfer([CMD_SET_BUFFER_BASE_ADDRESS, 0x00, 0x00])

        payload = [CMD_WRITE_BUFFER, 0x00] + list(data)
        self._spi_transfer(payload)

        self._spi_transfer([
            CMD_SET_PACKET_PARAMS,
            0x00, 0x08,
            len(data),
            0x01, 0x00,
        ])

        timeout_val = timeout_ms << 6
        self._spi_transfer([
            CMD_SET_TX,
            (timeout_val >> 16) & 0xFF,
            (timeout_val >> 8) & 0xFF,
            timeout_val & 0xFF,
        ])

        start = time.time()
        while time.time() - start < timeout_ms / 1000.0:
            if self._gpio and self._gpio.input(self.dio1_pin):
                self._spi_transfer([CMD_CLR_IRQ_STATUS, 0xFF, 0xFF])
                return True
            time.sleep(0.01)

        log.warning("TX timeout after %d ms", timeout_ms)
        return False

    def receive(self, timeout_ms: int = 10000) -> bytes | None:
        """Listen for a LoRa packet."""
        timeout_val = timeout_ms << 6
        self._spi_transfer([
            CMD_SET_RX,
            (timeout_val >> 16) & 0xFF,
            (timeout_val >> 8) & 0xFF,
            timeout_val & 0xFF,
        ])

        start = time.time()
        while time.time() - start < timeout_ms / 1000.0:
            if self._gpio and self._gpio.input(self.dio1_pin):
                self._spi_transfer([CMD_CLR_IRQ_STATUS, 0xFF, 0xFF])
                status = self._spi_transfer([0x13, 0x00, 0x00, 0x00])
                payload_len = status[2] if len(status) > 2 else 0
                offset = status[3] if len(status) > 3 else 0
                if payload_len > 0:
                    rx_data = self._spi_transfer(
                        [CMD_READ_BUFFER, offset, 0x00] + [0x00] * payload_len
                    )
                    return bytes(rx_data[3:3 + payload_len])
                return None
            time.sleep(0.01)

        return None

    def sleep(self):
        """Put module into sleep mode."""
        self._spi_transfer([CMD_SET_SLEEP, 0x00])

    def close(self):
        """Release SPI and GPIO resources."""
        if self._spi:
            try:
                self.sleep()
                self._spi.close()
            except Exception:
                pass
            self._spi = None
        if self._gpio:
            try:
                self._gpio.cleanup([self.reset_pin])
            except Exception:
                pass
        log.info("SX1262 closed")
