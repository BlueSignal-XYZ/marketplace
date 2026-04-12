# Environment Variable Audit — BlueSignal Platform

**Date:** 2026-02-21  
**Scope:** waterquality.trading + cloud.bluesignal.xyz  
**Source files scanned:** `src/**/*.{js,jsx,ts,tsx}`, `configs.js`, `vite.config.ts`, `.env.example`

---

## 1. Required & Missing

Environment variables referenced in code but **not declared** in `.env.example`:

- [ ] `VITE_MAPBOX_TOKEN` — Mapbox GL access token for interactive maps
  - `src/wqt/pages/MapPage.tsx:11` — Project map (waterquality.trading/map)
  - `src/wqt/pages/PresalePage.tsx:19` — Presale map (has hardcoded fake fallback — **security risk**)
  - `src/components/shared/PropertyMap.jsx:9` — Property map component
  - **Impact:** Map view fails gracefully (falls back to list view), but map is unusable without this token.

- [ ] `VITE_POLYGON_TESTNET_RPC` — Polygon Amoy testnet RPC endpoint
  - `configs.js:16` — Blockchain config (falls back to public `https://rpc-amoy.polygon.technology`)
  - **Impact:** Low — public fallback is functional but rate-limited.

- [ ] `VITE_POLYGON_MAINNET_RPC` — Polygon mainnet RPC endpoint
  - `configs.js:22` — Blockchain config (falls back to public `https://polygon-rpc.com`)
  - **Impact:** Low — public fallback is functional but rate-limited.

- [ ] `VITE_DEMO_MODE` — Enable demo mode globally via env var
  - `src/utils/demoMode.ts:9` — Demo mode detection
  - **Impact:** Optional — demo mode also works via `?demo=1` URL param and localStorage toggle.

- [ ] `VITE_SHOW_DEMO_TOGGLE` — Show demo toggle button in Cloud header
  - `src/components/navigation/CloudHeader.jsx:13` — Cloud header UI
  - **Impact:** Optional — toggle only visible in dev mode by default.

- [ ] `VITE_USE_MOCK_API` — Force mock API usage in production
  - `src/hooks/useUserDevices.js:21` — Device detection hook
  - **Impact:** Optional — defaults to mock in dev, real API in production.

- [ ] `VITE_USE_MOCK_DATA` — Control mock data in Cloud console pages
  - `src/components/cloud/OverviewDashboard.jsx:12` — Overview dashboard
  - `src/components/cloud/SiteDetailPage.jsx:10` — Site detail
  - `src/components/cloud/DeviceDetailPage.jsx:21` — Device detail
  - `src/scripts/back_door.js:1526` — Backend API client (as fallback check)
  - **Impact:** Defaults to mock data ON (not `"false"`). Set to `"false"` to use real APIs only.

- [ ] `VITE_USE_MARKETPLACE_MOCKS` — Control mock data for marketplace APIs
  - `src/scripts/back_door.js:1524-1525` — Backend API client
  - **Impact:** Optional — falls back to `VITE_USE_MOCK_DATA` if not set.

---

## 2. Required & Set

Environment variables that are **declared in `.env.example`** and **referenced in code**:

- [x] `VITE_FIREBASE_API_KEY` — Firebase Web API key
  - `src/apis/firebase.js:18`, `src/pages/landing/utils/firebase.js:15`
  - **Required for:** Authentication, database access. App shows config error screen without it.

- [x] `VITE_FIREBASE_AUTH_DOMAIN` — Firebase auth domain (e.g., `project.firebaseapp.com`)
  - `src/apis/firebase.js:19`, `src/pages/landing/utils/firebase.js:16`
  - **Required for:** Authentication flows. App shows config error screen without it.

- [x] `VITE_FIREBASE_PROJECT_ID` — Firebase project ID
  - `src/apis/firebase.js:20`, `src/pages/landing/utils/firebase.js:17`
  - **Required for:** All Firebase services. App shows config error screen without it.

- [x] `VITE_FIREBASE_STORAGE_BUCKET` — Firebase Storage bucket
  - `src/apis/firebase.js:21`, `src/pages/landing/utils/firebase.js:18`
  - **Required for:** File uploads and media storage.

- [x] `VITE_FIREBASE_MESSAGING_SENDER_ID` — Firebase Cloud Messaging sender ID
  - `src/apis/firebase.js:22`, `src/pages/landing/utils/firebase.js:19`
  - **Required for:** Push notifications (if enabled).

- [x] `VITE_FIREBASE_APP_ID` — Firebase app ID
  - `src/apis/firebase.js:23`, `src/pages/landing/utils/firebase.js:20`
  - **Required for:** Firebase initialization.

- [x] `VITE_FIREBASE_MEASUREMENT_ID` — Firebase Analytics measurement ID
  - `src/apis/firebase.js:24`
  - **Required for:** Analytics (optional, gracefully ignored if missing).

- [x] `VITE_ALCHEMY_API_KEY` — Alchemy RPC provider key for Polygon
  - `vite.config.ts:25` (injected at build time)
  - **Required for:** Blockchain interactions via Alchemy RPC.

- [x] `VITE_GOOGLE_MAPS_API_KEY` — Google Maps JavaScript API key
  - `src/components/cloud/SiteDetailPage.jsx:318` — Site detail map
  - `src/components/installer/LocationCapture.jsx:173` — Location capture
  - `vite.config.ts:26` (injected at build time)
  - **Required for:** Google Maps rendering on site detail and commissioning pages.

- [x] `VITE_LIVEPEER_API_KEY` — Livepeer Studio API key
  - `vite.config.ts:27` (injected at build time)
  - **Required for:** Video streaming and media upload features.

- [x] `VITE_SERVER_URL` — Backend Cloud Functions URL
  - `configs.js:7` (falls back to `https://us-central1-waterquality-trading.cloudfunctions.net/app`)
  - **Required for:** All backend API calls.

- [x] `VITE_BLOCKCHAIN_MODE` — Blockchain network mode (`"test"` or `"main"`)
  - `configs.js:9` (defaults to `"test"`)
  - **Required for:** Selecting Polygon Amoy testnet vs mainnet.

- [x] `VITE_GA4_MEASUREMENT_ID` — Google Analytics 4 measurement ID
  - `src/App.jsx:85` — Analytics initialization
  - `src/utils/analytics.ts:10` — Analytics utility
  - **Required for:** Page view tracking. No-ops if empty.

- [x] `VITE_BUILD_VERSION` — Build version string for debugging
  - `src/App.jsx:26` — Version bubble in dev mode
  - **Required for:** Build identification. Defaults to current date.

- [x] `VITE_DEBUG` — Enable debug mode in production builds
  - `src/App.jsx:91` — Debug logging and version bubble
  - **Required for:** Debug logging in production. Defaults to false.

---

## 3. Unused / Stale

Environment variables **declared in `.env.example`** but **not directly referenced in code**:

- [ ] `VITE_FIREBASE_DATABASE_URL` — Firebase Realtime Database URL
  - Declared in `.env.example` and `vite.config.ts` VITE_ENV_VARS list
  - **Not referenced in any source file** — Firebase SDK auto-resolves the database URL from the project config.
  - **Action:** Can be removed from `.env.example` unless needed for explicit database URL override.

---

## 4. Non-Vite Environment Variables (Shell / CI/CD)

These are used by deployment scripts and CI/CD, not by the Vite build:

- `CLOUDFLARE_DEPLOY_HOOK_WQT` — Cloudflare deploy hook for waterquality.trading
- `CLOUDFLARE_DEPLOY_HOOK_CLOUD` — Cloudflare deploy hook for cloud.bluesignal.xyz
- `CLOUDFLARE_DEPLOY_HOOK_LANDING` — Cloudflare deploy hook for bluesignal.xyz
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID (API method)
- `CLOUDFLARE_API_TOKEN` — Cloudflare API token (API method)
- `CLOUDFLARE_PROJECT_WQT` — Cloudflare Pages project name for WQT
- `CLOUDFLARE_PROJECT_CLOUD` — Cloudflare Pages project name for Cloud
- `CLOUDFLARE_PROJECT_LANDING` — Cloudflare Pages project name for Landing
- `USE_CLOUDFLARE_API` — Toggle between deploy hooks and API method
- `BUILD_TARGET` — Build target selector (`wqt`, `cloud`, `landing`)

---

## 5. Security Notes

1. **`src/wqt/pages/PresalePage.tsx:19`** — Contains a hardcoded Mapbox token fallback (`pk.eyJ1...`). This appears to be a fake/test token but should be removed. Use `VITE_MAPBOX_TOKEN` env var only.

2. **`configs.js`** — Public RPC URLs (`https://rpc-amoy.polygon.technology`, `https://polygon-rpc.com`) are used as fallbacks. These are public endpoints and not secrets, but they are rate-limited. For production, use `VITE_POLYGON_TESTNET_RPC` / `VITE_POLYGON_MAINNET_RPC` with Alchemy or similar provider keys.

3. All Firebase configuration values come from environment variables exclusively ✅.

4. No Stripe keys, LoRaWAN/TTN credentials, or payment keys were found in the codebase.

---

## 6. Device System & Revenue Grade Environment Variables

Added February 2026 for the BlueSignal Device System and Revenue Grade Credit On-Ramp.

### Backend (Firebase Cloud Functions)

These are set via Cloud Functions configuration or GitHub Secrets:

| Variable | Description | Required |
|---|---|---|
| `TTN_APP_ID` | The Things Network application ID (e.g., `bluesignal-wqm`) | Yes (for LoRaWAN) |
| `TTN_API_KEY` | TTN v3 API key for device registration and downlink scheduling | Yes (for LoRaWAN) |
| `TTN_WEBHOOK_SECRET` | Shared secret for TTN webhook authentication | Yes (already configured as Cloud Function secret) |
| `TTN_BASE_URL` | TTN v3 API base URL (default: `https://nam1.cloud.thethings.network`) | No (has default) |
| `BLUESIGNAL_OUI_PREFIX` | First 4 bytes of DevEUI (default: `0018B200`) | No (has default) |
| `BLUESIGNAL_APP_EUI` | Fixed AppEUI for all BlueSignal devices (default: `70B3D57ED0000001`) | No (has default) |
| `FIRMWARE_BUCKET_URL` | Cloud storage URL for firmware binaries (for BLE OTA) | No (v2 feature) |

### Firmware (Pi on-device — NOT environment variables)

The Pi firmware uses JSON config files under `/opt/bluesignal/config/`, not environment variables.
Build-time variables for `flash_image.sh`:

| Variable | Description | Default |
|---|---|---|
| `BLUESIGNAL_FW_VERSION` | Firmware version baked into SD card image | `1.0.0` |
| `BLUESIGNAL_HW_REVISION` | Hardware revision identifier | `WQM1-v1.0` |

### Pi Config Files (generated at first boot)

- `device.json` — Device identity (device_id, dev_eui, ble_name)
- `lora.json` — LoRaWAN credentials (app_key, written by BLE commissioning)
- `calibration.json` — Sensor calibration constants with revenue-grade fields
- `settings.json` — Sample interval, thresholds, relay rules, revenue-grade settings
