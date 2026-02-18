# BlueSignal Marketplace

A React-based platform for environmental credit trading and IoT device monitoring. The application operates in **tri-mode architecture**, serving three products from a single codebase with a unified design system.

---

## Overview

| Mode | Domain | Purpose |
|------|--------|---------|
| **Marketplace (WQT)** | [waterquality.trading](https://waterquality.trading) | Nutrient credit marketplace — buy, sell, and verify environmental certificates |
| **Cloud** | [cloud.bluesignal.xyz](https://cloud.bluesignal.xyz) | IoT device monitoring dashboard for water quality sensors |
| **Landing** | [bluesignal.xyz](https://bluesignal.xyz) | Hardware product landing page (isolated entry point) |

Cloud and Marketplace share the same codebase (`src/main.jsx`) with runtime hostname detection. The Landing page is a completely separate entry point (`src/pages/landing/main.jsx`) with no shared dependencies.

---

## Key Features

### Marketplace Mode (waterquality.trading)
- **Credit Trading** — Browse, buy, and sell nutrient credits (nitrogen, phosphorus, stormwater, thermal)
- **Registry Explorer** — Public registry of verified environmental certificates
- **Interactive Map** — Geospatial visualization of credit-generating projects
- **Trading Programs** — Browse regulatory programs with credit calculator
- **Purchase Flow** — Multi-step checkout with card (Stripe) and crypto wallet payment
- **Portfolio** — Track holdings, transaction history, and environmental impact
- **Certificate Verification** — Blockchain-backed ERC-1155 certificate authenticity on Polygon

### Cloud Mode (cloud.bluesignal.xyz)
- **Fleet Dashboard** — Real-time overview of all deployed WQM-1 devices
- **Site Management** — Organize devices by installation sites with status tracking
- **Device Detail** — Per-device charts, metrics, firmware, and battery monitoring
- **Alert System** — Severity-based alerts (critical, warning, info) with filtering
- **Commissioning Wizard** — Step-by-step device installation and activation
- **Onboarding** — Role selection, profile setup, and review flow for new users
- **Live Stream & Media** — Livepeer integration for site video feeds (coming soon)

### Landing Mode (bluesignal.xyz)
- **Product Showcase** — WQM-1 hardware specs, sensor grid, architecture
- **Interactive 3D** — Three.js system scene visualization
- **Scroll Reveals** — IntersectionObserver-driven animations
- **Completely Isolated** — Own theme, global styles, typography; zero imports from main app

---

## Design System

Both Cloud and Marketplace share a unified design system built with Styled Components:

| Layer | Location | Purpose |
|-------|----------|---------|
| **Tokens** | `src/design-system/tokens/` | Spacing, radius, elevation, animation, fonts, breakpoints, z-index |
| **Themes** | `src/design-system/themes/` | WQT theme (financial, data-dense) and Cloud theme (Apple-clean, spacious) |
| **Primitives** | `src/design-system/primitives/` | Table, Modal, Badge, Button, SearchBar, FilterChips, Tabs, EmptyState, Skeleton, DataCard, ComingSoon, etc. |

### Typography
- **Sans**: Inter (300–800) — all UI text
- **Mono**: JetBrains Mono (400–700) — data values, prices, IDs, coordinates
- Loaded via Google Fonts in `index.html` and `cloud.html`

### Breakpoints
| Token | Width | Target |
|-------|-------|--------|
| `sm` | 640px | Mobile → Tablet |
| `md` | 768px | Tablet |
| `lg` | 1024px | Tablet → Desktop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### Responsive Layout Rules
- **Mobile** (`< 640px`): 16px side padding, full-width, single-column grids
- **Tablet** (`640px–1023px`): 24px sides, 2-column grids
- **Desktop** (`1024px+`): 32–48px sides, 1200px max-width centered, 3–4 column grids
- Tables: horizontally scrollable with sticky first column on mobile
- Filter chips: horizontal scroll on mobile
- Modals: full-screen takeover on mobile, centered card on desktop
- Navigation: full-screen overlay on mobile, slide-out panel on tablet+
- Touch targets: minimum 44px × 44px

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18 + Vite |
| **Routing** | React Router v6 |
| **State** | React Context API (AppContext) |
| **Styling** | Styled Components + Design System tokens |
| **Auth & DB** | Firebase Authentication + Realtime Database |
| **Hosting** | Firebase Hosting (multi-site) + Cloudflare CDN |
| **Backend API** | Cloud Functions (Node.js) |
| **Blockchain** | Polygon (Amoy testnet / mainnet) via ethers.js |
| **Media** | Livepeer |
| **Charts** | Chart.js + react-chartjs-2 |
| **Maps** | Google Maps API, Mapbox GL |
| **Payments** | Stripe |

---

## Prerequisites

- **Node.js** v20 or higher
- **Git** (authenticated to repository)
- **Firebase CLI** (`npm install -g firebase-tools`)

---

## Getting Started

### Installation

```bash
git clone https://github.com/BlueSignal-XYZ/Marketplace.git
cd Marketplace
npm install
```

### Development

```bash
# Start development server (localhost:3000)
npm run dev

# Test different modes locally:
# Marketplace: http://localhost:3000
# Cloud:       http://localhost:3000?app=cloud

# Landing page (separate entry point):
BUILD_TARGET=landing npm run dev
```

### Building

```bash
# Build all sites
npm run build

# Build individual sites
npm run build:wqt      # Marketplace (waterquality.trading)
npm run build:cloud    # Cloud (cloud.bluesignal.xyz)
npm run build:landing  # Landing (bluesignal.xyz)
```

Each build outputs to a separate directory:
- `dist-wqt/` — Marketplace build
- `dist-cloud/` — Cloud build
- `dist-landing/` — Landing build

### Deployment

```bash
# Deploy all sites to Firebase
firebase deploy

# Deploy individual sites
npm run deploy:wqt
npm run deploy:cloud
npm run deploy:landing

# Full deployment (Firebase + Cloudflare)
npm run deploy:all
```

---

## Architecture

### Mode Detection (`src/utils/modeDetection.js`)

Cloud and Marketplace modes are detected at runtime based on hostname:

```
┌──────────────────────────────────────────────────────────┐
│ Cloud Mode:                                              │
│   • cloud.bluesignal.xyz                                 │
│   • cloud-bluesignal.web.app                             │
│   • ?app=cloud (dev/testing)                             │
├──────────────────────────────────────────────────────────┤
│ Marketplace Mode (default):                              │
│   • waterquality.trading                                 │
│   • waterquality-trading.web.app                         │
│   • localhost                                            │
└──────────────────────────────────────────────────────────┘
```

The Landing page uses its own entry point (`landing.html` → `src/pages/landing/main.jsx`) and does not go through mode detection.

### Directory Structure

```
src/
├── apis/                       # Firebase config
├── assets/                     # Images, logos
├── components/
│   ├── cloud/                  # Cloud-specific (Sites, Devices, Alerts, Onboarding, etc.)
│   ├── dashboards/             # Role-based dashboards (Buyer, Seller, Installer)
│   ├── elements/               # Feature modules (livepeer, marketplace, contractUI)
│   ├── navigation/             # CloudHeader, CloudMenu, MarketplaceHeader, MarketplaceMenu
│   ├── shared/                 # Reusable UI (Footer, NotificationBell, etc.)
│   └── seo/                    # SEOHead, JSON-LD schemas
├── context/                    # AppContext (global state)
├── data/                       # Static/mock data
├── design-system/
│   ├── tokens/                 # shared.ts, wqt.ts, cloud.ts
│   ├── themes/                 # wqtTheme.ts, cloudTheme.ts
│   └── primitives/             # Table, Modal, Badge, Button, SearchBar, etc.
├── hooks/                      # Custom hooks (useUserDevices, useFirstTime, etc.)
├── pages/landing/              # Landing page (isolated entry point)
├── platforms/
│   ├── wqt/                    # WQT theme provider, shell, pages, landing sections
│   └── cloud/                  # Cloud theme provider, shell, pages
├── routes/                     # Top-level route components
├── scripts/                    # Backend API integration (back_door.js)
├── services/                   # v2 API client, data services
├── shared/
│   ├── components/             # AuthGate, AuthModal, ErrorBoundary
│   ├── hooks/                  # useApiQueries, useToast
│   └── providers/              # ToastProvider, QueryProvider
├── utils/                      # modeDetection, roleRouting
└── wqt/                        # v2 WQT pages (Registry, RecentRemovals, Map, Presale)
```

### State Management

Global state via `AppContext` (`src/context/AppContext.jsx`):

```javascript
const { STATES, ACTIONS } = useAppContext();
const { user, isMobile, isLoading, authLoading } = STATES;

ACTIONS.logNotification("success", "Operation complete");
ACTIONS.logConfirmation("Are you sure?", () => doAction());
```

### Backend API Integration

API clients in `src/scripts/back_door.js`:

| API | Purpose |
|-----|---------|
| `UserAPI` | User account CRUD |
| `AccountAPI` | Blockchain account management |
| `CertificateAPI` | Certificate/credit workflows |
| `TransactionAPI` | On-chain transaction management |

v2 API client in `src/services/v2/client.ts` for marketplace, devices, alerts, and portfolio endpoints.

---

## Route Structure

### Marketplace Routes (WQT)

| Route | Auth | Description |
|-------|------|-------------|
| `/` | No | Landing page (unauthenticated visitors) |
| `/marketplace` | No | Credit listings with search and filters |
| `/marketplace/listing/:id` | No | Listing detail with tabs |
| `/registry` | No | Public credit registry |
| `/map` | No | Interactive project map |
| `/recent-removals` | No | Recently retired credits |
| `/programs` | No | Trading programs browser |
| `/certificate/:id` | No | Certificate detail |
| `/purchase/:id` | Yes | Multi-step purchase flow |
| `/portfolio` | Yes | Holdings, history, impact |
| `/dashboard` | Yes | User dashboard |
| `/dashboard/seller` | Yes | Seller management |
| `/dashboard/buyer` | Yes | Buyer overview |

### Cloud Routes

| Route | Auth | Description |
|-------|------|-------------|
| `/` | No | Login / redirect to dashboard |
| `/dashboard/main` | Yes | Fleet overview with alerts |
| `/cloud/sites` | Yes | Site list with status filters |
| `/cloud/devices` | Yes | Device list with fleet summary |
| `/cloud/devices/:deviceId` | Yes | Device detail with charts |
| `/cloud/alerts` | Yes | Alert management with severity filters |
| `/cloud/commissioning/new` | Yes | Commissioning wizard |
| `/cloud/onboarding` | Yes | New user onboarding |
| `/cloud/tools/live` | Yes | Live stream (coming soon) |
| `/cloud/tools/upload-media` | Yes | Media upload (coming soon) |

---

## Environment Variables

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Livepeer (Media Streaming)
VITE_LIVEPEER_API_KEY=

# Mapbox (Project Map)
VITE_MAPBOX_TOKEN=

# Build Version (auto-generated if not set)
VITE_BUILD_VERSION=
```

---

## Firebase Hosting

Multi-site hosting with three targets:

| Target | Directory | Domain |
|--------|-----------|--------|
| `waterquality-trading` | `dist-wqt/` | waterquality.trading |
| `cloud-bluesignal` | `dist-cloud/` | cloud.bluesignal.xyz |
| `landing-bluesignal` | `dist-landing/` | bluesignal.xyz |

All sites use SPA rewrites (`** → /index.html`). Configuration in `firebase.json` and `.firebaserc`.

---

## Cloudflare Integration

Cloudflare provides CDN caching and edge optimization on top of Firebase Hosting. Deployment triggers automatically via deploy hooks or API after Firebase deployment succeeds.

---

## Contributing

1. Create a feature branch from `master`
2. Make changes following the design system tokens (no hardcoded colors or font sizes)
3. Build all three targets: `npm run build`
4. Submit a pull request

---

## License

Proprietary — BlueSignal LTD
