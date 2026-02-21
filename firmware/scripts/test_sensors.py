#!/usr/bin/env python3
"""Read all sensor channels once and print results as JSON.

Usage:
    python3 -m scripts.test_sensors
    python3 scripts/test_sensors.py
"""

import json
import sys
import os
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.sensors.ads1115 import ADS1115
from src.sensors.ph import PHSensor
from src.sensors.tds import TDSSensor
from src.sensors.turbidity import TurbiditySensor
from src.sensors.orp import ORPSensor
from src.sensors.temperature import TemperatureSensor
from src.sensors.gps import GPSSensor


def main():
    print("=" * 60)
    print("BlueSignal WQM-1 — Sensor Test")
    print("=" * 60)

    results = {"timestamp": time.time(), "sensors": {}, "errors": []}

    # ADC U1 (0x48): pH, TDS, Turbidity
    print("\n[ADC U1] Scanning I2C 0x48...")
    adc1 = ADS1115(address=0x48)
    if adc1.scan():
        print("  ✓ ADS1115 U1 found at 0x48")
    else:
        print("  ✗ ADS1115 U1 NOT found at 0x48")
        results["errors"].append("ADC U1 (0x48) not responding")

    # ADC U2 (0x49): ORP
    print("[ADC U2] Scanning I2C 0x49...")
    adc2 = ADS1115(address=0x49)
    if adc2.scan():
        print("  ✓ ADS1115 U2 found at 0x49")
    else:
        print("  ✗ ADS1115 U2 NOT found at 0x49")
        results["errors"].append("ADC U2 (0x49) not responding")

    # Temperature (read first for compensation)
    print("\n[DS18B20] Reading temperature...")
    temp_sensor = TemperatureSensor({})
    temp_c = temp_sensor.read()
    if temp_c is not None:
        print(f"  ✓ Temperature: {temp_c:.2f} °C")
        results["sensors"]["temperature_c"] = temp_c
    else:
        print("  ✗ DS18B20 not found or read failed")
        results["errors"].append("DS18B20 temperature sensor not found")

    # pH
    print("\n[pH] Reading pH sensor (ADC U1, AIN0)...")
    try:
        ph_cfg = {"adc_channel": 0, "gain": 1, "averaging_samples": 5}
        ph = PHSensor(adc1, ph_cfg)
        voltage = ph.read_voltage()
        ph_val = ph.read(temperature_c=temp_c)
        print(f"  Voltage: {voltage:.4f} V")
        print(f"  ✓ pH: {ph_val:.2f}")
        results["sensors"]["ph"] = ph_val
        results["sensors"]["ph_voltage"] = round(voltage, 4)
    except Exception as e:
        print(f"  ✗ pH read error: {e}")
        results["errors"].append(f"pH: {e}")

    # TDS
    print("\n[TDS] Reading TDS sensor (ADC U1, AIN1)...")
    try:
        tds_cfg = {"adc_channel": 1, "gain": 1, "averaging_samples": 5}
        tds = TDSSensor(adc1, tds_cfg)
        voltage = tds.read_voltage()
        tds_val = tds.read(temperature_c=temp_c)
        print(f"  Voltage: {voltage:.4f} V")
        print(f"  ✓ TDS: {tds_val:.1f} ppm")
        results["sensors"]["tds_ppm"] = tds_val
        results["sensors"]["tds_voltage"] = round(voltage, 4)
    except Exception as e:
        print(f"  ✗ TDS read error: {e}")
        results["errors"].append(f"TDS: {e}")

    # Turbidity
    print("\n[Turbidity] Reading turbidity sensor (ADC U1, AIN2)...")
    try:
        turb_cfg = {"adc_channel": 2, "gain": 1, "averaging_samples": 5}
        turb = TurbiditySensor(adc1, turb_cfg)
        turb_val = turb.read()
        print(f"  ✓ Turbidity: {turb_val:.1f} NTU")
        results["sensors"]["turbidity_ntu"] = turb_val
    except Exception as e:
        print(f"  ✗ Turbidity read error: {e}")
        results["errors"].append(f"Turbidity: {e}")

    # ORP
    print("\n[ORP] Reading ORP sensor (ADC U2, AIN0)...")
    try:
        orp_cfg = {"adc_channel": 0, "gain": 1, "offset_voltage": 1.65, "averaging_samples": 5}
        orp = ORPSensor(adc2, orp_cfg)
        orp_val = orp.read()
        print(f"  ✓ ORP: {orp_val:.1f} mV")
        results["sensors"]["orp_mv"] = orp_val
    except Exception as e:
        print(f"  ✗ ORP read error: {e}")
        results["errors"].append(f"ORP: {e}")

    # GPS
    print("\n[GPS] Reading GPS (UART, 10s timeout)...")
    try:
        gps_cfg = {"uart_port": "/dev/serial0", "baud_rate": 9600}
        gps = GPSSensor(gps_cfg)
        if gps.start():
            start = time.time()
            gps_data = None
            while time.time() - start < 10:
                gps_data = gps.read()
                if gps_data:
                    break
                time.sleep(1)

            if gps_data:
                print(f"  ✓ Latitude:   {gps_data['latitude']:.6f}")
                print(f"  ✓ Longitude:  {gps_data['longitude']:.6f}")
                print(f"  ✓ Altitude:   {gps_data.get('altitude', 'N/A')} m")
                print(f"  ✓ Satellites: {gps_data.get('satellites', 'N/A')}")
                results["sensors"]["gps"] = gps_data
            else:
                print("  ⚠ No GPS fix within 10s (expected outdoors)")
                results["errors"].append("GPS: no fix within 10s")
            gps.close()
        else:
            print("  ✗ GPS serial port failed to open")
            results["errors"].append("GPS: serial port failed")
    except Exception as e:
        print(f"  ✗ GPS error: {e}")
        results["errors"].append(f"GPS: {e}")

    # Summary
    print("\n" + "=" * 60)
    print("RESULTS")
    print("=" * 60)
    print(json.dumps(results, indent=2))

    if results["errors"]:
        print(f"\n⚠ {len(results['errors'])} error(s) detected")
        sys.exit(1)
    else:
        print("\n✓ All sensors operational")

    adc1.close()
    adc2.close()


if __name__ == "__main__":
    main()
