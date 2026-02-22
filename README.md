# BlueSignal Marketplace

A React-based platform for environmental nutrient credit trading, IoT water quality device monitoring, and hardware product sales. Serves three products from a single codebase with a unified design system.

---

## Architecture Overview

### Tri-Mode Hosting

| Mode | Domain | Purpose | Entry Point |
|------|--------|---------|-------------|
| **Marketplace (WQT)** | [waterquality.trading](https://waterquality.trading) | Nutrient credit marketplace — browse, buy, sell, and verify environmental certificates | `index.html` → `src/main.jsx` |
| **Cloud** | [cloud.bluesignal.xyz](https://cloud.bluesignal.xyz) | IoT device monitoring dashboard for WQM-1 water quality sensors | `cloud.html` → `src/main.jsx` |
| **Landing** | [bluesignal.xyz](https://bluesignal.xyz) | WQM-1 hardware product landing page | `landing.html` → `src/pages/landing/main.jsx` |

Cloud and Marketplace share `src/main.jsx` with runtime hostname detection (`src/utils/modeDetection.js`). The Landing page is a completely isolated entry point — no React Router, no Firebase Auth, no AppContext, no shared imports from the main app.

### Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18 + Vite 4 |
| **Language** | JavaScript/JSX + TypeScript (mixed, `allowJs: true`) |
| **Routing** | React Router v6 (Cloud/Marketplace); pathname-based router (Landing) |
| **State** | React Context API (`AppContext`) + React Query (`@tanstack/react-query`) |
| **Styling** | Styled Components 6 + design system tokens |
| **Auth & DB** | Firebase Authentication + Realtime Database |
| **Hosting** | Firebase Hosting (multi-site) + Cloudflare Pages CDN |
| **Backend** | Firebase Cloud Functions (Node.js 20, Express) |
| **Blockchain** | Polygon (Amoy testnet / mainnet) via ethers.js v6, Alchemy SDK |
| **Media** | Livepeer (video upload/streaming) |
| **Charts** | Chart.js + react-chartjs-2 |
| **Maps** | Google Maps API (`@react-google-maps/api`), Mapbox GL |
| **Payments** | Stripe (Elements + Payment Intents) |
| **CRM** | HubSpot (contacts, deals, device sync via Cloud Functions) |
| **3D** | Three.js (landing page system scene) |
| **Testing** | Vitest + React Testing Library + happy-dom |
| **Linting** | ESLint (react, react-hooks, react-refresh) |

### Folder Structure

```
├── configs.js                  # Server URL, blockchain network config
├── index.html                  # WQT entry point
├── cloud.html                  # Cloud entry point
├── landing.html                # Landing entry point
├── vite.config.ts              # Tri-mode build configuration
├── firebase.json               # Multi-site hosting, DB rules, functions
├── .firebaserc                 # Firebase project targets
├── database.rules.json         # Firebase Realtime Database security rules
├── firestore.rules             # Firestore security rules
├── functions/                  # Firebase Cloud Functions (backend)
│   ├── index.js                # Express app + DB triggers + scheduled functions
│   ├── hubspot.js              # HubSpot CRM integration
│   ├── auth.js                 # User profile endpoints
│   ├── qrcode.js               # Device QR code generation/validation
│   ├── commissioning.js        # Device commissioning workflow
│   ├── sites.js                # Site management + geocoding
│   ├── readings.js             # Sensor data ingestion + alerts
│   ├── marketplace.js          # Listings, purchases, credits
│   ├── virginia.js             # Virginia nutrient credit exchange
│   ├── creditGeneration.js     # Credit calculation from readings
│   ├── preorder.js             # Landing page pre-order capture
│   ├── v2/                     # v2 API modules (market, search, devices, etc.)
│   └── scheduled/              # Cron jobs (health checks, calibration, retention)
├── firmware/                   # WQM-1 device firmware (Python, Raspberry Pi)
├── scripts/                    # Build/deploy helper scripts
├── public/                     # Static assets, favicons, SEO files
├── docs/                       # Audit reports, triage notes
└── src/
    ├── apis/                   # Firebase initialization
    ├── assets/                 # Images, Lottie animations
    ├── components/
    │   ├── cloud/              # Cloud console pages (21 components)
    │   ├── dashboards/         # Role-based dashboards (Buyer, Seller, Installer)
    │   ├── elements/           # Feature modules (livepeer, marketplace, contractUI)
    │   ├── navigation/         # CloudHeader, CloudMenu, MarketplaceHeader, MarketplaceMenu
    │   ├── payment/            # Stripe payment integration
    │   ├── shared/             # Reusable UI (Footer, Badge, Card, Skeleton, etc.)
    │   ├── seo/                # SEOHead, JSON-LD schemas
    │   ├── installer/          # Commission workflow, device activation
    │   ├── BlueSignalConfigurator/ # Legacy sales/configurator (backward compat)
    │   └── popups/             # Global modals (Notification, Confirmation, ResultPopup)
    ├── context/                # AppContext (global state via React Context)
    ├── design-system/
    │   ├── tokens/             # shared.ts, wqt.ts, cloud.ts (spacing, colors, etc.)
    │   ├── themes/             # wqtTheme.ts, cloudTheme.ts
    │   └── primitives/         # Table, Modal, Badge, Button, SearchBar, FilterChips,
    │                           # Tabs, Input, Pagination, Toast, Skeleton, DataCard,
    │                           # ComingSoon, EmptyState, Chart, Avatar, SegmentedControl
    ├── hooks/                  # useUserDevices, useAuth, useCommission, useFetchNPCCreditEvents
    ├── pages/landing/          # Landing page (isolated subtree)
    │   ├── main.jsx            # Entry point (no React Router)
    │   ├── LandingPage.jsx     # Root component
    │   ├── sections/           # Hero, SensorGrid, Architecture, UseCases, Specs, CTA
    │   ├── components/         # Nav, Footer, SystemScene (Three.js), RevealOnScroll
    │   ├── pages/              # Privacy, Terms, Warranty, Download, NotFound
    │   └── styles/             # theme.js, GlobalStyles.js, typography.js
    ├── platforms/
    │   ├── wqt/                # WQT theme provider, shell, router, landing sections
    │   │   ├── WQTApp.jsx      # WQT router (all marketplace routes)
    │   │   ├── layouts/        # WQTShell (header + footer wrapper)
    │   │   ├── landing/        # WQT landing page sections
    │   │   └── pages/          # ~18 page components
    │   └── cloud/              # Cloud theme provider, shell, router
    │       ├── CloudApp.jsx    # Cloud router (all cloud routes)
    │       ├── layouts/        # CloudShell (header + sidebar wrapper)
    │       └── pages/          # Dashboard, DeviceDetail, Commissioning, RevenueGrade
    ├── routes/                 # Top-level route components (Welcome, Home, NotFound)
    ├── scripts/                # Backend API integration (back_door.js)
    ├── services/
    │   ├── v2/                 # Typed v2 API client (client.ts), demo interceptor
    │   ├── programs/           # Trading program registry (ProgramService, VirginiaNceProgram)
    │   ├── virginia/           # Virginia credit calculator, project service
    │   ├── types/              # TypeScript interfaces (devices, credits, market, etc.)
    │   └── *.js                # Domain services (device, site, order, customer, cloud mock)
    ├── shared/
    │   ├── components/         # AuthGate, AuthModal, ErrorBoundary
    │   ├── hooks/              # useApiQueries, useToast
    │   └── providers/          # ToastProvider, QueryProvider
    ├── utils/                  # modeDetection, roleRouting, analytics
    ├── wqt/pages/              # v2 WQT pages (Registry, RecentRemovals, Map, Presale,
    │                           #   CreditPortfolio, TradingPrograms)
    ├── constants/              # Shared constants
    ├── contracts/              # Smart contract ABIs
    ├── interfaces/             # TypeScript interfaces (device, commercial)
    └── test/                   # Test setup, mocks (axios, firebase)
```

---

## Prerequisites

- **Node.js** v20+
- **npm** (included with Node.js)
- **Firebase CLI** — `npm install -g firebase-tools` (for deployment)
- **Git** (authenticated to the repository)

---

## Setup & Installation

### 1. Clone and install

```bash
git clone https://github.com/BlueSignal-XYZ/Marketplace.git
cd Marketplace
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with real values. See [Environment Variables](#environment-variables) below.

### 3. Run development server

```bash
# Marketplace mode (default) — http://localhost:3000
npm run dev

# Switch modes in browser:
#   Marketplace: http://localhost:3000
#   Cloud:       http://localhost:3000?app=cloud

# Landing page (separate entry point):
BUILD_TARGET=landing npm run dev
```

### 4. Install Cloud Functions dependencies (for backend work)

```bash
cd functions && npm install
```

---

## Environment Variables

All variables use the `VITE_` prefix (required by Vite). Copy `.env.example` to `.env.local` and fill in values.

### Firebase Configuration (required)

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain (e.g., `project.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase analytics measurement ID |
| `VITE_FIREBASE_DATABASE_URL` | Firebase Realtime Database URL |

### Third-Party API Keys

| Variable | Description |
|----------|-------------|
| `VITE_ALCHEMY_API_KEY` | Alchemy SDK key for Polygon RPC |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key |
| `VITE_LIVEPEER_API_KEY` | Livepeer API key for video streaming |
| `VITE_MAPBOX_TOKEN` | Mapbox GL access token for project/presale maps |

### App Configuration

| Variable | Description |
|----------|-------------|
| `VITE_SERVER_URL` | Backend Cloud Functions URL (defaults to production) |
| `VITE_BLOCKCHAIN_MODE` | `test` (Polygon Amoy) or `main` (Polygon mainnet) |
| `VITE_POLYGON_TESTNET_RPC` | Custom testnet RPC endpoint (optional) |
| `VITE_POLYGON_MAINNET_RPC` | Custom mainnet RPC endpoint (optional) |
| `VITE_GA4_MEASUREMENT_ID` | Google Analytics 4 measurement ID |

### Demo & Development

| Variable | Description |
|----------|-------------|
| `VITE_DEMO_MODE` | Enable demo mode globally (sample data) |
| `VITE_SHOW_DEMO_TOGGLE` | Show demo toggle in Cloud header |
| `VITE_USE_MOCK_API` | Force mock API usage |
| `VITE_USE_MOCK_DATA` | Control mock data in Cloud pages (default: `true`; set `false` for real APIs) |

### Build Metadata

| Variable | Description |
|----------|-------------|
| `VITE_BUILD_VERSION` | Build version tag (auto-generated if not set) |
| `VITE_DEBUG` | Enable debug logging |

### Cloudflare Deployment (local only)

| Variable | Description |
|----------|-------------|
| `CLOUDFLARE_DEPLOY_HOOK_WQT` | Deploy hook URL for waterquality-trading |
| `CLOUDFLARE_DEPLOY_HOOK_CLOUD` | Deploy hook URL for cloud-bluesignal |
| `CLOUDFLARE_DEPLOY_HOOK_LANDING` | Deploy hook URL for bluesignal.xyz |

---

## Available Scripts

### Development

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server on localhost:3000 |
| `npm run preview` | Preview production build locally |

### Building

| Script | Description |
|--------|-------------|
| `npm run build` | Build all three sites (WQT + Cloud + Landing) |
| `npm run build:wqt` | Build Marketplace → `dist-wqt/` |
| `npm run build:cloud` | Build Cloud → `dist-cloud/` |
| `npm run build:landing` | Build Landing → `dist-landing/` |

Each build sets `BUILD_TARGET`, runs Vite with `--max-old-space-size=8192`, copies SEO files (robots.txt, sitemap.xml), and renames the HTML entry to `index.html`.

### Deployment

| Script | Description |
|--------|-------------|
| `npm run deploy:wqt` | Build + deploy Marketplace to Firebase |
| `npm run deploy:cloud` | Build + deploy Cloud to Firebase |
| `npm run deploy:landing` | Build + deploy Landing to Firebase |
| `npm run deploy:all` | Build all, deploy to Firebase, trigger Cloudflare |
| `npm run deploy:full:wqt` | Deploy WQT to Firebase then trigger Cloudflare |
| `npm run deploy:full:cloud` | Deploy Cloud to Firebase then trigger Cloudflare |
| `npm run deploy:full:landing` | Deploy Landing to Firebase then trigger Cloudflare |

### Cloudflare

| Script | Description |
|--------|-------------|
| `npm run cloudflare:trigger` | Trigger all Cloudflare builds via deploy hooks |
| `npm run cloudflare:trigger:wqt` | Trigger WQT Cloudflare build only |
| `npm run cloudflare:trigger:cloud` | Trigger Cloud Cloudflare build only |
| `npm run cloudflare:trigger:landing` | Trigger Landing Cloudflare build only |

### Testing

| Script | Description |
|--------|-------------|
| `npm test` | Run Vitest in watch mode |
| `npm run test:ui` | Run Vitest with UI |
| `npm run test:coverage` | Run tests with v8 coverage report |
| `npm run test:ci` | Run tests once (CI mode, verbose) |

### Data

| Script | Description |
|--------|-------------|
| `npm run seed` | Seed mock/demo data (`scripts/seed-data.js`) |
| `npm run seed:clear` | Clear seeded data |

### Cloud Functions

Run from the `functions/` directory:

| Script | Description |
|--------|-------------|
| `npm run serve` | Start Firebase Functions emulator |
| `npm run deploy` | Deploy all Cloud Functions |
| `npm run logs` | Stream Cloud Functions logs |
| `npm run lint` | Lint Cloud Functions code |

---

## Key Features / Modules

### Marketplace Mode (waterquality.trading)

- **Credit Marketplace** — Browse, search, and filter nutrient credit listings (nitrogen, phosphorus, stormwater, thermal) with type/price/vintage filters.
- **Listing Detail** — Per-listing view with tabbed info, seller data, and purchase CTA.
- **Purchase Flow** — Multi-step checkout supporting Stripe card payments and crypto wallet payment.
- **Registry Explorer** — Public registry of verified environmental certificates with search.
- **Interactive Map** — Geospatial visualization of credit-generating projects (Mapbox GL) and environmental sensor data (Google Maps).
- **Trading Programs** — Browse regulatory trading programs (e.g., Virginia NCE) with detail pages and credit calculators.
- **Certificate Verification** — Blockchain-backed ERC-1155 certificate detail pages on Polygon.
- **Portfolio & Dashboard** — Authenticated users track holdings, transaction history, environmental impact, and financial data.
- **Seller Tools** — Seller onboarding, create listings, manage dashboard, verification UI.
- **Buyer Dashboard** — Buyer-specific overview of purchases and credits.
- **Credit Portfolio** — Manage owned credits with listing/retirement actions.
- **Presale** — Pre-purchase page for upcoming credit offerings.
- **Audience Pages** — For Utilities, For Homeowners, For Aggregators, For Credit Generators, How It Works.
- **Virginia NCE** — Virginia Chesapeake Bay Watershed nutrient credit exchange with basin data, project management, and credit calculation.

### Cloud Mode (cloud.bluesignal.xyz)

- **Fleet Dashboard** — Real-time overview of all deployed WQM-1 devices with status summary, alerts, and map.
- **Site Management** — Create, edit, and view installation sites with device assignments, geocoding, and boundary maps.
- **Device List** — Searchable/filterable device inventory with status indicators.
- **Device Detail** — Per-device charts, sensor metrics (pH, TDS, turbidity, ORP, temperature), firmware info, battery monitoring, relay control, and alert thresholds.
- **Revenue Grade** — Wizard to enable revenue-grade monitoring on devices (baseline, calibration, HUC lookup, WQT account linking).
- **Alert System** — Severity-based alerts (critical, warning, info) with filtering, acknowledge, and resolve actions.
- **Commissioning Wizard** — Full step-by-step device installation workflow (device check, connection test, calibration, site assignment, activation).
- **Onboarding** — New user onboarding wizard (role selection, profile setup, device addition).
- **Device Onboarding** — Add new devices via serial number or QR scan with naming, GPS, and site assignment.
- **Profile** — User profile management with role and notification preferences.
- **Installer Dashboard** — Job tracking and device management for field installers.
- **Cloud Tools** — Nutrient calculator, certificate verification.

### Landing Mode (bluesignal.xyz)

- **Product Showcase** — WQM-1 hardware specs, sensor capabilities, architecture overview.
- **Interactive 3D** — Three.js system scene visualization of the device.
- **Sensor Grid** — Visual display of all sensor types and their specifications.
- **Use Cases** — Application scenarios for the WQM-1 device.
- **Scroll Reveals** — IntersectionObserver-driven animations throughout.
- **Contact Form** — Lead capture form that writes to Firestore.
- **Legal Pages** — Privacy policy, terms of service, warranty.
- **Download Page** — Firmware download instructions and SSH setup guide.
- **Completely Isolated** — Own theme, global styles, typography; zero imports from main app.

### Backend (Cloud Functions)

- **v1 API** — Express app at `/app` with endpoints for user profiles, QR codes, device registration, commissioning, sites, geocoding, sensor readings, alerts, marketplace listings/purchases, credits, Stripe payments, Virginia NCE, trading programs, enrollments, notifications.
- **v2 API** — Typed endpoints under `/v2/` for market stats/search, data/sensors, credits/purchase/portfolio, blockchain/mint/certificates, programs, devices (metrics, alerts, claim, commission, commands, revenue-grade, calibrations), sites, account linking, credit projects/accruals.
- **HubSpot CRM** — Contact, deal, and device sync; webhook handlers; batch sync.
- **Database Triggers** — Auto-sync customers, orders, commissions, and device activations to HubSpot.
- **Scheduled Functions** — Device health checks, calibration expiry, baseline completion, credit accrual, data retention cleanup.
- **Sensor Ingestion** — `ingestReading` HTTP endpoint + `onReadingCreated` trigger for alerting.
- **Pre-order Capture** — Landing page form submission handler.

### Firmware (WQM-1 Device)

- **Python firmware** for Raspberry Pi Zero 2W with WQM-1 HAT.
- **Sensors** — pH (BNC + OPA340), TDS (AC excitation), Turbidity (IR 850nm), ORP (BNC), Temperature (DS18B20), GPS (MAX-M10S).
- **LoRaWAN** — SX1262 radio with CayenneLPP encoding.
- **Relay control**, LED status, calibration scripts, factory reset.
- **systemd services** — WQM main loop, BLE, health monitor, LED.
- **Image builder** — Scripts for flashable SD card image.

---

## Route Structure

### Marketplace Routes (WQT)

| Route | Auth | Component |
|-------|------|-----------|
| `/` | No | `WQTLandingPage` (redirects authenticated users to dashboard) |
| `/login` | No | `Welcome` |
| `/marketplace` | No | `MarketplacePage` |
| `/marketplace/listing/:id` | No | `ListingDetailPage` |
| `/registry` | No | `RegistryPage` |
| `/map` | No | `MapPage` |
| `/data` | No | `EnvironmentalMapPage` |
| `/data/watersheds` | No | `WatershedDashboardPage` |
| `/recent-removals` | No | `RecentRemovalsPage` |
| `/certificate/:id` | No | `CertificateDetailPage` |
| `/programs` | No | `ProgramsPage` |
| `/programs/:programId` | No | `TradingProgramDetailPage` |
| `/presale` | No | `PresalePage` |
| `/for-utilities` | No | `ForUtilitiesPage` |
| `/for-homeowners` | No | `ForHomeownersPage` |
| `/for-aggregators` | No | `ForAggregatorsPage` |
| `/how-it-works` | No | `HowItWorksPage` |
| `/generate-credits` | No | `ForCreditGeneratorsPage` |
| `/contact` | No | `ContactPage` |
| `/terms` | No | `TermsPage` |
| `/privacy` | No | `PrivacyPage` |
| `/dashboard` | Yes | `WQTDashboardPage` |
| `/dashboard/buyer` | Yes | `BuyerDashboard` |
| `/dashboard/seller` | Yes | `SellerDashboard` |
| `/dashboard/financial` | Yes | `FinancialDashboard` |
| `/portfolio` | Yes | `PortfolioPage` |
| `/credits` | Yes | `CreditPortfolioPage` |
| `/purchase/:id` | Yes | `PurchaseFlowPage` |
| `/seller/onboarding` | Yes | `SellerOnboardingPage` |
| `/marketplace/create-listing` | Yes | `CreateListingPage` |
| `/marketplace/transactions` | Yes | `TransactionPage` |
| `/marketplace/tools/verification` | Yes | `VerificationUI` |

### Cloud Routes

| Route | Auth | Component |
|-------|------|-----------|
| `/` | No | `CloudLanding` (login or redirect to dashboard/onboarding) |
| `/dashboard/main` | Yes | `CloudDashboardPage` |
| `/dashboard/installer` | Yes | `InstallerDashboard` |
| `/dashboard/:dashID` | Yes | `Home` (legacy) |
| `/cloud/sites` | Yes | `SitesListPage` |
| `/cloud/sites/new` | Yes | `CreateSitePage` |
| `/cloud/sites/:siteId` | Yes | `SiteDetailPage` |
| `/cloud/devices` | Yes | `DevicesListPage` |
| `/cloud/devices/new` | Yes | `DeviceOnboardingWizard` |
| `/cloud/devices/add` | Yes | `AddDevicePage` |
| `/cloud/devices/:deviceId` | Yes | `DeviceDetailPage` |
| `/cloud/devices/:deviceId/revenue-grade/setup` | Yes | `RevenueGradeWizardPage` |
| `/cloud/commissioning` | Yes | `CommissioningPage` |
| `/cloud/commissioning/new` | Yes | `FullCommissioningWizard` |
| `/cloud/commissioning/:commissionId` | Yes | `CommissionWorkflow` |
| `/cloud/commissioning/:commissionId/complete` | Yes | `DeviceActivation` |
| `/cloud/alerts` | Yes | `AlertsPage` |
| `/cloud/alerts/:alertId` | Yes | `AlertDetailPage` |
| `/cloud/onboarding` | Yes | `OnboardingWizard` |
| `/cloud/profile` | Yes | `ProfilePage` |
| `/cloud/tools/nutrient-calculator` | Yes | `CloudNutrientCalculator` |
| `/cloud/tools/verification` | Yes | `CloudVerification` |
| `/cloud/tools/live` | Yes | `CloudLiveStream` |
| `/device/:deviceId` | Yes | `NewDeviceDetailPage` (v2) |
| `/commission` | Yes | `CommissioningWizardPage` (v2) |
| `/v2/dashboard` | Yes | `CloudDashboardPage` (v2 alias) |
| `/media/:playbackID` | Yes | `CloudMediaPlayer` |
| `/media/live/:liveID` | Yes | `CloudMediaPlayer` |

### Landing Routes (bluesignal.xyz)

Pathname-based router (no React Router):

| Route | Component |
|-------|-----------|
| `/` | `LandingPage` |
| `/privacy` | `PrivacyPage` |
| `/terms` | `TermsPage` |
| `/warranty` | `WarrantyPage` |
| `/download` | `DownloadPage` |
| `*` | `NotFoundPage` |

### Legacy Sales Routes (via `?app=landing` on Cloud/Marketplace builds)

| Route | Component |
|-------|-----------|
| `/` | `SalesPage` (BlueSignalConfigurator) |
| `/about` | `AboutPage` |
| `/faq` | `FAQPage` |
| `/contact` | `ContactPage` |
| `/developers`, `/docs` | `DeveloperDocsPage` |
| `/privacy`, `/terms`, `/warranty`, `/accessibility` | `LegalPage` |

---

## Backend API Endpoints

### v1 API (Express on Cloud Functions)

Base URL: `https://us-central1-waterquality-trading.cloudfunctions.net/app`

| Group | Endpoints |
|-------|-----------|
| **User Profiles** | `POST /user/profile/get`, `/update`, `/role/update`, `/onboarding/complete` |
| **QR Codes** | `POST /device/qr/generate`, `/generate-batch`, `/validate`, `/device/register` |
| **Commissioning** | `POST /commission/initiate`, `/update-step`, `/complete`, `/get`, `/list`, `/cancel`, `/run-tests` |
| **Sites** | `POST /site/create`, `/get`, `/update`, `/list`, `/delete`, `/add-device`, `/remove-device`, `/update-boundary` |
| **Geocoding** | `POST /geocode/address`, `/reverse` |
| **Readings & Alerts** | `POST /readings/get`, `/stats`, `/alerts/active`, `/acknowledge`, `/resolve`, `/device/thresholds/update` |
| **Marketplace** | `POST /marketplace/listing/create`, `/get`, `/update`, `/cancel`, `/listings/search`, `/purchase`, `/purchase/complete`, `/orders`, `/stats` |
| **Credits** | `POST /credits/create`, `/user`, `/calculate-from-readings` |
| **Pre-order** | `POST /preOrderCapture` |
| **Virginia NCE** | `GET /virginia/basins`; `POST /virginia/basin`, `/projects/*`, `/credits/*` |
| **Trading Programs** | `GET /trading-programs`, `/trading-programs/:id` |
| **Enrollments** | `POST /enrollments`; `GET /enrollments`, `/enrollments/:id` |
| **Notifications** | `GET /notifications`, `/notifications/unread-count`; `POST /notifications/:id/read`, `/:id/dismiss`, `/mark-all-read` |
| **HubSpot** | `POST /hubspot/contacts/*`, `/deals/*`, `/devices/*`, `/sync/*`, `/webhooks/*` |
| **Stripe** | `POST /stripe/config`, `/create/payment_intent`, `/get/price` |

### v2 API

All under `/v2/` prefix, typed client at `src/services/v2/client.ts`.

| Group | Endpoints |
|-------|-----------|
| **Market** | `GET /market/stats`, `/market/ticker`, `/market/listing/:id`; `POST /market/search` |
| **Data** | `GET /data/sensors/public`, `/data/watersheds` |
| **Credits** | `POST /credits/purchase`, `/credits/submit`; `GET /credits/portfolio` |
| **Blockchain** | `POST /blockchain/mint`; `GET /blockchain/certificate/:id` |
| **Wallet** | `POST /wallet/link` |
| **Programs** | `GET /programs`, `/programs/:id`; `POST /programs/:id/calculate` |
| **Devices** | `GET /devices`, `/devices/:id`, `/devices/:id/metrics`, `/devices/:id/alerts`, `/devices/:id/calibrations`, `/devices/:id/revenue-grade/status`; `POST /devices/check`, `/devices/test-connection`, `/devices/commission`, `/devices/claim`, `/devices/:id/command`, `/devices/:id/calibrations`, `/devices/:id/revenue-grade/enable`, `/devices/:id/revenue-grade/disable`; `PUT /devices/:id/revenue-grade` |
| **Sites** | `GET /sites`; `POST /sites`, `/sites/huc-lookup` |
| **Alerts** | `GET /alerts` |
| **Account** | `GET /account/link-status`; `POST /account/link-wqt`; `DELETE /account/link-wqt` |
| **Projects** | `POST /projects`, `/projects/:id/accruals/calculate`, `/projects/:id/submit-verification`; `GET /projects/:id`, `/projects/:id/accruals` |

### Database Triggers

| Trigger | Description |
|---------|-------------|
| `onUserCreate` | Firebase Auth user creation handler |
| `onUserDelete` | Firebase Auth user deletion handler |
| `ingestReading` | HTTP endpoint for IoT sensor data ingestion |
| `onReadingCreated` | DB trigger for alert generation on new readings |
| `deviceHealthCheck` | Scheduled device health monitoring |
| `onCustomerCreated` | Sync new customer to HubSpot |
| `onCustomerUpdated` | Sync customer updates to HubSpot |
| `onOrderCreated` | Sync new order to HubSpot as deal |
| `onOrderUpdated` | Sync order status changes to HubSpot |
| `onCommissionCompleted` | Sync completed commissions to HubSpot |
| `onDeviceActivated` | Sync activated devices to HubSpot |

### Scheduled Functions

| Function | Description |
|----------|-------------|
| `deviceHealthCheck` | Periodic device health and connectivity monitoring |
| `calibrationExpiry` | Check and alert on expiring probe calibrations |
| `baselineCompletion` | Monitor baseline data collection progress |
| `creditAccrual` | Calculate and accrue credits from sensor readings |
| `dataRetention` | Clean up old sensor data per retention policy |

---

## Design System

Cloud and Marketplace share a unified design system (`src/design-system/`):

| Layer | Location | Contents |
|-------|----------|---------|
| **Tokens** | `tokens/shared.ts` | Spacing scale, border radius, elevation shadows, animation durations, font families, breakpoints, z-index layers |
| **Tokens** | `tokens/wqt.ts` | WQT-specific colors (financial, data-dense palette) |
| **Tokens** | `tokens/cloud.ts` | Cloud-specific colors (Apple-clean, spacious palette) |
| **Themes** | `themes/wqtTheme.ts` | Full WQT theme object for Styled Components `ThemeProvider` |
| **Themes** | `themes/cloudTheme.ts` | Full Cloud theme object for Styled Components `ThemeProvider` |
| **Primitives** | `primitives/` | Avatar, Badge, Button, Chart, ComingSoon, DataCard, EmptyState, FilterChips, Input, Modal, Pagination, SearchBar, SegmentedControl, Skeleton, Table, Tabs, Toast |

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

---

## State Management

### AppContext (`src/context/AppContext.jsx`)

Global state for Cloud/Marketplace via `useAppContext()`:

**States**: `user`, `authLoading`, `isLoading`, `isMobile`, `sidebarOpen`, `searchResults`, `routePath`, `notificationBarOpen`, `settingsMenuOpen`, `verificationUIOpen`, `verificationData`, `calculatorOpen`, `settingsTab`, `confirmation`, `notification`, `txPopupVisible`, `result`, `showSubItems`.

**Actions**: `updateUser`, `setUser`, `logout`, `handleLogOut`, `logNotification`, `clearNotification`, `logConfirmation`, `cancelConfirmation`, `setIsLoading`, `handleSidebar`, `handleNotificationsBar`, `handleVerificationUI`, `handleSettingsMenu`, `handleSettingsTab`, `toggleCalculator`, `setResult`, `setTxPopupVisible`, `toggleEnvironmentSubItems`.

User data is persisted in `sessionStorage` and hydrated on app load via Firebase `onAuthStateChanged` + `UserAPI.account.getUserFromUID()`.

### React Query

Both platforms wrap routes in `QueryProvider` (`@tanstack/react-query`) for server state caching.

---

## Deployment

### Firebase Hosting (Multi-Site)

Three hosting targets defined in `firebase.json` and `.firebaserc`:

| Target | Build Directory | Domain |
|--------|----------------|--------|
| `waterquality-trading` | `dist-wqt/` | waterquality.trading |
| `cloud-bluesignal` | `dist-cloud/` | cloud.bluesignal.xyz |
| `landing-bluesignal` | `dist-landing/` | bluesignal.xyz |

All sites use SPA rewrites (`** → /index.html`), security headers (X-Frame-Options, CSP for landing, HSTS), and immutable caching for JS/CSS/images.

### Cloud Functions

Deployed to Firebase Cloud Functions (Node.js 20). The `app` function is the main Express server. Six core functions deploy automatically via CI; HubSpot-dependent triggers require manual deployment with Secret Manager IAM permissions.

### Cloudflare Pages

Cloudflare provides CDN caching and edge optimization on top of Firebase Hosting. Triggered automatically after Firebase deployment via deploy hooks or API.

### CI/CD (GitHub Actions)

On merge to `master` (`.github/workflows/firebase-hosting-merge.yml`):

1. Install dependencies (`npm ci --force`)
2. Type check (`npx tsc --noEmit`)
3. Run tests (`npm run test:ci`)
4. Build all three sites with env vars from GitHub Secrets
5. Deploy Cloud Functions (core 6 functions, with retry logic)
6. Deploy all Firebase Hosting targets
7. Trigger Cloudflare builds for all three sites (with exponential backoff retries)

Pull requests get preview deployments via `.github/workflows/firebase-hosting-pull-request.yml`.

### Required GitHub Secrets

**Firebase**: `FIREBASE_SERVICE_ACCOUNT_WATERQUALITY_TRADING`, `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID`, `VITE_FIREBASE_DATABASE_URL`.

**Third-party**: `VITE_ALCHEMY_API_KEY`, `VITE_GOOGLE_MAPS_API_KEY`, `VITE_LIVEPEER_API_KEY`.

**Cloudflare**: `CLOUDFLARE_DEPLOY_HOOK_WQT`, `CLOUDFLARE_DEPLOY_HOOK_CLOUD`, `CLOUDFLARE_DEPLOY_HOOK_LANDING`.

---

## Testing

Tests use **Vitest** with **React Testing Library** and **jsdom**. Configuration in `vitest.config.ts`.

```bash
npm test              # Watch mode
npm run test:ci       # Single run (CI)
npm run test:coverage # Coverage report (v8)
```

Coverage thresholds: 30% lines, functions, branches, statements.

Existing test files:
- `src/App.test.jsx`
- `src/apis/firebase.test.js`
- `src/context/AppContext.test.jsx`
- `src/components/payment/Payment.test.jsx`

Test mocks in `src/test/mocks/` for axios and Firebase.

---

## Known Gaps / TODOs

### Limited Test Coverage

Only 4 test files exist. Coverage thresholds are set at 30% — most components, services, and hooks have no tests.

### Mock Data Dependencies

Cloud console pages default to mock data (`VITE_USE_MOCK_DATA` defaults to `true`). `src/services/cloudMockAPI.js` has a top-level TODO to replace all mock APIs with real backend calls. The demo interceptor (`src/services/v2/demoInterceptor.js`) stubs revenue grade, calibrations, device commands, HUC lookup, account linking, and credit projects.

### Incomplete API Wiring

- `InstallerDashboard.jsx` — has TODO comments to replace mock API calls with real ones, and navigate-to-job/add-device stubs.
- `AlertsPage.jsx` and `AlertDetailPage.jsx` — TODO comments to replace mock API calls for alert acknowledge/resolve/reopen.
- `MetricsAPI.getMetric()` — returns hardcoded `"10"` (stub).

### Coming Soon Features

- **Live Streaming** — `CloudToolsWrapper.jsx` marks live streaming as "coming soon".
- **Media Upload** — Upload photos/documentation marked as "coming soon"; route redirects to verification.

### Cloud Functions Deployment Gap

HubSpot-dependent triggers (`onCustomerCreated`, `onCustomerUpdated`, `onOrderCreated`, `onOrderUpdated`, `onCommissionCompleted`, `onDeviceActivated`) and the `hubspotWebhook`/`ttnWebhook` functions require `roles/secretmanager.admin` IAM permission and must be deployed manually, not through CI.

### Marketplace Mock Mode

The `MarketplaceAPI` in `back_door.js` uses a mock mode flag. When enabled (default), all marketplace API calls return empty stubs instead of calling the backend.

### Legacy Code

The `BlueSignalConfigurator` component tree (`src/components/BlueSignalConfigurator/`) is a legacy sales/configurator page kept for backward compatibility when accessed via `?app=landing`. The production landing page uses the isolated `src/pages/landing/` entry point.

---

## Contributing

1. Create a feature branch from `master`
2. Follow the design system tokens (no hardcoded colors, spacing, or font sizes)
3. Add tests for new features
4. Build all three targets: `npm run build`
5. Submit a pull request

---

## License

Proprietary — BlueSignal LTD
