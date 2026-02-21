"""First-boot identity generation from Pi serial number.

Generates device.json, calibration.json, and settings.json config files
using the Pi's unique hardware serial number from /proc/cpuinfo.

Identity format:
  device_id:  BS-WQM1-{last 12 chars of serial}
  ble_name:   BlueSignal-{last 4 chars of serial}
  dev_eui:    0018B200{last 8 chars of serial}
  app_eui:    70B3D57ED0000001 (fixed for all BlueSignal devices)
"""

import os
import logging
from datetime import datetime

from .config import atomic_write_json, load_json_safe

log = logging.getLogger("wqm.identity")

OUI_PREFIX = "0018B200"
APP_EUI = "70B3D57ED0000001"
HW_REVISION = "WQM1-v1.0"
FW_VERSION = "1.0.0"


def _read_pi_serial() -> str:
    """Read the Pi's 16-char hex serial from /proc/cpuinfo."""
    try:
        with open("/proc/cpuinfo", "r") as f:
            for line in f:
                if line.startswith("Serial"):
                    serial = line.strip().split(":")[1].strip()
                    return serial.lower()
    except (FileNotFoundError, IOError, IndexError):
        pass

    # Fallback: use MAC address of wlan0
    try:
        with open("/sys/class/net/wlan0/address", "r") as f:
            mac = f.read().strip().replace(":", "")
            return mac.ljust(16, "0")
    except (FileNotFoundError, IOError):
        pass

    # Last resort: generate from hostname
    import hashlib
    hostname = os.uname().nodename
    return hashlib.sha256(hostname.encode()).hexdigest()[:16]


def generate_device_identity(serial: str) -> dict:
    """Generate device identity fields from Pi serial number."""
    serial = serial.lower()
    last12 = serial[-12:].upper()
    last8 = serial[-8:].upper()
    last4 = serial[-4:].upper()

    return {
        "device_id": f"BS-WQM1-{last12}",
        "ble_name": f"BlueSignal-{last4}",
        "dev_eui": f"{OUI_PREFIX}{last8}",
        "app_eui": APP_EUI,
        "hw_revision": HW_REVISION,
        "fw_version": FW_VERSION,
        "flash_date": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "commissioned": False,
    }


def default_calibration() -> dict:
    """Default calibration config with revenue-grade fields."""
    return {
        "ph": {
            "offset": 0.0,
            "slope": 1.0,
            "point_low": {"ph": 4.01, "voltage": 1.05},
            "point_high": {"ph": 6.86, "voltage": 1.50},
            "calibrated_at": None,
            "expires_at": None,
            "standards": [],
        },
        "tds": {
            "scale_factor": 500.0,
            "offset": 0.0,
            "calibrated_at": None,
            "expires_at": None,
            "standards": [],
        },
        "turbidity": {
            "scale_factor": 909.09,
            "coeff_a": -1120.4,
            "coeff_b": 5742.3,
            "coeff_c": -4352.9,
            "calibrated_at": None,
            "expires_at": None,
            "standards": [],
        },
        "orp": {
            "offset": 0.0,
            "offset_mv": 0.0,
            "calibrated_at": None,
            "expires_at": None,
            "standards": [],
        },
        "revenue_grade": False,
    }


def default_settings() -> dict:
    """Default operational settings with revenue-grade block."""
    return {
        "sample_interval_seconds": 900,
        "uplink_interval_seconds": 900,
        "alert_thresholds": {
            "ph_low": 6.0,
            "ph_high": 9.0,
            "tds_high": 800,
            "turbidity_high": 100,
            "orp_low": 150,
            "temperature_high": 35.0,
        },
        "relay_rules": [],
        "power_save_mode": False,
        "gps": {
            "duty_cycle_enabled": False,
            "duty_interval_seconds": 3600,
            "mobile_mode": False,
        },
        "revenue_grade": {
            "enabled": False,
            "baseline_type": None,
            "baseline_start": None,
            "baseline_duration_days": None,
            "min_uptime_pct": 95,
            "max_gap_hours": 4,
            "flow_estimate_m3_per_day": None,
        },
    }


def generate_if_needed(config_dir: str) -> dict:
    """Generate identity and config files if they don't exist.

    Args:
        config_dir: Path to the config directory (e.g. /opt/bluesignal/config
                     or firmware/config for development).

    Returns:
        The device identity dict (from device.json).
    """
    os.makedirs(config_dir, exist_ok=True)

    device_path = os.path.join(config_dir, "device.json")
    calibration_path = os.path.join(config_dir, "calibration.json")
    settings_path = os.path.join(config_dir, "settings.json")

    # Device identity
    device = load_json_safe(device_path, default=None)
    if device is None:
        serial = _read_pi_serial()
        device = generate_device_identity(serial)
        atomic_write_json(device_path, device)
        log.info("Generated device identity: %s", device["device_id"])
    else:
        log.info("Device identity exists: %s", device.get("device_id", "unknown"))

    # Calibration
    if not os.path.exists(calibration_path):
        atomic_write_json(calibration_path, default_calibration())
        log.info("Generated default calibration config")

    # Settings
    if not os.path.exists(settings_path):
        atomic_write_json(settings_path, default_settings())
        log.info("Generated default settings config")

    return device
