#!/usr/bin/env python3
"""Interactive TDS calibration using a known reference solution.

Usage:
    sudo python3 scripts/calibrate_tds.py
"""

import sys
import os
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.sensors.ads1115 import ADS1115
from src.sensors.tds import TDSSensor
from src.calibration.calibrate import CalibrationManager

CAL_PATH = "/etc/bluesignal/calibration.yaml"


def main():
    print("=" * 60)
    print("BlueSignal WQM-1 — TDS Sensor Calibration")
    print("=" * 60)
    print()
    print("Requirements:")
    print("  • TDS calibration solution with known ppm value")
    print("    (common: 342 ppm, 500 ppm, or 1000 ppm)")
    print()

    adc = ADS1115(address=0x48)
    if not adc.scan():
        print("✗ ADS1115 not found at 0x48")
        sys.exit(1)

    tds_cfg = {"adc_channel": 1, "gain": 1, "averaging_samples": 1}
    tds_sensor = TDSSensor(adc, tds_cfg)

    known_ppm = float(input("Enter known TDS value (ppm): "))

    input(f"\nPlace probe in {known_ppm:.0f} ppm solution, then press Enter...")

    print("  Taking 10 readings...")
    time.sleep(2)
    readings = []
    for i in range(10):
        v = tds_sensor.read_voltage()
        readings.append(v)
        print(f"    [{i+1}/10] {v:.4f} V")
        time.sleep(0.5)

    avg_voltage = sum(readings) / len(readings)
    print(f"  Average voltage: {avg_voltage:.4f} V")

    if avg_voltage < 0.01:
        print("\n✗ Voltage too low — check probe connection")
        sys.exit(1)

    factor = known_ppm / avg_voltage
    cal_data = {
        "factor": round(factor, 2),
        "offset": 0.0,
        "reference_solution_ppm": known_ppm,
    }

    cal_mgr = CalibrationManager(CAL_PATH)
    cal_mgr.load()
    cal_mgr.save("tds", cal_data)

    print(f"\n✓ Calibration saved to {CAL_PATH}")
    print(f"  factor = {factor:.2f} ppm/V")

    tds_sensor.factor = factor
    tds_sensor.offset = 0.0
    verify = tds_sensor.read()
    print(f"  Verification reading: {verify:.1f} ppm (expected ~{known_ppm:.0f})")

    adc.close()


if __name__ == "__main__":
    main()
