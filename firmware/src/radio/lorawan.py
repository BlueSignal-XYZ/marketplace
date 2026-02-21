"""LoRaWAN MAC layer over SX1262. OTAA join + Class A uplink.

Implements a simplified LoRaWAN 1.0.3 MAC for uplink-only operation
with TTN Fair Use Policy enforcement (30s airtime/day, 10 downlinks/day).

For production, consider replacing with a full LoRaWAN stack (e.g.
LMIC port, or chirpstack-gateway-bridge) once hardware is validated.
"""

import logging
import os
import struct
import time
from datetime import datetime, timezone

log = logging.getLogger("wqm.lorawan")


class AirtimeBudget:
    """TTN Fair Use Policy tracker.

    TTN limits:
    - Uplink: 30 seconds of airtime per device per 24 hours
    - Downlink: 10 downlinks per device per 24 hours
    """

    MAX_DAILY_AIRTIME_MS = 30_000   # 30 seconds
    MAX_DAILY_DOWNLINKS = 10
    MAX_CONFIRMED_PER_DAY = 5       # Each confirmed uplink costs 1 downlink

    def __init__(self):
        self.daily_airtime_ms = 0
        self.daily_downlinks = 0
        self.daily_confirmed = 0
        self._last_reset = datetime.now(timezone.utc).date()

    def _check_reset(self):
        """Reset counters at UTC midnight."""
        today = datetime.now(timezone.utc).date()
        if today != self._last_reset:
            self.daily_airtime_ms = 0
            self.daily_downlinks = 0
            self.daily_confirmed = 0
            self._last_reset = today
            log.info("Airtime budget reset for new UTC day")

    def can_uplink(self, estimated_airtime_ms: int) -> bool:
        """Check if uplink is within fair use budget."""
        self._check_reset()
        return (self.daily_airtime_ms + estimated_airtime_ms) < self.MAX_DAILY_AIRTIME_MS

    def record_uplink(self, airtime_ms: int, confirmed: bool = False):
        """Record an uplink's airtime consumption."""
        self._check_reset()
        self.daily_airtime_ms += airtime_ms
        if confirmed:
            self.daily_confirmed += 1
            self.daily_downlinks += 1  # ACK consumes a downlink slot
        log.debug("Airtime: %d/%d ms, downlinks: %d/%d",
                  self.daily_airtime_ms, self.MAX_DAILY_AIRTIME_MS,
                  self.daily_downlinks, self.MAX_DAILY_DOWNLINKS)

    def can_downlink(self) -> bool:
        """Check if downlink is within budget."""
        self._check_reset()
        return self.daily_downlinks < self.MAX_DAILY_DOWNLINKS

    def can_confirmed(self) -> bool:
        """Check if confirmed uplink is within budget."""
        self._check_reset()
        return self.daily_confirmed < self.MAX_CONFIRMED_PER_DAY

    def remaining_airtime_ms(self) -> int:
        self._check_reset()
        return max(0, self.MAX_DAILY_AIRTIME_MS - self.daily_airtime_ms)

    @staticmethod
    def estimate_airtime_ms(payload_bytes: int, sf: int = 7, bw: int = 125) -> int:
        """Estimate LoRa airtime for a given payload and modulation.

        Simplified calculation based on Semtech formula.
        """
        # Preamble: 8 symbols + 4.25
        t_sym_ms = (2 ** sf) / (bw * 1000) * 1000
        t_preamble = (8 + 4.25) * t_sym_ms

        # Payload symbols (simplified)
        payload_bits = 8 * (payload_bytes + 13)  # +13 for LoRaWAN overhead
        n_payload = max(8, payload_bits // (4 * sf))

        t_payload = n_payload * t_sym_ms
        return int(t_preamble + t_payload)


class LoRaWAN:
    """LoRaWAN 1.0.3 Class A MAC with airtime budget tracking."""

    def __init__(self, config: dict, bus_lock=None):
        self.config = config
        self.dev_eui = config.get("dev_eui", "")
        self.app_eui = config.get("app_eui", "")
        self.app_key = config.get("app_key", "")
        self.joined = False
        self.frame_counter = 0
        self.radio = None
        self.bus_lock = bus_lock
        self.data_rate = config.get("data_rate", 3)
        self.airtime = AirtimeBudget()

        # Compute SF from data rate
        self._sf = max(7, min(12, 12 - self.data_rate))

    def _init_radio(self):
        from .sx1262 import SX1262
        self.radio = SX1262(
            spi_bus=0, spi_cs=0,
            dio1_pin=17,
            busy_pin=22,
            reset_pin=27,
        )
        if self.bus_lock:
            with self.bus_lock:
                self.radio.init()
        else:
            self.radio.init()

        freq_plans = {
            "US915": 903_900_000,
            "EU868": 868_100_000,
            "AU915": 915_200_000,
        }
        freq = freq_plans.get(self.config.get("frequency_plan", "US915"), 903_900_000)

        if self.bus_lock:
            with self.bus_lock:
                self.radio.set_frequency(freq)
                self.radio.set_lora_params(sf=self._sf, bw=125, cr=5)
                self.radio.set_tx_power(self.config.get("tx_power", 14))
        else:
            self.radio.set_frequency(freq)
            self.radio.set_lora_params(sf=self._sf, bw=125, cr=5)
            self.radio.set_tx_power(self.config.get("tx_power", 14))

        log.info("SX1262 radio ready: freq=%d, SF%d, %d dBm",
                 freq, self._sf, self.config.get("tx_power", 14))

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

                if self.bus_lock:
                    with self.bus_lock:
                        tx_ok = self.radio.transmit(join_req)
                else:
                    tx_ok = self.radio.transmit(join_req)

                if tx_ok:
                    if self.bus_lock:
                        with self.bus_lock:
                            rx_data = self.radio.receive(timeout_ms=6000)
                    else:
                        rx_data = self.radio.receive(timeout_ms=6000)

                    if rx_data and len(rx_data) >= 17 and (rx_data[0] & 0xE0) == 0x20:
                        self.joined = True
                        self.frame_counter = 0
                        log.info("OTAA join successful")
                        return True

                log.warning("Join attempt %d: no accept received", attempt + 1)
            except Exception as e:
                log.warning("Join failed: %s", e)

            delay = min(backoff * (2 ** attempt), 900)  # Max 15 min
            time.sleep(delay)

        log.error("OTAA join failed after all retries")
        return False

    def is_joined(self) -> bool:
        return self.joined

    def send(self, payload: bytes, port: int = 1, confirmed: bool = False) -> bool:
        """Send an uplink frame with airtime budget check."""
        if not self.joined:
            log.warning("Cannot send: not joined")
            return False
        if self.radio is None:
            log.error("Radio not initialized")
            return False

        # Check airtime budget
        est_airtime = AirtimeBudget.estimate_airtime_ms(
            len(payload), sf=self._sf)
        if not self.airtime.can_uplink(est_airtime):
            log.warning("Airtime budget exceeded — skipping uplink "
                        "(used %d/%d ms)",
                        self.airtime.daily_airtime_ms,
                        AirtimeBudget.MAX_DAILY_AIRTIME_MS)
            return False

        # Check confirmed budget
        if confirmed and not self.airtime.can_confirmed():
            log.info("Confirmed uplink budget exhausted — sending unconfirmed")
            confirmed = False

        try:
            self.frame_counter += 1

            mhdr = bytes([0x80 if confirmed else 0x40])
            dev_addr = bytes(4)
            fctrl = bytes([0x00])
            fcnt = struct.pack("<H", self.frame_counter & 0xFFFF)
            fport = bytes([port])
            frame = mhdr + dev_addr + fctrl + fcnt + fport + payload + bytes(4)

            if self.bus_lock:
                with self.bus_lock:
                    success = self.radio.transmit(frame)
            else:
                success = self.radio.transmit(frame)

            if success:
                self.airtime.record_uplink(est_airtime, confirmed)
                log.info("Uplink sent: %d bytes, FCnt=%d, airtime=%dms",
                         len(payload), self.frame_counter, est_airtime)
            else:
                log.warning("Uplink TX failed")
            return success

        except Exception as e:
            log.error("Uplink failed: %s", e)
            return False

    def get_max_payload(self) -> int:
        """Return max payload bytes for current data rate."""
        from .cayenne import CayenneLPP
        return CayenneLPP.max_payload_for_dr(self.data_rate)

    def close(self):
        if self.radio:
            if self.bus_lock:
                with self.bus_lock:
                    self.radio.close()
            else:
                self.radio.close()
            self.radio = None
        self.joined = False
        log.info("LoRaWAN closed")
