#!/usr/bin/env python3
"""Factory reset: wipe config, calibration, and readings.

Usage:
    sudo python3 scripts/factory_reset.py
"""

import os
import sys
import shutil


FILES_TO_DELETE = [
    "/etc/bluesignal/config.yaml",
    "/etc/bluesignal/calibration.yaml",
    "/var/lib/bluesignal/readings.db",
    "/var/lib/bluesignal/readings.db-wal",
    "/var/lib/bluesignal/readings.db-shm",
    "/var/lib/bluesignal/calibration.json",
]

LOG_DIR = "/var/log/bluesignal"


def main():
    print("=" * 60)
    print("BlueSignal WQM-1 — Factory Reset")
    print("=" * 60)
    print()
    print("This will DELETE:")
    print("  • Device configuration (/etc/bluesignal/config.yaml)")
    print("  • Sensor calibration data")
    print("  • All stored sensor readings")
    print("  • Log files")
    print()

    confirm = input("Type 'RESET' to confirm: ")
    if confirm != "RESET":
        print("Aborted.")
        sys.exit(0)

    print()
    for path in FILES_TO_DELETE:
        if os.path.exists(path):
            os.remove(path)
            print(f"  Deleted: {path}")
        else:
            print(f"  Skip (not found): {path}")

    if os.path.isdir(LOG_DIR):
        for f in os.listdir(LOG_DIR):
            fp = os.path.join(LOG_DIR, f)
            if os.path.isfile(fp):
                os.remove(fp)
                print(f"  Deleted: {fp}")

    print()
    print("✓ Factory reset complete")
    print("  Run setup.sh to reconfigure this device")


if __name__ == "__main__":
    main()
