#!/bin/bash
set -euo pipefail

# Build a flashable .img.gz for WQM-1 devices.
# Wrapper script that invokes image/build.sh from the firmware root.
# Run from the firmware/ directory.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FIRMWARE_DIR="$(dirname "$SCRIPT_DIR")"

exec "${FIRMWARE_DIR}/image/build.sh"
