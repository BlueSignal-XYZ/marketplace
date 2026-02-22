"""Atomic JSON config read/write utilities.

All JSON config files (device.json, calibration.json, settings.json, lora.json)
must be written atomically to survive power loss during write. A partial write
produces invalid JSON, which crashes services on next boot.

Uses write-to-temp, fsync, rename pattern — atomic on the same filesystem.
"""

import json
import os
import tempfile
import logging

log = logging.getLogger("wqm.config")


def atomic_write_json(filepath, data):
    """Write JSON atomically. Safe against power loss during write.

    Strategy: write to a temporary file in the same directory, fsync to
    flush to SD card, then rename (which is atomic on ext4/same-fs).
    """
    dir_path = os.path.dirname(os.path.abspath(filepath))
    os.makedirs(dir_path, exist_ok=True)

    fd, tmp_path = tempfile.mkstemp(dir=dir_path, suffix=".tmp")
    try:
        with os.fdopen(fd, "w") as f:
            json.dump(data, f, indent=2)
            f.write("\n")
            f.flush()
            os.fsync(f.fileno())
        os.rename(tmp_path, filepath)
        log.debug("Config written: %s", filepath)
    except Exception:
        if os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
        raise


def load_json_safe(filepath, default=None):
    """Load JSON with graceful fallback on corruption or missing file.

    If the file is missing or contains invalid JSON:
    - If default is provided, return it and log a warning
    - If no default, raise the original exception
    """
    try:
        with open(filepath, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        if default is not None:
            log.warning("Config not found: %s — using defaults", filepath)
            return default
        raise
    except json.JSONDecodeError as e:
        if default is not None:
            log.error("Config corrupted: %s (%s) — using defaults", filepath, e)
            return default
        raise


def merge_config(base, updates):
    """Deep-merge updates into base config dict. Returns new dict."""
    result = dict(base)
    for key, value in updates.items():
        if (
            key in result
            and isinstance(result[key], dict)
            and isinstance(value, dict)
        ):
            result[key] = merge_config(result[key], value)
        else:
            result[key] = value
    return result
