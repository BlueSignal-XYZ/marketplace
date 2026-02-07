#!/usr/bin/env python3
"""
BlueSignal BS-WQM-100 Water Quality Monitor — Main Entry Point

This is the main firmware application for the BlueSignal water quality
monitoring device. It initializes all sensors, establishes a LoRaWAN
connection, and runs the continuous sampling loop.

Sampling loop:
  1. Read all sensors (ADC channels, DS18B20, GPS)
  2. Apply calibration and temperature compensation
  3. Store reading in local SQLite buffer
  4. Encode as Cayenne LPP payload
  5. Transmit via LoRaWAN
  6. Drain any buffered readings if connected
  7. Sleep until next interval

Usage:
  python3 main.py                    # Uses default config path
  python3 main.py --config /path/to/config.yaml
  python3 main.py --calibrate ph     # Enter pH calibration mode
"""

import argparse
import logging
import logging.handlers
import os
import signal
import sys
import time

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sensors import ADCReader, PHSensor, TDSSensor, TurbiditySensor, TemperatureSensor, GPSSensor
from comms import LoRaWAN, CayenneLPP
from comms.payload import encode_sensor_reading
from storage import LocalDatabase, SyncManager
from control import RelayController, StatusLED
from utils import load_config, CalibrationManager

# Version
__version__ = "1.0.0"

# Global shutdown flag
_shutdown = False


def signal_handler(signum, frame):
    """Handle SIGTERM/SIGINT for graceful shutdown."""
    global _shutdown
    _shutdown = True
    logging.getLogger(__name__).info("Shutdown signal received (%s)", signum)


def setup_logging(config):
    """Configure logging from config."""
    log_level = getattr(logging, config.get("logging.level", "INFO").upper(), logging.INFO)
    log_file = config.get("logging.file", "/var/log/bluesignal/wqm.log")
    max_size = config.get("logging.max_size_mb", 10) * 1024 * 1024
    backup_count = config.get("logging.backup_count", 3)

    # Create log directory
    log_dir = os.path.dirname(log_file)
    if log_dir and not os.path.exists(log_dir):
        try:
            os.makedirs(log_dir, mode=0o755, exist_ok=True)
        except PermissionError:
            log_file = None  # Fall back to console only

    # Root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Console handler
    console = logging.StreamHandler(sys.stdout)
    console.setLevel(log_level)
    console.setFormatter(logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    ))
    root_logger.addHandler(console)

    # File handler (rotating)
    if log_file:
        try:
            file_handler = logging.handlers.RotatingFileHandler(
                log_file, maxBytes=max_size, backupCount=backup_count,
            )
            file_handler.setLevel(log_level)
            file_handler.setFormatter(logging.Formatter(
                "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S",
            ))
            root_logger.addHandler(file_handler)
        except Exception as e:
            logging.warning("Could not create log file %s: %s", log_file, e)


def initialize_sensors(config, cal_manager):
    """
    Initialize all sensor drivers.

    Returns:
        dict: Initialized sensor objects.
    """
    logger = logging.getLogger(__name__)
    sensors = {}

    # ADC (shared by pH, TDS, turbidity)
    adc = ADCReader()
    if adc.initialize():
        sensors["adc"] = adc
    else:
        logger.error("ADC initialization failed -- analog sensors unavailable")
        return sensors

    # pH sensor
    if config.get("sensors.ph.enabled", True):
        ph_cal = cal_manager.get("ph") or config.get("sensors.ph.calibration", {})
        ph = PHSensor(
            adc,
            channel=config.get("sensors.ph.adc_channel", 3),
            calibration=ph_cal,
        )
        ph.initialize()
        sensors["ph"] = ph

    # TDS sensor
    if config.get("sensors.tds.enabled", True):
        tds_cal = cal_manager.get("tds") or config.get("sensors.tds.calibration", {})
        tds = TDSSensor(
            adc,
            channel=config.get("sensors.tds.adc_channel", 0),
            calibration=tds_cal,
        )
        tds.initialize()
        sensors["tds"] = tds

    # Turbidity sensor
    if config.get("sensors.turbidity.enabled", True):
        turb_cal = cal_manager.get("turbidity") or config.get("sensors.turbidity.calibration", {})
        turb = TurbiditySensor(
            adc,
            channel=config.get("sensors.turbidity.adc_channel", 1),
            calibration=turb_cal,
        )
        turb.initialize()
        sensors["turbidity"] = turb

    # Temperature sensor (DS18B20)
    if config.get("sensors.temperature.enabled", True):
        temp = TemperatureSensor(
            device_id=config.get("sensors.temperature.device_id"),
        )
        if temp.initialize():
            sensors["temperature"] = temp
        else:
            logger.warning("DS18B20 not found -- temperature readings unavailable")

    # GPS
    if config.get("sensors.gps.enabled", True):
        gps = GPSSensor(
            port=config.get("sensors.gps.port", "/dev/ttyAMA0"),
            baud=config.get("sensors.gps.baud", 9600),
        )
        if gps.initialize():
            gps.start()
            sensors["gps"] = gps
        else:
            logger.warning("GPS initialization failed -- location unavailable")

    return sensors


def read_all_sensors(sensors, config):
    """
    Read all sensors and return a structured reading dict.

    Returns:
        dict: {temperature, ph, turbidity, tds, gps, metadata}
    """
    logger = logging.getLogger(__name__)
    reading = {
        "temperature": None,
        "ph": None,
        "turbidity": None,
        "tds": None,
        "gps": None,
        "metadata": {},
    }

    # Averaging samples
    avg_count = config.get("sampling.averaging_samples", 3)

    # Temperature first (needed for TDS compensation)
    if "temperature" in sensors:
        reading["temperature"] = sensors["temperature"].read()

    # pH
    if "ph" in sensors:
        values = []
        for _ in range(avg_count):
            v = sensors["ph"].read()
            if v is not None:
                values.append(v)
            time.sleep(0.05)
        if values:
            reading["ph"] = round(sum(values) / len(values), 2)

    # Turbidity
    if "turbidity" in sensors:
        values = []
        for _ in range(avg_count):
            v = sensors["turbidity"].read()
            if v is not None:
                values.append(v)
            time.sleep(0.05)
        if values:
            reading["turbidity"] = round(sum(values) / len(values), 1)

    # TDS (temperature compensated)
    if "tds" in sensors:
        values = []
        for _ in range(avg_count):
            v = sensors["tds"].read(temperature=reading["temperature"])
            if v is not None:
                values.append(v)
            time.sleep(0.05)
        if values:
            reading["tds"] = round(sum(values) / len(values), 1)

    # GPS
    if "gps" in sensors:
        gps_data = sensors["gps"].read()
        if gps_data and gps_data.has_fix:
            reading["gps"] = gps_data.to_dict()

    logger.info(
        "Sensor reading: temp=%.1f°C, pH=%.2f, turb=%.1f NTU, TDS=%.0f ppm, GPS=%s",
        reading["temperature"] or 0,
        reading["ph"] or 0,
        reading["turbidity"] or 0,
        reading["tds"] or 0,
        "fix" if reading["gps"] else "no fix",
    )

    return reading


def main():
    global _shutdown

    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="BlueSignal BS-WQM-100 Firmware")
    parser.add_argument("--config", help="Path to config.yaml")
    parser.add_argument("--calibrate", choices=["ph", "tds"],
                        help="Enter calibration mode for a sensor")
    parser.add_argument("--version", action="version", version=f"BS-WQM-100 v{__version__}")
    args = parser.parse_args()

    # Load configuration
    config = load_config(args.config)
    setup_logging(config)

    logger = logging.getLogger(__name__)
    logger.info("=" * 60)
    logger.info("BlueSignal BS-WQM-100 v%s starting...", __version__)
    logger.info("Device ID: %s", config.get("device.id", "unknown"))
    logger.info("=" * 60)

    # Register signal handlers
    signal.signal(signal.SIGTERM, signal_handler)
    signal.signal(signal.SIGINT, signal_handler)

    # Initialize calibration manager
    # Derive calibration path from the db_path directory, not by replacing
    # the filename — that breaks when db_path uses a non-default name.
    _db_path = config.get("storage.db_path", "/var/lib/bluesignal/readings.db")
    _cal_dir = os.path.dirname(_db_path) or "/var/lib/bluesignal"
    cal_manager = CalibrationManager(
        cal_path=os.path.join(_cal_dir, "calibration.json")
    )
    cal_manager.load()

    # Initialize status LED
    led = StatusLED()
    led.initialize()
    led.set_status("init", blink=True)

    # Initialize sensors
    logger.info("Initializing sensors...")
    sensors = initialize_sensors(config, cal_manager)
    logger.info("Sensors initialized: %s", list(sensors.keys()))

    # Handle calibration mode
    if args.calibrate:
        run_calibration(args.calibrate, sensors, cal_manager)
        return

    # Initialize local database
    db = LocalDatabase(db_path=config.get("storage.db_path", "/var/lib/bluesignal/readings.db"))
    if not db.initialize():
        logger.error("Database initialization failed -- exiting")
        led.set_status("error")
        return

    # Initialize LoRaWAN
    lora = LoRaWAN(
        dev_eui=config.get("lorawan.dev_eui", ""),
        app_eui=config.get("lorawan.app_eui", ""),
        app_key=config.get("lorawan.app_key", ""),
        region=config.get("lorawan.region", "US915"),
        config={
            "spreading_factor": config.get("lorawan.spreading_factor", 7),
            "tx_power": config.get("lorawan.tx_power", 14),
        },
    )

    lora_available = False
    if config.get("lorawan.dev_eui"):
        if lora.initialize():
            led.set_status("init", blink=True)
            if lora.join(
                timeout=config.get("lorawan.join_timeout", 30),
                retries=config.get("lorawan.join_retries", 3),
            ):
                lora_available = True
                led.set_status("ok")
                logger.info("LoRaWAN joined successfully")
            else:
                led.set_status("warning")
                logger.warning("LoRaWAN join failed -- will buffer locally")
        else:
            led.set_status("warning")
            logger.warning("LoRa radio init failed -- will buffer locally")
    else:
        logger.warning("LoRaWAN not configured -- running in local-only mode")
        led.set_status("warning")

    # Initialize sync manager
    sync = SyncManager(db, lora, encode_sensor_reading)

    # Initialize antifouling relay
    relay = RelayController(
        on_duration=config.get("antifouling.on_duration", 30),
        off_duration=config.get("antifouling.off_duration", 270),
    )
    if config.get("antifouling.enabled", True):
        if relay.initialize():
            relay.start_duty_cycle()
        else:
            logger.warning("Relay init failed -- antifouling disabled")

    # Wait for GPS fix (non-blocking, up to timeout)
    if "gps" in sensors:
        fix_timeout = config.get("sensors.gps.fix_timeout", 120)
        logger.info("Waiting for GPS fix (timeout: %ds)...", fix_timeout)
        if sensors["gps"].wait_for_fix(timeout=fix_timeout):
            gps_data = sensors["gps"].read()
            logger.info("GPS fix acquired: %.6f, %.6f", gps_data.latitude, gps_data.longitude)
        else:
            logger.warning("GPS fix not acquired within %ds -- continuing without location", fix_timeout)

    # Main sampling loop
    interval = config.get("sampling.interval_seconds", 300)
    warmup = config.get("sampling.warmup_seconds", 5)
    device_id = config.get("device.id", "bs-wqm-unknown")

    logger.info("Starting sampling loop (interval: %ds)", interval)
    led.set_status("ok")

    cycle_count = 0

    while not _shutdown:
        cycle_start = time.time()
        cycle_count += 1

        try:
            # Sensor warmup
            if warmup > 0:
                time.sleep(warmup)

            # Read all sensors
            reading = read_all_sensors(sensors, config)

            # Build sensor dict for storage
            sensor_data = {}
            if reading["temperature"] is not None:
                sensor_data["temperature"] = reading["temperature"]
            if reading["ph"] is not None:
                sensor_data["ph"] = reading["ph"]
            if reading["turbidity"] is not None:
                sensor_data["turbidity"] = reading["turbidity"]
            if reading["tds"] is not None:
                sensor_data["tds"] = reading["tds"]

            # Metadata
            metadata = {
                "firmware": __version__,
                "cycle": cycle_count,
                "relay_on": relay.is_on() if relay else False,
            }

            # Store locally
            db.store_reading(
                device_id=device_id,
                sensors=sensor_data,
                metadata=metadata,
                gps=reading.get("gps"),
            )

            # Transmit via LoRaWAN
            if lora_available and lora.is_joined():
                led.set_status("sending")
                payload = encode_sensor_reading(reading)
                if lora.send(payload, port=1):
                    led.set_status("ok")
                    logger.debug("Uplink sent (%d bytes)", len(payload))

                    # Drain any buffered readings
                    unsynced_count = db.get_unsynced_count()
                    if unsynced_count > 1:  # >1 because current reading is also unsynced
                        sync.drain()
                else:
                    led.set_status("warning")
                    logger.warning("Uplink failed -- reading buffered locally")
            else:
                led.set_status("warning")

            # Periodic cleanup
            if cycle_count % 100 == 0:
                cleanup_days = config.get("storage.cleanup_days", 30)
                db.cleanup_old_synced(max_age_days=cleanup_days)

                stats = db.get_stats()
                logger.info(
                    "DB stats: %d total, %d unsynced, %.1f MB",
                    stats.get("total_readings", 0),
                    stats.get("unsynced", 0),
                    stats.get("db_size_mb", 0),
                )

        except Exception as e:
            logger.error("Sampling cycle error: %s", e, exc_info=True)
            led.set_status("error")
            time.sleep(5)  # Brief pause before retrying

        # Sleep until next interval
        elapsed = time.time() - cycle_start
        sleep_time = max(0, interval - elapsed)
        if sleep_time > 0 and not _shutdown:
            logger.debug("Sleeping %.0fs until next sample...", sleep_time)
            # Interruptible sleep
            sleep_end = time.time() + sleep_time
            while time.time() < sleep_end and not _shutdown:
                time.sleep(1.0)

    # Graceful shutdown
    logger.info("Shutting down...")
    led.set_status("off")
    relay.shutdown()
    if "gps" in sensors:
        sensors["gps"].shutdown()
    if "adc" in sensors:
        sensors["adc"].shutdown()
    lora.shutdown()
    db.shutdown()
    led.shutdown()

    logger.info("BlueSignal BS-WQM-100 stopped. Goodbye.")


def run_calibration(sensor_name, sensors, cal_manager):
    """Interactive calibration mode."""
    logger = logging.getLogger(__name__)

    if sensor_name == "ph":
        if "ph" not in sensors:
            logger.error("pH sensor not available for calibration")
            return

        ph_sensor = sensors["ph"]
        print("\n=== pH Sensor Calibration ===")
        print("You will need pH 7.0 and pH 4.0 buffer solutions.\n")

        input("1. Place probe in pH 7.0 buffer and press Enter...")
        time.sleep(3)
        readings = [ph_sensor.read_voltage() for _ in range(10)]
        readings = [r for r in readings if r is not None]
        if not readings:
            print("ERROR: Could not read pH sensor voltage")
            return
        ph7_voltage = sum(readings) / len(readings)
        print(f"   pH 7.0 voltage: {ph7_voltage:.4f}V")

        input("\n2. Place probe in pH 4.0 buffer and press Enter...")
        time.sleep(3)
        readings = [ph_sensor.read_voltage() for _ in range(10)]
        readings = [r for r in readings if r is not None]
        if not readings:
            print("ERROR: Could not read pH sensor voltage")
            return
        ph4_voltage = sum(readings) / len(readings)
        print(f"   pH 4.0 voltage: {ph4_voltage:.4f}V")

        cal_data = ph_sensor.calibrate(ph4_voltage, ph7_voltage)
        if cal_data:
            cal_manager.save("ph", cal_data)
            print(f"\nCalibration saved: slope={cal_data['slope']:.4f}, offset={cal_data['offset']:.4f}")
        else:
            print("\nCalibration FAILED")

    elif sensor_name == "tds":
        print("\n=== TDS Sensor Calibration ===")
        print("You will need a known TDS calibration solution.\n")
        print("TDS calibration adjusts the voltage-to-ppm conversion factor.")
        print("Place probe in calibration solution and enter the known TDS value.")

        known_tds = float(input("\nKnown TDS value (ppm): "))
        if "tds" not in sensors:
            logger.error("TDS sensor not available for calibration")
            return

        tds_sensor = sensors["tds"]
        time.sleep(3)
        voltage = tds_sensor.read_voltage()
        if voltage is None or voltage < 0.01:
            print("ERROR: Could not read TDS sensor voltage")
            return

        print(f"   Measured voltage: {voltage:.4f}V")
        factor = known_tds / voltage
        cal_data = {"factor": round(factor, 2), "offset": 0.0}
        cal_manager.save("tds", cal_data)
        print(f"\nCalibration saved: factor={factor:.2f} ppm/V")


if __name__ == "__main__":
    main()
