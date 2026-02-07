"""
Sensor Calibration Manager

Handles calibration routines for pH and TDS sensors.
Calibration data is persisted to a JSON file so it survives reboots.
"""

import json
import logging
import os
import time

logger = logging.getLogger(__name__)

DEFAULT_CAL_PATH = "/var/lib/bluesignal/calibration.json"


class CalibrationManager:
    """
    Manages sensor calibration data.

    Usage:
        cal = CalibrationManager()
        cal.load()
        ph_cal = cal.get("ph")
        cal.save("ph", {"slope": -5.556, "offset": 20.89})
    """

    def __init__(self, cal_path=DEFAULT_CAL_PATH):
        self.cal_path = cal_path
        self._data = {}

    def load(self):
        """Load calibration data from file."""
        if not os.path.exists(self.cal_path):
            logger.info("No calibration file found at %s, using defaults", self.cal_path)
            return False

        try:
            with open(self.cal_path, "r") as f:
                self._data = json.load(f)
            logger.info("Calibration data loaded from %s", self.cal_path)
            return True

        except Exception as e:
            logger.error("Failed to load calibration: %s", e)
            return False

    def save(self, sensor_name, cal_data):
        """
        Save calibration data for a sensor.

        Args:
            sensor_name: e.g., "ph", "tds", "turbidity"
            cal_data: dict of calibration parameters
        """
        self._data[sensor_name] = {
            **cal_data,
            "calibrated_at": time.time(),
        }

        try:
            # Ensure directory exists
            cal_dir = os.path.dirname(self.cal_path)
            if cal_dir and not os.path.exists(cal_dir):
                os.makedirs(cal_dir, mode=0o755, exist_ok=True)

            with open(self.cal_path, "w") as f:
                json.dump(self._data, f, indent=2)

            logger.info("Calibration saved for %s", sensor_name)
            return True

        except Exception as e:
            logger.error("Failed to save calibration: %s", e)
            return False

    def get(self, sensor_name):
        """
        Get calibration data for a sensor.

        Args:
            sensor_name: e.g., "ph", "tds"

        Returns:
            dict or None: Calibration parameters.
        """
        return self._data.get(sensor_name)

    def get_all(self):
        """Get all calibration data."""
        return self._data.copy()
