"""Calibration data manager. Reads/writes calibration.yaml."""

import logging
import time
from pathlib import Path

log = logging.getLogger("wqm.calibration")


class CalibrationManager:
    def __init__(self, cal_path: str):
        self.cal_path = Path(cal_path)
        self._data = {}

    def load(self) -> dict:
        """Load calibration data from YAML file."""
        if not self.cal_path.exists():
            log.info("No calibration file at %s, using defaults", self.cal_path)
            return {}

        try:
            import yaml
            with open(self.cal_path) as f:
                self._data = yaml.safe_load(f) or {}
            log.info("Calibration loaded from %s", self.cal_path)
            return self._data
        except Exception as e:
            log.error("Failed to load calibration: %s", e)
            return {}

    def get(self, sensor_name: str) -> dict:
        """Get calibration data for a sensor."""
        return self._data.get(sensor_name, {})

    def save(self, sensor_name: str, cal_data: dict):
        """Save calibration data for a sensor."""
        self._data[sensor_name] = {**cal_data, "calibrated_at": time.time()}

        try:
            import yaml
            self.cal_path.parent.mkdir(parents=True, exist_ok=True)
            with open(self.cal_path, "w") as f:
                yaml.dump(self._data, f, default_flow_style=False)
            log.info("Calibration saved for %s", sensor_name)
        except Exception as e:
            log.error("Failed to save calibration: %s", e)

    def get_all(self) -> dict:
        return dict(self._data)
