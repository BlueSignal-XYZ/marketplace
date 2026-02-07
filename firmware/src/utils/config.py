"""
Configuration Management

Loads device configuration from config.yaml and provides validated
defaults for all configurable parameters.
"""

import logging
import os

logger = logging.getLogger(__name__)

DEFAULT_CONFIG_PATH = "/etc/bluesignal/config.yaml"

# Fallback defaults when no config file exists
DEFAULTS = {
    "device": {
        "id": "bs-wqm-unknown",
        "model": "BS-WQM-100",
        "firmware_version": "1.0.0",
    },
    "sampling": {
        "interval_seconds": 300,     # 5 minutes
        "warmup_seconds": 5,         # Sensor warmup before reading
        "averaging_samples": 3,      # Number of ADC samples to average
    },
    "lorawan": {
        "dev_eui": "",
        "app_eui": "",
        "app_key": "",
        "region": "US915",
        "spreading_factor": 7,
        "tx_power": 14,
        "join_retries": 3,
        "join_timeout": 30,
    },
    "sensors": {
        "ph": {
            "enabled": True,
            "adc_channel": 3,
            "calibration": {
                "ph4_voltage": 3.04,
                "ph7_voltage": 2.50,
            },
        },
        "tds": {
            "enabled": True,
            "adc_channel": 0,
            "calibration": {
                "factor": 500.0,
                "offset": 0.0,
            },
        },
        "turbidity": {
            "enabled": True,
            "adc_channel": 1,
            "calibration": {
                "coeff_a": -1120.4,
                "coeff_b": 5742.3,
                "coeff_c": -4352.9,
            },
        },
        "temperature": {
            "enabled": True,
            "device_id": None,  # Auto-detect
        },
        "gps": {
            "enabled": True,
            "port": "/dev/ttyAMA0",
            "baud": 9600,
            "fix_timeout": 120,
        },
    },
    "antifouling": {
        "enabled": True,
        "on_duration": 30,
        "off_duration": 270,
    },
    "storage": {
        "db_path": "/var/lib/bluesignal/readings.db",
        "cleanup_days": 30,
    },
    "logging": {
        "level": "INFO",
        "file": "/var/log/bluesignal/wqm.log",
        "max_size_mb": 10,
        "backup_count": 3,
    },
}


class DeviceConfig:
    """
    Typed configuration object with dot-notation access.
    """

    def __init__(self, config_dict):
        self._data = config_dict

    def get(self, key_path, default=None):
        """
        Get a config value using dot-notation path.

        Args:
            key_path: e.g., "lorawan.dev_eui" or "sampling.interval_seconds"
            default: Fallback value if key not found.

        Returns:
            The config value.
        """
        keys = key_path.split(".")
        value = self._data
        for key in keys:
            if isinstance(value, dict) and key in value:
                value = value[key]
            else:
                return default
        return value

    def to_dict(self):
        """Return the full config as a dict."""
        return self._data


def load_config(config_path=None):
    """
    Load configuration from YAML file with defaults.

    Args:
        config_path: Path to config.yaml. If None, checks:
            1. ./config.yaml (current directory)
            2. /etc/bluesignal/config.yaml

    Returns:
        DeviceConfig: Validated configuration object.
    """
    import copy

    config = copy.deepcopy(DEFAULTS)

    # Find config file
    if config_path is None:
        candidates = [
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(
                os.path.abspath(__file__)
            ))), "config.yaml"),
            DEFAULT_CONFIG_PATH,
        ]
        for path in candidates:
            if os.path.exists(path):
                config_path = path
                break

    if config_path and os.path.exists(config_path):
        try:
            import yaml

            with open(config_path, "r") as f:
                user_config = yaml.safe_load(f)

            if user_config:
                _deep_merge(config, user_config)
                logger.info("Configuration loaded from %s", config_path)
            else:
                logger.warning("Config file is empty, using defaults")

        except ImportError:
            logger.warning("PyYAML not installed, using defaults")
        except Exception as e:
            logger.error("Failed to load config from %s: %s", config_path, e)
    else:
        logger.warning("No config file found, using defaults")

    # Validate critical fields
    if not config["lorawan"]["dev_eui"]:
        logger.warning("LoRaWAN dev_eui not configured!")

    return DeviceConfig(config)


def _deep_merge(base, override):
    """
    Deep merge override dict into base dict.
    Override values take precedence; base provides defaults.
    """
    for key, value in override.items():
        if key in base and isinstance(base[key], dict) and isinstance(value, dict):
            _deep_merge(base[key], value)
        else:
            base[key] = value
