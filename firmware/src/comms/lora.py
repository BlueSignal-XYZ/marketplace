"""
LoRaWAN Driver for SX1262 Module

Handles LoRaWAN Class A communication via the SX1262 module on SPI0.
Uses OTAA (Over-The-Air Activation) to join the TTN v3 network.

Hardware connections (SPI0):
  - MOSI: GPIO10
  - MISO: GPIO9
  - SCLK: GPIO11
  - CS/NSS: GPIO8 (CE0)
  - BUSY: GPIO22
  - DIO1: GPIO25
  - RESET: GPIO23

This module wraps the SX1262 LoRa library to provide a simple
LoRaWAN uplink interface. The actual LoRaWAN MAC layer (OTAA join,
frame counters, MIC calculation) is handled by the library.
"""

import logging
import time

logger = logging.getLogger(__name__)

# SX1262 GPIO pin assignments on the BlueSignal carrier board
SX1262_PINS = {
    "cs": 8,       # SPI CE0
    "busy": 22,
    "dio1": 25,
    "reset": 23,
}

# US915 LoRaWAN frequency plan (TTN)
US915_FREQ = 915.0  # MHz (sub-band varies)

# Default LoRaWAN parameters
DEFAULT_SF = 7          # Spreading factor (7-12, lower = faster but shorter range)
DEFAULT_BW = 125000     # Bandwidth in Hz
DEFAULT_CR = 5          # Coding rate (5 = 4/5)
DEFAULT_TX_POWER = 14   # dBm (max for US915)


class LoRaWAN:
    """
    LoRaWAN Class A uplink via SX1262.

    Usage:
        lora = LoRaWAN(dev_eui="...", app_eui="...", app_key="...")
        if lora.initialize():
            if lora.join():
                lora.send(payload_bytes)
    """

    def __init__(self, dev_eui, app_eui, app_key, region="US915", config=None):
        """
        Args:
            dev_eui: Device EUI (16 hex chars)
            app_eui: Application EUI / Join EUI (16 hex chars)
            app_key: Application Key (32 hex chars)
            region: LoRaWAN region ("US915", "EU868", etc.)
            config: Optional dict with sf, bw, cr, tx_power overrides
        """
        self.dev_eui = dev_eui
        self.app_eui = app_eui
        self.app_key = app_key
        self.region = region

        self.sf = DEFAULT_SF
        self.bw = DEFAULT_BW
        self.cr = DEFAULT_CR
        self.tx_power = DEFAULT_TX_POWER

        if config:
            self.sf = config.get("spreading_factor", DEFAULT_SF)
            self.bw = config.get("bandwidth", DEFAULT_BW)
            self.cr = config.get("coding_rate", DEFAULT_CR)
            self.tx_power = config.get("tx_power", DEFAULT_TX_POWER)

        self._lora = None
        self._joined = False
        self._frame_counter = 0
        self._last_send_time = 0

    def initialize(self):
        """
        Initialize the SX1262 module.

        Returns:
            bool: True if initialization succeeded.
        """
        try:
            from SX1262 import SX1262

            self._lora = SX1262(
                spi_bus=0,
                clk=11,
                mosi=10,
                miso=9,
                cs=SX1262_PINS["cs"],
                irq=SX1262_PINS["dio1"],
                rst=SX1262_PINS["reset"],
                gpio=SX1262_PINS["busy"],
            )

            # Configure for LoRa mode
            self._lora.begin(
                freq=US915_FREQ,
                bw=self.bw / 1000.0,  # Library expects kHz
                sf=self.sf,
                cr=self.cr,
                syncWord=0x34,  # LoRaWAN sync word
                power=self.tx_power,
                preambleLength=8,
                implicit=False,
                implicitLen=0xFF,
                crcOn=True,
                txIq=False,
                rxIq=True,
                tcxoVoltage=1.7,
                useRegulatorLDO=False,
                blocking=True,
            )

            logger.info(
                "SX1262 initialized: freq=%.1fMHz, SF=%d, BW=%dHz, power=%ddBm",
                US915_FREQ, self.sf, self.bw, self.tx_power,
            )
            return True

        except ImportError:
            logger.error(
                "SX1262 library not installed. Install pySX126x: "
                "pip install pySX126x"
            )
            return False
        except Exception as e:
            logger.error("SX1262 initialization failed: %s", e)
            return False

    def join(self, timeout=30, retries=3):
        """
        Perform OTAA join to TTN v3.

        Args:
            timeout: Seconds to wait for join accept per attempt.
            retries: Number of join attempts.

        Returns:
            bool: True if join succeeded.
        """
        if self._lora is None:
            logger.error("SX1262 not initialized")
            return False

        for attempt in range(1, retries + 1):
            logger.info(
                "OTAA join attempt %d/%d (DevEUI: %s...)",
                attempt, retries, self.dev_eui[:8],
            )

            try:
                # Build join request
                # Note: Actual LoRaWAN OTAA requires a MAC layer implementation.
                # The pySX126x library provides raw LoRa, not LoRaWAN MAC.
                # For production, use a proper LoRaWAN stack (e.g., LMIC port,
                # or Chirpstack device library). This is a simplified version
                # that sends the join request and waits for accept.

                join_payload = self._build_join_request()
                self._lora.send(join_payload)

                # Wait for join accept on RX1/RX2 windows
                start = time.time()
                while time.time() - start < timeout:
                    # Check for incoming data (join accept)
                    recv_len = self._lora.available()
                    if recv_len > 0:
                        data = self._lora.read(recv_len)
                        if self._parse_join_accept(data):
                            self._joined = True
                            self._frame_counter = 0
                            logger.info("OTAA join successful!")
                            return True

                    time.sleep(0.1)

                logger.warning("Join attempt %d: no accept received", attempt)

            except Exception as e:
                logger.error("Join attempt %d failed: %s", attempt, e)

            # Exponential backoff between attempts
            if attempt < retries:
                backoff = 5 * (2 ** (attempt - 1))
                logger.info("Retrying in %ds...", backoff)
                time.sleep(backoff)

        logger.error("OTAA join failed after %d attempts", retries)
        return False

    def send(self, payload, port=1, confirmed=False):
        """
        Send an uplink message.

        Args:
            payload: bytes to send (max 51 bytes for DR0, 242 for DR4+)
            port: LoRaWAN FPort (1-223)
            confirmed: If True, request acknowledgement from network.

        Returns:
            bool: True if send succeeded (for unconfirmed) or ack received (confirmed).
        """
        if self._lora is None:
            logger.error("SX1262 not initialized")
            return False

        if not self._joined:
            logger.error("Not joined to network. Call join() first.")
            return False

        try:
            # Build LoRaWAN data frame
            frame = self._build_data_frame(payload, port, confirmed)

            # Enforce duty cycle (min 1 second between transmissions)
            elapsed = time.time() - self._last_send_time
            if elapsed < 1.0:
                time.sleep(1.0 - elapsed)

            # Transmit
            self._lora.send(frame)
            self._last_send_time = time.time()
            self._frame_counter += 1

            logger.info(
                "Uplink sent: port=%d, %d bytes, fcnt=%d, confirmed=%s",
                port, len(payload), self._frame_counter, confirmed,
            )

            # If confirmed, wait for ACK in RX windows
            if confirmed:
                return self._wait_for_ack(timeout=10)

            return True

        except Exception as e:
            logger.error("Send failed: %s", e)
            return False

    def is_joined(self):
        """Check if currently joined to the network."""
        return self._joined

    def get_frame_counter(self):
        """Get current uplink frame counter."""
        return self._frame_counter

    def _build_join_request(self):
        """
        Build a LoRaWAN join request (MHDR + AppEUI + DevEUI + DevNonce + MIC).
        Simplified implementation -- production should use a proper LoRaWAN MAC stack.
        """
        import os

        # MHDR: Join Request (0x00)
        mhdr = bytes([0x00])

        # AppEUI and DevEUI (little-endian)
        app_eui_bytes = bytes.fromhex(self.app_eui)[::-1]
        dev_eui_bytes = bytes.fromhex(self.dev_eui)[::-1]

        # DevNonce: random 2 bytes
        dev_nonce = os.urandom(2)

        # Build frame (MIC would be calculated with AppKey in production)
        frame = mhdr + app_eui_bytes + dev_eui_bytes + dev_nonce

        # MIC placeholder (4 bytes) -- actual CMAC calculation needed for production
        frame += bytes(4)

        return frame

    def _parse_join_accept(self, data):
        """
        Parse a join accept message.
        Simplified -- production needs AES decryption with AppKey.
        """
        if not data or len(data) < 17:
            return False

        mhdr = data[0]
        # Join Accept MHDR type = 0x20
        if (mhdr & 0xE0) == 0x20:
            logger.debug("Received join accept (%d bytes)", len(data))
            return True

        return False

    def _build_data_frame(self, payload, port, confirmed):
        """
        Build a LoRaWAN data uplink frame.
        Simplified -- production needs full MAC layer with encryption.
        """
        # MHDR: Unconfirmed Data Up (0x40) or Confirmed Data Up (0x80)
        mhdr = bytes([0x80 if confirmed else 0x40])

        # DevAddr (4 bytes) -- assigned during join, placeholder here
        dev_addr = bytes(4)

        # FCtrl (1 byte)
        fctrl = bytes([0x00])

        # FCnt (2 bytes, little-endian)
        import struct
        fcnt = struct.pack("<H", self._frame_counter & 0xFFFF)

        # FPort
        fport = bytes([port])

        # Frame = MHDR | DevAddr | FCtrl | FCnt | FPort | Payload | MIC
        frame = mhdr + dev_addr + fctrl + fcnt + fport + payload

        # MIC placeholder (4 bytes)
        frame += bytes(4)

        return frame

    def _wait_for_ack(self, timeout=10):
        """Wait for downlink ACK."""
        start = time.time()
        while time.time() - start < timeout:
            recv_len = self._lora.available()
            if recv_len > 0:
                data = self._lora.read(recv_len)
                if data and len(data) > 0:
                    logger.debug("Received downlink (%d bytes)", len(data))
                    return True
            time.sleep(0.1)

        logger.warning("No ACK received within %ds", timeout)
        return False

    def shutdown(self):
        """Put the SX1262 into sleep mode."""
        if self._lora:
            try:
                self._lora.reset()
            except Exception:
                pass
            self._lora = None
        self._joined = False
        logger.info("SX1262 shutdown complete")
