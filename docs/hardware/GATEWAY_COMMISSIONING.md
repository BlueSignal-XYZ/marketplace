# Gateway Commissioning Contract

This document defines the interface contract between the **WQM-1 gateway firmware** (maintained in its own repository) and the **BlueSignal Cloud/Marketplace platform** (this repository). It ensures commissioning stays in lockstep across both repos.

## Firmware Version Compatibility

The platform stores `firmwareVersion` per device in the Firebase Realtime Database at `devices/{deviceId}/firmwareVersion`. During commissioning, the connectivity test step should validate that the gateway is running a compatible firmware version.

| Field | Path | Format |
|-------|------|--------|
| Firmware version | `devices/{deviceId}/firmwareVersion` | SemVer (e.g. `1.0.0`) |
| Minimum supported | Defined in `functions/v2/devices.js` | Currently `1.0.0` |

**Rule:** Firmware major version changes that alter the reading payload schema or commissioning protocol MUST be coordinated with platform updates before deployment.

## Commissioning Workflow

The platform implements a 7-step commissioning workflow in `functions/commissioning.js`. The gateway firmware and mobile app share responsibility across these steps.

| Step | Name | Required | Gateway Responsibility | Platform Responsibility |
|------|------|----------|----------------------|------------------------|
| 1 | `device_scan` | Yes | Expose device serial via QR code label and/or BLE advertisement | Validate serial number, create commission record in Firebase |
| 2 | `site_selection` | Yes | None (mobile app step) | Associate device with monitoring site |
| 3 | `location_capture` | Yes | Report GPS coordinates via sensor readings | Store location, update `devices/{deviceId}/installation/location` |
| 4 | `photo_upload` | Yes | None (mobile app step) | Store installation photos in commission record |
| 5 | `connectivity_test` | Yes | Report health telemetry (battery, signal, sensor readings) | Run automated tests: power, connectivity, sensors, cloud_ingestion |
| 6 | `sensor_calibration` | No | Accept and apply calibration offsets to sensor readings | Store offsets at `devices/{deviceId}/configuration/calibration` |
| 7 | `review_confirm` | Yes | None (mobile app step) | Set device `installation/status` to `active`, finalize commission |

### Device Status Transitions

```
registered → commissioned (on initiate) → active (on complete)
                                        → registered (on cancel/fail)
```

Only devices with status `registered`, `unregistered`, or `decommissioned` can begin commissioning.

## API Endpoints

The gateway interacts with the platform through these endpoints:

### Device Management (`functions/v2/devices.js`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/v2/devices` | List user's devices |
| GET | `/v2/devices/:id` | Get device detail (includes firmwareVersion) |
| GET | `/v2/devices/:id/metrics` | Time-series sensor readings (24h/7d/30d) |
| GET | `/v2/devices/:id/alerts` | Alert history |
| POST | `/v2/devices/check` | Validate device ID exists |
| POST | `/v2/devices/test-connection` | Run connectivity check |
| POST | `/v2/devices/commission` | Trigger full commissioning |

### Commissioning (`functions/commissioning.js`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/commission/initiate` | Start commissioning (requires `deviceId`) |
| POST | `/commission/update-step` | Complete a workflow step (requires `commissionId`, `stepName`, `stepData`) |
| POST | `/commission/complete` | Finalize commission (all required steps must be done) |
| POST | `/commission/cancel` | Cancel active commission |
| POST | `/commission/tests` | Run automated commission tests |
| POST | `/commission/get` | Get commission details |
| POST | `/commission/list` | List commissions (filtered by role) |

All endpoints require Firebase Auth bearer token in `Authorization` header.

## Data Schema Contract

### Device Identity

| Field | Format | Source |
|-------|--------|--------|
| Device ID | `BS-WQM1-{12 hex chars}` | Derived from Pi serial (`/proc/cpuinfo`) |
| DevEUI | `0018B200{8 hex chars}` | OUI-based, for LoRaWAN registration |
| AppEUI | `70B3D57ED0000001` | Hardcoded (TTN allocation) |
| BLE Name | `BlueSignal-{4 hex chars}` | For BLE commissioning discovery |
| Serial Number | `pgw-XXXX` | Platform-generated (4-digit padded) |

### Sensor Reading Payload

The gateway encodes readings using Cayenne LPP over LoRaWAN. The platform decodes these into the following JSON structure stored at `readings/{deviceId}`:

| Channel | Sensor | Unit | Cayenne Type |
|---------|--------|------|-------------|
| 1 | pH | pH units (0-14) | Analog Input |
| 2 | TDS | ppm | Analog Input |
| 3 | Turbidity | NTU | Analog Input |
| 4 | ORP | mV | Analog Input |
| 5 | Temperature | Celsius | Temperature |
| 6 | GPS | lat/lng/alt | GPS |

The platform maps these via the `toReadings()` function in `functions/v2/devices.js`.

### Health Telemetry

The gateway reports health data to `devices/{deviceId}/health`:

```json
{
  "batteryLevel": 85,
  "signalStrength": -67,
  "lastSeen": 1711324800000,
  "firmwareVersion": "1.0.0"
}
```

## Commissioning Test Thresholds

During the `connectivity_test` step, the platform runs these automated checks:

| Test | Metric | Pass Condition | Fail Condition |
|------|--------|---------------|----------------|
| `power` | `health.batteryLevel` | >= 10% | < 10% |
| `connectivity` | `health.signalStrength` | >= -100 dBm | < -100 dBm |
| `sensors` | Time since `health.lastSeen` | <= 30 minutes | > 30 minutes |
| `cloud_ingestion` | Entries in `readings/{deviceId}` | At least 1 reading exists | No readings |

Overall status: `passed` (all pass), `warning` (no failures but some warnings), `failed` (any failure).

## Cross-Repo Development Rules

### Breaking Changes Requiring Coordination

These changes in the **gateway firmware repo** require corresponding updates in **this platform repo** before deployment:

1. **Reading payload schema changes** — Adding, removing, or renaming sensor channels requires updating the `toReadings()` mapper in `functions/v2/devices.js` and any frontend components that display readings.

2. **Health telemetry format changes** — Altering the health payload structure requires updating `functions/scheduled/deviceHealth.js` and the commissioning test logic in `functions/commissioning.js`.

3. **Device identity format changes** — Modifying the device ID, DevEUI, or serial number format requires updating `src/services/deviceService.js` serial generation and validation logic.

4. **Commissioning protocol changes** — Adding or reordering commissioning steps requires updating the `COMMISSION_STEPS` array in `functions/commissioning.js` and the frontend `CommissioningPage.jsx` / `DeviceOnboardingWizard.jsx`.

5. **Calibration data format changes** — Altering calibration offset structure requires updating `functions/commissioning.js` (sensor_calibration step handler) and `functions/scheduled/` calibration expiry checks.

### Version Bump Protocol

When releasing a new firmware version:
1. Update the firmware repo's `VERSION` file
2. Verify the new version is >= the platform's minimum supported version
3. If breaking changes are included, update the platform's minimum version requirement
4. The platform will record the firmware version from the device's health telemetry automatically

### Testing Commissioning End-to-End

1. Register a test device in Firebase with status `registered`
2. Populate `devices/{deviceId}/health` with valid telemetry
3. Push at least one reading to `readings/{deviceId}`
4. Run through the 7-step commissioning flow via the Cloud dashboard
5. Verify device status transitions: `registered` → `commissioned` → `active`

## Platform Files Reference

Key files in this repo that implement the device/commissioning contract:

| File | Purpose |
|------|---------|
| `functions/commissioning.js` | 7-step commissioning workflow backend |
| `functions/v2/devices.js` | Device CRUD API + metrics/alerts |
| `functions/scheduled/deviceHealth.js` | Periodic health check scheduling |
| `src/services/deviceService.js` | Firebase device CRUD (frontend) |
| `src/services/deviceLifecycleService.js` | Device state transition logic |
| `src/components/cloud/CommissioningPage.jsx` | Commissioning UI |
| `src/components/cloud/DeviceOnboardingWizard.jsx` | Device onboarding flow |
| `src/components/cloud/DeviceDetailPage.jsx` | Device monitoring dashboard |
