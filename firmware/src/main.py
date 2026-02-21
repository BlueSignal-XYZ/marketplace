#!/usr/bin/env python3
"""BlueSignal WQM-1 — Main sensor acquisition loop.

Orchestrates sensor reads, local storage, LoRaWAN uplink, relay
automation, and health monitoring. Designed for unattended 24/7
operation on Raspberry Pi Zero 2W under systemd.
"""

import signal
import sys
import time
import logging
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

CONFIG_PATH = Path("/etc/bluesignal/config.yaml")
CALIBRATION_PATH = Path("/etc/bluesignal/calibration.yaml")

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


def main():
    global shutdown
    signal.signal(signal.SIGTERM, handle_signal)
    signal.signal(signal.SIGINT, handle_signal)

    config = load_config()
    setup_logging(config.get("logging", {}))
    log = logging.getLogger("wqm")

    version = config.get("device", {}).get("firmware_version", "1.0.0")
    log.info("WQM-1 firmware v%s starting", version)

    led = StatusLED(config.get("led", {"gpio_pin": 25}))
    led.set_pattern("boot")

    db = ReadingsDB(config.get("storage", {}).get(
        "database_path", "/var/lib/bluesignal/readings.db"))

    adc1 = ADS1115(address=0x48)
    adc2 = ADS1115(address=0x49)

    cal_mgr = CalibrationManager(str(CALIBRATION_PATH))
    cal = cal_mgr.load()

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

    if sc.get("gps", {}).get("enabled", True):
        gps = GPSSensor(sc.get("gps", {}))
        if gps.start():
            sensors["gps"] = gps

    log.info("Sensors initialized: %s", list(sensors.keys()))

    lora = None
    lora_cfg = config.get("lorawan", {})
    if lora_cfg.get("enabled", False):
        lora = LoRaWAN(lora_cfg)
        lora.join()

    relay_cfg = config.get("relay", {})
    relay = RelayController(relay_cfg) if relay_cfg.get("enabled", False) else None
    rules = RuleEngine(relay_cfg.get("rules", []), relay) if relay else None

    sync = SyncManager(db, lora, config.get("storage", {}))

    led.set_pattern("sampling")
    log.info("All subsystems initialized. Entering main loop.")
    db.log_event("startup", {"version": version, "sensors": list(sensors.keys())})

    interval = config.get("sampling", {}).get("interval_seconds", 60)
    last_uplink = 0
    uplink_interval = lora_cfg.get("uplink_interval_seconds", 300) if lora else float("inf")

    while not shutdown:
        loop_start = time.time()

        try:
            reading = {"timestamp": time.time()}
            temp_c = None

            if "temperature" in sensors:
                temp_c = sensors["temperature"].read()
                reading["temperature_c"] = temp_c

            if "ph" in sensors:
                reading["ph"] = sensors["ph"].read(temperature_c=temp_c)

            if "tds" in sensors:
                reading["tds_ppm"] = sensors["tds"].read(temperature_c=temp_c)

            if "turbidity" in sensors:
                reading["turbidity_ntu"] = sensors["turbidity"].read()

            if "orp" in sensors:
                reading["orp_mv"] = sensors["orp"].read()

            if "gps" in sensors:
                gps_data = sensors["gps"].read()
                if gps_data:
                    reading["latitude"] = gps_data["latitude"]
                    reading["longitude"] = gps_data["longitude"]
                    reading["altitude_m"] = gps_data.get("altitude")
                    reading["satellites"] = gps_data.get("satellites")

            db.insert(reading)

            if rules:
                rules.evaluate(reading)

            now = time.time()
            if lora and lora.is_joined() and (now - last_uplink) >= uplink_interval:
                led.set_pattern("transmitting")
                payload = CayenneLPP.encode(reading)
                if lora.send(payload):
                    last_uplink = now
                    sync.flush_buffered()
                else:
                    log.warning("LoRa uplink failed, data buffered locally")
                led.set_pattern("sampling")

            if int(now) % 300 < interval:
                health = HealthCheck.run(adc1, adc2, lora, db)
                log.info("Health: %s", health)

            retention = config.get("storage", {}).get("retention_days", 30)
            if int(now) % 86400 < interval:
                db.prune(retention)

            log.info(
                "Reading: temp=%.1f pH=%.2f tds=%.0f turb=%.0f orp=%.0f",
                reading.get("temperature_c") or 0,
                reading.get("ph") or 0,
                reading.get("tds_ppm") or 0,
                reading.get("turbidity_ntu") or 0,
                reading.get("orp_mv") or 0,
            )

        except Exception as e:
            log.error("Main loop error: %s", e, exc_info=True)
            led.set_pattern("error")
            time.sleep(5)
            led.set_pattern("sampling")

        elapsed = time.time() - loop_start
        sleep_time = max(0, interval - elapsed)
        if sleep_time > 0 and not shutdown:
            end = time.time() + sleep_time
            while time.time() < end and not shutdown:
                time.sleep(1.0)

    log.info("Shutdown signal received. Cleaning up...")
    led.set_pattern("boot")
    if relay:
        relay.off()
    if lora:
        lora.close()
    if "gps" in sensors:
        sensors["gps"].close()
    adc1.close()
    adc2.close()
    db.log_event("shutdown")
    db.close()
    led.off()
    led.cleanup()
    log.info("WQM-1 stopped.")


if __name__ == "__main__":
    main()
