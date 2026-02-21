#!/bin/bash
set -euo pipefail

# Build a flashable .img.gz for WQM-1 devices
#
# Requirements: root (for losetup/mount), wget, xz-utils
#
# This script:
# 1. Downloads Raspberry Pi OS Lite (Bookworm, arm64)
# 2. Mounts the image via loop device
# 3. Injects firmware + config
# 4. Enables required interfaces
# 5. Compresses the image for distribution

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FIRMWARE_DIR="$(dirname "$SCRIPT_DIR")"

VERSION=$(cat "${FIRMWARE_DIR}/VERSION" | tr -d '[:space:]')
IMG_NAME="bluesignal-wqm1-v${VERSION}"
WORK_DIR="/tmp/wqm-image-build"

echo "Building ${IMG_NAME}.img.gz"

# --- Download base image ---
BASE_URL="https://downloads.raspberrypi.com/raspios_lite_arm64/images/"
BASE_IMG="2024-11-19-raspios-bookworm-arm64-lite.img"

if [ ! -f "${WORK_DIR}/${BASE_IMG}" ]; then
  mkdir -p "${WORK_DIR}"
  echo "Downloading Raspberry Pi OS Lite..."
  wget -q --show-progress \
    -O "${WORK_DIR}/${BASE_IMG}.xz" \
    "${BASE_URL}raspios_lite_arm64-2024-11-19/${BASE_IMG}.xz"
  xz -d "${WORK_DIR}/${BASE_IMG}.xz"
fi

# --- Copy and expand image ---
cp "${WORK_DIR}/${BASE_IMG}" "${WORK_DIR}/${IMG_NAME}.img"

# Expand by 512MB for firmware + dependencies
truncate -s +512M "${WORK_DIR}/${IMG_NAME}.img"
LOOP=$(losetup -fP --show "${WORK_DIR}/${IMG_NAME}.img")

# Trap to clean up on exit
cleanup() {
  set +e
  umount "${MOUNT_ROOT}/boot/firmware" 2>/dev/null
  umount "${MOUNT_ROOT}" 2>/dev/null
  losetup -d "${LOOP}" 2>/dev/null
}
trap cleanup EXIT

e2fsck -f "${LOOP}p2" || true
resize2fs "${LOOP}p2"

# --- Mount ---
MOUNT_ROOT="${WORK_DIR}/mnt"
mkdir -p "${MOUNT_ROOT}"
mount "${LOOP}p2" "${MOUNT_ROOT}"
mount "${LOOP}p1" "${MOUNT_ROOT}/boot/firmware"

# --- Inject firmware ---
mkdir -p "${MOUNT_ROOT}/opt/bluesignal/firmware"
cp -r "${FIRMWARE_DIR}/src" \
      "${FIRMWARE_DIR}/config" \
      "${FIRMWARE_DIR}/requirements.txt" \
      "${FIRMWARE_DIR}/setup.sh" \
      "${FIRMWARE_DIR}/systemd" \
      "${FIRMWARE_DIR}/scripts" \
      "${FIRMWARE_DIR}/VERSION" \
      "${MOUNT_ROOT}/opt/bluesignal/firmware/"

# --- Inject firstboot script ---
cp "${SCRIPT_DIR}/firstboot.sh" "${MOUNT_ROOT}/opt/bluesignal/firstboot.sh"
chmod +x "${MOUNT_ROOT}/opt/bluesignal/firstboot.sh"

# Create systemd oneshot for first boot
cat > "${MOUNT_ROOT}/etc/systemd/system/bluesignal-firstboot.service" <<EOF
[Unit]
Description=BlueSignal WQM-1 First Boot Setup
After=network-online.target
Wants=network-online.target
ConditionPathExists=/opt/bluesignal/firstboot.sh

[Service]
Type=oneshot
ExecStart=/opt/bluesignal/firstboot.sh
ExecStartPost=/bin/rm /opt/bluesignal/firstboot.sh
RemainAfterExit=yes
TimeoutStartSec=300

[Install]
WantedBy=multi-user.target
EOF

# Enable firstboot
chroot "${MOUNT_ROOT}" systemctl enable bluesignal-firstboot.service

# --- Enable interfaces in config.txt ---
cat >> "${MOUNT_ROOT}/boot/firmware/config.txt" <<EOF

# BlueSignal WQM-1 HAT configuration
dtparam=i2c_arm=on
dtparam=spi=on
dtoverlay=w1-gpio,gpiopin=4
dtoverlay=disable-bt
enable_uart=1
EOF

# --- Enable SSH ---
touch "${MOUNT_ROOT}/boot/firmware/ssh"

# --- Unmount and compress ---
umount "${MOUNT_ROOT}/boot/firmware"
umount "${MOUNT_ROOT}"
losetup -d "${LOOP}"
trap - EXIT

echo "Compressing image..."
gzip -9 "${WORK_DIR}/${IMG_NAME}.img"
mv "${WORK_DIR}/${IMG_NAME}.img.gz" "${FIRMWARE_DIR}/"
sha256sum "${FIRMWARE_DIR}/${IMG_NAME}.img.gz" > "${FIRMWARE_DIR}/${IMG_NAME}.img.gz.sha256"

echo ""
echo "=== Build complete ==="
echo "Image: ${IMG_NAME}.img.gz"
echo "SHA256: $(cat "${FIRMWARE_DIR}/${IMG_NAME}.img.gz.sha256")"
echo ""
echo "Flash with:"
echo "  gunzip -c ${IMG_NAME}.img.gz | sudo dd of=/dev/sdX bs=4M status=progress"
echo "  — or —"
echo "  Use Raspberry Pi Imager -> Custom Image"
