# BlueSignal Platform Overhaul — Cursor Agent Prompt

**Drop this file at the root of the `marketplace` repo as `OVERHAUL_PROMPT.md`. Reference it in every Cursor session.**

---

## YOU ARE

A senior full-stack engineer executing a comprehensive overhaul of the BlueSignal platform. You are working alone in Cursor with access to the full monorepo. You build frontend and backend in sequence — types first, then API, then UI. You do not break production. You do not skip steps.

Read `CLAUDE.md` for existing architecture context. Read this file for what you're building toward.

---

## THE TWO PRODUCTS

### WaterQuality.Trading (WQT) — The Exchange
An independent environmental intelligence platform and nutrient credit exchange. Think Bloomberg Terminal meets Senken.io — but for water quality.

- **Audience:** Anyone. Corporates buying offsets, landowners selling credits, municipalities, developers, researchers.
- **Identity:** Professional financial platform. Data-dense. Tables over cards. Monospace numbers. Deep blue (`#0052CC`). WQT has its OWN landing page, its own nav, its own brand weight.
- **Domain:** `waterquality.trading`
- **No auth required to:** Browse marketplace, view environmental data, explore registry, read sensor feeds, verify certificates.
- **Auth required to:** Buy credits, list credits, manage portfolio, connect wallet.

### BlueSignal Cloud — The Hardware Dashboard
A customer portal for BlueSignal BS-WQM-100 device owners. Clean, spacious, Apple-like.

- **Audience:** BlueSignal customers only. People who bought and deployed a sensor.
- **Identity:** Apple marketing aesthetic. Generous whitespace. Sensor data as beautiful typography. One CTA per screen.
- **Domain:** `cloud.bluesignal.xyz`
- **Auth required for:** Everything.

### The Relationship
WQT is the NYSE. BlueSignal is a listed company with its own investor portal (Cloud). The exchange exists independently of any single participant. BlueSignal happens to be the dominant, most trusted supplier — its credits are sensor-verified and carry a premium badge. But WQT accepts credits from any verified source (with 85-95% rejection rate for non-BlueSignal submissions — quality is the brand).

**Connection points:**
- Shared Firebase Auth (one login, both platforms)
- Credits generated in Cloud → appear in WQT portfolio as "Available to List"
- Device sensor data (if owner opts in to public sharing) → visible on WQT environmental data map
- Mode toggle in header: Cloud users see "WQT Exchange →", WQT users with devices see "BlueSignal Cloud →"
- Single codebase, two theme providers, hostname-based mode detection at runtime

---

## WHAT MUST SURVIVE (non-negotiable)

Before you touch anything, internalize this list. If you break any of these, you've failed:

- All existing Cloud Functions API endpoints (every route in `functions/index.js`)
- Firebase Auth integration
- Polygon blockchain certificate verification
- Virginia nutrient credit engine (basins, delivery factors, exchange ratios, uncertainty ratios) — this becomes one instance of a pluggable program interface, NOT deleted
- Device commissioning workflow logic
- Stripe payment integration
- Livepeer media streaming
- HubSpot CRM sync
- All existing route paths (SEO + bookmarks)
- All existing build targets (`dist-wqt/`, `dist-cloud/`, `dist-landing/`)
- `npm run build` must produce three clean dist folders at every phase

---

## DESIGN SYSTEM

Build this FIRST. Every component on both platforms imports from `src/design-system/`. No hardcoded colors, font sizes, or spacing anywhere else.

### Shared Tokens (both platforms inherit)
```typescript
// src/design-system/tokens/shared.ts

export const spacing = {
  unit: 8, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64, section: 96
} as const;

export const radius = { sm: 6, md: 12, lg: 16, full: 9999 } as const;

export const elevation = {
  card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  cardHover: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
  modal: '0 20px 60px rgba(0,0,0,0.15)',
  none: 'none',
} as const;

export const animation = {
  fast: '150ms ease-out',
  medium: '250ms ease-out',
  slow: '400ms ease-out',
  spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const fonts = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', monospace",
} as const;
```

### WQT Theme — Data-Dense, Financial, Authoritative
```typescript
// src/design-system/tokens/wqt.ts

export const wqtColors = {
  primary: '#0052CC',
  primaryLight: '#E6EEFA',
  surface: '#FFFFFF',
  background: '#F7F8FA',        // Cool gray — terminal feel
  backgroundDark: '#1B1F2A',    // For optional dark data panels
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E2E4E9',
  positive: '#10B981',          // Price up, verified, online
  negative: '#EF4444',          // Price down, rejected, offline
  warning: '#F59E0B',
  water: '#06B6D4',             // Environmental accent
  verified: '#8B5CF6',          // Blockchain-verified badge — purple
} as const;

export const wqtTypography = {
  display:   { size: 56, lineHeight: 64, tracking: -0.03, weight: 700 },
  h1:        { size: 40, lineHeight: 48, tracking: -0.02, weight: 700 },
  h2:        { size: 30, lineHeight: 38, tracking: -0.02, weight: 600 },
  h3:        { size: 22, lineHeight: 28, tracking: 0,     weight: 600 },
  body:      { size: 15, lineHeight: 24, tracking: 0,     weight: 400 },  // Tighter for density
  bodySmall: { size: 13, lineHeight: 20, tracking: 0,     weight: 400 },
  caption:   { size: 11, lineHeight: 16, tracking: 0.04,  weight: 600, transform: 'uppercase' },
  dataLarge: { size: 32, lineHeight: 40, tracking: -0.02, weight: 700, font: 'mono' },
  dataSmall: { size: 14, lineHeight: 20, tracking: 0,     weight: 500, font: 'mono' },
} as const;
```

### Cloud Theme — Clean, Spacious, Apple-Like
```typescript
// src/design-system/tokens/cloud.ts

export const cloudColors = {
  primary: '#0066FF',
  primaryLight: '#E8F0FE',
  surface: '#FFFFFF',
  background: '#FAFAFA',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  accent: '#06B6D4',
} as const;

export const cloudTypography = {
  display:   { size: 48, lineHeight: 56, tracking: -0.02, weight: 600 },
  h1:        { size: 36, lineHeight: 44, tracking: -0.02, weight: 600 },
  h2:        { size: 28, lineHeight: 36, tracking: -0.01, weight: 600 },
  h3:        { size: 22, lineHeight: 28, tracking: 0,     weight: 600 },
  body:      { size: 16, lineHeight: 24, tracking: 0,     weight: 400 },
  bodySmall: { size: 14, lineHeight: 20, tracking: 0,     weight: 400 },
  caption:   { size: 12, lineHeight: 16, tracking: 0.02,  weight: 500 },
} as const;
```

### Design System Primitives
Build these as the shared component library. Both platforms use them, themed by their respective providers.

```
src/design-system/primitives/
├── Button.tsx          # primary, secondary, ghost, destructive variants
├── Input.tsx           # text, search, number inputs
├── Badge.tsx           # status badges (verified, pending, rejected, online, offline)
├── Toast.tsx           # THE notification system — auto-dismiss, top-right, max 2 visible
├── Skeleton.tsx        # Content-shaped loading placeholders (replaces all Lottie loaders)
├── Table.tsx           # Sortable, filterable columns — CRITICAL for WQT
├── DataCard.tsx        # Large number + label + optional sparkline
├── Chart.tsx           # Time-series wrapper (Recharts or Lightweight Charts)
├── Modal.tsx           # Confirmation dialogs ONLY — destructive actions
├── Avatar.tsx          # User/organization avatars
├── EmptyState.tsx      # Illustration + message + single CTA
├── Tabs.tsx            # Clean tab switcher
├── SearchBar.tsx       # With filter dropdowns
└── index.ts            # Barrel export
```

### Component Rules
- Every primitive accepts theme via styled-components `ThemeProvider`. No hardcoded colors.
- No component exceeds 200 lines. Extract subcomponents.
- No FontAwesome. Use Lucide icons — curate ~40 icons and re-export from `design-system/icons/`.
- No Lottie animations. Use Skeleton components for loading states.
- No Bootstrap components. Replace with primitives.

---

## UX RULES — BOTH PLATFORMS

### Kill the Bloat
1. **No modals on page load.** Ever.
2. **First-time components self-destruct.** Build a `useFirstTime(featureKey)` hook that checks `user.dismissed[featureKey]` in Firebase. Show once, persist dismissal, never again.
3. **One notification system.** A single `Toast` component. Kill `NotificationPopup`, `ResultPopup`, `NotificationBar`. Keep ONE `ConfirmDialog` for destructive actions only (delete device, cancel listing, retire credits).
4. **Auth gates actions, not pages.** Public pages stay public. Gate clicks (Buy, List, Portfolio), not routes.
5. **Empty states replace wizards.** No onboarding modals. If a user has no devices, show the dashboard with a beautiful empty state and one CTA.
6. **DemoBanner dies.** Delete `src/components/DemoBanner.tsx`.

### Navigation
- **WQT:** `Logo | Dashboard | Marketplace | Data | Registry | [Portfolio ▾] | [Connect Wallet / Profile]`
  - If user has BlueSignal devices: subtle "Cloud →" link near profile
- **Cloud:** `Logo | Dashboard | Devices | Sites | Alerts | [Profile ▾]`
  - Always: "WQT Exchange →" link

### Responsive
- WQT: Desktop-first. Terminal users are on desktops. Marketplace and portfolio must work on mobile.
- Cloud: Mobile-first. Installers and device owners use phones in the field.

---

## WQT PAGES

### WQT Landing Page (waterquality.trading — unauthenticated)
Standalone marketing page. Sells the PLATFORM, not the hardware.

- **Hero:** "The Water Quality Exchange." Subtitle about verified credits, real sensors, transparent trading. CTAs: [Enter Platform] [Connect Wallet]. Background: subtle animated data viz (flowing numbers, map dots), NOT a river photo.
- **Market Snapshot Bar:** Live ticker-style — Total Credits Traded, Credits Retired, Active Sensors, Avg N Price, Avg P Price. Immediately signals "financial platform."
- **Three Pillars:** Monitor (environmental intelligence) → Trade (credit exchange) → Impact (verified outcomes)
- **Audience Sections:** For Buyers / For Sellers / For Developers (future API)
- **Trust Section:** Verification methodology, blockchain transparency, quality standards (85-95% rejection), "Powered by BlueSignal IoT" badge — subtle, not dominant.
- **Footer:** Platform links, API docs, legal, "BlueSignal Hardware →" link to bluesignal.xyz

### WQT Dashboard (/dashboard — auth required)
Personalized market overview. First thing a logged-in user sees.

- Market overview: N and P credit prices, 24h change, 7d sparklines, volume
- Watchlist: User-curated regions/types they track
- Portfolio summary: Holdings, value, P&L (if user has credits)
- Activity feed: Latest transactions, new listings, retirements (anonymized)
- Environmental index panel: Aggregated water quality by watershed, map option

### WQT Marketplace (/marketplace — public)
The exchange. Table-first layout. NOT a card grid.

- **Filter bar (persistent):** Region/Watershed, Nutrient Type (N/P/Combined), Price Range, Vintage, Verification Level (Sensor-Verified / Third-Party / Pending), Program, Sort
- **Listing table columns:** Credit ID (truncated hash) | Type (N/P badge) | Quantity (kg) | Price ($/credit) | Region | Verification Badge (🟢🔵⚪) | Vintage | Seller | [Buy]
- **Map toggle:** Switch between table and geospatial view
- Pagination. Not infinite scroll (terminal users expect page control).

### WQT Listing Detail (/marketplace/listing/:id — public)
- Header: type, quantity, price, verification badge, seller
- Location map pin
- Sensor data panel (if sensor-verified): device type, recent readings as data cards with sparklines, data coverage stat, "View Full History →"
- Certificate panel: on-chain hash, Polygonscan link, mint date, metadata
- Credit lineage: visual timeline (Generated → Verified → Listed → Purchased → Retired)
- Purchase section: price breakdown, [Buy with Card] (Stripe), [Buy with Wallet] (Polygon), quantity selector

### WQT Environmental Data (/data — public)
The terminal differentiator. This is what makes WQT more than a marketplace.

- **Map view (primary):** All public sensors, color-coded by water quality index. Click sensor → popup with readings. Click watershed → aggregated stats.
- **Watershed dashboard:** Select watershed → quality trends, nutrient loading, active credits, participating sensors, regulatory context
- **Sensor feeds (/data/sensors):** Table of all public feeds, sortable by location/quality/recency. Click through to time-series.
- **Indices (/data/indices — scaffold, build later):** Aggregated regional indices, trend analysis, comparison tools.

### WQT Registry (/registry — public)
Every credit ever minted, traded, or retired. Fully transparent.

- **Table:** Certificate ID | Type | Quantity | Status (Active/Retired) | Mint Date | Owner (address) | Program
- Search by hash, seller, region
- Click through to certificate detail

### WQT Certificate Detail (/certificate/:id — public)
Shareable verification page. Suitable for linking in reports, audits, press.

- Full certificate metadata
- On-chain verification (Polygonscan link, block number)
- Credit lineage timeline
- Linked sensor data (if applicable)
- QR code for sharing

### WQT Portfolio (/portfolio — auth required)
- **Holdings tab:** Credits owned, grouped by type/region, current market value
- **History tab:** All purchases and sales with timestamps, prices, tx links
- **Retirements tab:** Retired credits with reason, on-chain burn tx, downloadable impact report
- **Impact summary:** Total N removed (kg), Total P removed (kg), environmental equivalencies
- **Listings tab (sellers):** Active, drafts, sold, cancelled. Create new listing CTA.

### WQT Seller Onboarding (/sell — auth required)
For non-BlueSignal sellers. BlueSignal device owners bypass this — their credits auto-generate.

1. Organization profile (name, type, location)
2. Project description (what improvement, where, when, how)
3. Evidence upload (lab reports, monitoring data, verification letters, photos)
4. Review + explicit message: "Approval rate is approximately 5-15%. We maintain the highest quality standards."
5. Wait for admin approval → notification on approve/reject with reason
6. If approved → credits minted, listed in draft, seller sets price and activates

---

## CLOUD PAGES

### Cloud Dashboard (/dashboard — auth required)
- Device count, online/offline, total readings, active alerts, credits generated
- Device cards: name, location, status, last reading, battery
- Quick actions: Add device, view alerts, list credits on WQT
- **Empty state (no devices):** Beautiful illustration + "Deploy your first BS-WQM-100" + link to bluesignal.xyz. NO wizard. NO modal.

### Cloud Device Detail (/devices/:id)
- Header: device name, map pin, status badge, battery, firmware
- Readings: ONE chart at a time with tab switcher (pH | TDS | Turbidity | Temp). Zoomable. Clean.
- Alerts for this device
- Credits generated from this device. "List on WQT →" link.
- Settings: rename, thresholds, calibration, data sharing toggle ("Make public on WQT")

### Cloud Sites (/sites, /sites/:id)
- Group devices by installation site
- Site detail: map with device pins, aggregated readings, site alerts

### Cloud Commissioning (/commissioning — installer role)
- Full-screen step-by-step: Scan QR → Verify → Assign site → Run tests → Activate → Link customer
- Progress bar, one step per screen

### Cloud Profile (/profile)
- User info, connected wallet, linked WQT account
- "Go to WQT Exchange →" button

---

## DIRECTORY STRUCTURE

```
src/
├── design-system/
│   ├── tokens/
│   │   ├── shared.ts
│   │   ├── wqt.ts
│   │   └── cloud.ts
│   ├── themes/
│   │   ├── wqtTheme.ts
│   │   └── cloudTheme.ts
│   ├── primitives/            # Button, Input, Badge, Toast, Table, etc.
│   │   └── index.ts
│   ├── icons/                 # Curated Lucide re-exports
│   └── index.ts
│
├── platforms/
│   ├── wqt/
│   │   ├── WQTApp.tsx         # WQT theme provider + router
│   │   ├── layouts/           # WQTShell, WQTHeader, WQTFooter
│   │   ├── landing/           # WQT landing page sections
│   │   └── pages/             # All WQT pages listed above
│   └── cloud/
│       ├── CloudApp.tsx       # Cloud theme provider + router
│       ├── layouts/           # CloudShell, CloudHeader, CloudFooter
│       └── pages/             # All Cloud pages listed above
│
├── features/                  # Shared feature modules
│   ├── auth/                  # AuthProvider, LoginForm, WalletConnect, useAuth
│   ├── credits/               # CreditCard, CreditLineage, PurchaseFlow
│   ├── sensors/               # SensorChart, SensorDataCard
│   ├── programs/              # ProgramCard, virginiaProgram, ProgramService interface
│   └── verification/          # CertificateVerifier, BlockchainBadge
│
├── services/                  # API layer (replaces back_door.js)
│   ├── api.ts                 # Axios instance, auth interceptor
│   ├── authService.ts
│   ├── marketplaceService.ts
│   ├── creditService.ts
│   ├── deviceService.ts
│   ├── sensorService.ts
│   ├── programService.ts
│   ├── commissionService.ts
│   ├── blockchainService.ts
│   └── types/                 # TypeScript interfaces for all API contracts
│
├── shared/
│   ├── hooks/                 # useFirstTime, useMode, useToast, useWallet, useBreakpoint
│   ├── providers/             # ModeProvider, NotificationProvider, Web3Provider
│   └── utils/                 # modeDetection, formatters, constants
│
├── App.tsx                    # Mode detector → renders WQTApp or CloudApp (<100 lines)
└── main.tsx
```

---

## BACKEND — v2 ENDPOINTS

Add these to `functions/index.js` under a `/v2/` prefix. DO NOT modify any existing v1 endpoints.

```javascript
// Market Data
app.get("/v2/market/stats", ...);           // Global: prices, volumes, activity
app.get("/v2/market/ticker", ...);          // Real-time N and P prices
app.post("/v2/market/search", ...);         // Filtered listing search + pagination

// Credit Lifecycle
app.post("/v2/credits/submit", ...);        // Non-BS seller submits for review
app.post("/v2/credits/approve", ...);       // Admin approves (mints on-chain)
app.post("/v2/credits/reject", ...);        // Admin rejects with reason
app.post("/v2/credits/list", ...);          // Create marketplace listing
app.post("/v2/credits/purchase", ...);      // Buy (Stripe or wallet)
app.post("/v2/credits/retire", ...);        // Retire (on-chain burn)
app.get("/v2/credits/portfolio/:userId", ...); // User portfolio

// Environmental Data
app.get("/v2/data/sensors/public", ...);    // All public sensor feeds
app.get("/v2/data/sensors/:id/readings", ...); // Public sensor time-series
app.get("/v2/data/watersheds", ...);        // Aggregated watershed data
app.get("/v2/data/watersheds/:id", ...);    // Individual watershed

// Programs (replaces Virginia-only)
app.get("/v2/programs", ...);               // All trading programs
app.get("/v2/programs/:id", ...);           // Program detail
app.post("/v2/programs/:id/calculate", ...); // Calculate credits under program

// Blockchain
app.post("/v2/blockchain/mint", ...);       // Mint ERC-1155
app.get("/v2/blockchain/verify/:hash", ...); // Verify certificate
app.post("/v2/blockchain/retire", ...);     // Burn credit NFT
app.get("/v2/blockchain/certificate/:id", ...); // Certificate metadata

// Wallet
app.post("/v2/wallet/link", ...);           // Link wallet to user
app.post("/v2/wallet/verify", ...);         // Verify ownership (sign message)
app.get("/v2/wallet/balance/:address", ...); // Credit balance
```

### Programs Abstraction
Virginia becomes one instance of a `ProgramService` interface:
```typescript
interface ProgramService {
  getRegions(): Region[];
  calculateCredits(readings: Reading[], program: Program): CreditEstimate;
  generateCredits(deviceId: string, program: Program): Credit[];
  validateTransfer(creditId: string, from: Region, to: Region): TransferValidation;
}
```
Virginia implements this with its basin delivery factors and exchange ratios. Future programs (Chesapeake Bay, Gulf Coast, Great Lakes, international) implement the same interface.

### ERC-1155 Contract (Polygon Amoy)
Deploy `BlueSignalCredit.sol`:
- Each token ID = unique credit (nutrient type + region + vintage + device)
- Metadata URI → IPFS or Firebase-hosted JSON
- Functions: `mint`, `retire` (burn with reason), `uri`
- Owner-only minting (backend is sole minter)
- Events: `CreditMinted`, `CreditRetired`, `CreditTransferred`

---

## EXECUTION ORDER

Work sequentially. Each phase must pass `npm run build` before moving to the next.

### Phase 0: Foundation
1. Create `src/design-system/tokens/` (shared, wqt, cloud)
2. Create `src/design-system/themes/` (wqtTheme, cloudTheme)
3. Create `src/services/types/` — TypeScript interfaces for ALL v2 API contracts
4. Create `src/shared/hooks/useFirstTime.ts`, `useToast.ts`, `useMode.ts`
5. Verify: `npm run build` still produces three clean dist folders

### Phase 1: Design System Primitives
1. Build all primitives (Button, Input, Badge, Toast, Skeleton, Table, DataCard, Chart, Modal, EmptyState, Tabs, SearchBar)
2. Set up Lucide icon re-exports
3. Verify: primitives render correctly with both themes

### Phase 2: App Shell Refactor
1. Create `src/platforms/wqt/WQTApp.tsx` with WQT theme provider + router
2. Create `src/platforms/cloud/CloudApp.tsx` with Cloud theme provider + router
3. Refactor `src/App.tsx` to mode detector only (<100 lines)
4. Create WQTShell (header, footer, toast container) and CloudShell
5. Kill DemoBanner, kill quad-notification system, implement single Toast
6. Verify: both platforms render, all existing routes still work

### Phase 3: WQT Landing Page + Market Data API
1. Build WQT landing page (hero, market snapshot, pillars, audience tabs, trust)
2. Add `/v2/market/stats` and `/v2/market/ticker` endpoints to Cloud Functions
3. Wire landing page market snapshot to live data
4. Verify: waterquality.trading landing page is standalone and compelling

### Phase 4: WQT Marketplace + Search API
1. Build marketplace page (filter bar, listing table, map toggle)
2. Build listing detail page (sensor data, certificate, lineage, purchase)
3. Add `/v2/market/search` endpoint with filtering + pagination
4. Build certificate detail page
5. Wire everything to v2 API
6. Verify: public users can browse and drill into listings

### Phase 5: WQT Environmental Data
1. Build map view with public sensor feeds
2. Build watershed dashboard
3. Build sensor feeds table
4. Add `/v2/data/sensors/public`, `/v2/data/watersheds` endpoints
5. Scaffold `/data/indices` page (placeholder for future)

### Phase 6: Auth + Web3 + Purchase
1. Build unified auth flow (email + wallet connect via Web3Modal or RainbowKit)
2. Build purchase flow (Stripe + wallet)
3. Deploy ERC-1155 contract to Polygon Amoy
4. Add `/v2/credits/purchase`, `/v2/blockchain/mint`, `/v2/wallet/link` endpoints
5. Wire purchase flow end-to-end

### Phase 7: WQT Portfolio + Seller Tools
1. Build portfolio page (holdings, history, retirements, impact, listings)
2. Build seller onboarding flow (5-step, with quality messaging)
3. Add `/v2/credits/submit`, `/v2/credits/approve`, `/v2/credits/reject` endpoints
4. Build WQT dashboard (personalized market overview)

### Phase 8: Cloud Rebuild
1. Rebuild Cloud dashboard with new design system
2. Rebuild device detail (one chart at a time, tab switcher, clean)
3. Rebuild commissioning wizard (full-screen steps)
4. Build Cloud ↔ WQT data bridge (credits flow, sensor sharing toggle)
5. Verify: Cloud feels distinctly different from WQT — Apple clean vs terminal dense

### Phase 9: Programs Abstraction
1. Refactor Virginia module into ProgramService interface
2. Build programs browser on WQT
3. Add `/v2/programs/*` endpoints
4. Pipe credit calculation through program-specific rules

---

## FILES TO DELETE

Verify dependencies before deleting. Migrate any needed logic first.

```
DELETE:
- src/components/DemoBanner.tsx
- src/components/popups/NotificationPopup.jsx
- src/components/popups/ResultPopup.jsx  
- src/components/popups/ConfirmationPopup.jsx  (replace with design-system Modal)
- src/legacy/                                  
- *.bat files at root (npm scripts exist)
- sales.html, cloud.html at root (generated by build)

CONSOLIDATE:
- src/scripts/back_door.js (291K) → src/services/*.ts
- src/context/AppContext.jsx (24K) → src/features/auth/AuthProvider.tsx + src/shared/providers/*
- src/App.jsx (974 lines) → src/App.tsx (<100 lines) + src/platforms/*/
- src/services/cloudMockAPI.js (31K) → replace with real v2 calls, flag remaining mocks
```

---

## RULES — READ EVERY TIME

1. **TypeScript for all new files.** Existing .jsx only touched when you're modifying for another reason.
2. **No component exceeds 200 lines.** Extract.
3. **No hardcoded design values.** Everything from theme.
4. **No modals on page load.** Ever.
5. **WQT pages use WQT theme. Cloud pages use Cloud theme.** Never mix.
6. **`npm run build` must pass after every phase.** Three clean dist folders.
7. **Never modify v1 API endpoints.** All new backend work under `/v2/`.
8. **Every state-changing API endpoint validates input** (400 not 500) **and logs an audit trail.**
9. **Blockchain operations are async.** Mint, poll for confirmation, update status. Never block the UI on chain confirmation.
10. **Import data from `services/`.** Components never import Firebase SDK directly.

---

## REFERENCE PRODUCTS

| Product | What to Study |
|---------|---------------|
| **Senken.io** | Credit marketplace UX, project detail pages, buyer journey, verification badges |
| **Bloomberg Terminal** | Data density, table-first layouts, watchlists, market dashboards |
| **Apple.com** | Landing page editorial quality, typography, whitespace (for Cloud aesthetic) |
| **Polygonscan** | Certificate verification UX, transaction detail, on-chain proof |
| **Stripe Dashboard** | Financial dashboard patterns, transaction history, seller tools |

---

## SUCCESS CRITERIA

1. A visitor to waterquality.trading sees a professional, independent environmental exchange — not a hardware company's marketplace tab.
2. The marketplace feels like a terminal. Tables. Charts. Monospace numbers. Data density done right.
3. Cloud feels like Apple. Clean, spacious, one CTA per screen. Zero popup overwhelm.
4. A BlueSignal customer toggles between Cloud and WQT without re-authenticating. Credits flow. Sensor data bridges.
5. An investor sees Series A infrastructure, not a hackathon demo.
6. `npm run build` produces three clean dist folders with zero TypeScript errors.
