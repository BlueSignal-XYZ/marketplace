"""Time synchronization service — GPS primary, saved-time fallback.

The Pi Zero 2W has no RTC. Without time sync, all readings get garbage
timestamps, corrupting the entire data pipeline. Revenue-grade data with
bad timestamps is worthless.

Priority order:
  1. GPS time (GPRMC sentence with valid date/time)
  2. Saved-time fallback (/opt/bluesignal/config/last_known_time)
  3. Estimated (system default — flagged as unreliable)
"""

import os
import time
import logging
import threading
import subprocess
from datetime import datetime

from .config import atomic_write_json, load_json_safe

log = logging.getLogger("wqm.time")

SAVED_TIME_PATH = "/opt/bluesignal/config/last_known_time"
# Development fallback path
SAVED_TIME_PATH_DEV = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "config", "last_known_time",
)


class TimeSync:
    """GPS/NTP/saved-time synchronization with validity gating."""

    def __init__(self, gps_sensor=None, saved_time_path=None):
        """
        Args:
            gps_sensor: GPSSensor instance (optional — if None, GPS sync disabled)
            saved_time_path: Path to save/load last known timestamp
        """
        self.gps = gps_sensor
        self.saved_time_path = saved_time_path or self._default_path()
        self.time_valid = threading.Event()
        self.time_source = "none"  # "gps", "ntp", "saved", "estimated"
        self._sync_thread = None
        self._running = False

    @staticmethod
    def _default_path():
        for p in [SAVED_TIME_PATH, SAVED_TIME_PATH_DEV]:
            if os.path.exists(os.path.dirname(p)):
                return p
        return SAVED_TIME_PATH_DEV

    def start(self):
        """Start background time sync. Non-blocking."""
        self._running = True
        self._sync_thread = threading.Thread(target=self._sync_loop, daemon=True)
        self._sync_thread.start()

    def stop(self):
        self._running = False
        if self._sync_thread and self._sync_thread.is_alive():
            self._sync_thread.join(timeout=5.0)

    def wait_for_valid(self, timeout=180) -> bool:
        """Block until time is valid or timeout. Returns True if valid."""
        if self.time_valid.is_set():
            return True
        log.info("Waiting for time sync (timeout=%ds)...", timeout)
        result = self.time_valid.wait(timeout=timeout)
        if not result:
            log.warning("Time sync timed out — using estimated time")
            self.time_source = "estimated"
            self.time_valid.set()  # unblock, but flagged as estimated
        return result

    def is_reliable(self) -> bool:
        """True if time came from GPS or NTP (not estimated/saved)."""
        return self.time_source in ("gps", "ntp")

    def save_current_time(self):
        """Persist current Unix timestamp for fallback on next boot."""
        try:
            os.makedirs(os.path.dirname(self.saved_time_path), exist_ok=True)
            atomic_write_json(self.saved_time_path, {
                "timestamp": time.time(),
                "source": self.time_source,
                "saved_at": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            })
        except Exception as e:
            log.warning("Failed to save time: %s", e)

    def _sync_loop(self):
        """Try GPS time sync, then saved-time fallback."""
        # Attempt 1: GPS time sync (up to 120 seconds)
        if self.gps and self._try_gps_sync(timeout=120):
            return

        # Attempt 2: Saved-time fallback
        if self._try_saved_time():
            return

        # Attempt 3: Give up — will be caught by wait_for_valid timeout
        log.warning("No time source available — waiting for timeout")

    def _try_gps_sync(self, timeout=120) -> bool:
        """Wait for GPS fix with valid time. Set system clock from NMEA."""
        start = time.monotonic()
        log.info("Attempting GPS time sync (timeout=%ds)...", timeout)

        while self._running and (time.monotonic() - start) < timeout:
            if self.gps is None:
                return False

            gps_data = self.gps.read()
            if gps_data and gps_data.get("has_fix"):
                # The GPS sensor already parses time from NMEA
                # Use the fix time if available
                gps_time = gps_data.get("utc_time")
                if gps_time:
                    self._set_system_time(gps_time)
                    self.time_source = "gps"
                    self.time_valid.set()
                    self.save_current_time()
                    log.info("GPS time sync successful: %s", gps_time)
                    return True

                # Even without explicit time, a GPS fix means system
                # time is likely reasonable (gpsd may have set it)
                self.time_source = "gps"
                self.time_valid.set()
                self.save_current_time()
                log.info("GPS fix acquired — assuming system time is valid")
                return True

            time.sleep(2.0)

        log.warning("GPS time sync failed — no fix within %ds", timeout)
        return False

    def _try_saved_time(self) -> bool:
        """Load last known time and set system clock."""
        data = load_json_safe(self.saved_time_path, default=None)
        if data is None:
            return False

        saved_ts = data.get("timestamp")
        if saved_ts is None or saved_ts < 1700000000:  # Before ~Nov 2023
            log.warning("Saved time too old: %s", saved_ts)
            return False

        # Only use saved time if current system time looks wrong
        # (before 2024 or obviously epoch-based)
        if time.time() < 1700000000:
            self._set_system_time_unix(saved_ts)
            self.time_source = "saved"
            self.time_valid.set()
            log.info("Using saved time: %s (source: %s)",
                     datetime.utcfromtimestamp(saved_ts).isoformat(),
                     data.get("source", "unknown"))
            return True

        # System time already looks reasonable
        self.time_source = "saved"
        self.time_valid.set()
        log.info("System time looks valid, saved time as confirmation")
        return True

    @staticmethod
    def _set_system_time(utc_string):
        """Set system clock from UTC time string."""
        try:
            subprocess.run(
                ["date", "-s", utc_string],
                capture_output=True, timeout=5
            )
        except Exception as e:
            log.warning("Failed to set system time: %s", e)

    @staticmethod
    def _set_system_time_unix(timestamp):
        """Set system clock from Unix timestamp."""
        try:
            dt = datetime.utcfromtimestamp(timestamp)
            subprocess.run(
                ["date", "-s", dt.strftime("%Y-%m-%d %H:%M:%S")],
                capture_output=True, timeout=5
            )
        except Exception as e:
            log.warning("Failed to set system time: %s", e)
