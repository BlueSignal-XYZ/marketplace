"""ADS1115 16-bit ADC driver over I2C (smbus2).

Supports both U1 (0x48) and U2 (0x49) on the WQM-1 HAT.
Single-ended reads on AIN0-AIN3, configurable PGA gain.
"""

import time
import struct
import logging

log = logging.getLogger("wqm.ads1115")

REG_CONVERSION = 0x00
REG_CONFIG = 0x01

MUX_MAP = {0: 0x4000, 1: 0x5000, 2: 0x6000, 3: 0x7000}
PGA_MAP = {
    2 / 3: 0x0000,  # +/- 6.144V
    1: 0x0200,      # +/- 4.096V
    2: 0x0400,      # +/- 2.048V
    4: 0x0600,      # +/- 1.024V
    8: 0x0800,      # +/- 0.512V
    16: 0x0A00,     # +/- 0.256V
}
PGA_VOLTAGE = {
    2 / 3: 6.144, 1: 4.096, 2: 2.048, 4: 1.024, 8: 0.512, 16: 0.256
}
DR_128SPS = 0x0080
OS_SINGLE = 0x8000
MODE_SINGLE = 0x0100
COMP_DISABLE = 0x0003


class ADS1115:
    """16-bit ADC with I2C interface, single-ended voltage reads."""

    def __init__(self, address=0x48, bus_num=1):
        self.address = address
        self._bus = None
        self._bus_num = bus_num

    def _get_bus(self):
        if self._bus is None:
            import smbus2
            self._bus = smbus2.SMBus(self._bus_num)
        return self._bus

    def read_channel(self, channel: int, gain: int = 1, samples: int = 1,
                     retries: int = 3) -> float:
        """Read single-ended voltage from AINx. Returns median of N samples.

        Retries on I2C error up to `retries` times, then marks channel as failed.
        """
        if channel not in MUX_MAP:
            raise ValueError(f"Invalid channel {channel}. Must be 0-3.")
        if gain not in PGA_MAP:
            raise ValueError(f"Invalid gain {gain}. Must be one of {list(PGA_MAP.keys())}.")

        bus = self._get_bus()
        readings = []
        for _ in range(samples):
            voltage = self._read_single(bus, channel, gain, retries)
            if voltage is not None:
                readings.append(voltage)

        if not readings:
            log.error("ADS1115 0x%02X ch%d: all samples failed", self.address, channel)
            return float('nan')

        readings.sort()
        mid = len(readings) // 2
        if len(readings) % 2:
            return readings[mid]
        return (readings[mid - 1] + readings[mid]) / 2

    def _read_single(self, bus, channel: int, gain: int, retries: int) -> float | None:
        """Read a single ADC sample with retry logic."""
        for attempt in range(retries):
            try:
                config = (OS_SINGLE | MUX_MAP[channel] | PGA_MAP[gain] |
                          MODE_SINGLE | DR_128SPS | COMP_DISABLE)

                config_bytes = [(config >> 8) & 0xFF, config & 0xFF]
                bus.write_i2c_block_data(self.address, REG_CONFIG, config_bytes)

                time.sleep(0.012)

                for _ in range(10):
                    status = bus.read_i2c_block_data(self.address, REG_CONFIG, 2)
                    if status[0] & 0x80:
                        break
                    time.sleep(0.002)

                data = bus.read_i2c_block_data(self.address, REG_CONVERSION, 2)
                raw = struct.unpack(">h", bytes(data))[0]
                voltage = raw * (PGA_VOLTAGE[gain] / 32768.0)
                return voltage
            except OSError as e:
                log.warning("ADS1115 0x%02X ch%d I2C error (attempt %d/%d): %s",
                            self.address, channel, attempt + 1, retries, e)
                time.sleep(0.05 * (attempt + 1))
        return None

    def scan(self) -> bool:
        """Check if device responds on I2C."""
        try:
            bus = self._get_bus()
            bus.read_byte(self.address)
            return True
        except OSError:
            return False

    def close(self):
        if self._bus is not None:
            self._bus.close()
            self._bus = None
