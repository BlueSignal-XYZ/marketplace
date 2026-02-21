# BlueSignal WQM-1 Firmware

Python firmware for the BlueSignal WQM-1 water quality monitoring device.
Runs on Raspberry Pi Zero 2W with the WQM-1 HAT (65 x 56.5 mm).

## Hardware

| Component      | Part              | Interface          |
|----------------|-------------------|--------------------|
| Compute        | Raspberry Pi Zero 2W (BCM2710A1, 512 MB) | — |
| ADC U1         | ADS1115           | I2C 0x48           |
| ADC U2         | ADS1115           | I2C 0x49           |
| pH Probe       | BNC + OPA340      | ADC U1 AIN0        |
| TDS Probe      | JST-XH, AC excitation | ADC U1 AIN1     |
| Turbidity      | IR 850nm + OPA380 | ADC U1 AIN2        |
| ORP Probe      | BNC + OPA340      | ADC U2 AIN0        |
| Temperature    | DS18B20           | GPIO 4 (1-Wire)    |
| GPS            | MAX-M10S          | UART GPIO 14/15    |
| LoRa Radio     | SX1262            | SPI0 (GPIO 8/9/10/11) |
| Relay          | N-MOSFET driver   | GPIO 23            |
| Status LED     | Single LED        | GPIO 25            |

## Quick Start (Flashable Image)

1. Download `bluesignal-wqm1-v1.0.0.img.gz` from [Releases](https://github.com/NeptuneChain-Inc/NPC-Frontend/releases)
2. Flash to a 16 GB+ microSD card:
   ```bash
   gunzip -c bluesignal-wqm1-v1.0.0.img.gz | sudo dd of=/dev/sdX bs=4M status=progress
   ```
   Or use **Raspberry Pi Imager** → Custom Image.
3. Insert microSD into Pi Zero 2W, attach WQM-1 HAT, connect 9–24 V DC power.
4. SSH in: `ssh pi@wqm-XXXX.local` (default password: `raspberry`)
5. Edit config:
   ```bash
   sudo nano /etc/bluesignal/config.yaml
   ```
6. Set your LoRaWAN keys (from the [TTN console](https://console.cloud.thethings.network/)):
   - `dev_eui`
   - `app_eui`
   - `app_key`
7. Reboot: `sudo reboot`

The `bluesignal-wqm` service starts automatically on boot.

## Manual Installation

On an existing Raspberry Pi OS Lite (Bookworm) installation:

```bash
git clone https://github.com/NeptuneChain-Inc/NPC-Frontend.git
cd NPC-Frontend/firmware
sudo bash setup.sh
sudo reboot
```

After reboot:
```bash
sudo systemctl start bluesignal-wqm
sudo journalctl -u bluesignal-wqm -f
```

## Configuration

The configuration file lives at `/etc/bluesignal/config.yaml`. A template
with all options documented is at `config/config.yaml.example`.

Key sections:

| Section    | Description                              |
|------------|------------------------------------------|
| `device`   | Device ID, name, firmware version        |
| `sampling` | Read interval, averaging, warmup delay   |
| `sensors`  | Enable/disable each channel, ADC config  |
| `lorawan`  | TTN credentials, frequency plan, TX power|
| `relay`    | GPIO pin, default state, automation rules|
| `led`      | GPIO pin, blink patterns                 |
| `storage`  | Database path, retention, sync batch size|
| `logging`  | Level, file path, rotation settings      |

## Calibration

### pH Sensor

Two-point calibration with pH 4.01 and pH 6.86 buffer solutions:

```bash
cd /opt/bluesignal/firmware
sudo venv/bin/python scripts/calibrate_ph.py
```

Follow the prompts. Calibration data is saved to `/etc/bluesignal/calibration.yaml`.

### TDS Sensor

Single-point calibration with a known TDS solution:

```bash
sudo venv/bin/python scripts/calibrate_tds.py
```

## Testing

Run individual sensor tests without starting the full loop:

```bash
cd /opt/bluesignal/firmware

# Read all sensors once, print JSON
sudo venv/bin/python scripts/test_sensors.py

# Test LoRaWAN join + uplink
sudo venv/bin/python scripts/test_lora.py

# Toggle relay 3x
sudo venv/bin/python scripts/test_relay.py

# Stream GPS data for 30 seconds
sudo venv/bin/python scripts/test_gps.py
```

## LED Status Codes

| Pattern          | Meaning                        |
|------------------|--------------------------------|
| Solid ON         | Booting / initializing         |
| Slow blink (1 Hz)| Normal sampling operation      |
| Fast blink (5 Hz)| Transmitting via LoRa          |
| SOS pattern      | Error (check logs)             |
| Double blink     | No LoRaWAN link (data buffered)|
| OFF              | Stopped / powered down         |

## Data Pipeline

```
Sensors → ADS1115/DS18B20/UART
  → Python reads + calibrates
  → SQLite WAL (/var/lib/bluesignal/readings.db)
  → Cayenne LPP encode
  → LoRaWAN uplink (SX1262 → TTN v3)
  → TTN webhook → Firebase Cloud Function
  → Firebase RTDB → BlueSignal Cloud dashboard
```

If LoRaWAN is unavailable, readings buffer locally in SQLite. When the
link restores, buffered readings drain automatically (store-and-forward).

## Relay Automation

The relay on GPIO 23 can be triggered automatically by sensor thresholds.
Configure rules in `config.yaml`:

```yaml
relay:
  enabled: true
  gpio_pin: 23
  rules:
    - name: "High pH Alert"
      sensor: "ph"
      condition: ">"
      threshold: 8.5
      action: "on"
      duration_seconds: 300
      cooldown_seconds: 600
```

Supported conditions: `>`, `<`, `>=`, `<=`, `==`

## Troubleshooting

### Service won't start
```bash
sudo journalctl -u bluesignal-wqm -n 50 --no-pager
```

### No I2C devices found
```bash
sudo i2cdetect -y 1
# Should show 0x48 and 0x49
```
If missing, verify `/boot/firmware/config.txt` contains `dtparam=i2c_arm=on`.

### DS18B20 not detected
```bash
ls /sys/bus/w1/devices/28-*
```
If missing, verify `dtoverlay=w1-gpio,gpiopin=4` in config.txt and check the 4.7 kΩ pull-up resistor.

### GPS no fix
- Ensure antenna has clear sky view (won't work indoors)
- Check UART: `cat /dev/serial0` should show NMEA sentences
- Verify Bluetooth is disabled: `dtoverlay=disable-bt` in config.txt

### Factory reset
```bash
sudo venv/bin/python scripts/factory_reset.py
```

## Directory Structure

```
firmware/
├── README.md
├── CHANGELOG.md
├── VERSION
├── requirements.txt
├── setup.sh
├── config/
│   ├── config.yaml.example
│   └── calibration.yaml
├── src/
│   ├── main.py
│   ├── sensors/          (ads1115, ph, tds, turbidity, orp, temperature, gps)
│   ├── radio/            (sx1262, lorawan, cayenne)
│   ├── storage/          (database, sync)
│   ├── control/          (relay, led, rules)
│   ├── calibration/      (calibrate)
│   └── utils/            (logger, health)
├── systemd/              (service + health timer)
├── scripts/              (test + calibration scripts)
└── image/                (flashable image builder)
```

## Building a Flashable Image

Requires root and a Linux host with `losetup`, `wget`, `xz`:

```bash
cd firmware
sudo bash image/build.sh
```

Produces `bluesignal-wqm1-vX.Y.Z.img.gz` with SHA256 checksum.

## License

Proprietary — BlueSignal Inc.
