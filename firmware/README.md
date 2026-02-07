# BlueSignal BS-WQM-100 Firmware

Python firmware for the BlueSignal water quality monitoring device based on the Raspberry Pi Zero 2 W carrier board HAT.

## Hardware

- **MCU**: Raspberry Pi Zero 2 W (ARM Cortex-A53, 512MB RAM)
- **ADC**: ADS1115 16-bit, 4-channel (I2C, 0x48)
- **Sensors**: pH (BNC/OPA340), TDS/conductivity, turbidity, DS18B20 temperature
- **GPS**: NEO-6M (UART)
- **Radio**: SX1262 LoRa module (SPI, 915MHz US)
- **Antifouling**: 60W 28KHz ultrasonic transducer via optocoupler-isolated relay
- **Enclosure**: IP67, PG7 cable glands

## Pin Mapping

| Function | Interface | GPIO |
|----------|-----------|------|
| ADS1115 ADC | I2C1 | SDA=GPIO2, SCL=GPIO3 |
| SX1262 LoRa | SPI0 | MOSI=10, MISO=9, SCLK=11, CS=8 |
| SX1262 Control | GPIO | BUSY=22, DIO1=25, RST=23 |
| NEO-6M GPS | UART0 | TX=14, RX=15 |
| DS18B20 Temp | 1-Wire | GPIO4 |
| Relay (Antifouling) | GPIO | GPIO17 |
| LED Red | GPIO | GPIO24 |
| LED Green | GPIO | GPIO27 |
| LED Blue | GPIO | GPIO18 |

## Setup

### 1. Enable Interfaces

```bash
sudo raspi-config
# Interface Options -> I2C -> Enable
# Interface Options -> SPI -> Enable
# Interface Options -> Serial Port -> No (login shell), Yes (hardware)
```

Add to `/boot/config.txt`:
```
dtoverlay=w1-gpio,gpiopin=4
dtparam=i2c_arm=on
dtparam=spi=on
```

### 2. Install Dependencies

```bash
sudo apt update
sudo apt install python3-pip python3-venv
cd /opt/bluesignal/firmware
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure

```bash
sudo mkdir -p /etc/bluesignal /var/lib/bluesignal /var/log/bluesignal
sudo cp config.yaml /etc/bluesignal/config.yaml
# Edit with your LoRaWAN credentials from TTN:
sudo nano /etc/bluesignal/config.yaml
```

### 4. Test

```bash
source venv/bin/activate
python3 src/main.py --config config.yaml
```

### 5. Install as Service

```bash
sudo cp bluesignal-wqm.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable bluesignal-wqm
sudo systemctl start bluesignal-wqm
sudo journalctl -u bluesignal-wqm -f
```

## Calibration

### pH Sensor

```bash
python3 src/main.py --calibrate ph
# Follow prompts with pH 4.0 and pH 7.0 buffer solutions
```

### TDS Sensor

```bash
python3 src/main.py --calibrate tds
# Follow prompts with known TDS calibration solution
```

## Data Flow

```
Sensors -> ADS1115/DS18B20/GPS
  -> Python reads + calibrates
  -> Store in SQLite (/var/lib/bluesignal/readings.db)
  -> Encode as Cayenne LPP
  -> LoRaWAN uplink (SX1262 -> TTN v3)
  -> TTN webhook -> Firebase Cloud Function
  -> Firebase RTDB -> Dashboard
```

## LoRaWAN Payload

Uses Cayenne LPP encoding for TTN compatibility:

| Channel | Type | Sensor | Resolution |
|---------|------|--------|------------|
| 1 | Temperature (0x67) | DS18B20 | 0.1 C |
| 2 | Analog Input (0x02) | pH | 0.01 |
| 3 | Analog Input (0x02) | Turbidity | 0.01 NTU |
| 4 | Analog Input (0x02) | TDS | 0.01 ppm |
| 5 | GPS (0x88) | NEO-6M | 0.0001 deg |
| 6 | Analog Output (0x03) | Battery | 0.01 V |

## License

Proprietary - BlueSignal Inc.
