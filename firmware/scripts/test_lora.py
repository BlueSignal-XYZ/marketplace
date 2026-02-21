#!/usr/bin/env python3
"""Join TTN and send a test uplink.

Usage:
    python3 scripts/test_lora.py
"""

import sys
import os
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import yaml
from src.radio.lorawan import LoRaWAN
from src.radio.cayenne import CayenneLPP


def main():
    print("=" * 60)
    print("BlueSignal WQM-1 — LoRa Test")
    print("=" * 60)

    config_paths = [
        "/etc/bluesignal/config.yaml",
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                     "config", "config.yaml"),
    ]

    lora_cfg = None
    for p in config_paths:
        if os.path.exists(p):
            with open(p) as f:
                cfg = yaml.safe_load(f)
            lora_cfg = cfg.get("lorawan", {})
            print(f"Config loaded from {p}")
            break

    if not lora_cfg or not lora_cfg.get("dev_eui"):
        print("\n✗ LoRaWAN not configured.")
        print("  Set dev_eui, app_eui, and app_key in config.yaml")
        sys.exit(1)

    print(f"\nDevEUI:  {lora_cfg['dev_eui']}")
    print(f"AppEUI:  {lora_cfg['app_eui']}")
    print(f"Region:  {lora_cfg.get('frequency_plan', 'US915')}")

    print("\n[1/3] Initializing SX1262...")
    lora = LoRaWAN(lora_cfg)

    print("[2/3] Joining TTN (OTAA)...")
    if lora.join(retries=3, backoff=5.0):
        print("  ✓ Joined successfully!")
    else:
        print("  ✗ Join failed after 3 attempts")
        lora.close()
        sys.exit(1)

    print("[3/3] Sending test uplink...")
    test_reading = {
        "temperature_c": 22.5,
        "ph": 7.0,
        "tds_ppm": 150.0,
        "turbidity_ntu": 5.0,
        "orp_mv": 200.0,
    }
    payload = CayenneLPP.encode(test_reading)
    print(f"  Payload: {payload.hex()} ({len(payload)} bytes)")

    if lora.send(payload, port=1):
        print("  ✓ Uplink sent!")
        print("  Check TTN console for the message")
    else:
        print("  ✗ Uplink failed")

    lora.close()
    print("\nDone.")


if __name__ == "__main__":
    main()
