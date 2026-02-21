#!/usr/bin/env python3
"""Stream GPS fix data for 30 seconds.

Usage:
    python3 scripts/test_gps.py
"""

import sys
import os
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.sensors.gps import GPSSensor


def main():
    print("=" * 60)
    print("BlueSignal WQM-1 — GPS Test (30 seconds)")
    print("=" * 60)

    gps = GPSSensor({"uart_port": "/dev/serial0", "baud_rate": 9600})

    if not gps.start():
        print("\n✗ Failed to open GPS serial port")
        sys.exit(1)

    print("\nWaiting for fix (place antenna with clear sky view)...\n")

    start = time.time()
    duration = 30
    last_print = 0

    while time.time() - start < duration:
        now = time.time()
        if now - last_print < 2:
            time.sleep(0.5)
            continue

        data = gps.read()
        elapsed = int(now - start)

        if data:
            print(f"[{elapsed:2d}s] FIX  lat={data['latitude']:.6f}  "
                  f"lon={data['longitude']:.6f}  "
                  f"alt={data.get('altitude', 'N/A')}m  "
                  f"sats={data.get('satellites', '?')}  "
                  f"hdop={data.get('hdop', '?')}")
        else:
            print(f"[{elapsed:2d}s] No fix yet...")

        last_print = now

    gps.close()
    print("\n✓ GPS test complete")


if __name__ == "__main__":
    main()
