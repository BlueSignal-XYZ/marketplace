# BlueSignal Ecosystem — Audit Findings

**Date:** February 8, 2026
**Repo:** `marketplace` (single repo, tri-mode architecture)
**Database:** Firebase Realtime Database (project: `waterquality-trading`)

---

## Architecture Overview

| Mode | Hostname | Entry Point | Build Target |
|---|---|---|---|
| Landing | bluesignal.xyz | `src/pages/landing/main.jsx` | `dist-landing/` |
| Cloud | cloud.bluesignal.xyz | `src/main.jsx` → `App.jsx` | `dist-cloud/` |
| Marketplace | waterquality.trading | `src/main.jsx` → `App.jsx` | `dist-wqt/` |

Mode detection: `src/utils/modeDetection.js` (runtime hostname check).
Cloud and Marketplace share the same entry point and context; Landing is fully isolated.

---

## BlueSignal Cloud Dashboard — Component Status

| Component | File | Status | Notes |
|---|---|---|---|
| Firebase Auth (sign up/in/Google/reset) | `src/routes/Welcome.jsx`, `src/routes/components/welcome/LoginForm.jsx`, `RegisterForm.jsx` | FUNCTIONAL | Email + Google sign-in, password reset, `onAuthStateChanged` in AppContext |
| Onboarding Wizard | `src/components/cloud/OnboardingWizard.jsx` | FUNCTIONAL | 3-step wizard (role, profile, review), sets `onboardingCompleted: true` via `UserProfileAPI` |
| Overview Dashboard | `src/components/cloud/OverviewDashboard.jsx` | FUNCTIONAL | Real device/alert/site data via `DeviceAPI`, `AlertsAPI`, `SiteAPI`; mock fallbacks for commissioning/tasks |
| Devices List | `src/components/cloud/DevicesListPage.jsx` | FUNCTIONAL | Reads from RTDB `/devices/` via `DeviceService.getAllDevices()`, merges with mock; filters by status/type/lifecycle |
| Device Detail | `src/components/cloud/DeviceDetailPage.jsx` | FUNCTIONAL | Tabs: Overview, Live Data (Chart.js), Configuration, Logs; reads via `DeviceAPI`, `AlertsAPI`, `ReadingsAPI` |
| Add Device | `src/components/cloud/AddDevicePage.jsx` | FUNCTIONAL | Serial validation (PGW-XXXX or BS-XXXXXX format), writes via `DeviceAPI.addDevice()` |
| Device Onboarding Wizard | `src/components/cloud/DeviceOnboardingWizard.jsx` | STUB | 4-step wizard (type, identity, location, confirm); uses `CloudMockAPI`, device creation does NOT persist |
| Full Commissioning Wizard | `src/components/cloud/FullCommissioningWizard.jsx` | FUNCTIONAL | 7-step wizard (scan, site, location, photos, tests, calibrate, review); Firebase RTDB via `useCommission` hook |
| Commissioning List | `src/components/cloud/CommissioningPage.jsx` | STUB | Filter pills, device table, commission modal; ALL data from `CloudMockAPI` |
| Commission Workflow | `src/components/installer/CommissionWorkflow.jsx` | FUNCTIONAL | 6-step installer workflow; real backend API via `commissionService` |
| Device Activation | `src/components/installer/DeviceActivation.jsx` | FUNCTIONAL | Activates device post-commission, updates lifecycle to "active" |
| Sites List | `src/components/cloud/SitesListPage.jsx` | FUNCTIONAL | Reads via `GeocodingAPI.listSites({ ownerId })`, mock fallback |
| Create Site | `src/components/cloud/CreateSitePage.jsx` | FUNCTIONAL | Multi-section form, writes via `GeocodingAPI.createSite()` |
| Site Detail | `src/components/cloud/SiteDetailPage.jsx` | STUB | Google Maps integration exists; ALL data from `CloudMockAPI` |
| Alerts List | `src/components/cloud/AlertsPage.jsx` | PARTIAL | Reads real alerts via `AlertsAPI.getActive()`; acknowledge/resolve actions are local-only (TODO) |
| Alert Detail | `src/components/cloud/AlertDetailPage.jsx` | STUB | Uses `CloudMockAPI.alerts.getAll()`; actions don't persist |
| Profile | `src/components/cloud/ProfilePage.jsx` | FUNCTIONAL | Reads/writes via `UserProfileAPI.getProfile()` / `updateProfile()` |
| Installer Dashboard | `src/components/dashboards/InstallerDashboard.jsx` | FUNCTIONAL | Installer-specific view |

---

## WaterQuality.Trading Marketplace — Component Status

| Component | File | Status | Data Source | Notes |
|---|---|---|---|---|
| Marketplace Browse | `src/routes/marketplace/Marketplace.jsx` | FUNCTIONAL (mock) | `creditsApi` mock | Grid of credit listings with cards |
| Listing Detail | `src/routes/marketplace/ListingDetail.jsx` | FUNCTIONAL (mock) | `creditsApi` mock | Full listing with map, stats, request quote |
| NFT Listing Page | `src/components/elements/marketplace/ListingPage.jsx` | FUNCTIONAL | `MarketplaceAPI.Events` (blockchain) | NFT buy/bid with PoSPopup |
| Credit Registry | `src/wqt/pages/RegistryPage.tsx` | FUNCTIONAL (mock) | `mockRegistryData` | Sortable table, filters, detail modal |
| Project Map | `src/wqt/pages/MapPage.tsx` | FUNCTIONAL (mock) | `mockMapData` | Mapbox integration, project markers/boundaries |
| Recent Removals | `src/wqt/pages/RecentRemovalsPage.tsx` | FUNCTIONAL (mock) | `mockRegistryData` (filtered) | Date range filters, retired credits |
| Presale | `src/wqt/pages/PresalePage.tsx` | FUNCTIONAL (mock) | `mockPresaleData` | Card grid/map, status filters |
| Buyer Dashboard | `src/components/dashboards/BuyerDashboard.jsx` | FUNCTIONAL (mock) | Hardcoded mock | Stats, credits list, purchases, quick actions |
| Seller Dashboard | `src/components/dashboards/SellerDashboard.jsx` | FUNCTIONAL (mock) | Hardcoded mock | Stats, listings, revenue chart, sales |
| Financial Dashboard | `src/routes/marketplace/account/FinancialDashboard.jsx` | FUNCTIONAL (mock) | Hardcoded mock | Revenue/type charts (Chart.js), transactions, payout |
| Create Listing | `src/components/elements/marketplace/CreateListingPage.jsx` | FUNCTIONAL | `CreditsMarketplaceAPI.createListing()` | Real API, loads sites via GeocodingAPI |
| Transaction Page | `src/components/elements/marketplace/TransactionPage.jsx` | FUNCTIONAL (mock) | Hardcoded mock | Filterable list, pagination UI |
| Certificate | `src/components/routes/CertificatePage.jsx` | FUNCTIONAL | Backend API `/npc_credits/certificates/` | Social share links |
| Verification UI | `src/components/elements/contractUI/VerificationUI.jsx` | FUNCTIONAL | `UserAPI.media`, `UserAPI.assets` | Role-based tabs (farmer/verifier/admin) |

---

## Cross-Platform Features — Gap Analysis

| Feature | Cloud | WQT | Cross-Platform | Status |
|---|---|---|---|---|
| Firebase Auth (shared) | Yes | Yes | Same Firebase project | WORKING |
| Device commissioning | Full wizard + workflow | N/A | N/A | WORKING (Cloud only) |
| Device visibility | Full (list, detail, charts) | Not visible | Devices not shown in WQT | MISSING |
| Trading programs | N/A | N/A | No data model or UI | MISSING |
| Device-to-program enrollment | N/A | N/A | No enrollment flow | MISSING |
| Notifications (cross-platform) | N/A | N/A | No notification system | MISSING |
| Credit generation from readings | N/A | Backend function exists | No frontend UI | MISSING |
| Credit portfolio | N/A | Partial (buyer dashboard) | No dedicated view | MISSING |
| Virtual device simulator | N/A | N/A | N/A | MISSING |

---

## RTDB Schema — Current Paths

| Path | Purpose | Used By | Has Rules |
|---|---|---|---|
| `/users/{uid}/` | User profiles, settings, wallets, activity | Cloud + WQT | Yes |
| `/devices/{serialNumber}/` | Device inventory, ownership, installation, health | Cloud | Yes |
| `/sites/{siteId}/` | Site management, location, devices, credits | Cloud | Yes |
| `/commissions/{commissionId}/` | Commission workflows | Cloud | Yes |
| `/readings/{deviceId}/{timestamp}/` | Sensor time-series data | Cloud (backend write-only) | Yes |
| `/credits/{creditId}/` | Credit records (nitrogen/phosphorus/stormwater/thermal) | WQT | Yes |
| `/listings/{listingId}/` | Marketplace listings | WQT | Yes |
| `/alerts/{alertId}/` | Device alerts | Cloud | Yes |
| `/orders/{orderId}/` | Purchase orders (Stripe) | WQT | Yes |
| `/customers/{customerId}/` | Admin customer management | Cloud | Yes |
| `/installers/{installerId}/` | Installer stats | Cloud | Yes |
| `/tradingPrograms/{programId}/` | Trading program definitions | — | **MISSING** |
| `/enrollments/{enrollmentId}/` | Device-program enrollments | — | **MISSING** |
| `/notifications/{notificationId}/` | Cross-platform notifications | — | **MISSING** |

---

## Sensor Channel Alignment (WQM-1 HAT)

| HAT Component | Sensor | Current RTDB Field | Dashboard Shows | Status |
|---|---|---|---|---|
| BNC Female (A0) | pH Probe | `ph` | Yes | OK |
| JST-XH (A1) | TDS / Conductivity | `tds_ppm` / `conductivity` | Yes | OK |
| JST-XH (A2) | Turbidity | `ntu` | Yes | OK |
| DS18B20 (GPIO) | Temperature | `temp_c` | Yes | OK |
| GPS (UART) | GPS Coordinates | `gps.lat`, `gps.lng` | Not in readings view | NEEDS FIX |
| JST-XH (A3) | Reserved | — | Not shown | OK (future) |
| N/A | NPK (n/p/k) | `npk_n`, `npk_p`, `npk_k` | Yes (shown) | NEEDS REMOVAL |

---

## First-Run Behavior

| Element | Implemented | Persistence | Notes |
|---|---|---|---|
| Onboarding Wizard | Yes | RTDB (`onboardingCompleted: true`) | Shows only when no devices AND not completed |
| Welcome Banner (Dashboard) | Yes | `localStorage` | Should migrate to RTDB for cross-device |
| Empty Device State | Yes | Checks device count | Redirects to `/cloud/onboarding` |
| Tooltip Hints | No | — | Not implemented |

---

## Backend API Coverage

All APIs are in `src/scripts/back_door.js` calling Cloud Functions at `us-central1-app-neptunechain.cloudfunctions.net/app`:

| API | Endpoints | Used By |
|---|---|---|
| `UserAPI` | getUserFromUID, getUserFromUsername, media, assets | Cloud + WQT |
| `AccountAPI` | create, register, verify (role/registered/blacklist) | Cloud + WQT |
| `DeviceAPI` | CRUD, lifecycle, emulate, getDeviceData | Cloud |
| `CommissionAPI` | initiate, runTests, complete, cancel | Cloud |
| `SiteAPI` | CRUD | Cloud |
| `AlertsAPI` | getActive, acknowledge, resolve | Cloud |
| `ReadingsAPI` | get (with pagination/time range) | Cloud |
| `CustomerAPI` | CRUD | Cloud |
| `OrderAPI` | CRUD | WQT |
| `MarketplaceAPI` | NFT operations | WQT |
| `NPCCreditsAPI` | issue, buy, transfer, donate, getCreditTypes | WQT |
| `CreditsMarketplaceAPI` | createListing, getListings | WQT |
| `StripeAPI` | config, createPaymentIntent, getPrice | WQT |
| `UserProfileAPI` | getProfile, updateProfile, updateRole | Cloud + WQT |
| `GeocodingAPI` | listSites, createSite | Cloud |
| `QRCodeAPI` | generate, validate | Cloud |
| `VirginiaAPI` | Virginia-specific credit exchange | WQT |
| `TradingProgramAPI` | — | **MISSING** |
| `EnrollmentAPI` | — | **MISSING** |
| `NotificationsAPI` | — | **MISSING** |

---

## Mock Data Files (to be replaced with real APIs)

| File | Used By | Replacement API |
|---|---|---|
| `src/apis/creditsApi.js` | Marketplace browse, ListingDetail | `CreditsMarketplaceAPI.getListings()` |
| `src/data/mockRegistryData.ts` | RegistryPage, RecentRemovalsPage | Backend `/credits` endpoint |
| `src/data/mockMapData.ts` | MapPage | `SiteAPI.list()` / `GeocodingAPI.listSites()` |
| `src/data/mockPresaleData.ts` | PresalePage | `CreditsMarketplaceAPI` (filtered) |
| `src/services/cloudMockAPI.js` | SiteDetailPage, AlertDetailPage, CommissioningPage, DeviceOnboardingWizard | Real `SiteAPI`, `AlertsAPI`, `CommissionAPI`, `DeviceAPI` |

---

## Summary

**What works well:**
- Firebase Auth is shared and functional across all modes
- Cloud dashboard has a mature device management pipeline (commission, activate, monitor)
- Backend API layer is comprehensive with 20+ API modules
- RTDB schema is well-defined with validation rules
- UI components exist for nearly all pages (even if using mock data)

**What needs immediate attention:**
1. 9 WQT marketplace pages use mock data instead of real RTDB APIs
2. 5 Cloud dashboard pages are stubs using `CloudMockAPI`
3. No cross-platform device visibility (Cloud devices not shown in WQT)
4. No trading program / enrollment / notification infrastructure
5. No virtual device simulator for pre-hardware testing
6. Device detail page shows NPK sensors that don't exist on WQM-1 HAT
