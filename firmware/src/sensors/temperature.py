"""DS18B20 temperature sensor via 1-Wire on GPIO 4.

Reads from the kernel 1-Wire driver at /sys/bus/w1/devices/28-*.
The dtoverlay=w1-gpio,gpiopin=4 must be enabled in /boot/firmware/config.txt.
"""

import glob
import logging
import time

log = logging.getLogger("wqm.temp")

W1_BASE = "/sys/bus/w1/devices/"


class TemperatureSensor:
    def __init__(self, config: dict):
        self.device_path = None
        self._find_device()

    def _find_device(self):
        devices = glob.glob(W1_BASE + "28-*")
        if devices:
            self.device_path = devices[0] + "/w1_slave"
            log.info("DS18B20 found at %s", self.device_path)
        else:
            log.warning("No DS18B20 found on 1-Wire bus")

    def read(self) -> float | None:
        if not self.device_path:
            self._find_device()
            if not self.device_path:
                return None

        for attempt in range(3):
            try:
                with open(self.device_path, "r") as f:
                    lines = f.readlines()

                if len(lines) < 2:
                    log.warning("DS18B20: incomplete read")
                    continue

                if "YES" not in lines[0]:
                    log.warning("DS18B20 CRC check failed, retry %d", attempt + 1)
                    time.sleep(0.1 * (attempt + 1))
                    continue

                pos = lines[1].find("t=")
                if pos == -1:
                    continue

                temp_c = int(lines[1][pos + 2:]) / 1000.0

                if temp_c < -55.0 or temp_c > 125.0:
                    log.warning("DS18B20: %.1f°C outside rated range", temp_c)

                log.debug("Temperature: %.2f°C", temp_c)
                return round(temp_c, 2)

            except (FileNotFoundError, IOError) as e:
                log.error("DS18B20 read error: %s", e)
                self.device_path = None
                return None

        log.error("DS18B20: all retries failed")
        return None
