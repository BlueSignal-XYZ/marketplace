"""
DS18B20 Digital Temperature Sensor Driver

Reads temperature from a DS18B20 sensor connected on the 1-Wire bus (GPIO4).
The Pi's 1-Wire interface must be enabled in /boot/config.txt:
    dtoverlay=w1-gpio,gpiopin=4

The DS18B20 appears as a file under /sys/bus/w1/devices/28-*/w1_slave
and reports temperature in millidegrees Celsius.
"""

import logging
import glob
import time

logger = logging.getLogger(__name__)

# 1-Wire device directory
W1_DEVICES_PATH = "/sys/bus/w1/devices/"
W1_DEVICE_PREFIX = "28-"  # DS18B20 family code
W1_SLAVE_FILE = "w1_slave"


class TemperatureSensor:
    """
    DS18B20 temperature sensor on 1-Wire bus.

    Usage:
        temp = TemperatureSensor()
        temp.initialize()
        value = temp.read()  # returns degrees Celsius
    """

    def __init__(self, device_id=None):
        """
        Args:
            device_id: Specific 1-Wire device ID (e.g., "28-0123456789ab").
                       If None, auto-detects the first DS18B20.
        """
        self.device_id = device_id
        self.device_path = None

    def initialize(self):
        """
        Initialize by finding the DS18B20 device on the 1-Wire bus.

        Returns:
            bool: True if sensor found, False otherwise.
        """
        try:
            if self.device_id:
                # Use specified device
                path = W1_DEVICES_PATH + self.device_id + "/" + W1_SLAVE_FILE
                try:
                    with open(path, "r"):
                        pass
                    self.device_path = path
                    logger.info("DS18B20 found at %s", self.device_id)
                    return True
                except FileNotFoundError:
                    logger.error("DS18B20 device %s not found", self.device_id)
                    return False
            else:
                # Auto-detect first DS18B20
                devices = glob.glob(W1_DEVICES_PATH + W1_DEVICE_PREFIX + "*")
                if not devices:
                    logger.error(
                        "No DS18B20 sensor found. Ensure 1-Wire is enabled: "
                        "dtoverlay=w1-gpio,gpiopin=4 in /boot/config.txt"
                    )
                    return False

                self.device_id = devices[0].split("/")[-1]
                self.device_path = devices[0] + "/" + W1_SLAVE_FILE
                logger.info("DS18B20 auto-detected: %s", self.device_id)

                if len(devices) > 1:
                    logger.warning(
                        "Multiple DS18B20 sensors found (%d), using first: %s",
                        len(devices),
                        self.device_id,
                    )

                return True

        except Exception as e:
            logger.error("DS18B20 initialization error: %s", e)
            return False

    def read(self):
        """
        Read temperature in degrees Celsius.

        The DS18B20 takes ~750ms for a 12-bit conversion. The kernel driver
        handles this automatically; reading the w1_slave file blocks until
        the conversion is complete.

        Returns:
            float: Temperature in Celsius (e.g., 22.5), or None on error.
        """
        if self.device_path is None:
            logger.error("DS18B20 not initialized")
            return None

        try:
            with open(self.device_path, "r") as f:
                lines = f.readlines()

            # First line ends with "YES" if CRC is valid
            if len(lines) < 2:
                logger.error("DS18B20: incomplete read")
                return None

            if "YES" not in lines[0]:
                logger.warning("DS18B20: CRC check failed, retrying...")
                time.sleep(0.2)
                return self._retry_read()

            # Second line contains "t=XXXXX" where XXXXX is millidegrees
            temp_pos = lines[1].find("t=")
            if temp_pos == -1:
                logger.error("DS18B20: temperature data not found in response")
                return None

            temp_string = lines[1][temp_pos + 2:].strip()
            temp_c = float(temp_string) / 1000.0

            # Sanity check
            if temp_c < -55.0 or temp_c > 125.0:
                logger.warning(
                    "DS18B20: temperature %.1f°C outside rated range", temp_c
                )

            logger.debug("Temperature: %.2f°C", temp_c)
            return round(temp_c, 2)

        except FileNotFoundError:
            logger.error("DS18B20: device file disappeared (sensor disconnected?)")
            return None
        except (ValueError, IndexError) as e:
            logger.error("DS18B20: parse error: %s", e)
            return None
        except Exception as e:
            logger.error("DS18B20: read error: %s", e)
            return None

    def _retry_read(self, max_retries=3):
        """Retry reading on CRC failure."""
        for attempt in range(max_retries):
            time.sleep(0.1 * (attempt + 1))
            try:
                with open(self.device_path, "r") as f:
                    lines = f.readlines()

                if len(lines) >= 2 and "YES" in lines[0]:
                    temp_pos = lines[1].find("t=")
                    if temp_pos != -1:
                        temp_c = float(lines[1][temp_pos + 2:].strip()) / 1000.0
                        logger.debug("DS18B20 retry %d succeeded: %.2f°C",
                                     attempt + 1, temp_c)
                        return round(temp_c, 2)
            except Exception:
                continue

        logger.error("DS18B20: all retries failed")
        return None

    def shutdown(self):
        """No cleanup needed for 1-Wire."""
        logger.info("DS18B20 shutdown complete")
