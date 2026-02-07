"""
NEO-6M GPS Module Driver

Reads GPS data from a NEO-6M module connected via UART (/dev/ttyAMA0).
Parses NMEA sentences (GGA for fix data, RMC for speed/date).

Hardware: NEO-6M GPS module on UART0 (TX=GPIO14, RX=GPIO15)
Baud rate: 9600 (NEO-6M default)

Note: The Pi's built-in serial console must be disabled for UART0:
    sudo raspi-config -> Interface Options -> Serial Port -> No (login shell), Yes (hardware)
    Or: remove 'console=serial0,115200' from /boot/cmdline.txt
"""

import logging
import time
import threading

logger = logging.getLogger(__name__)

# UART defaults for NEO-6M
GPS_SERIAL_PORT = "/dev/ttyAMA0"
GPS_BAUD_RATE = 9600
GPS_TIMEOUT = 2.0


class GPSData:
    """Container for parsed GPS data."""

    def __init__(self):
        self.latitude = None
        self.longitude = None
        self.altitude = None      # meters above sea level
        self.satellites = 0
        self.fix_quality = 0      # 0=invalid, 1=GPS fix, 2=DGPS
        self.speed_knots = None
        self.hdop = None          # Horizontal dilution of precision
        self.timestamp = None     # UTC time string (HHMMSS.SS)
        self.date = None          # Date string (DDMMYY)
        self.has_fix = False
        self.last_update = 0      # Unix timestamp of last valid fix

    def to_dict(self):
        """Convert to dictionary for storage/transmission."""
        return {
            "latitude": self.latitude,
            "longitude": self.longitude,
            "altitude": self.altitude,
            "satellites": self.satellites,
            "fix_quality": self.fix_quality,
            "hdop": self.hdop,
            "has_fix": self.has_fix,
        }


class GPSSensor:
    """
    NEO-6M GPS module on UART.

    Usage:
        gps = GPSSensor()
        gps.initialize()
        gps.start()  # starts background reading thread
        data = gps.read()  # returns latest GPSData
        gps.stop()
    """

    def __init__(self, port=GPS_SERIAL_PORT, baud=GPS_BAUD_RATE):
        self.port = port
        self.baud = baud
        self._serial = None
        self._data = GPSData()
        self._lock = threading.Lock()
        self._running = False
        self._thread = None

    def initialize(self):
        """
        Open the serial port to the GPS module.

        Returns:
            bool: True if serial port opened successfully.
        """
        try:
            import serial

            self._serial = serial.Serial(
                port=self.port,
                baudrate=self.baud,
                timeout=GPS_TIMEOUT,
            )

            # Flush any buffered data
            self._serial.reset_input_buffer()

            logger.info("GPS initialized on %s at %d baud", self.port, self.baud)
            return True

        except ImportError:
            logger.error("pyserial not installed: pip install pyserial")
            return False
        except Exception as e:
            logger.error("GPS initialization failed: %s", e)
            return False

    def start(self):
        """Start background GPS reading thread."""
        if self._running:
            return

        self._running = True
        self._thread = threading.Thread(target=self._read_loop, daemon=True)
        self._thread.start()
        logger.info("GPS background reader started")

    def stop(self):
        """Stop background GPS reading thread."""
        self._running = False
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=5.0)
        logger.info("GPS background reader stopped")

    def read(self):
        """
        Get the latest GPS data.

        Returns:
            GPSData: Latest parsed GPS data.
        """
        with self._lock:
            return self._data

    def wait_for_fix(self, timeout=120):
        """
        Block until a GPS fix is obtained or timeout.

        Args:
            timeout: Maximum seconds to wait.

        Returns:
            bool: True if fix obtained within timeout.
        """
        start = time.time()
        while time.time() - start < timeout:
            with self._lock:
                if self._data.has_fix:
                    return True
            time.sleep(1.0)

        logger.warning("GPS fix timeout after %ds", timeout)
        return False

    def _read_loop(self):
        """Background thread: continuously read and parse NMEA sentences."""
        while self._running:
            try:
                if self._serial is None or not self._serial.is_open:
                    time.sleep(1.0)
                    continue

                line = self._serial.readline()
                if not line:
                    continue

                try:
                    sentence = line.decode("ascii", errors="ignore").strip()
                except Exception:
                    continue

                if sentence.startswith("$GPGGA") or sentence.startswith("$GNGGA"):
                    self._parse_gga(sentence)
                elif sentence.startswith("$GPRMC") or sentence.startswith("$GNRMC"):
                    self._parse_rmc(sentence)

            except Exception as e:
                logger.debug("GPS read error: %s", e)
                time.sleep(0.5)

    def _parse_gga(self, sentence):
        """
        Parse GPGGA sentence for position fix data.

        Format: $GPGGA,time,lat,N/S,lon,E/W,quality,sats,hdop,alt,M,geoid,M,,*cs
        """
        try:
            parts = sentence.split(",")
            if len(parts) < 15:
                return

            fix_quality = int(parts[6]) if parts[6] else 0

            with self._lock:
                self._data.fix_quality = fix_quality
                self._data.has_fix = fix_quality > 0

                if parts[1]:
                    self._data.timestamp = parts[1]

                if fix_quality > 0:
                    # Parse latitude
                    if parts[2] and parts[3]:
                        self._data.latitude = self._nmea_to_decimal(
                            parts[2], parts[3]
                        )

                    # Parse longitude
                    if parts[4] and parts[5]:
                        self._data.longitude = self._nmea_to_decimal(
                            parts[4], parts[5]
                        )

                    # Satellites
                    if parts[7]:
                        self._data.satellites = int(parts[7])

                    # HDOP
                    if parts[8]:
                        self._data.hdop = float(parts[8])

                    # Altitude
                    if parts[9]:
                        self._data.altitude = float(parts[9])

                    self._data.last_update = time.time()

                    logger.debug(
                        "GPS fix: lat=%.6f, lon=%.6f, alt=%.1fm, sats=%d",
                        self._data.latitude or 0,
                        self._data.longitude or 0,
                        self._data.altitude or 0,
                        self._data.satellites,
                    )

        except (ValueError, IndexError) as e:
            logger.debug("GGA parse error: %s", e)

    def _parse_rmc(self, sentence):
        """
        Parse GPRMC sentence for speed and date.

        Format: $GPRMC,time,status,lat,N/S,lon,E/W,speed,course,date,mag,mode*cs
        """
        try:
            parts = sentence.split(",")
            if len(parts) < 12:
                return

            with self._lock:
                # Speed in knots
                if parts[7]:
                    self._data.speed_knots = float(parts[7])

                # Date (DDMMYY)
                if parts[9]:
                    self._data.date = parts[9]

        except (ValueError, IndexError) as e:
            logger.debug("RMC parse error: %s", e)

    @staticmethod
    def _nmea_to_decimal(coord, direction):
        """
        Convert NMEA coordinate to decimal degrees.

        NMEA format: DDMM.MMMM (latitude) or DDDMM.MMMM (longitude)
        """
        try:
            # Find the decimal point
            dot_pos = coord.index(".")
            # Degrees are everything before the last 2 digits before the dot
            degrees = int(coord[: dot_pos - 2])
            minutes = float(coord[dot_pos - 2:])
            decimal = degrees + minutes / 60.0

            if direction in ("S", "W"):
                decimal = -decimal

            return round(decimal, 6)
        except (ValueError, IndexError):
            return None

    def shutdown(self):
        """Stop reading and close serial port."""
        self.stop()
        if self._serial and self._serial.is_open:
            try:
                self._serial.close()
            except Exception:
                pass
        logger.info("GPS shutdown complete")
