#!/bin/bash
set -euo pipefail

# BlueSignal WQM-1 First-Boot Provisioning
# Run as root on a fresh Raspberry Pi OS Lite image

echo "=== BlueSignal WQM-1 Setup ==="

# --- System user ---
useradd -r -s /usr/sbin/nologin bluesignal 2>/dev/null || true
usermod -aG gpio,i2c,spi,dialout bluesignal

# --- Enable interfaces ---
raspi-config nonint do_i2c 0      # Enable I2C
raspi-config nonint do_spi 0      # Enable SPI
raspi-config nonint do_serial 2   # Enable UART, disable console

# Enable 1-Wire
grep -q "dtoverlay=w1-gpio" /boot/firmware/config.txt || \
  echo "dtoverlay=w1-gpio,gpiopin=4" >> /boot/firmware/config.txt

# Disable Bluetooth (frees UART for GPS)
grep -q "dtoverlay=disable-bt" /boot/firmware/config.txt || \
  echo "dtoverlay=disable-bt" >> /boot/firmware/config.txt

# --- Directory structure ---
mkdir -p /opt/bluesignal/firmware
mkdir -p /etc/bluesignal
mkdir -p /var/lib/bluesignal
mkdir -p /var/log/bluesignal

chown -R bluesignal:bluesignal /var/lib/bluesignal /var/log/bluesignal /etc/bluesignal

# --- Install firmware ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cp -r "${SCRIPT_DIR}/." /opt/bluesignal/firmware/
cd /opt/bluesignal/firmware

# Python venv
python3 -m venv venv
venv/bin/pip install --upgrade pip
venv/bin/pip install -r requirements.txt

# --- Config ---
if [ ! -f /etc/bluesignal/config.yaml ]; then
  cp config/config.yaml.example /etc/bluesignal/config.yaml
  # Generate device ID from MAC address
  DEVICE_ID=$(cat /sys/class/net/wlan0/address 2>/dev/null | tr -d ':' || hostname)
  sed -i "s/id: \"\"/id: \"${DEVICE_ID}\"/" /etc/bluesignal/config.yaml
  echo "Config created at /etc/bluesignal/config.yaml — EDIT BEFORE USE"
fi

if [ ! -f /etc/bluesignal/calibration.yaml ]; then
  cp config/calibration.yaml /etc/bluesignal/calibration.yaml
fi

# --- systemd services ---
cp systemd/bluesignal-wqm.service /etc/systemd/system/
cp systemd/bluesignal-health.service /etc/systemd/system/
cp systemd/bluesignal-health.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable bluesignal-wqm.service
systemctl enable bluesignal-health.timer

# --- Hostname ---
hostnamectl set-hostname "wqm-${DEVICE_ID:0:8}" 2>/dev/null || true

echo ""
echo "=== Setup complete ==="
echo "1. Edit /etc/bluesignal/config.yaml (set LoRaWAN keys)"
echo "2. Reboot to enable I2C/SPI/UART/1-Wire"
echo "3. After reboot: systemctl start bluesignal-wqm"
echo ""
