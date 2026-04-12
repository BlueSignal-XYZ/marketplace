# Audit Findings Summary — Cloud + Marketplace CRUD & Persistence

**Date:** 2026-04-12
**Branch:** `claude/audit-findings-summary-ek1zO`
**Scope:** React SPA (Cloud + Marketplace modes) + Firebase Cloud Functions + RTDB rules
**Out of scope:** WQM-1 firmware, Ops Dashboard, Landing page, blockchain layer

---

## Executive Summary

The user reports that "marketplace and cloud applications are not writing or editing to the user profile, meaning data is not persistent and network errors are common." This audit confirms that report and expands it.

**Headline findings (24 issues across 4 severity tiers):**

- **P0 — Runtime failure (4 findings).** Create-Site throws a `TypeError` at runtime. Create-Listing 400s on every submit. Profile "Save" silently drops 6 of 9 fields the UI collects. Onboarding-complete flag is written with two different casings (`onboardingComplete` vs `onboardingCompleted`) across three code paths.

- **P1 — Stubs that pretend to work (5 findings).** "Place Order" is a toast. Profile image upload is local-only. 2FA/deactivate/delete-account handlers are empty. Data export/backup are empty. Seller cannot edit or cancel their own listings.

- **P1 — Missing capability, backend ready (6 findings).** Six endpoints in `functions/index.js` have no frontend caller: alert acknowledge/resolve/reopen, threshold update, listing update/cancel, customer-scoped site list.

- **P1 — Persistence & architecture (5 findings).** `AppContext.updateUser` never writes to the server. No Firebase offline persistence. No axios retry on 5xx/network. Cloud mode still routes through `cloudMockAPI.js`. Security rules and backend whitelist are out of sync.

- **P2 — Structural gaps (4 findings).** Orphaned `/order/create` frontend API with no route. `notifications` settings visible but unsavable. No pagination on any list endpoint. No schema for `users/{uid}/privacy` or `address` in either whitelist or rules.

## 1. P0 — Broken at Runtime

### 1.1 Create-Site throws `TypeError: GeocodingAPI.createSite is not a function`

- **UI caller:** `src/components/cloud/CreateSitePage.jsx:293` — `await GeocodingAPI.createSite(siteData)`
- **API surface:** `src/scripts/back_door.js:1550-1553` — `GeocodingAPI = { geocode, reverse }`. `createSite` does not exist here.
- **Correct client:** `SiteAPI.create` at `src/scripts/back_door.js:1122`, wired to `/site/create` (`functions/index.js:189`, handler `sites.createSite`).
- **User-visible impact:** The only site-creation path in Cloud is completely non-functional. Users see `"Failed to create site. Please try again."`.
- **Fix sketch:** Replace `GeocodingAPI.createSite(siteData)` with `SiteAPI.create(siteData)`. No backend change required.

### 1.2 Create-Listing returns 400 on every submit

- **UI caller:** `src/components/elements/marketplace/CreateListingPage.jsx:423-441` sends:
  ```
  { sellerId, creditType, quantity, unit, pricePerUnit, currency, siteId,
    title, description, verificationStandard, vintageYear, expirationDate,
    minimumPurchase, metadata, images }
  ```
- **Client wrapper:** `CreditsMarketplaceAPI.createListing` → `createCreditListing` at `src/scripts/back_door.js:1657-1676` — **only passes 5 fields** (`creditId, quantity, pricePerUnit, minPurchase, expiresInDays`). The other 10 UI fields are silently dropped before the request leaves the browser.
- **Backend:** `functions/marketplace.js:13-17` requires `creditId, quantity, pricePerUnit`. Returns `400 Missing required fields: creditId, quantity, pricePerUnit` because the UI has no notion of a pre-existing `creditId` and never sends one.
- **User-visible impact:** 100% failure rate on marketplace listing creation. Data entry is wasted.
- **Fix sketch:** Two-sided repair. Either (a) extend `functions/marketplace.js:12-80` to accept the richer payload and derive/create a credit record server-side, or (b) add a "select credit" step to the UI and slim the payload. **Recommend (a)** — the UI form matches how sellers actually think about listings (site + type + quantity + vintage), not pre-registered credit IDs.

### 1.3 Profile "Save" silently drops 6 of 9 fields

- **Backend whitelist:** `functions/auth.js:125-127`
  ```js
  const allowedProfileFields = ["displayName", "phone", "company", "bio", "role"];
  const allowedSettingsFields = ["timezone", "units"];
  const allowedTopLevel     = ["onboardingCompleted", "onboardingCompletedAt"];
  ```
- **UI submissions (all silently dropped):**
  | Field | UI file:line | Why dropped |
  |---|---|---|
  | `username` | `src/components/elements/setting-tabs/ProfileSettings.jsx:139-142` | Not in whitelist |
  | `privacy.profileVisibility` | `src/components/elements/setting-tabs/PrivacySettings.jsx:69-76` | Not in whitelist |
  | `privacy.activityStatus` | `PrivacySettings.jsx:69-76` | Not in whitelist |
  | `privacy.transactionPrivacy` | `PrivacySettings.jsx:69-76` | Not in whitelist |
  | `privacy.dataUploadPrivacy` | `PrivacySettings.jsx:69-76` | Not in whitelist |
  | `notifications.*` | (visible in `NotificationSettings` UI) | Not in whitelist — see §5.3 |
  | `address.*`, `email` | Profile forms | Not in whitelist |

- **Response:** Backend returns `{success: true}` after writing only the whitelisted subset. UI pops a success toast.
- **User-visible impact:** User edits their privacy toggles, clicks Save, sees success, reloads, and all toggles reset. Identical for username, notifications, address.
- **Fix sketch:** Treat this as two defects, not one. (1) Backend should reject unknown fields with `400 Unknown fields: […]` instead of silently accepting. (2) Extend whitelist + matching rule validators (see §4.5) to cover `privacy`, `notifications`, `address`, and `username` — the fields the UI already exposes.

### 1.4 Onboarding flag stored under two different casings

Three writers disagree on the field name:

| Writer | File : line | Field name |
|---|---|---|
| Auth `onCreate` trigger | `functions/auth.js:27` | `onboardingComplete: false` |
| Dedicated onboarding endpoint | `functions/auth.js:279` | `"profile/onboardingComplete": true` |
| `updateUserProfile` whitelist | `functions/auth.js:127` | `onboardingCompleted`, `onboardingCompletedAt` |
| RTDB validator | `database.rules.json:20` | `onboardingComplete` (only) |

- **User-visible impact:** If the frontend completes onboarding via `updateUserProfile` (the generic profile update), it writes `onboardingCompleted` — which *is* accepted by rules (undeclared fields pass the `hasChildren(['email','role'])` .validate), but then every reader in the app looks for `onboardingComplete` (no "d"). The flag is effectively unwritable through the profile endpoint, and the onboarding gate never closes.
- **Fix sketch:** Pick `onboardingComplete` (matches the trigger, the completion endpoint, and the rules). Remove `onboardingCompleted` from the whitelist. Replace with `onboardingComplete` + drop the `onboardingCompletedAt` shadow (use `updatedAt` or store it alongside `onboardingComplete` only via the dedicated endpoint).

## 2. P1 — Stubs That Pretend to Work

### 2.1 "Place Order" is a toast
- **File:** `src/platforms/wqt/pages/MarketplacePage.jsx:583-585`
- `handlePlaceOrder = () => toast({ type: 'info', message: 'Order placement coming soon.' })`
- **Backend:** `/marketplace/purchase` endpoint **already exists** at `functions/index.js:221` (`marketplace.purchaseCredits`). The stub is pure UI — no backend gap.

### 2.2 Profile image upload never leaves the browser
- **File:** `src/components/elements/setting-tabs/ProfileSettings.jsx:94-103`
- Reads file to a DataURL, calls `setImagePreview(url)`, never uploads. Refresh reverts to default Neptune icon.

### 2.3 Account actions are empty handlers
- **File:** `src/components/elements/setting-tabs/AccountSettings.jsx:75-91`
- 2FA toggle, deactivate account, delete account — all `onClick` handlers are placeholders with `// Logic to …` comments.

### 2.4 Data management tab is entirely stubbed
- **File:** `src/components/elements/setting-tabs/DataSettings.jsx:14-26`
- Backup, export, delete-data buttons have no backend calls.

### 2.5 Seller cannot edit or cancel their own listing
- Backend endpoints `app.post("/marketplace/listing/update", …)` and `/marketplace/listing/cancel` exist (`functions/index.js:218-219`). There is no UI in the seller dashboard that calls them. Listings are effectively write-once.

## 3. P1 — Missing Capability (Backend Ready, UI Absent)

| Endpoint | `functions/index.js` | Backend handler | Gap |
|---|---|---|---|
| `/device/thresholds/update` | 210 | `readings.updateAlertThresholds` | No alert-threshold editor in any Cloud page |
| `/alerts/acknowledge` | 207 | `readings.acknowledgeAlert` | No alert-management UI |
| `/alerts/resolve` | 208 | `readings.resolveAlert` | ″ |
| `/alerts/reopen` | 209 | `readings.reopenAlert` | ″ |
| `/marketplace/listing/update` | 218 | `marketplace.updateListing` | No edit UI (see §2.5) |
| `/marketplace/listing/cancel` | 219 | `marketplace.cancelListing` | No cancel UI (see §2.5) |
| `/credits/create` | 225 | `marketplace.createCredit` | No manual-credit UI (accrual-only today) |

The backend is ~70% ahead of the UI on CRUD surface. Most P1 capability gaps are **"wire it up"** tasks, not design-from-scratch tasks.

## 4. P1 — Persistence & Architecture

### 4.1 `AppContext.updateUser` is local-only
- **File:** `src/context/AppContext.jsx:120-139`
- Implementation: either re-fetches from backend via `UserProfileAPI.get(uid)` *or* accepts a pre-built user object, then calls `localStorage.setItem('bluesignal_user', …)` and `setUser(userdata)`. **It never pushes changes to the server.**
- Every component that calls `ACTIONS.updateUser(uid, {displayName: 'New Name'})` believing it persists is wrong — the new name lives only in React state + `localStorage` until the session ends.

### 4.2 No Firebase offline persistence
- **File:** `src/apis/firebase.js:42-46`
- `getDatabase(app)` is called with no `enableIndexedDbPersistence`, no `onDisconnect`, no `.info/connected` listener surfaced to the UI.
- Result: a network blip mid-write silently loses data; the app can't distinguish "offline" from "server error"; no retry-on-reconnect.

### 4.3 No axios retry / backoff / error classification
- **File:** `src/scripts/back_door.js` (all `authPost` paths)
- The only interceptor logic is 401 → logout. 5xx, timeouts, and `ERR_NETWORK` bubble up as generic `"Failed to …"` error strings. Users see the same message for "server is down" and "you typed an invalid email."

### 4.4 Cloud mode still routes through `cloudMockAPI.js`
- **File:** `src/services/cloudMockAPI.js:1-14` — carries the TODO banner:
  > `TODO(P2, Added 2026-04-05, Updated 2026-04-12): Replace all mock APIs below with real backend API calls …`
- This matches CLAUDE.md's own Open Items list: *"Cloud Storage archival + RTDB deletion before 50+ devices"* is one downstream symptom. Mock data serving a production-facing Cloud mode is a correctness and data-provenance risk.

### 4.5 Security rules and backend whitelist are out of sync
- **File:** `database.rules.json:11-42`
- Rules have `.validate` entries for: `email, displayName, phone, company, role, createdAt, updatedAt, onboardingComplete`, plus settings sub-structure.
- Whitelist allows `bio` — rules have no validator for it (permissive default).
- Whitelist allows `onboardingCompleted`/`onboardingCompletedAt` — rules have no validator and the canonical field is `onboardingComplete` (see §1.4).
- Whitelist does **not** allow `notifications.*`, yet rules validate that sub-tree — read-only by UI, write-blocked by API.
- Neither layer has schema for `privacy`, `address`, or `username`.

## 5. P2 — Structural Gaps

### 5.1 Orphaned `/order/create` frontend API
- **File:** `src/scripts/back_door.js:1135-1142` — `createOrder → POST /order/create`
- **Backend:** no `/order/create` route exists in `functions/index.js` (only `/marketplace/purchase`). Two parallel "order" mental models in the code base.

### 5.2 `notifications.*` settings are read-only in practice
- Rules validate the shape (`database.rules.json:24-28`), but profile update whitelist excludes notifications (`functions/auth.js:126`). Any UI toggle for email/SMS/push is a ghost.

### 5.3 No pagination on list endpoints
- `SiteAPI.list`, `SiteAPI.listByCustomer`, `CreditsMarketplaceAPI.searchListings`, `readings.getDeviceReadings` all return unbounded lists. OK at current scale, will not hold past ~500 rows anywhere.

### 5.4 No `privacy` / `address` schema anywhere
- Neither `database.rules.json` nor `functions/auth.js` have any concept of the fields the UI asks users to fill in (`PrivacySettings.jsx:69-76`). The UI is ahead of the data contract.

## 6. Remediation Roadmap (phased)

### Phase A — Fix-as-you-go P0s (hours)
1. `CreateSitePage.jsx:293` — swap `GeocodingAPI.createSite` → `SiteAPI.create`. Confirm navigation uses `result.siteId` field the server actually returns.
2. Reshape listing create: extend `functions/marketplace.js:createListing` to accept `{sellerId, creditType, quantity, unit, pricePerUnit, currency, siteId, title, description, verificationStandard, vintageYear, expirationDate, minimumPurchase, metadata, images}`. Derive/create a credit record server-side from site + quantity + vintage. Update `createCreditListing` in `back_door.js:1657-1676` to pass the full object through.
3. Extend profile whitelist in `functions/auth.js:125-127` to include `username, privacy, notifications, address, email`. Update backend to return `400` on unknown fields rather than silently dropping.
4. Collapse onboarding-flag casing: standardize on `onboardingComplete` in `functions/auth.js:127`. Remove `onboardingCompleted` from the whitelist.

### Phase B — Real persistence layer
1. Rewrite `AppContext.updateUser` (`src/context/AppContext.jsx:120-139`) to call `UserProfileAPI.update`, wait for server success, then update local state. Surface failures via `logNotification('error', …)`.
2. Enable `enableIndexedDbPersistence` on Firestore; wire `.info/connected` on RTDB to a context-level `isOnline` flag. Use `onDisconnect` on per-user activity nodes where appropriate.
3. Add an axios interceptor in `back_door.js` (there's only one `authPost` helper — single-site fix) with: exponential backoff on 5xx/ERR_NETWORK (2s/4s/8s/16s caps at 4 attempts per CLAUDE.md's git-ops pattern), auth-token refresh on 401-with-refresh-token, and a classified error object `{kind: 'validation'|'auth'|'network'|'server', userMessage, originalError}`.
4. Tighten `database.rules.json` — add `.validate` entries for the new whitelist fields (`users/{uid}/profile/privacy`, `.../notifications`, `.../address`, `.../username`) with length limits and type checks.

### Phase C — Fill capability gaps
1. Remove the stub at `MarketplacePage.jsx:583-585`; wire `CreditsMarketplaceAPI.purchase` to the existing `/marketplace/purchase` endpoint.
2. Build alert-management UI (acknowledge, resolve, reopen) — endpoints exist at `/alerts/*`.
3. Build seller "Edit listing" and "Cancel listing" UI under seller dashboard — endpoints exist.
4. Build device-threshold editor — endpoint exists.
5. Implement profile image upload via Livepeer or Firebase Storage; wire back to `profile/photoURL`.

### Phase D — Retire mock routing in Cloud
Per CLAUDE.md open item. Replace `cloudMockAPI.js` readers with real backend aggregations of Pollution Gateway Pro data. Keep `src/services/demo/` as the sole demo surface.

### Phase E — Harden
1. Pagination on every list endpoint (cursor-based; `limitToLast` + `startAt`).
2. Remove orphaned `/order/create` client path (`back_door.js:1135-1142`) or route it to `/marketplace/purchase`.
3. `AccountSettings` stub handlers: 2FA via Firebase `multi-factor`, deactivate via `profile/status = 'deactivated'`, delete via full RTDB purge + Auth delete. Requires new endpoints.
4. `DataSettings` backup/export/delete: server-side `users/{uid}` export to JSON, rate-limited.

## 7. Critical Files Referenced

- `functions/auth.js:1-56` — `onUserCreate` trigger (writes `onboardingComplete`)
- `functions/auth.js:100-148` — `updateUserProfile` (whitelist + drops)
- `functions/auth.js:260-303` — `completeOnboarding` endpoint (writes `onboardingComplete`)
- `functions/marketplace.js:12-80` — `createListing` (payload shape)
- `functions/index.js:180-227` — route table
- `database.rules.json:1-80` — RTDB schema validators
- `src/scripts/back_door.js:1122, 1135-1142, 1550-1553, 1657-1676` — `SiteAPI`, `createOrder`, `GeocodingAPI`, `createCreditListing`
- `src/context/AppContext.jsx:120-139` — `updateUser` (local-only)
- `src/apis/firebase.js:42-46` — Firebase init (no persistence)
- `src/components/cloud/CreateSitePage.jsx:293` — broken API call
- `src/components/elements/marketplace/CreateListingPage.jsx:423-441` — payload mismatch
- `src/components/elements/setting-tabs/ProfileSettings.jsx:94-103, 139-142` — image stub + username drop
- `src/components/elements/setting-tabs/PrivacySettings.jsx:69-76` — privacy fields dropped
- `src/components/elements/setting-tabs/AccountSettings.jsx:75-91` — empty handlers
- `src/components/elements/setting-tabs/DataSettings.jsx:14-26` — empty handlers
- `src/platforms/wqt/pages/MarketplacePage.jsx:583-585` — order stub
- `src/services/cloudMockAPI.js:1-14` — mock TODO

## 8. Next Step

User decides which phases to ship in which order. Recommend Phase A + Phase B as a single PR — they together restore the "data persists" user expectation that triggered this audit. Phase C and onward are net-new feature work and should be tracked separately.
