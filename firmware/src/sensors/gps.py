"""MAX-M10S GPS module: NMEA parsing for lat/lng/alt/fix/sats.

Connected via UART on GPIO 14/15 (/dev/serial0). PPS output on GPIO 24.
Uses pynmea2 for robust NMEA sentence parsing.
"""

import logging
import time
import threading

log = logging.getLogger("wqm.gps")


class GPSSensor:
    def __init__(self, config: dict):
        self.port = config.get("uart_port", "/dev/serial0")
        self.baud = config.get("baud_rate", 9600)
        self._serial = None
        self._data = {}
        self._lock = threading.Lock()
        self._running = False
        self._thread = None

    def _open_serial(self) -> bool:
        try:
            import serial
            self._serial = serial.Serial(
                port=self.port,
                baudrate=self.baud,
                timeout=2.0,
            )
            self._serial.reset_input_buffer()
            log.info("GPS initialized on %s at %d baud", self.port, self.baud)
            return True
        except ImportError:
            log.error("pyserial not installed")
            return False
        except Exception as e:
            log.error("GPS init failed: %s", e)
            return False

    def start(self) -> bool:
        """Start background NMEA reader thread."""
        if not self._open_serial():
            return False
        self._running = True
        self._thread = threading.Thread(target=self._read_loop, daemon=True)
        self._thread.start()
        return True

    def read(self) -> dict | None:
        """Get latest GPS fix data, or None if no fix."""
        with self._lock:
            if self._data.get("has_fix"):
                return dict(self._data)
        return None

    def _read_loop(self):
        try:
            import pynmea2
        except ImportError:
            log.error("pynmea2 not installed")
            return

        while self._running:
            try:
                if self._serial is None or not self._serial.is_open:
                    time.sleep(1.0)
                    continue

                line = self._serial.readline()
                if not line:
                    continue

                sentence = line.decode("ascii", errors="ignore").strip()
                if not sentence.startswith("$"):
                    continue

                try:
                    msg = pynmea2.parse(sentence)
                except pynmea2.ParseError:
                    continue

                if isinstance(msg, pynmea2.types.talker.GGA):
                    self._handle_gga(msg)
                elif isinstance(msg, pynmea2.types.talker.RMC):
                    self._handle_rmc(msg)

            except Exception as e:
                log.debug("GPS read error: %s", e)
                time.sleep(0.5)

    def _handle_gga(self, msg):
        with self._lock:
            fix_quality = int(msg.gps_qual) if msg.gps_qual else 0
            self._data["has_fix"] = fix_quality > 0
            self._data["fix_quality"] = fix_quality

            if fix_quality > 0:
                if msg.latitude is not None:
                    self._data["latitude"] = round(msg.latitude, 6)
                if msg.longitude is not None:
                    self._data["longitude"] = round(msg.longitude, 6)
                if msg.altitude is not None:
                    self._data["altitude"] = float(msg.altitude)
                if msg.num_sats:
                    self._data["satellites"] = int(msg.num_sats)
                if msg.horizontal_dil:
                    self._data["hdop"] = float(msg.horizontal_dil)
                self._data["last_update"] = time.time()

                log.debug("GPS fix: lat=%.6f, lon=%.6f, sats=%d",
                          self._data.get("latitude", 0),
                          self._data.get("longitude", 0),
                          self._data.get("satellites", 0))

    def _handle_rmc(self, msg):
        with self._lock:
            if msg.spd_over_grnd:
                self._data["speed_knots"] = float(msg.spd_over_grnd)
            if msg.datestamp:
                self._data["date"] = str(msg.datestamp)

    def close(self):
        self._running = False
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=5.0)
        if self._serial and self._serial.is_open:
            try:
                self._serial.close()
            except Exception:
                pass
        log.info("GPS shutdown complete")
