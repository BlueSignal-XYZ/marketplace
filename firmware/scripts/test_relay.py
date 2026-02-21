#!/usr/bin/env python3
"""Toggle relay on/off 3 times with 1-second intervals.

Usage:
    python3 scripts/test_relay.py
"""

import sys
import os
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.control.relay import RelayController


def main():
    print("=" * 60)
    print("BlueSignal WQM-1 — Relay Test (GPIO 23)")
    print("=" * 60)

    relay = RelayController({"gpio_pin": 23, "default_state": "off"})

    for i in range(1, 4):
        print(f"\n[{i}/3] Relay ON...")
        relay.on()
        time.sleep(1.0)

        print(f"[{i}/3] Relay OFF...")
        relay.off()
        time.sleep(1.0)

    relay.cleanup()
    print("\n✓ Relay test complete")


if __name__ == "__main__":
    main()
