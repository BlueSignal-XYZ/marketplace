# Changelog

All notable changes to the WQM-1 firmware will be documented in this file.

## [1.0.0] — 2026-02-21

### Added
- Six sensor channels: pH, TDS, turbidity, ORP, temperature (DS18B20), GPS (MAX-M10S)
- Dual ADS1115 ADC support (U1 at 0x48, U2 at 0x49) via smbus2
- LoRaWAN Class A uplink via SX1262 (OTAA join, Cayenne LPP encoding)
- SQLite WAL-mode local storage with store-and-forward sync
- Threshold-based relay automation rules with cooldown
- Single-LED status patterns (boot, sampling, transmitting, error, no_link)
- GPS geo-tagging with PPS support
- Nernst temperature compensation for pH readings
- Interactive pH and TDS calibration scripts
- systemd service with watchdog, security hardening, and auto-restart
- Health check service with periodic diagnostics
- First-boot provisioning script (setup.sh)
- Flashable image build pipeline (image/build.sh)
- Structured JSON logging with rotation
- Factory reset script

### Hardware
- Raspberry Pi Zero 2W (BCM2710A1, 512 MB)
- BlueSignal WQM-1 HAT (65 x 56.5 mm)
- SX1262 LoRa radio on SPI0
- DS18B20 on GPIO 4 (1-Wire)
- MAX-M10S GPS on UART (GPIO 14/15)
- Relay on GPIO 23
- Status LED on GPIO 25
