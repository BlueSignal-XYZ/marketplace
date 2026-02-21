"""Structured logging with rotation. JSON to file + human-readable to stdout."""

import logging
import logging.handlers
import json
import os
import time


class JSONFormatter(logging.Formatter):
    """Emit JSON log lines for machine parsing."""

    def format(self, record):
        entry = {
            "ts": time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime(record.created)),
            "level": record.levelname,
            "logger": record.name,
            "msg": record.getMessage(),
        }
        if record.exc_info and record.exc_info[0]:
            entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(entry)


def setup_logging(config: dict):
    """Configure root logger from config dict."""
    level_str = config.get("level", "INFO").upper()
    level = getattr(logging, level_str, logging.INFO)
    log_file = config.get("file", "/var/log/bluesignal/wqm.log")
    max_bytes = config.get("max_size_mb", 10) * 1024 * 1024
    backup_count = config.get("backup_count", 3)

    root = logging.getLogger()
    root.setLevel(level)

    if root.handlers:
        root.handlers.clear()

    console = logging.StreamHandler()
    console.setLevel(level)
    console.setFormatter(logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    ))
    root.addHandler(console)

    if log_file:
        log_dir = os.path.dirname(log_file)
        if log_dir:
            try:
                os.makedirs(log_dir, mode=0o755, exist_ok=True)
            except PermissionError:
                logging.warning("Cannot create log dir %s, file logging disabled", log_dir)
                return

        try:
            fh = logging.handlers.RotatingFileHandler(
                log_file, maxBytes=max_bytes, backupCount=backup_count,
            )
            fh.setLevel(level)
            fh.setFormatter(JSONFormatter())
            root.addHandler(fh)
        except Exception as e:
            logging.warning("Cannot open log file %s: %s", log_file, e)
