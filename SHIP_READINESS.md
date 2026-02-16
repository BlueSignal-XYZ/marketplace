# SHIP READINESS AUDIT

**Date:** 2026-02-15  
**Auditor:** Automated deep audit  
**Build status:** All 3 targets build with zero errors  
**Overall verdict:** NOT ship-ready for general availability. Ship-ready for closed beta with punch-list items acknowledged.

---

## Table of Contents

1. [Smoke Test Audit](#1-smoke-test-audit)
2. [API Contract Alignment](#2-api-contract-alignment)
3. [Auth Flow Verification](#3-auth-flow-verification)
4. [State Management Gaps](#4-state-management-gaps)
5. [Build & Bundle Report](#5-build--bundle-report)
6. [Prioritized Punch List](#6-prioritized-punch-list)

---

## 1. Smoke Test Audit

Every route in WQTApp and CloudApp was walked. Each page was evaluated for: crash safety on empty data, crash safety on API error, loading state wiring, error state wiring, empty state, and presence of hardcoded mock data.

### WQT Platform — 23 Pages

| # | Page | Loading | Error | Empty | Hardcoded Data | Status |
|---|------|---------|-------|-------|----------------|--------|
| 1 | MarketplacePage | YES | YES | YES | NO | **PASS** |
| 2 | ListingDetailPage | YES | YES | YES | NO | **PASS** |
| 3 | CertificateDetailPage | YES | YES | YES | NO | **PASS** |
| 4 | EnvironmentalMapPage | NO | NO | YES | YES — 6 fake sensors, hardcoded averages, placeholder map div | **FAIL** |
| 5 | WatershedDashboardPage | NO | NO | NO | YES — 4 fake watersheds, hardcoded stats, placeholder chart | **FAIL** |
| 6 | PurchaseFlowPage | YES | YES | YES | NO | **PASS** |
| 7 | PortfolioPage | YES | YES | YES | NO | **PASS** |
| 8 | SellerOnboardingPage | N/A | NO | N/A | YES — submit button is `alert()` stub | **FAIL** |
| 9 | WQTDashboardPage | YES | NO | YES | NO — but errors are silently swallowed via `Promise.allSettled` | **WARN** |
| 10 | ProgramsPage | NO | NO | NO | YES — hardcoded single program object, fake counts | **FAIL** |
| 11 | WQTLandingPage | N/A | N/A | N/A | N/A — static marketing, expected | **PASS** |
| 12 | RegistryPage | YES | NO | YES | YES — silent mock fallback on error or empty API | **WARN** |
| 13 | RecentRemovalsPage | YES | NO | YES | YES — silent mock fallback | **WARN** |
| 14 | MapPage | YES | YES | YES | YES — state initialized with mock data, silent fallback | **WARN** |
| 15 | PresalePage | YES | NO | YES | YES — mock data, fake Mapbox token, dead action buttons | **FAIL** |
| 16 | TradingProgramDetailPage | YES | YES | YES | NO | **PASS** |
| 17 | CreditPortfolioPage | YES | YES | YES | NO | **PASS** |
| 18 | CreateListingPage | YES | YES | N/A | NO — but sites dropdown shows no loading/error | **WARN** |
| 19 | TransactionPage | YES | NO | YES | NO — but error silently shows empty state | **WARN** |
| 20 | VerificationUI | YES | NO | YES | NO — but 4 async calls have ZERO try/catch, deprecated RQ syntax | **FAIL** |
| 21 | BuyerDashboard | YES | NO | YES | YES — permanent "Sample Data" banner even with real data | **WARN** |
| 22 | SellerDashboard | YES | NO | YES | YES — hardcoded revenue chart, "+23%" string, permanent demo banner | **FAIL** |
| 23 | FinancialDashboard | YES | NO | NO | YES — hardcoded $22,500 balance, fake bank info, hardcoded charts | **FAIL** |

**WQT Totals: 8 PASS, 7 WARN, 8 FAIL**

### Cloud Platform — 19 Pages

| # | Page | Loading | Error | Empty | Hardcoded Data | Status |
|---|------|---------|-------|-------|----------------|--------|
| 1 | CloudDashboardPage (v2) | YES | YES | YES | NO | **PASS** |
| 2 | DeviceDetailPage (v2) | YES | YES | YES | NO | **PASS** |
| 3 | CommissioningWizardPage (v2) | YES | YES | N/A | MINOR — calibration step simulated (labeled honestly) | **PASS** |
| 4 | OverviewDashboard (legacy) | YES | NO | YES | YES — `USE_MOCK` defaults true, 2 sections always mock | **WARN** |
| 5 | DevicesListPage (legacy) | YES | NO | YES | YES — always merges mock devices into real data | **WARN** |
| 6 | DeviceDetailPage (legacy) | YES | PARTIAL | YES | YES — `USE_MOCK` defaults true, logs/commission always mock | **WARN** |
| 7 | SitesListPage | YES | NO | YES | YES — silent mock fallback on API error | **WARN** |
| 8 | SiteDetailPage | YES | YES | YES | YES — `USE_MOCK` defaults true, triple mock fallback | **WARN** |
| 9 | CreateSitePage | YES | YES | N/A | NO | **PASS** |
| 10 | CommissioningPage (legacy) | YES | PARTIAL | YES | NO — uses `alert()` for missing commission history | **PASS** |
| 11 | FullCommissioningWizard | YES | YES | YES | YES — connectivity tests use `Math.random()`, results saved to DB | **FAIL** |
| 12 | AlertsPage | YES | NO | YES | YES — `USE_MOCK` true, actions are `setTimeout` stubs, DemoBanner | **FAIL** |
| 13 | AlertDetailPage | YES | PARTIAL | YES | YES — `handleReopen` is local state only, TODO comment | **WARN** |
| 14 | DeviceOnboardingWizard | PARTIAL | YES | N/A | YES — icon values are broken strings ("Blue", "Brown") | **WARN** |
| 15 | ProfilePage | YES | YES | N/A | NO | **PASS** |
| 16 | OnboardingWizard | YES | YES | N/A | NO | **PASS** |
| 17 | AddDevicePage | YES | YES | N/A | NO | **PASS** |
| 18 | InstallerDashboard | PARTIAL | NO | YES | YES — entire page is hardcoded: fake devices, past-dated jobs, `alert()` stubs | **FAIL** |
| 19 | Home (placeholder) | NO | NO | N/A | YES — intentional "coming soon" placeholder | **PASS** |

**Cloud Totals: 9 PASS, 7 WARN, 3 FAIL**

### Combined Smoke Test Score

| Status | WQT | Cloud | Total |
|--------|-----|-------|-------|
| PASS | 8 | 9 | **17** |
| WARN | 7 | 7 | **14** |
| FAIL | 8 | 3 | **11** |
| **Total** | 23 | 19 | **42** |

**Verdict: FAIL** — 11 pages will actively mislead users or crash. 14 pages have masked failures.

---

## 2. API Contract Alignment

### v2 Client → Backend Cross-Reference

All 25 client functions in `src/services/v2/client.ts` map to registered backend routes. 0 phantom endpoints.

| Client Function | Backend Route | Method | Match |
|----------------|--------------|--------|-------|
| `getMarketStats()` | `/v2/market/stats` | GET | **PASS** |
| `getMarketTicker()` | `/v2/market/ticker` | GET | **PASS** |
| `getListing(id)` | `/v2/market/listing/:id` | GET | **PASS** |
| `searchListings(params)` | `/v2/market/search` | POST | **PASS** |
| `getPublicSensors()` | `/v2/data/sensors/public` | GET | **PASS** |
| `getWatersheds()` | `/v2/data/watersheds` | GET | **PASS** |
| `purchaseCredits(params)` | `/v2/credits/purchase` | POST | **PASS** |
| `submitCredits(params)` | `/v2/credits/submit` | POST | **PASS** |
| `getPortfolio(userId)` | `/v2/credits/portfolio` | GET | **PASS** |
| `mintCertificate(params)` | `/v2/blockchain/mint` | POST | **PASS** |
| `getCertificate(id)` | `/v2/blockchain/certificate/:id` | GET | **PASS** |
| `linkWallet(params)` | `/v2/wallet/link` | POST | **PASS** |
| `getPrograms()` | `/v2/programs` | GET | **PASS** |
| `getProgram(id)` | `/v2/programs/:id` | GET | **PASS** |
| `calculateCredits(programId, params)` | `/v2/programs/:id/calculate` | POST | **PASS** |
| `getDevices(userId)` | `/v2/devices` | GET | **PASS** |
| `getDevice(deviceId)` | `/v2/devices/:id` | GET | **PASS** |
| `getDeviceMetrics(...)` | `/v2/devices/:id/metrics` | GET | **PASS** |
| `getDeviceAlerts(deviceId)` | `/v2/devices/:id/alerts` | GET | **PASS** |
| `checkDevice(deviceId)` | `/v2/devices/check` | POST | **PASS** |
| `testDeviceConnection(deviceId)` | `/v2/devices/test-connection` | POST | **PASS** |
| `commissionDevice(params)` | `/v2/devices/commission` | POST | **PASS** |
| `getSites(userId)` | `/v2/sites` | GET | **PASS** |
| `createSite(params)` | `/v2/sites` | POST | **PASS** |
| `getAlerts(userId)` | `/v2/alerts` | GET | **PASS** |

**Result: 25/25 PASS**

### Backend Endpoints Without Frontend Callers

| Endpoint | Purpose | Risk |
|----------|---------|------|
| `POST /v2/credits/approve` | Admin credit approval | Low — admin-only, no UI yet |
| `POST /v2/credits/reject` | Admin credit rejection | Low — admin-only, no UI yet |

### Type/Shape Mismatches

| # | Mismatch | Severity | Detail |
|---|----------|----------|--------|
| 1 | `PublicSensor.status` returns device status strings (`active`/`inactive`) but type expects `OnlineStatus` (`online`/`offline`/`unknown`) | **HIGH** | Any frontend code checking `=== 'online'` will fail |
| 2 | `PortfolioHolding.status` always `"minted"` | **MEDIUM** | Portfolio never shows `listed`, `sold`, `retired` |
| 3 | `PortfolioTransaction.type` always `"purchase"` | **MEDIUM** | Transaction history never shows sales/retirements |
| 4 | `submitCredits` returns `status: "pending_review"` (underscore) vs `CreditStatus` uses `"pending-review"` (hyphen) | **MEDIUM** | Status comparison will fail |
| 5 | `LinkWalletResult` has double-nested `success` field | **LOW** | Redundant but doesn't break |
| 6 | `CommissionResult.siteId` can be `undefined` but type says `string \| null` | **LOW** | `=== null` check would fail |
| 7 | `PurchaseResult.transactionHash` returns `null` but type is `string?` (optional) | **LOW** | Truthiness checks work, strict `!== undefined` wouldn't |
| 8 | `createSite` response omits `city`/`state`/`country` | **LOW** | Fields are optional in type |
| 9 | `Certificate.credit.verificationLevel` is `string` not union type | **LOW** | No enforcement |
| 10 | `Certificate.credit.status` is `string` not union type | **LOW** | No enforcement |

### Unused Types (40 types defined with no endpoint)

Types exist in `src/services/types/` for future endpoints that don't exist yet: `Credit`, `CreditLineage`, `RetireRequest`, `VerificationResult`, `BlockchainRetireRequest`, `WalletBalance`, `User`, `UserProfile`, `TransferValidation`, `SiteDetail`, `CloudDashboardData`, and ~28 more. These are not harmful but represent dead code until the corresponding endpoints are built.

### Legacy API Layer Usage

| API Layer | Files Using It | Status |
|-----------|---------------|--------|
| `back_door.js` (v1 HTTP) | 66 files | Legacy — parallel to v2 |
| `wqtDataService.js` (v1 wrapper) | 10 files | Legacy wrapper over back_door |
| `CloudMockAPI` (hardcoded mocks) | 8 files | Should be removed |
| Direct Firebase RTDB | 4 files | Bypasses all API validation |
| **Total legacy touchpoints** | **88 files** | |

**Verdict: PASS for v2 contract alignment (25/25). WARN for 10 type mismatches. FAIL for 88 legacy API touchpoints still active.**

---

## 3. Auth Flow Verification

### Unauthenticated User → Protected Route

| Platform | Behavior | Verdict |
|----------|----------|---------|
| **WQT** | `AuthGate` → `<Navigate to="/login" replace />` → renders `<Welcome />` login page. **Does NOT preserve the original URL.** After login, user lands on `/` (landing page), never returns to intended route. | **WARN** |
| **Cloud** | `AuthGate` → renders `<Welcome />` inline at the current URL. After login, `onAuthStateChanged` fires, `user` populates, and `children` render at the same URL. User lands on the exact page they wanted. | **PASS** |

### Token Expiry Mid-Session

| Step | Behavior | Verdict |
|------|----------|---------|
| Token refresh | Firebase SDK auto-refreshes tokens within ~5 min of expiry via `getIdToken()` | **PASS** |
| Refresh failure (network/revoked) | `getToken()` catches, returns `null` | **PASS** |
| `requireAuth=true` endpoint with null token | Throws `ApiError('Authentication required', 401)` immediately, no network call | **PASS** |
| Server returns HTTP 401 | Error propagates to component. **No global interceptor.** Each page renders its own inline error. | **FAIL** |
| Re-auth prompt | **Does not exist.** User sees scattered "Authentication required" errors per-component. `AppContext.user` remains stale (non-null) because `onAuthStateChanged` doesn't fire on token refresh failure. | **FAIL** |

### Wallet Connect

| Scenario | Behavior | Verdict |
|----------|----------|---------|
| Authenticated user + MetaMask → connect + sign → `linkWallet()` succeeds | Modal closes, wallet linked | **PASS** |
| Authenticated user + MetaMask → `linkWallet()` **fails** | Error is `console.error`'d but **swallowed silently**. Modal shows success message. User believes wallet is linked when it isn't. | **FAIL** |
| **Unauthenticated** user clicks "Connect Wallet" | MetaMask prompts, user signs. Success message displayed. **But no auth session created.** Modal stays open. User is still blocked by `AuthGate`. Button sits alongside email/Google login as if it's a login method, but it's only a linking feature. | **FAIL** |
| MetaMask not installed | Button text changes to "Install MetaMask". Click shows error message. **No link to install.** | **WARN** |
| User rejects MetaMask prompt | "Wallet connection cancelled." shown. | **PASS** |
| Email + wallet merge | **Not implemented.** `linkWallet` stores the association server-side but there is no account merge flow. | **N/A** (acknowledged deferred) |

### Route Guard Consistency

All protected routes in both platforms are wrapped with their respective `AuthGate` variants. **No unguarded routes found.**

| Aspect | WQT | Cloud | Verdict |
|--------|-----|-------|---------|
| Protected routes gated | All 12 | All 24 | **PASS** |
| Public routes ungated | All 11 | `/` only | **PASS** |
| Catch-all `*` route | `<NotFound />` | `<CloudLanding />` (shows Welcome if unauthed) | **PASS** — intentional |

### Dead Auth Code

`src/hooks/useAuth.js` defines a complete parallel auth system (`AuthProvider`, `useAuth`, `AuthContext`) with its own `onAuthStateChanged` listener and RTDB profile subscription. **No production file imports it.** It is dead code that risks future accidental double-wrapping and race conditions.

**Verdict: FAIL** — Token expiry has no global handler. Wallet connect silently swallows errors. Unauthenticated wallet UX is misleading.

---

## 4. State Management Gaps

### Server State Caching

| Page | Fetching Strategy | Cached? | Invalidated? |
|------|-------------------|---------|-------------|
| MarketplacePage | React Query `useMarketplaceQuery` | YES (30s stale) | YES — by `usePurchaseMutation` |
| PortfolioPage | React Query `usePortfolioQuery` | YES (30s stale) | YES — by `usePurchaseMutation`, `useSubmitCreditsMutation` |
| CloudDashboardPage | React Query `useDevicesQuery`, `useAlertsQuery` | YES (60s poll) | YES — by `useCommissionDeviceMutation` |
| PurchaseFlowPage | `usePurchaseMutation` + direct `getListing(id)` | Mutation only | Listing not cached |
| CommissioningWizardPage | `useCommissionDeviceMutation` + direct calls | Mutation only | Commission invalidates devices/alerts |
| WQTDashboardPage | Direct `getMarketStats()` + `getPortfolio()` | NO | NO |
| ListingDetailPage | Direct `getListing(id)` | NO | NO |
| CertificateDetailPage | Direct `getCertificate(id)` | NO | NO |
| DeviceDetailPage (v2) | Direct `getDevice()` + `getDeviceMetrics()` + `getDeviceAlerts()` | NO | NO |
| All legacy pages | `back_door.js` / `wqtDataService` / `CloudMockAPI` | NO | NO |

### QueryClient Defaults

| Setting | Value |
|---------|-------|
| `staleTime` | 30,000ms (30s) |
| `gcTime` | 300,000ms (5min, default) |
| `retry` | 1 (queries), 0 (mutations) |
| `refetchOnWindowFocus` | `false` (global), `true` (MarketplacePage override) |
| `refetchOnMount` | `true` (default) |
| `refetchInterval` | `60_000` (devices + alerts only) |

### Stale/Conflicting Data Risks

| Risk | Severity | Detail |
|------|----------|--------|
| **Portfolio data from 3 sources** | **HIGH** | `/portfolio` (React Query), `/credits` (wqtDataService), `/dashboard` (direct v2) — all show "portfolio" data from different APIs with different shapes. After a purchase, only the RQ-backed page refreshes. The other two stay stale. |
| **Market stats fetched by 2 independent components** | **MEDIUM** | `MarketSnapshotBar` and `WQTDashboardPage` both call `getMarketStats()` independently via `useEffect`. Duplicate requests, potential visual inconsistency if backend data changes between responses. |
| **Device detail not cache-aware** | **MEDIUM** | After commissioning a device, the mutation invalidates `['devices']` and `['alerts']` queries. But `DeviceDetailPage` uses direct `getDevice()` in a `useEffect` — it won't see updates until remount. |
| **Listing detail stale after purchase** | **MEDIUM** | `ListingDetailPage` fetches via direct `useEffect`. After purchasing on `/purchase/:id`, the listing detail in another tab still shows old availability. The actual transaction is protected (purchase page fetches fresh data), but displayed info was stale. |
| **Registry/Map/Presale silent mock fallback** | **LOW** | These pages initialize state with mock data and silently fall back to it on API error. User cannot distinguish real from fake. |
| **Two parallel "portfolio" pages** | **LOW** | `/portfolio` (PortfolioPage, v2 design) and `/credits` (CreditPortfolioPage, old design) show overlapping-but-different data. Both are auth-gated and accessible. Conflicting numbers possible. |

### Toast State Scoping

| Property | Value | Verdict |
|----------|-------|---------|
| Provider | Each platform wraps its own `<ToastProvider>` | **PASS** |
| State isolation | `useState` per provider instance | **PASS** |
| Cross-mode leakage | **Not possible** — only one mode runs at a time | **PASS** |
| Module-level `toastCounter` | Shared but harmless (ID generation only) | **PASS** |
| Legacy notification system | `AppContext` has `logNotification` — runs in parallel with Toast system | **WARN** — dual notification systems active |
| Max visible toasts | 2 | **PASS** |

**Verdict: WARN** — Core RQ pages are correctly cached and invalidated. But non-RQ pages can show stale/conflicting data after mutations. Two notification systems exist.

---

## 5. Build & Bundle Report

### Build Status

| Target | Entry Point | Status | Build Time |
|--------|-------------|--------|------------|
| WQT | `index.html` | **PASS** (0 errors) | ~109s |
| Cloud | `cloud.html` | **PASS** (0 errors) | ~75s |
| Landing | `landing.html` | **PASS** (0 errors) | ~5s |

### WQT — Top 10 Largest Chunks

| # | Chunk | Size (KB) | Gzipped (KB) | Over 200KB? |
|---|-------|-----------|-------------|-------------|
| 1 | `index-*.js` (main bundle) | **2,212.89** | 591.06 | **YES** |
| 2 | `MediaUpload-*.js` | **1,046.80** | 321.59 | **YES** |
| 3 | `mapbox-gl-*.js` | **986.17** | 275.59 | **YES** |
| 4 | `index.esm-*.js` (Google Maps) | **434.34** | 106.90 | **YES** |
| 5 | `firebase-*.js` | **352.22** | 75.72 | **YES** |
| 6 | `html5-qrcode-scanner-*.js` | **335.73** | 100.13 | **YES** |
| 7 | `vendor-*.js` (React + Router + styled-components + RQ) | **231.28** | 74.56 | **YES** |
| 8 | `html2canvas.esm-*.js` | **201.43** | 48.04 | **YES** |
| 9 | `esm-*.js` (Lottie) | **152.86** | 33.98 | NO |
| 10 | `index.es-*.js` (Chart.js) | **118.43** | 37.50 | NO |

### Cloud — Top 10 Largest Chunks

Identical to WQT (shared codebase, same chunks):

| # | Chunk | Size (KB) | Gzipped (KB) | Over 200KB? |
|---|-------|-----------|-------------|-------------|
| 1 | `cloud-*.js` (main bundle) | **2,212.89** | 591.07 | **YES** |
| 2 | `MediaUpload-*.js` | **1,046.80** | 321.59 | **YES** |
| 3 | `mapbox-gl-*.js` | **986.17** | 275.59 | **YES** |
| 4 | `index.esm-*.js` (Google Maps) | **434.34** | 106.90 | **YES** |
| 5 | `firebase-*.js` | **352.22** | 75.72 | **YES** |
| 6 | `html5-qrcode-scanner-*.js` | **335.73** | 100.13 | **YES** |
| 7 | `vendor-*.js` | **231.28** | 74.56 | **YES** |
| 8 | `html2canvas.esm-*.js` | **201.43** | 48.04 | **YES** |
| 9 | `esm-*.js` (Lottie) | **152.86** | 33.98 | NO |
| 10 | `index.es-*.js` (Chart.js) | **118.43** | 37.50 | NO |

### Landing — All Chunks

| # | Chunk | Size (KB) | Gzipped (KB) | Over 200KB? |
|---|-------|-----------|-------------|-------------|
| 1 | `vendor-*.js` (React + styled-components) | **140.88** | 45.27 | NO |
| 2 | `landing-*.js` (app code) | **120.48** | 33.69 | NO |

**Landing is clean — well under budget.**

### Key Bundle Concerns

| Issue | Impact | Recommendation |
|-------|--------|----------------|
| **Main bundle 2.2MB** | Slow initial load | The main entry pulls in ALL shared components. Both WQT and Cloud bundles include the full set of all pages for both platforms (each other's pages are dead code in that build). Tree-shaking isn't separating them because of `src/routes/index.js` barrel import. |
| **MediaUpload 1MB** | Livepeer SDK is enormous | Already code-split (lazy loaded). Only loads when user navigates to upload. Acceptable. |
| **Mapbox-GL 986KB** | Only used on 3 pages | Already lazy-loaded via page code splitting. Acceptable. |
| **Google Maps 434KB** | Only used on 2 pages | Already lazy-loaded. Acceptable. |
| **Firebase 352KB** | Inherent SDK size for app+auth+database | Modular imports already used. Firestore lazy-loaded. This is the minimum for the three required Firebase modules. |
| **QR Scanner 336KB** | Only used on commissioning pages | Already lazy-loaded. Acceptable. |
| **html2canvas 201KB** | Only used for certificate export | Already lazy-loaded on demand. Acceptable. |
| **WQT pages in Cloud build and vice versa** | Dead code shipped to wrong build | `src/routes/index.js` statically imports `Home`, `Marketplace`, `FinancialDashboard`, and `Welcome`, which are used by both platforms. This prevents Vite from tree-shaking them. |

### Build Warnings

| Warning | Detail | Severity |
|---------|--------|----------|
| Static+dynamic import conflict for `Home.jsx` | `CloudApp.jsx` dynamic-imports it, `routes/index.js` statically imports it | LOW |
| Static+dynamic import conflict for `FinancialDashboard.jsx` | `WQTApp.jsx` dynamic-imports it, `routes/index.js` statically imports it | LOW |
| `eval` usage in Lottie player | Third-party library, cannot fix | LOW |
| 5 missing env vars | `VITE_ALCHEMY_API_KEY`, `VITE_GOOGLE_MAPS_API_KEY`, `VITE_LIVEPEER_API_KEY`, `VITE_BUILD_VERSION`, `VITE_DEBUG` — optional runtime features | LOW |

**Verdict: WARN** — All builds succeed. Landing is clean. WQT/Cloud main bundles at 2.2MB are concerning but most large dependencies are already code-split and lazy-loaded. The main bundle size is the primary issue.

---

### Dead Code & Debug Statements

| Category | Count | Detail |
|----------|-------|--------|
| `console.log()` in `src/` | **~65 calls across 38 files** | Includes debug logs in VerificationUI, SellerDashboard, payment flows, legacy routes, setting tabs, cloudMockAPI |
| `alert()` in `src/` | **10 calls across 6 files** | SellerOnboardingPage (1), CommissioningPage (1), MediaUpload (4), ChartCard (1), InstallerDashboard (2), dash.utils (1) |
| `TODO` / `PLACEHOLDER` comments | **~170+ across 75 files** | Pervasive across legacy pages, design system primitives, services, and components |
| `src/hooks/useAuth.js` | Dead code | Parallel auth system, never imported in production |
| `src/routes/index.js` | Barrel export | Prevents tree-shaking of `Home`, `Marketplace`, `FinancialDashboard` |
| `src/App.jsx` / `src/App.tsx` | Dead code | Original app entry points replaced by platform-specific entries |
| `src/services/types/` (40 types) | Unused types | Defined for future endpoints that don't exist yet |
| Mock data files (`mockRegistryData`, `mockMapData`, `mockPresaleData`) | Active in production | Silently loaded as fallback in 4+ pages |
| `cloudMockAPI.js` | Active in production | Imported by 8 files, `USE_MOCK` defaults true |

**Verdict: FAIL** — Significant debug artifacts and mock data active in production paths.

---

## 6. Prioritized Punch List

### P0 — Must Fix Before Any User Touches This

These items present financial misinformation, crash risks, or misleading data to users.

| # | Issue | File(s) | Effort | Detail |
|---|-------|---------|--------|--------|
| 1 | **FinancialDashboard shows fake $22,500 balance and fake bank info** | `FinancialDashboard.jsx` | 2h | Hardcoded dollar amounts, bank details, and charts that look like real account data. Users will believe they have funds. Remove fake financial data or gate behind a "coming soon" banner. |
| 2 | **SellerDashboard has hardcoded revenue chart** | `SellerDashboard.jsx` | 1h | Revenue chart always shows same bars. "+23% this month" is a static string. Remove chart or wire to real data. |
| 3 | **VerificationUI has zero error handling on 4 async calls** | `VerificationUI.jsx` | 1h | Any API failure throws unhandled promise rejection → potential crash. Add try/catch to `getUploads()`, `getSubmissions()`, `getDisputes()`, `getApprovals()`. |
| 4 | **FullCommissioningWizard saves `Math.random()` test results to database** | `FullCommissioningWizard.jsx` | 2h | Fake pass/fail results based on random numbers are stored via `updateStep()`. Field technicians will see fake test results for real devices. |
| 5 | **`linkWallet` failure silently swallowed, success message shown** | `AuthModal.jsx` | 30m | Move `setSuccess()` inside the try block after `linkWallet()` succeeds, not before `onClose()`. |
| 6 | **10 `alert()` calls in production code** | 6 files | 1h | Replace all `alert()` with `useToast()` or remove. Especially `SellerOnboardingPage` submit and `InstallerDashboard` stubs. |
| 7 | **Wallet "Connect" button misleads unauthenticated users** | `AuthModal.jsx` | 1h | Shows success message but creates no auth session. Either disable for unauthed users, or add clear messaging that sign-in is still required. |

### P1 — Should Fix Before Public Beta

| # | Issue | File(s) | Effort | Detail |
|---|-------|---------|--------|--------|
| 8 | **No global 401/token-expiry interceptor** | `client.ts` | 4h | Add interceptor that detects 401, clears `AppContext.user`, and triggers re-auth modal. |
| 9 | **WQT login redirect loses destination URL** | `AuthGate.jsx` / `WQTApp.jsx` | 2h | Add `state={{ from: location }}` to `<Navigate>` and read it after login. |
| 10 | **`PublicSensor.status` type mismatch** | `functions/v2/data.js` | 1h | Map `device.status` to `OnlineStatus` values in handler (e.g., `active` → `online`). |
| 11 | **`submitCredits` status format mismatch** | `functions/v2/credits.js` | 15m | Change `"pending_review"` to `"pending-review"` to match `CreditStatus` type. |
| 12 | **Portfolio shown from 3 different APIs** | Multiple | 4h | Migrate `WQTDashboardPage` and `CreditPortfolioPage` to use `usePortfolioQuery`. Remove or redirect `/credits` route. |
| 13 | **InstallerDashboard is 100% hardcoded** | `InstallerDashboard.jsx` | 4h | Entire page is fake data with past dates. Either wire to APIs or add "coming soon" interstitial. |
| 14 | **AlertsPage actions are `setTimeout` stubs** | `AlertsPage.jsx` | 2h | Wire `handleAcknowledge` and `handleResolve` to `AlertsAPI` calls. |
| 15 | **`USE_MOCK` defaults to `true` across 7 Cloud pages** | Multiple Cloud pages | 4h | Flip default to `false`. Remove `CloudMockAPI` fallbacks. Add proper error states. |
| 16 | **Remove permanent "Sample Data" banners** | `BuyerDashboard.jsx`, `SellerDashboard.jsx` | 30m | Make `DemoBanner` conditional on actual mock data usage, or remove entirely now that pages fetch real data. |
| 17 | **Market stats double-fetched** | `MarketSnapshotBar`, `WQTDashboardPage` | 2h | Migrate both to `useMarketStatsQuery` so they share a single cached value. |

### P2 — Should Fix Before GA

| # | Issue | File(s) | Effort | Detail |
|---|-------|---------|--------|--------|
| 18 | **Main bundle 2.2MB** | `vite.config.ts`, `routes/index.js` | 8h | Eliminate barrel re-export in `routes/index.js`. Import `Welcome` and `NotFound` directly where used. Audit cross-platform imports to ensure WQT pages don't ship in Cloud bundle and vice versa. |
| 19 | **65 `console.log` calls in 38 files** | Various | 4h | Strip all debug logs from production paths. Keep `console.error` in catch blocks. |
| 20 | **4 pages use silent mock data fallback** | `RegistryPage`, `MapPage`, `RecentRemovalsPage`, `PresalePage` | 8h | Remove mock fallback. Add proper error UI. Wire to v2 endpoints. |
| 21 | **PresalePage has dead action buttons and fake Mapbox token** | `PresalePage.tsx` | 2h | Remove or label as "coming soon". Fix dummy Mapbox token. |
| 22 | **3 fully static pages with no API** | `EnvironmentalMapPage`, `WatershedDashboardPage`, `ProgramsPage` | 12h | Wire to v2 endpoints (`getPublicSensors`, `getWatersheds`, `getPrograms`) or mark clearly as demos. |
| 23 | **`useAuth.js` dead code** | `src/hooks/useAuth.js` | 15m | Delete file and `AuthTest.jsx`. |
| 24 | **40 unused TypeScript types** | `src/services/types/` | N/A | Not harmful. Keep for future development. Document which are aspirational vs active. |
| 25 | **88 files still on legacy `back_door.js` APIs** | Various | 40h+ | Long-term migration. Not blocking for beta if v2-wired pages are the primary user paths. |
| 26 | **Dual notification systems (Toast + AppContext.logNotification)** | Various | 4h | Deprecate `logNotification` in favor of `useToastContext`. Migrate remaining callers. |
| 27 | **DeviceOnboardingWizard broken icons** | `DeviceOnboardingWizard.jsx` | 30m | Replace string icons (`"Blue"`, `"Brown"`) with emoji or SVG icons. |

---

## Summary Scores

| Audit Section | Score | Verdict |
|---------------|-------|---------|
| 1. Smoke Test | 17 PASS / 14 WARN / 11 FAIL | **FAIL** |
| 2. API Contract | 25/25 endpoints, 10 type mismatches, 88 legacy files | **WARN** |
| 3. Auth Flow | Guards consistent, no 401 handler, wallet UX misleading | **FAIL** |
| 4. State Management | Core pages cached, 6 stale-data risks identified | **WARN** |
| 5. Build + Bundle | 0 build errors, 8 chunks over 200KB, 2.2MB main bundle | **WARN** |

**Overall: NOT ship-ready for GA. Ship-ready for closed beta if P0 items (7 items, ~8h effort) are resolved first.**
