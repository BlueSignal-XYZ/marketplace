#!/usr/bin/env python3
"""Interactive pH 2-point calibration.

Walks through calibration with pH 4.01 and pH 6.86 buffer solutions.
Saves results to /etc/bluesignal/calibration.yaml.

Usage:
    sudo python3 scripts/calibrate_ph.py
"""

import sys
import os
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.sensors.ads1115 import ADS1115
from src.sensors.ph import PHSensor
from src.calibration.calibrate import CalibrationManager

CAL_PATH = "/etc/bluesignal/calibration.yaml"


def average_voltage(ph_sensor, n=10, delay=0.5):
    """Take N voltage readings and return the average."""
    print(f"  Taking {n} readings...")
    time.sleep(2)  # Settle time
    readings = []
    for i in range(n):
        v = ph_sensor.read_voltage()
        readings.append(v)
        print(f"    [{i+1}/{n}] {v:.4f} V")
        time.sleep(delay)
    avg = sum(readings) / len(readings)
    print(f"  Average: {avg:.4f} V")
    return avg


def main():
    print("=" * 60)
    print("BlueSignal WQM-1 — pH Sensor Calibration")
    print("=" * 60)
    print()
    print("Requirements:")
    print("  • pH 4.01 buffer solution")
    print("  • pH 6.86 (or 7.00) buffer solution")
    print("  • Distilled water for rinsing between buffers")
    print()

    adc = ADS1115(address=0x48)
    if not adc.scan():
        print("✗ ADS1115 not found at 0x48")
        sys.exit(1)

    ph_cfg = {"adc_channel": 0, "gain": 1, "averaging_samples": 1}
    ph_sensor = PHSensor(adc, ph_cfg)

    input("Step 1: Place probe in pH 4.01 buffer, then press Enter...")
    v_low = average_voltage(ph_sensor)

    input("\nStep 2: Rinse probe, place in pH 6.86 buffer, then press Enter...")
    v_high = average_voltage(ph_sensor)

    print(f"\nCalibration points:")
    print(f"  pH 4.01 → {v_low:.4f} V")
    print(f"  pH 6.86 → {v_high:.4f} V")

    cal_data = ph_sensor.calibrate(v_low, v_high, ph_low=4.01, ph_high=6.86)
    if cal_data is None:
        print("\n✗ Calibration failed (voltages too close)")
        sys.exit(1)

    cal_mgr = CalibrationManager(CAL_PATH)
    cal_mgr.load()
    cal_mgr.save("ph", cal_data)

    print(f"\n✓ Calibration saved to {CAL_PATH}")
    print(f"  slope = {ph_sensor.slope:.4f}")
    print(f"  intercept = {ph_sensor.intercept:.4f}")

    input("\nStep 3: Place probe in pH 6.86 buffer to verify. Press Enter...")
    ph_val = ph_sensor.read()
    print(f"  Verification reading: pH {ph_val:.2f} (expected ~6.86)")

    adc.close()


if __name__ == "__main__":
    main()
