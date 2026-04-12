# Secrets Inventory

All secret values used by the BlueSignal marketplace, where they live, and
how they're distributed. Source-of-truth for on-call incident response.

**Rule**: no secret lives in a source file. Every entry here resolves to an
environment variable (client = `VITE_*`, server = bare name, provided via
Firebase Functions config or GCP Secret Manager).

## Client-side (VITE_\*)

These are bundled into the published client. They are **public by design**
(Firebase API keys are safe to expose — RTDB rules enforce access control).

| Variable                            | Purpose                       | Used by                                |
| ----------------------------------- | ----------------------------- | -------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Firebase client SDK           | `src/apis/firebase.js`, `src/ops/firebase.ts`, landing |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase Auth                 | ditto                                  |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase project              | ditto                                  |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase Storage              | ditto                                  |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM                           | ditto                                  |
| `VITE_FIREBASE_APP_ID`              | Firebase app                  | ditto                                  |
| `VITE_FIREBASE_MEASUREMENT_ID`      | Analytics                     | `src/apis/firebase.js`                 |
| `VITE_GOOGLE_MAPS_API_KEY`          | Maps tiles + geocoding        | `SiteDetailPage.jsx`, `LocationCapture.jsx` |
| `VITE_MAPBOX_TOKEN`                 | Mapbox tiles (WQT)            | `WQT MapPage`, `PropertyMap`, `PresalePage` |
| `VITE_GA4_MEASUREMENT_ID`           | Google Analytics              | `src/App.jsx`, `src/utils/analytics.ts`|
| `VITE_BUILD_VERSION`                | Version tag for debug badge   | `src/App.jsx`                          |
| `VITE_DEMO_MODE`                    | Force demo on at build time   | `src/services/demo/`                   |
| `VITE_USE_MOCK_DATA`                | Legacy alias for demo mode    | `src/services/demo/` (backward compat) |
| `VITE_USE_MARKETPLACE_MOCKS`        | Legacy alias for demo mode    | `src/services/demo/` (backward compat) |
| `VITE_DEBUG`                        | Dev-only verbose logging      | `src/App.jsx`                          |

## Server-side (Cloud Functions)

Never bundled. Set via `firebase functions:config:set` or GCP Secret Manager.
These are **truly secret** — rotation required if exposed.

| Variable                  | Purpose                                                     | Used by                            |
| ------------------------- | ----------------------------------------------------------- | ---------------------------------- |
| `SENDGRID_API_KEY`        | Outbound email (preorder confirmations)                     | `functions/preorder.js`            |
| `TTN_APP_ID`              | The Things Network app identifier                           | `functions/v2/devices.js`          |
| `TTN_API_KEY`             | TTN API credential for LoRaWAN provisioning                 | `functions/v2/devices.js`          |
| `TTN_BASE_URL`            | TTN regional cluster base URL                               | `functions/v2/devices.js`          |
| `BLUESIGNAL_APP_EUI`      | LoRaWAN AppEUI for the BlueSignal tenant                    | `functions/v2/devices.js`          |
| `TTN_WEBHOOK_SECRET`      | Shared secret for TTN → Cloud Functions webhook auth        | `functions/readings.js`            |
| `HUBSPOT_ACCESS_TOKEN`    | HubSpot API token for CRM sync                              | `functions/hubspot.js`             |
| `HUBSPOT_CLIENT_SECRET`   | HubSpot OAuth client secret                                 | `functions/index.js`               |
| `QR_SECRET`               | HMAC secret for device QR signatures                        | `functions/qrcode.js`              |
| `ADMIN_SEED_SECRET`       | One-time secret for admin-bootstrap flows                   | `functions/auth.js`                |
| `CLOUDFLARE_DEPLOY_HOOK_*`| Deploy hooks for CDN refresh (4 sites)                      | GitHub Actions workflow            |

## CI/CD (GitHub Actions)

Held in repo secrets (not committed). Required for deploys:

- `FIREBASE_TOKEN` / service account JSON
- `CLOUDFLARE_DEPLOY_HOOK_WQT`, `..._CLOUD`, `..._LANDING`, `..._OPS`
- `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` (alternative path)

## Rotation policy

- HubSpot token: rotate annually, or on personnel change
- TTN keys: rotate on hardware-vendor change
- QR secret: rotate if device serials ever leak; requires firmware update
- Firebase API keys: safe to leave; rules are the security boundary
- SendGrid: rotate annually

## Audit trail for access changes

All secrets live in either GCP Secret Manager (which logs read/write) or
GitHub Actions secrets (audit log under Settings → Security). Do not echo
secret values in logs or Cloud Function console output.
