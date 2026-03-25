# Gateway Firmware Repository — Claude Code Prompt

> **Usage:** Copy this file into the root of the WQM-1 gateway firmware repository as `CLAUDE.md` so that Claude Code understands the firmware project and its relationship to the BlueSignal platform.

---

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains the embedded firmware for the **BlueSignal WQM-1 Water Quality Monitor** — a Raspberry Pi Zero 2W-based sensor gateway that measures water quality parameters and transmits data to the BlueSignal Cloud platform.

The firmware runs on-device (Raspberry Pi OS Lite, arm64 Bookworm) and is completely independent from the web platform (marketplace repo). The two repos are connected only through the API contract defined below.

## Tech Stack

- **Language**: Python 3.11+
- **Hardware**: Raspberry Pi Zero 2W with custom WQM-1 sensor HAT
- **Sensors**: ADS1115 ADCs (I2C), DS18B20 (1-Wire), MAX-M10S GPS (UART)
- **Radio**: Semtech SX1262 LoRa transceiver (SPI) with LoRaWAN 1.0.3 Class A
- **Protocol**: Cayenne LPP encoding over LoRaWAN (US915/EU868/AU915)
- **Storage**: SQLite (WAL mode) for local buffering / store-and-forward
- **Services**: systemd (bluesignal-wqm, bluesignal-ble, bluesignal-led, bluesignal-health)
- **Commissioning**: BLE GATT server (bless library) for mobile app pairing

## Directory Structure

```
firmware/
├── src/
│   ├── main.py              # Main sensor acquisition loop
│   ├── sensors/             # Sensor drivers
│   │   ├── ads1115.py       # 16-bit ADC (I2C 0x48, 0x49)
│   │   ├── ph.py            # pH probe (Nernst compensation)
│   │   ├── tds.py           # Total Dissolved Solids
│   │   ├── turbidity.py     # IR turbidity (850nm)
│   │   ├── orp.py           # Oxidation-Reduction Potential
│   │   ├── temperature.py   # DS18B20 1-Wire
│   │   └── gps.py           # MAX-M10S GNSS (UART/NMEA)
│   ├── radio/
│   │   ├── lorawan.py       # LoRaWAN 1.0.3 Class A (OTAA)
│   │   ├── sx1262.py        # SX1262 SPI driver
│   │   └── cayenne.py       # Cayenne LPP encoder/decoder
│   ├── storage/
│   │   ├── database.py      # SQLite WAL local buffer
│   │   └── sync.py          # Store-and-forward sync manager
│   ├── control/
│   │   ├── relay.py         # GPIO 23 relay (10A, auto-shutoff)
│   │   ├── led.py           # GPIO 25 status LED (8 priority states)
│   │   └── rules.py         # Threshold-based automation
│   ├── calibration/
│   │   └── calibrate.py     # Sensor calibration manager
│   └── utils/
│       ├── identity.py      # Device ID generation from Pi serial
│       ├── config.py        # YAML config loader, atomic JSON I/O
│       ├── time_sync.py     # GPS-based time synchronization
│       ├── health.py        # Health diagnostics
│       ├── logger.py        # Structured logging with rotation
│       └── watchdog.py      # BCM2835 hardware watchdog
├── config/
│   ├── config.yaml.example  # Configuration template
│   ├── calibration.yaml     # Sensor calibration values
│   ├── boot-config.txt      # /boot/firmware/config.txt overlay
│   ├── journald-bluesignal.conf
│   ├── logrotate-bluesignal
│   └── modules-load.conf
├── systemd/                 # Service definitions
│   ├── bluesignal-wqm.service
│   ├── bluesignal-ble.service
│   ├── bluesignal-led.service
│   ├── bluesignal-health.service
│   └── bluesignal-health.timer
├── scripts/                 # Testing & calibration
│   ├── calibrate_ph.py      # 2-point pH calibration
│   ├── calibrate_tds.py     # Single-point TDS calibration
│   ├── factory_reset.py     # Full reset to defaults
│   ├── test_sensors.py      # Read all sensors once
│   ├── test_lora.py         # LoRaWAN join + uplink test
│   ├── test_relay.py        # Relay toggle test
│   ├── test_gps.py          # GPS stream test
│   └── build_image.sh       # Flashable SD image builder
├── image/                   # SD card image pipeline
│   ├── build.sh             # Image builder (Pi OS Lite base)
│   ├── firstboot.sh         # First-boot provisioning
│   └── wpa_supplicant.conf.tmpl
├── requirements.txt         # Python dependencies
├── setup.sh                 # First-boot setup script
├── VERSION                  # Current firmware version (SemVer)
├── CHANGELOG.md
└── README.md
```

## Development Commands

```bash
# Run firmware locally (on Pi or with mocked hardware)
python -m src.main

# Run individual sensor tests
python scripts/test_sensors.py
python scripts/test_lora.py
python scripts/test_gps.py
python scripts/test_relay.py

# Run pH calibration (interactive, requires buffer solutions)
python scripts/calibrate_ph.py

# Run TDS calibration
python scripts/calibrate_tds.py

# Factory reset (clears config, calibration, local DB)
python scripts/factory_reset.py

# Build flashable SD card image
bash scripts/build_image.sh

# Install dependencies (on Pi)
pip install -r requirements.txt
```

## Hardware Pin Assignments

| GPIO | Function | Interface |
|------|----------|-----------|
| 2, 3 | ADS1115 ADCs | I2C (SDA/SCL) |
| 4 | DS18B20 temperature | 1-Wire |
| 8, 9, 10, 11 | SX1262 LoRa | SPI0 (CE0, MISO, MOSI, SCLK) |
| 14, 15 | MAX-M10S GPS | UART (TX/RX) |
| 17 | SX1262 DIO1 | GPIO interrupt |
| 22 | SX1262 BUSY | GPIO input |
| 23 | Relay output | GPIO output (10A) |
| 24 | PPS (time sync) | GPIO input |
| 25 | Status LED | GPIO output (PWM) |
| 27 | SX1262 RESET | GPIO output |

## Platform Integration Contract

**CRITICAL:** This firmware communicates with the BlueSignal Cloud platform (separate repo: `bluesignal-xyz/marketplace`). Changes to the interfaces below require coordinated updates in both repos.

### Device Identity

| Field | Format | Source |
|-------|--------|--------|
| Device ID | `BS-WQM1-{12 hex chars}` | Pi serial from `/proc/cpuinfo` |
| DevEUI | `0018B200{8 hex chars}` | OUI-based |
| AppEUI | `70B3D57ED0000001` | Hardcoded TTN allocation |
| BLE Name | `BlueSignal-{4 hex chars}` | For commissioning discovery |

### Sensor Reading Payload (Cayenne LPP)

The firmware encodes sensor data using Cayenne LPP. The platform decodes these channels — changing channel assignments is a breaking change.

| Channel | Sensor | Unit | Cayenne Type |
|---------|--------|------|-------------|
| 1 | Temperature | Celsius | Temperature |
| 2 | pH | pH units (0-14) | Analog Input |
| 3 | TDS | ppm | Analog Input |
| 4 | Turbidity | NTU | Analog Input |
| 5 | ORP | mV | Analog Input |
| 6 | GPS | lat/lng/alt | GPS |

Platform decoder: `functions/readings.js` — `CAYENNE_TO_CANONICAL` mapping.

### Health Telemetry

The firmware reports health data that the platform reads during commissioning tests:

```json
{
  "batteryLevel": 85,
  "signalStrength": -67,
  "lastSeen": 1711324800000,
  "firmwareVersion": "1.0.0"
}
```

Platform path: `devices/{deviceId}/health` in Firebase Realtime Database.

### Commissioning Test Thresholds

The platform runs these tests during commissioning step 5 (`connectivity_test`). The firmware must meet these thresholds for commissioning to succeed:

| Test | What the Platform Checks | Pass Threshold |
|------|-------------------------|----------------|
| Power | `health.batteryLevel` | >= 10% |
| Connectivity | `health.signalStrength` | >= -100 dBm |
| Sensors | Time since `health.lastSeen` | <= 30 minutes |
| Cloud ingestion | Readings in `readings/{deviceId}` | At least 1 entry |

### Commissioning Workflow

The platform implements a 7-step commissioning flow. Steps where the firmware has a role:

1. **device_scan** — Firmware exposes device serial via BLE for QR/NFC scanning
3. **location_capture** — Firmware provides GPS coordinates through sensor readings
5. **connectivity_test** — Firmware must be online, reporting health telemetry and pushing readings
6. **sensor_calibration** — Firmware accepts calibration offsets from the platform and applies them

### Breaking Changes Checklist

Before making changes to any of the following, coordinate with the platform repo:

- [ ] Cayenne LPP channel assignments (`src/radio/cayenne.py`)
- [ ] Health telemetry payload format (`src/utils/health.py`)
- [ ] Device identity format (`src/utils/identity.py`)
- [ ] BLE commissioning service characteristics
- [ ] Calibration data structure (`src/calibration/calibrate.py`)
- [ ] Reading frequency or buffering behavior that affects commissioning test timing

### Version Bump Protocol

1. Update `VERSION` file with new SemVer
2. Update `CHANGELOG.md`
3. If breaking changes: coordinate with platform repo to update minimum supported version
4. Tag release: `git tag -a v{VERSION} -m "Release v{VERSION}"`
5. Build new SD card image: `bash scripts/build_image.sh`

## Important Patterns

### Sensor Reading Loop

`src/main.py` runs a continuous loop:
1. Read all sensors (pH, TDS, turbidity, ORP, temperature, GPS)
2. Apply calibration offsets
3. Encode to Cayenne LPP
4. Buffer in SQLite
5. Transmit via LoRaWAN (respecting TTN Fair Use: 30s/day airtime)
6. Pet hardware watchdog

### Store-and-Forward

`src/storage/` handles offline resilience:
- Readings buffered in SQLite WAL mode
- Max 10,000 buffered readings before flush
- 30-day retention policy
- Sync manager retries failed transmissions

### LED Status Codes

`src/control/led.py` priority states (highest first):
1. FAULT — SOS pattern
2. UPDATING — fast blink
3. COMMISSIONING — double blink
4. NO_SIGNAL — slow blink
5. SAMPLING — breathing (PWM sine wave)
6. IDLE — solid on
7. STANDBY — dim solid
8. OFF — off

## Known Issues

From the firmware audit:
- LoRaWAN session keys are never derived (encryption placeholder only)
- RX1/RX2 windows not opened after uplinks (downlink reception broken)
- No relay command parser for LoRa downlinks
- TDS overflow at 327 ppm, Turbidity overflow at 327 NTU (Cayenne LPP encoding limits)

## Python Dependencies

```
smbus2==0.4.3         # I2C (ADS1115)
spidev==3.6           # SPI (SX1262)
RPi.GPIO==0.7.1       # GPIO (relay, LED, radio)
pyyaml==6.0.1         # Config files
pynmea2==1.19.0       # NMEA parsing (GPS)
pyserial==3.5         # UART (GPS)
bless==0.2.5          # BLE GATT (commissioning)
pycryptodome==3.20.0  # AES-128 (LoRaWAN)
```
