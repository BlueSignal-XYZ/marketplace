#!/bin/bash
set -euo pipefail

# BlueSignal WQM-1 First Boot Script
# Runs once on first boot, then deletes itself.

echo "=== BlueSignal WQM-1 First Boot ==="

# Create system user
useradd -r -s /usr/sbin/nologin bluesignal 2>/dev/null || true
usermod -aG gpio,i2c,spi,dialout bluesignal

# Create directories
mkdir -p /etc/bluesignal /var/lib/bluesignal /var/log/bluesignal
chown -R bluesignal:bluesignal /var/lib/bluesignal /var/log/bluesignal /etc/bluesignal

# Install Python venv and dependencies
cd /opt/bluesignal/firmware
python3 -m venv venv
venv/bin/pip install --upgrade pip
venv/bin/pip install -r requirements.txt

# Copy default config if not present
if [ ! -f /etc/bluesignal/config.yaml ]; then
  cp config/config.yaml.example /etc/bluesignal/config.yaml
  DEVICE_ID=$(cat /sys/class/net/wlan0/address 2>/dev/null | tr -d ':' || hostname)
  sed -i "s/id: \"\"/id: \"${DEVICE_ID}\"/" /etc/bluesignal/config.yaml
fi

if [ ! -f /etc/bluesignal/calibration.yaml ]; then
  cp config/calibration.yaml /etc/bluesignal/calibration.yaml
fi

# Install systemd services
cp systemd/bluesignal-wqm.service /etc/systemd/system/
cp systemd/bluesignal-health.service /etc/systemd/system/
cp systemd/bluesignal-health.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable bluesignal-wqm.service
systemctl enable bluesignal-health.timer

# Set hostname
DEVICE_ID=$(cat /sys/class/net/wlan0/address 2>/dev/null | tr -d ':' || hostname)
hostnamectl set-hostname "wqm-${DEVICE_ID:0:8}" 2>/dev/null || true

# Start the service
systemctl start bluesignal-wqm.service
systemctl start bluesignal-health.timer

echo "=== First boot setup complete ==="
