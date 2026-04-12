# WaterQuality.Trading — Marketplace Hardening

## Context

**Repo:** `/home/user/Marketplace` (BlueSignal-XYZ/Marketplace on GitHub)
**Stack:** React 18, JavaScript/TypeScript, Styled Components, Firebase Hosting, Vite
**Backend:** Firebase Cloud Functions at `https://us-central1-app-neptunechain.cloudfunctions.net/app`
**Firebase Project:** `waterquality-trading`
**Live URLs:**
- Marketplace: https://waterquality.trading / https://waterquality-trading.web.app
- Cloud Dashboard: https://cloud.bluesignal.xyz / https://cloud-bluesignal.web.app

This is the Water Quality Trading marketplace front-end. The audience is utilities, regulators, engineers, and farmers — not retail crypto traders. The tone is professional, evidence-driven, and regulatory-aware.

**Current state:**
- Basic routing and pages exist with dual-mode architecture (Marketplace vs Cloud)
- Branding/colorway established with teal primary palette
- Auth is **WORKING** — Google Sign-In via Firebase popup flow is functional
- NutrientCalculator exists at `src/components/NutrientCalculator.jsx` (15KB)
- Marketplace browser exists at `src/components/elements/marketplace/MarketBrowser.jsx`
- Mock purchase flow started in `src/apis/purchasesApi.js`

---

## Design Tokens (Use These Exactly)

```ts
// Based on src/styles/colors.js and src/styles/global.js
export const colors = {
  // Primary teal palette
  primary: '#1D7072',        // primary500
  primaryLight: '#EFFBFB',   // primary50
  primaryDark: '#0F393A',    // primary700
  primaryHover: '#196061',   // primary600

  // Brand colors
  deepBlue: '#0A2E36',
  lightBlue: '#4FBDBA',
  accentBlue: '#88CDDA',

  // Logo colors
  logoPrimary: '#005A87',
  logoSecondary: '#003F5E',
  logoAccent: '#007BB5',

  // Neutral UI grays
  background: '#fafafa',     // ui50
  surface: '#f4f4f5',        // ui100
  border: '#e4e4e7',         // ui200
  borderHover: '#d4d4d8',    // ui300
  textMuted: '#a1a1aa',      // ui400
  textSecondary: '#71717a',  // ui500
  textPrimary: '#27272a',    // ui800
  textDark: '#18181b',       // ui900

  // Semantic colors
  success: '#64e986',        // rgb(100, 233, 134) from CSS vars
  warning: '#f59e0b',
  error: '#ef4444',          // red500
  errorLight: '#fef2f2',     // red50
  errorDark: '#b91c1c',      // red700

  white: '#FFFFFF',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '64px',
};

export const typography = {
  fontFamily: '"Satoshi", "Albert Sans", "Inter", sans-serif',
  h1: { size: '2rem', weight: 700, lineHeight: 1.3 },
  h2: { size: '1.5rem', weight: 600, lineHeight: 1.3 },
  h3: { size: '1.25rem', weight: 600, lineHeight: 1.3 },
  body: { size: '1rem', weight: 400, lineHeight: 1.6 },
};

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  laptop: '1024px',
  main: '1200px',
};

export const borderRadius = {
  default: '12px',
  small: '8px',
  large: '16px',
};

export const shadows = {
  light: 'rgba(17, 17, 26, 0.1) 0px 0px 16px',
  card: '0 4px 6px rgba(0, 0, 0, 0.1)',
  cardHover: '0 6px 8px rgba(0, 0, 0, 0.15)',
};

export const formHeightMd = '44px';
```

---

## Data Model Contracts

Define these interfaces. All components must use them.

```ts
// Based on src/interfaces/user.ts and src/apis/creditsApi.js

export type UserRole =
  | 'buyer'       // Purchases credits/offsets
  | 'seller'      // Lists and sells credits
  | 'installer'   // BlueSignal hardware tech
  | 'farmer'      // Farm operator (seller + installer)
  | 'admin'       // Platform administrator
  | 'operator';   // Facility operator

export interface User {
  uid: string;
  email: string;
  username?: string;
  role?: UserRole;
  displayName?: string;
  accountID?: string;
  createdAt?: string;
  budget?: number;
  purchaseHistory?: string[];
  listings?: string[];
  devices?: string[];
  sites?: string[];
  isVerified?: boolean;
}

export type CreditType = 'nitrogen' | 'phosphorus' | 'stormwater' | 'thermal' | 'sediment';
export type PollutantCode = 'N' | 'P' | 'TSS' | 'Temp';

export interface Program {
  id: string;
  name: string;
  watershed: string;
  state: string;
  location: string;
  creditTypes: CreditType[];
  pollutant: PollutantCode;
  status: 'active' | 'pending' | 'completed' | 'retired';
  totalUnits: number;
  availableUnits: number;
  pricePerUnit: number; // USD
  unit: string;
  vintageYear: number;
  verificationStatus: 'Verified' | 'Pending' | 'Provisional';
  verifier: string;
  description: string;
  methodology: string;
  sellerName: string;
  sellerType: 'Farmer' | 'Utility' | 'Aggregator' | 'Industrial';
  tags: string[];
  createdAt: Date;
}

export interface CreditOffering {
  id: string;
  programId: string;
  creditType: CreditType;
  quantity: number;
  pricePerUnit: number;
  vintage: number;
}

export interface Commitment {
  id: string;
  userId: string;
  creditId: string;
  offeringId: string;
  requestedQuantity: number;
  totalPrice: number;
  buyerNote?: string;
  status: 'received' | 'in_review' | 'confirmed' | 'cancelled';
  createdAt: string;
}

// Based on src/data/mockRegistryData.ts
export interface RegistryCredit {
  id: string;
  type: CreditType;
  quantity: number;
  unit: string;
  projectName: string;
  projectId: string;
  issueDate: string;
  retirementDate?: string;
  status: 'active' | 'retired';
  verificationId: string;
  location: string;
  verifier: string;
}

// Based on src/data/mockMapData.ts
export interface MapProject {
  id: string;
  name: string;
  lat: number;
  lng: number;
  creditTypes: CreditType[];
  totalCredits: number;
  status: 'active' | 'pending' | 'completed';
  description: string;
  owner: string;
}
```

---

## Existing File Map

```
src/
├── components/
│   ├── navigation/                    # Mode-specific headers/menus
│   │   ├── CloudHeader.jsx
│   │   ├── CloudMenu.jsx
│   │   ├── MarketplaceHeader.jsx
│   │   └── MarketplaceMenu.jsx
│   │
│   ├── elements/marketplace/          # Marketplace-specific components
│   │   ├── MarketBrowser.jsx          # Main marketplace listing browser
│   │   ├── ListingPage.jsx            # Listing detail view
│   │   ├── NFTCard.jsx                # Credit/listing card component
│   │   ├── SellerDashboard.jsx        # Seller management view
│   │   ├── UserProfile.jsx            # User profile display
│   │   ├── RequestQuoteModal.jsx      # Quote request modal
│   │   └── EventsPopup.jsx            # Event notifications
│   │
│   ├── NutrientCalculator.jsx         # Main calculator (15KB)
│   │
│   ├── payment/                       # Checkout flow components
│   │   ├── CheckoutForm.jsx
│   │   ├── CustomerInfoForm.jsx
│   │   ├── OrderConfirmation.jsx
│   │   └── ProductDisplay.jsx
│   │
│   ├── shared/                        # Reusable UI library
│   │   ├── Button/Button.jsx
│   │   ├── Input/Input.jsx
│   │   ├── Select/Select.tsx
│   │   ├── Badge/Badge.jsx
│   │   ├── Spinner/Spinner.jsx
│   │   ├── FilterPills/FilterPills.jsx
│   │   ├── ResponsiveTable/ResponsiveTable.jsx
│   │   └── FormSection/FormSection.jsx
│   │
│   ├── dashboards/                    # Role-based dashboards
│   │   ├── BuyerDashboard.jsx
│   │   ├── SellerDashboard.jsx
│   │   └── InstallerDashboard.jsx
│   │
│   ├── routes/                        # Page-level route components
│   │   ├── Registry.jsx
│   │   ├── Map.jsx
│   │   ├── CertificatePage.jsx
│   │   └── RecentRemoval.jsx
│   │
│   └── popups/                        # Global modals
│       ├── NotificationPopup.jsx
│       ├── ConfirmationPopup.jsx
│       └── ResultPopup.jsx
│
├── routes/
│   ├── Welcome.jsx                    # Landing/auth page
│   ├── Home.jsx                       # Home route
│   ├── AuthTest.jsx                   # Auth debugging page
│   ├── marketplace/
│   │   ├── Marketplace.jsx            # Marketplace main page
│   │   ├── ListingDetail.jsx          # Listing detail page
│   │   └── account/
│   │       └── FinancialDashboard.jsx
│   └── components/welcome/
│       ├── GoogleSignIn.jsx           # Google sign-in button
│       ├── LoginForm.jsx              # Login form with Google OAuth
│       └── RegisterForm.jsx           # Registration form
│
├── context/
│   └── AppContext.jsx                 # Global state (user, UI, notifications)
│
├── apis/
│   ├── firebase.js                    # Firebase router (Cloud vs WQT)
│   ├── firebaseCloud.ts               # Cloud Firebase config
│   ├── firebaseWqt.ts                 # WQT Firebase config
│   ├── creditsApi.js                  # Credits mock API
│   └── purchasesApi.js                # Purchases mock API
│
├── scripts/
│   ├── back_door.js                   # Backend API client (UserAPI, AccountAPI, etc.)
│   ├── AuthGooglePopup.js             # Google OAuth popup handler
│   └── helpers.js                     # Utility functions
│
├── interfaces/
│   ├── user.ts                        # User & UserRole types
│   └── livepeer.interfaces.ts         # Media/asset types
│
├── data/
│   ├── mockRegistryData.ts            # Mock registry credits
│   └── mockMapData.ts                 # Mock map projects
│
├── styles/
│   ├── colors.js                      # Color palette & theme
│   ├── breakpoints.js                 # Responsive breakpoints
│   └── global.js                      # Global styles (Satoshi font)
│
├── utils/
│   ├── demoMode.ts                    # Demo mode utilities
│   └── roleRouting.js                 # Role-based route logic
│
└── App.jsx                            # Main app, mode detection, routing (19KB)
```

---

## Step 1 — Auth (ALREADY WORKING)

**Current Status:** ✅ Auth is fully functional

**Firebase config:**
- Project: `waterquality-trading`
- Auth domain: `waterquality-trading.firebaseapp.com`
- API Key: `AIzaSyAESUVCltG4kviQLIiiygIROJ7BKMMgvX8`

**Environment Variables (for production - use instead of hardcoded):**
```bash
VITE_WQT_FIREBASE_API_KEY=
VITE_WQT_FIREBASE_AUTH_DOMAIN=
VITE_WQT_FIREBASE_PROJECT_ID=
VITE_WQT_FIREBASE_STORAGE_BUCKET=
VITE_WQT_FIREBASE_MESSAGING_SENDER_ID=
VITE_WQT_FIREBASE_APP_ID=
VITE_WQT_FIREBASE_MEASUREMENT_ID=
```

**What exists:**
1. ✅ `src/routes/components/welcome/LoginForm.jsx` — Google popup sign-in
2. ✅ `src/context/AppContext.jsx` — `onAuthStateChanged` listener, user state
3. ✅ `src/App.jsx` — `CloudAuthGate` component and `{user?.uid && ...}` patterns
4. ✅ `src/utils/roleRouting.js` — Role-based routing logic

**Route protection status:**
- Public: `/`, `/marketplace`, `/programs/:id`, `/registry`, `/map`
- Protected (auth-gated): `/dashboard/*`, `/marketplace/seller-dashboard`, `/marketplace/tools/*`

**Test criteria:**
- [x] Can sign in with Google from landing page
- [x] Auth state persists on refresh (via sessionStorage)
- [x] Protected routes redirect to landing when logged out
- [x] Sign out clears state and redirects

---

## Step 2 — Marketplace Catalog

**Goal:** Browsable, filterable program listing.

**Route:** `/marketplace`

**Existing components:**
- `src/components/elements/marketplace/MarketBrowser.jsx` — listing browser
- `src/components/elements/marketplace/NFTCard.jsx` — card component
- `src/apis/creditsApi.js` — mock credit data (8+ entries with realistic data)

**UI requirements:**
- Grid of `ProgramCard` components (3-col desktop, 1-col mobile)
- Each card shows: name, watershed, credit types (as pills), price range, status badge, available units
- Filter bar: credit type (multi-select), status, region/state
- Sort dropdown: price (low-high), availability, newest

**Component structure:**
```
Marketplace.tsx
├── FilterBar.tsx (use src/components/shared/FilterPills/FilterPills.jsx)
├── SortDropdown.tsx (use src/components/shared/Select/Select.tsx)
└── ProgramCard.tsx (extend NFTCard.jsx)
```

**Data source:**
- `src/apis/creditsApi.js` already has 8+ mock credits
- Includes: nitrogen, phosphorus, stormwater, thermal types
- Includes: Farmer, Utility, Aggregator, Industrial seller types
- Shape matches `Program` interface

**Test criteria:**
- [ ] All programs render on load
- [ ] Filters reduce visible programs correctly
- [ ] Sort reorders programs
- [ ] Cards link to `/programs/:id`
- [ ] Works on mobile (single column, filters collapse to drawer)

---

## Step 3 — Program Detail + Commitment Flow

**Goal:** View program details and submit a commitment.

**Route:** `/programs/:id` or `/marketplace/listing/:id`

**Existing components:**
- `src/components/elements/marketplace/ListingPage.jsx` — listing detail
- `src/components/elements/marketplace/RequestQuoteModal.jsx` — quote request

**UI sections:**
1. **Header:** Program name, status badge, watershed/location
2. **Metrics row:** Available units, price/unit, vintage, verification status
3. **Description:** 2-3 paragraph program summary
4. **"How it works":** Expandable section explaining credit generation
5. **Commitment CTA:** "Reserve Credits" button (disabled if logged out)

**Commitment flow (modal or stepped inline):**
1. **Select quantity:** Input field, shows calculated total, validates against available
2. **Review terms:** Summary of selection, placeholder terms text, checkbox
3. **Confirm:** Submit button, shows success state, creates `Commitment` record

**Data handling:**
- `src/apis/purchasesApi.js` already has `requestQuote()` function
- On confirm: POST to mock endpoint, returns `{ id, status: 'received' }`
- Use `ACTIONS.logNotification()` for success/error toasts

**Test criteria:**
- [ ] Detail page loads program by ID
- [ ] CTA disabled when logged out, enabled when logged in
- [ ] Quantity validation prevents over-commitment
- [ ] Flow completes and shows confirmation
- [ ] Back navigation doesn't lose state mid-flow

---

## Step 4 — Calculators

**Goal:** Polished, demo-ready calculators with presets.

**Existing calculator:**
- `src/components/NutrientCalculator.jsx` (15KB) — includes Chart.js visualization

**For the calculator:**
1. Match visual style to marketplace (same cards, inputs, spacing from `src/styles/colors.js`)
2. Add input validation (min/max, required fields, sensible defaults)
3. Add 2-3 preset buttons:
   - "Midwestern Row Crop Farm"
   - "Municipal WWTP Comparison"
   - "Coastal Stormwater BMP"
4. Clear output display with units labeled
5. Optional: "Save scenario" for logged-in users

**Test criteria:**
- [ ] Presets populate all fields with valid values
- [ ] Invalid input shows inline error, doesn't crash
- [ ] Output updates on input change (or on calculate button)
- [ ] Mobile layout doesn't break

---

## Step 5 — Account / Portfolio

**Goal:** User can view their commitments and saved scenarios.

**Route:** `/account` or `/marketplace/account` (protected)

**Existing components:**
- `src/components/dashboards/BuyerDashboard.jsx`
- `src/routes/marketplace/account/FinancialDashboard.jsx`
- `src/components/elements/marketplace/UserProfile.jsx`

**UI sections:**
1. **Profile header:** Avatar, name, email, sign out button
2. **Commitments list:** Table or cards showing user's commitments
   - Columns: Program, Credit Type, Quantity, Total, Status, Date
   - Use `src/components/shared/ResponsiveTable/ResponsiveTable.jsx`
3. **Saved scenarios:** If implemented, list saved calculator scenarios

**Test criteria:**
- [ ] Shows only current user's data
- [ ] Empty state if no commitments
- [ ] Links to program detail from commitment row

---

## Step 6 — Responsiveness + Polish

**Breakpoints (from src/styles/breakpoints.js):**
- Mobile: < 480px
- Tablet: 768-1024px
- Desktop: > 1024px

**Media helpers available:**
```js
import { media } from 'src/styles/breakpoints';
// media.mobile, media.tabletDown, media.tabletUp, media.laptopUp
```

**Checklist:**
- [ ] Landing page responsive
- [ ] Marketplace grid collapses gracefully
- [ ] Program detail readable on mobile
- [ ] Calculator inputs don't overflow
- [ ] Navigation collapses to hamburger on mobile (exists in MarketplaceMenu)
- [ ] Modals/drawers work on mobile

**Polish:**
- [ ] All buttons have hover/active states
- [ ] Loading spinners on async operations (use `src/components/shared/Spinner/Spinner.jsx`)
- [ ] Error toasts/messages for failures (use `ACTIONS.logNotification()`)
- [ ] No console errors in production build
- [ ] Remove dead code and unused imports

---

## Step 7 — Testing Requirements

**Config files exist:**
- `vitest.config.ts` — Vitest configuration
- `src/test/setup.ts` — Test setup
- `src/test/mocks/` — Firebase and axios mocks

**Unit tests (Vitest + RTL):**
- [ ] Auth context provides correct state
- [ ] ProgramCard renders all fields
- [ ] FilterBar filtering logic
- [ ] Calculator validation logic

**Integration tests:**
- [ ] Marketplace loads and filters work end-to-end
- [ ] Commitment flow completes
- [ ] Auth flow (sign in → protected route access)

**Manual QA checklist:**
- [ ] Test on Chrome, Safari, Firefox
- [ ] Test on iOS Safari, Android Chrome
- [ ] Test auth with real Google account

---

## Deliverables

When complete, provide:

1. **File changelog:** List of files created/modified
2. **Route map:** Final routes with auth requirements
3. **Env var list:** All required environment variables
4. **Deploy commands:**
   ```bash
   # Build for marketplace
   npm run build:wqt

   # Deploy to Firebase
   npm run deploy:wqt

   # Or separately:
   firebase deploy --only hosting:waterquality-trading
   ```
5. **Remaining gaps:** What's still mocked, what needs backend work

---

## Backend API Reference

**Base URL:** `https://us-central1-app-neptunechain.cloudfunctions.net/app`

**Available endpoints (from src/scripts/back_door.js):**

```js
// User APIs
UserAPI.account.getUserFromUID(uid)
UserAPI.account.getUserFromUsername(username)
UserAPI.account.createUser(userdata)
UserAPI.account.updateUser(uid, updates)

// Account APIs (blockchain)
AccountAPI.account.create(userdata)
AccountAPI.account.register(accountID, role)
AccountAPI.account.verify(txAddress)

// Certificate APIs
CertificateAPI.certificates.get(id)
CertificateAPI.credits.issue(data)

// Transaction APIs
TransactionAPI.transactions.get(id)
```

**Mock APIs (for marketplace - need backend implementation):**
```js
// src/apis/creditsApi.js
getAllCredits()
getCreditById(id)

// src/apis/purchasesApi.js
requestQuote(creditId, quantity, note)
```

---

## Blockchain Configuration

**From configs.js:**
```js
{
  MODE: "test",  // "test" or "main"
  NETWORKS: {
    testnet: {
      token: "MATIC",
      chainId: "80002",           // Polygon Amoy
      explorer: "https://amoy.polygonscan.com",
      rpc: "https://polygon-amoy.g.alchemy.com/v2/[key]"
    },
    mainnet: {
      token: "MATIC",
      chainId: "137",             // Polygon mainnet
      explorer: "https://polygonscan.com"
    }
  }
}
```

---

## Notes

- Dual-mode architecture: Cloud and Marketplace share codebase, detected at runtime via hostname
- Build outputs to `dist-wqt/` for marketplace, `dist-cloud/` for cloud dashboard
- Demo mode utilities in `src/utils/demoMode.ts` for testing without real data
- Auth test page available at `/auth-test` for debugging
