#!/usr/bin/env python3
"""BlueSignal WQM-1 — Main sensor acquisition loop.

Orchestrates sensor reads, local storage, LoRaWAN uplink, relay
automation, health monitoring, identity generation, time sync,
hardware watchdog, and revenue-grade data handling.

Designed for unattended 24/7 operation on Raspberry Pi Zero 2W
under systemd.
"""

import signal
import sys
import time
import logging
import threading
from pathlib import Path

import yaml

from .sensors.ads1115 import ADS1115
from .sensors.ph import PHSensor
from .sensors.tds import TDSSensor
from .sensors.turbidity import TurbiditySensor
from .sensors.orp import ORPSensor
from .sensors.temperature import TemperatureSensor
from .sensors.gps import GPSSensor
from .radio.lorawan import LoRaWAN
from .radio.cayenne import CayenneLPP
from .storage.database import ReadingsDB
from .storage.sync import SyncManager
from .control.relay import RelayController
from .control.led import StatusLED
from .control.rules import RuleEngine
from .calibration.calibrate import CalibrationManager
from .utils.logger import setup_logging
from .utils.health import HealthCheck
from .utils.config import load_json_safe, atomic_write_json
from .utils.identity import generate_if_needed
from .utils.time_sync import TimeSync
from .utils.watchdog import HardwareWatchdog

CONFIG_PATH = Path("/etc/bluesignal/config.yaml")
CALIBRATION_PATH = Path("/etc/bluesignal/calibration.yaml")
JSON_CONFIG_DIR = Path("/opt/bluesignal/config")
# Development fallback paths
DEV_CONFIG_DIR = Path(__file__).resolve().parent.parent / "config"

shutdown = False


def handle_signal(signum, frame):
    global shutdown
    shutdown = True


def load_config() -> dict:
    candidates = [
        CONFIG_PATH,
        Path(__file__).resolve().parent.parent / "config" / "config.yaml",
        Path(__file__).resolve().parent.parent / "config.yaml",
    ]
    for p in candidates:
        if p.exists():
            with open(p) as f:
                cfg = yaml.safe_load(f)
            if cfg:
                return cfg

    return {
        "device": {"id": "", "name": "WQM-1", "firmware_version": "1.0.0"},
        "sampling": {"interval_seconds": 60, "averaging_samples": 5, "warmup_seconds": 2},
        "sensors": {
            "ph": {"enabled": True, "adc_channel": 0, "gain": 1},
            "tds": {"enabled": True, "adc_channel": 1, "gain": 1},
            "turbidity": {"enabled": True, "adc_channel": 2, "gain": 1},
            "orp": {"enabled": True, "adc_channel": 0, "gain": 1},
            "temperature": {"enabled": True},
            "gps": {"enabled": True, "uart_port": "/dev/serial0", "baud_rate": 9600},
        },
        "lorawan": {"enabled": False},
        "relay": {"enabled": False, "gpio_pin": 23},
        "led": {"gpio_pin": 25},
        "storage": {"database_path": "/var/lib/bluesignal/readings.db", "retention_days": 30},
        "logging": {"level": "INFO"},
    }


def _get_config_dir() -> str:
    """Return the JSON config directory path."""
    if JSON_CONFIG_DIR.exists():
        return str(JSON_CONFIG_DIR)
    return str(DEV_CONFIG_DIR)


def main():
    global shutdown
    signal.signal(signal.SIGTERM, handle_signal)
    signal.signal(signal.SIGINT, handle_signal)

    config = load_config()
    setup_logging(config.get("logging", {}))
    log = logging.getLogger("wqm")

    version = config.get("device", {}).get("firmware_version", "1.0.0")
    log.info("WQM-1 firmware v%s starting", version)

    # ── 1. Generate identity if needed ─────────────────────
    config_dir = _get_config_dir()
    device_identity = generate_if_needed(config_dir)
    log.info("Device: %s", device_identity.get("device_id", "unknown"))

    # ── 2. Initialize LED ──────────────────────────────────
    led = StatusLED(config.get("led", {"gpio_pin": 25}))
    commissioned = device_identity.get("commissioned", False)
    if commissioned:
        led.request_state("NORMAL")
    else:
        led.request_state("COMMISSIONING")

    # ── 3. Initialize hardware watchdog ────────────────────
    watchdog = HardwareWatchdog(timeout=30)

    # ── 4. Initialize database ─────────────────────────────
    db = ReadingsDB(config.get("storage", {}).get(
        "database_path", "/var/lib/bluesignal/readings.db"))

    # ── 5. Shared bus lock (I2C + SPI contention) ──────────
    bus_lock = threading.Lock()

    # ── 6. Initialize ADCs ─────────────────────────────────
    adc1 = ADS1115(address=0x48)
    adc2 = ADS1115(address=0x49)

    # ── 7. Load calibration ────────────────────────────────
    cal_mgr = CalibrationManager(str(CALIBRATION_PATH))
    cal = cal_mgr.load()

    # Also load JSON calibration for revenue-grade fields
    json_cal = load_json_safe(
        str(Path(config_dir) / "calibration.json"),
        default={"revenue_grade": False}
    )
    revenue_grade = json_cal.get("revenue_grade", False)

    # Load JSON settings for revenue-grade config
    json_settings = load_json_safe(
        str(Path(config_dir) / "settings.json"),
        default={"revenue_grade": {"enabled": False}}
    )
    rg_settings = json_settings.get("revenue_grade", {})
    if rg_settings.get("enabled", False):
        revenue_grade = True

    # ── 8. Initialize sensors (with bus lock) ──────────────
    sc = config.get("sensors", {})
    sensors = {}

    if sc.get("ph", {}).get("enabled", True):
        ph_cfg = sc["ph"]
        ph_cfg["averaging_samples"] = config.get("sampling", {}).get("averaging_samples", 5)
        sensors["ph"] = PHSensor(adc1, ph_cfg, cal.get("ph", {}))

    if sc.get("tds", {}).get("enabled", True):
        tds_cfg = sc["tds"]
        tds_cfg["averaging_samples"] = config.get("sampling", {}).get("averaging_samples", 5)
        sensors["tds"] = TDSSensor(adc1, tds_cfg, cal.get("tds", {}))

    if sc.get("turbidity", {}).get("enabled", True):
        turb_cfg = sc["turbidity"]
        turb_cfg["averaging_samples"] = config.get("sampling", {}).get("averaging_samples", 5)
        sensors["turbidity"] = TurbiditySensor(adc1, turb_cfg, cal.get("turbidity", {}))

    if sc.get("orp", {}).get("enabled", True):
        orp_cfg = sc["orp"]
        orp_cfg["averaging_samples"] = config.get("sampling", {}).get("averaging_samples", 5)
        sensors["orp"] = ORPSensor(adc2, orp_cfg, cal.get("orp", {}))

    if sc.get("temperature", {}).get("enabled", True):
        sensors["temperature"] = TemperatureSensor(sc.get("temperature", {}))

    gps = None
    if sc.get("gps", {}).get("enabled", True):
        gps = GPSSensor(sc.get("gps", {}))
        if gps.start():
            sensors["gps"] = gps

    log.info("Sensors initialized: %s", list(sensors.keys()))

    # ── 9. Initialize time service ─────────────────────────
    time_sync = TimeSync(gps_sensor=gps)
    time_sync.start()
    log.info("Waiting for time sync...")
    time_sync.wait_for_valid(timeout=180)
    log.info("Time source: %s (reliable=%s)",
             time_sync.time_source, time_sync.is_reliable())

    # Revenue-grade: flag if time is not reliable
    time_reliable = time_sync.is_reliable()

    # ── 10. Initialize LoRa ────────────────────────────────
    lora = None
    lora_cfg = config.get("lorawan", {})
    if lora_cfg.get("enabled", False):
        # Merge credentials from lora.json if available
        lora_json = load_json_safe(
            str(Path(config_dir) / "lora.json"),
            default={}
        )
        if lora_json.get("app_key"):
            lora_cfg["app_key"] = lora_json["app_key"]
        if lora_json.get("dev_eui"):
            lora_cfg["dev_eui"] = lora_json["dev_eui"]
        elif device_identity.get("dev_eui"):
            lora_cfg["dev_eui"] = device_identity["dev_eui"]
        if not lora_cfg.get("app_eui") and device_identity.get("app_eui"):
            lora_cfg["app_eui"] = device_identity["app_eui"]

        lora = LoRaWAN(lora_cfg, bus_lock=bus_lock)
        led.request_state("LORA_JOINING")
        if lora.join():
            led.release_state("LORA_JOINING")
            led.request_state("JOIN_SUCCESS")
        else:
            led.release_state("LORA_JOINING")
            led.request_state("LORA_FAILED")

    # ── 11. Initialize relay ───────────────────────────────
    relay_cfg = config.get("relay", {})
    relay = RelayController(relay_cfg, db=db) if relay_cfg.get("enabled", False) else None
    rules = RuleEngine(relay_cfg.get("rules", []), relay) if relay else None

    sync = SyncManager(db, lora, config.get("storage", {}))

    log.info("All subsystems initialized. Entering main loop.")
    db.log_event("startup", {
        "version": version,
        "sensors": list(sensors.keys()),
        "device_id": device_identity.get("device_id"),
        "revenue_grade": revenue_grade,
        "time_source": time_sync.time_source,
    })

    # ── Determine sample interval ──────────────────────────
    interval = config.get("sampling", {}).get("interval_seconds", 60)

    # Revenue grade enforces minimum 15-min interval
    if revenue_grade and interval < 900:
        log.info("Revenue grade: enforcing minimum 900s sample interval (was %ds)", interval)
        interval = 900

    last_uplink = 0
    uplink_interval = lora_cfg.get("uplink_interval_seconds", 300) if lora else float("inf")
    pending_secondary = None  # Deferred split payload

    # ── Main loop ──────────────────────────────────────────
    while not shutdown:
        loop_start = time.time()
        watchdog.pet()

        try:
            reading = {"timestamp": time.time()}

            # Add time reliability flag for revenue grade
            if not time_reliable:
                reading["time_source"] = "estimated"

            temp_c = None

            # Read sensors with bus lock
            with bus_lock:
                if "temperature" in sensors:
                    temp_c = sensors["temperature"].read()
                    reading["temperature_c"] = temp_c

                if "ph" in sensors:
                    reading["ph"] = sensors["ph"].read(temperature_c=temp_c)

                if "tds" in sensors:
                    reading["tds_ppm"] = sensors["tds"].read(temperature_c=temp_c)

                if "turbidity" in sensors:
                    reading["turbidity_ntu"] = sensors["turbidity"].read()

            with bus_lock:
                if "orp" in sensors:
                    reading["orp_mv"] = sensors["orp"].read()

            if "gps" in sensors:
                gps_data = sensors["gps"].read()
                if gps_data:
                    reading["latitude"] = gps_data["latitude"]
                    reading["longitude"] = gps_data["longitude"]
                    reading["altitude_m"] = gps_data.get("altitude")
                    reading["satellites"] = gps_data.get("satellites")

            # Add relay state to reading
            if relay:
                reading["relay_state"] = relay.is_on()

            # Add calibration status for revenue grade
            if revenue_grade:
                cal_status = _build_calibration_status(json_cal)
                reading["calibration_status"] = cal_status
                # Check if any calibration is expired
                if _any_calibration_expired(json_cal):
                    reading["calibration_expired"] = True

            db.insert(reading)

            if rules:
                rules.evaluate(reading)

            # ── LoRa uplink ────────────────────────────────
            now = time.time()
            if lora and lora.is_joined() and (now - last_uplink) >= uplink_interval:
                led.request_state("UPDATING")

                # Send deferred secondary payload from previous split
                if pending_secondary:
                    lora.send(pending_secondary)
                    pending_secondary = None

                # Build and potentially split payload
                max_payload = lora.get_max_payload()
                payloads = CayenneLPP.encode_split(reading, max_payload)

                if lora.send(payloads[0]):
                    last_uplink = now
                    if len(payloads) > 1:
                        pending_secondary = payloads[1]
                    sync.flush_buffered()
                else:
                    log.warning("LoRa uplink failed, data buffered locally")

                led.release_state("UPDATING")

            # ── Periodic maintenance ───────────────────────
            if int(now) % 300 < interval:
                health = HealthCheck.run(adc1, adc2, lora, db)
                log.info("Health: %s", health)

            # Save time periodically (every 5 min)
            if int(now) % 300 < interval:
                time_sync.save_current_time()

            retention = config.get("storage", {}).get("retention_days", 30)
            if int(now) % 86400 < interval:
                db.prune(retention)

            log.info(
                "Reading: temp=%.1f pH=%.2f tds=%.0f turb=%.0f orp=%.0f%s",
                reading.get("temperature_c") or 0,
                reading.get("ph") or 0,
                reading.get("tds_ppm") or 0,
                reading.get("turbidity_ntu") or 0,
                reading.get("orp_mv") or 0,
                " [RG]" if revenue_grade else "",
            )

        except Exception as e:
            log.error("Main loop error: %s", e, exc_info=True)
            led.request_state("FAULT")
            time.sleep(5)
            led.release_state("FAULT")

        elapsed = time.time() - loop_start
        sleep_time = max(0, interval - elapsed)
        if sleep_time > 0 and not shutdown:
            end = time.time() + sleep_time
            while time.time() < end and not shutdown:
                watchdog.pet()
                time.sleep(min(1.0, max(0, end - time.time())))

    # ── Shutdown ───────────────────────────────────────────
    log.info("Shutdown signal received. Cleaning up...")
    led.set_pattern("off")
    if relay:
        relay.cleanup()
    if lora:
        lora.close()
    if "gps" in sensors:
        sensors["gps"].close()
    adc1.close()
    adc2.close()
    time_sync.save_current_time()
    time_sync.stop()
    db.log_event("shutdown")
    db.close()
    watchdog.close()
    led.cleanup()
    log.info("WQM-1 stopped.")


def _build_calibration_status(json_cal: dict) -> int:
    """Build calibration status bitmask for Cayenne LPP channel 9.

    Bit 0: pH calibrated (has non-null calibrated_at)
    Bit 1: TDS calibrated
    Bit 2: Turbidity calibrated
    Bit 3: ORP calibrated
    Bit 7: revenue_grade enabled
    """
    status = 0
    if json_cal.get("ph", {}).get("calibrated_at"):
        status |= 0x01
    if json_cal.get("tds", {}).get("calibrated_at"):
        status |= 0x02
    if json_cal.get("turbidity", {}).get("calibrated_at"):
        status |= 0x04
    if json_cal.get("orp", {}).get("calibrated_at"):
        status |= 0x08
    if json_cal.get("revenue_grade", False):
        status |= 0x80
    return status


def _any_calibration_expired(json_cal: dict) -> bool:
    """Check if any probe calibration has expired."""
    now = time.time()
    for probe in ["ph", "tds", "turbidity", "orp"]:
        probe_cal = json_cal.get(probe, {})
        expires_at = probe_cal.get("expires_at")
        if expires_at and isinstance(expires_at, (int, float)) and expires_at < now:
            return True
    return False


if __name__ == "__main__":
    main()
