# WQM-1 — Water Quality Monitor

## Description

Autonomous water quality monitoring system that measures 6 environmental parameters in real-time. Designed for distributed sensor networks across aquaculture, algae monitoring, stormwater compliance, and environmental research.

**Repo:** github.com/BlueSignal-XYZ/wqm-1

## Parameters Measured

| Parameter | Sensor |
|-----------|--------|
| pH | Analog pH probe |
| Total Dissolved Solids (TDS) | TDS probe |
| Turbidity | Turbidity sensor |
| Oxidation-Reduction Potential (ORP) | ORP probe |
| Temperature | Temperature probe |
| GPS Location | u-blox GPS module |

## Hardware

- **Compute:** Raspberry Pi Zero 2W
- **ADCs:** Dual ADS1115 (16-bit, I2C) for analog sensor reads
- **Radio:** SX1262 LoRa transceiver
- **GPS:** u-blox GPS module
- **Power:** Power management components (battery + solar capable)
- **OS:** Raspberry Pi OS Lite

## Communication

- **Protocol:** LoRaWAN
- **Payload Format:** Cayenne LPP (Low Power Payload)
- **Encryption:** AES-128
- **Range:** Long-range, low-power (suitable for remote deployments)

## Tech Stack

- **Language:** Python (~85% of codebase)
- **Data Storage:** SQLite with WAL (Write-Ahead Logging) buffering
- **Scripts:** Shell scripts for setup and deployment
- **Web:** Minimal HTML/CSS for local configuration interface

## Key Development Areas

- Firmware development and optimization
- Sensor calibration and accuracy tuning
- LoRa networking and gateway integration
- Power management and battery optimization
- Data pipeline: sensor → SQLite → LoRaWAN → cloud
- Field deployment and weatherproofing

## Conventions

- Python firmware runs on Raspberry Pi OS Lite
- Use the `logging` module for debugging (not `print()`)
- SQLite WAL mode for concurrent read/write
- Cayenne LPP encoding for LoRa payloads
