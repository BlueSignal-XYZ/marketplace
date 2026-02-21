"""LoRaWAN MAC layer over SX1262. OTAA join + Class A uplink.

Implements a simplified LoRaWAN 1.0.3 MAC for uplink-only operation.
For production, consider replacing with a full LoRaWAN stack (e.g.
LMIC port, or chirpstack-gateway-bridge) once hardware is validated.
"""

import logging
import os
import time

log = logging.getLogger("wqm.lorawan")


class LoRaWAN:
    def __init__(self, config: dict):
        self.config = config
        self.dev_eui = config.get("dev_eui", "")
        self.app_eui = config.get("app_eui", "")
        self.app_key = config.get("app_key", "")
        self.joined = False
        self.frame_counter = 0
        self.radio = None

    def _init_radio(self):
        from .sx1262 import SX1262
        self.radio = SX1262(
            spi_bus=0, spi_cs=0,
            dio1_pin=17,
            busy_pin=22,
            reset_pin=27,
        )
        self.radio.init()

        freq_plans = {
            "US915": 903_900_000,
            "EU868": 868_100_000,
            "AU915": 915_200_000,
        }
        freq = freq_plans.get(self.config.get("frequency_plan", "US915"), 903_900_000)
        self.radio.set_frequency(freq)

        dr = self.config.get("data_rate", 3)
        sf = max(7, min(12, 12 - dr))
        self.radio.set_lora_params(sf=sf, bw=125, cr=5)
        self.radio.set_tx_power(self.config.get("tx_power", 14))
        log.info("SX1262 radio ready: freq=%d, SF%d, %d dBm", freq, sf,
                 self.config.get("tx_power", 14))

    def join(self, retries: int = 10, backoff: float = 15.0) -> bool:
        """OTAA join with exponential backoff."""
        if not self.dev_eui or not self.app_eui or not self.app_key:
            log.warning("LoRaWAN credentials not configured — skipping join")
            return False

        try:
            self._init_radio()
        except Exception as e:
            log.error("Radio init failed: %s", e)
            return False

        dev_eui_bytes = bytes.fromhex(self.dev_eui)
        app_eui_bytes = bytes.fromhex(self.app_eui)

        for attempt in range(retries):
            log.info("OTAA join attempt %d/%d", attempt + 1, retries)
            try:
                mhdr = bytes([0x00])
                dev_nonce = os.urandom(2)
                join_req = (mhdr +
                            app_eui_bytes[::-1] +
                            dev_eui_bytes[::-1] +
                            dev_nonce +
                            bytes(4))

                if self.radio.transmit(join_req):
                    rx_data = self.radio.receive(timeout_ms=6000)
                    if rx_data and len(rx_data) >= 17 and (rx_data[0] & 0xE0) == 0x20:
                        self.joined = True
                        self.frame_counter = 0
                        log.info("OTAA join successful")
                        return True

                log.warning("Join attempt %d: no accept received", attempt + 1)
            except Exception as e:
                log.warning("Join failed: %s", e)

            time.sleep(backoff * (2 ** attempt))

        log.error("OTAA join failed after all retries")
        return False

    def is_joined(self) -> bool:
        return self.joined

    def send(self, payload: bytes, port: int = 1, confirmed: bool = False) -> bool:
        """Send an uplink frame."""
        if not self.joined:
            log.warning("Cannot send: not joined")
            return False
        if self.radio is None:
            log.error("Radio not initialized")
            return False

        try:
            self.frame_counter += 1
            import struct

            mhdr = bytes([0x80 if confirmed else 0x40])
            dev_addr = bytes(4)
            fctrl = bytes([0x00])
            fcnt = struct.pack("<H", self.frame_counter & 0xFFFF)
            fport = bytes([port])
            frame = mhdr + dev_addr + fctrl + fcnt + fport + payload + bytes(4)

            success = self.radio.transmit(frame)
            if success:
                log.info("Uplink sent: %d bytes, FCnt=%d", len(payload), self.frame_counter)
            else:
                log.warning("Uplink TX failed")
            return success

        except Exception as e:
            log.error("Uplink failed: %s", e)
            return False

    def close(self):
        if self.radio:
            self.radio.close()
            self.radio = None
        self.joined = False
        log.info("LoRaWAN closed")
