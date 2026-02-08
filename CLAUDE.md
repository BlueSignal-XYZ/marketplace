# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bluesignal Marketplace is a React SPA that operates in **tri-mode architecture**:
- **Marketplace** (waterquality.trading) - Nutrient credit marketplace
- **Cloud** (cloud.bluesignal.xyz) - Device monitoring dashboard
- **Landing** (bluesignal.xyz) - WQM-1 product landing page (isolated entry point)

The Cloud and Marketplace modes share the same codebase (`src/main.jsx`) with different routing based on hostname detection. The Landing page is a completely separate entry point (`src/pages/landing/main.jsx`) with no shared dependencies.

## Tech Stack

- **Frontend**: React 18 + Vite (SPA)
- **Routing**: React Router v6 (Cloud/Marketplace only; Landing uses anchor links)
- **State**: AppContext (React Context API) in `src/context/AppContext.jsx` (Cloud/Marketplace only)
- **Styling**: Styled Components
- **Auth & Database**: Firebase Authentication + Realtime Database (Cloud/Marketplace only)
- **Hosting**: Firebase Hosting (multi-site: waterquality-trading, cloud-bluesignal, landing-bluesignal)
- **Backend API**: Cloud Functions at `us-central1-app-neptunechain.cloudfunctions.net/app`
- **Blockchain**: Polygon (Amoy testnet / mainnet) via Alchemy, ethers.js
- **Media**: Livepeer for video upload/streaming
- **Charts**: Chart.js + react-chartjs-2
- **Maps**: @react-google-maps/api, mapbox-gl

## Development Commands

```bash
# Development server (localhost:3000)
npm run dev

# Build for production (all sites)
npm run build

# Build for specific sites
npm run build:wqt      # WaterQuality.Trading
npm run build:cloud    # BlueSignal Cloud
npm run build:landing  # BlueSignal Landing (bluesignal.xyz)

# Deploy to Firebase
firebase deploy

# Deploy specific sites
npm run deploy:wqt      # Build + deploy waterquality.trading
npm run deploy:cloud    # Build + deploy cloud.bluesignal.xyz
npm run deploy:landing  # Build + deploy bluesignal.xyz

# Deploy all sites (Firebase + Cloudflare)
npm run deploy:all      # Build all, deploy to Firebase, trigger Cloudflare

# Full deployment (Firebase + Cloudflare) per site
npm run deploy:full:wqt      # Deploy WQT to Firebase then trigger Cloudflare
npm run deploy:full:cloud    # Deploy Cloud to Firebase then trigger Cloudflare
npm run deploy:full:landing  # Deploy Landing to Firebase then trigger Cloudflare

# Trigger Cloudflare builds only (no Firebase deploy)
npm run cloudflare:trigger         # Trigger all sites
npm run cloudflare:trigger:wqt     # Trigger WQT only
npm run cloudflare:trigger:cloud   # Trigger Cloud only
npm run cloudflare:trigger:landing # Trigger Landing only

# Test landing mode locally
# Landing has its own entry point — run: BUILD_TARGET=landing npm run dev
```

## Architecture

### Mode Detection (`src/utils/modeDetection.js`)

The app detects mode based on hostname (used by Cloud/Marketplace builds only):
- **Landing mode**: `bluesignal.xyz`, `www.bluesignal.xyz`, `sales-bluesignal.web.app`, or `?app=landing`
- **Cloud mode**: `cloud.bluesignal.xyz`, `*.cloud.bluesignal.xyz`, `cloud-bluesignal.web.app`, or `?app=cloud`
- **Marketplace mode**: `waterquality.trading`, `*.waterquality.trading`, `waterquality-trading.web.app`, or default

Note: In production, the landing page uses its own entry point (`landing.html` → `src/pages/landing/main.jsx`) and does NOT go through `App.jsx` or mode detection. The detection exists only so Cloud/Marketplace builds correctly exclude landing hostnames.

### Landing Page Architecture (`src/pages/landing/`)

The landing page is a **completely isolated subtree** with:
- Its own `main.jsx` entry point (no React Router, no Firebase, no AppContext)
- Its own theme (`styles/theme.js`), global styles, and typography system
- Styled Components + CSS-only animations (IntersectionObserver for scroll reveals)
- Zero imports from `src/components/`, `src/context/`, `src/scripts/`, or `src/styles/`

### Routing Structure

Routes are split into `CloudRoutes` and `MarketplaceRoutes` in `src/App.jsx`:

**Cloud Routes** (auth-gated):
- `/dashboard/:dashID` - Dynamic dashboards
- `/dashboard/main` - Main cloud dashboard
- `/features/*` - Tools (calculator, verification, streaming, media)

**Marketplace Routes**:
- `/marketplace` - Public marketplace (no auth)
- `/marketplace/listing/:id` - Listing detail pages
- `/registry`, `/map`, `/recent-removals`, `/certificate/:id` - Public exploration
- `/marketplace/tools/*` - Auth-gated tools (calculator, live, upload, verification)
- `/marketplace/seller-dashboard` - Auth-gated seller account

Landing route (`/`) redirects authenticated users to `/marketplace` or `/dashboard/main` based on mode.

### Key Directories

- `src/pages/landing/` - Landing page (bluesignal.xyz) — isolated entry point
  - `main.jsx` - React entry point
  - `LandingPage.jsx` - Root component
  - `sections/` - HeroSection, SensorGrid, ArchitectureSection, UseCasesSection, InstallationBanner, SpecsSection, CTASection
  - `components/` - Nav, Footer, SystemScene, RevealOnScroll
  - `styles/` - theme.js, GlobalStyles.js, typography.js
- `src/routes/` - Top-level route components (Welcome, Home, NotFound, etc.)
- `src/components/` - Shared components, organized by domain:
  - `navigation/` - CloudHeader, MarketplaceHeader, CloudMenu, MarketplaceMenu
  - `cloud/` - Cloud-specific components (DashboardMain, etc.)
  - `elements/` - Feature modules (livepeer, contractUI, marketplace)
  - `popups/` - Global modals (Notification, Confirmation, ResultPopup)
  - `shared/` - Reusable UI components
  - `routes/` - Nested route components (Registry, Map, CertificatePage, etc.)
- `src/context/AppContext.jsx` - Global state (user, UI toggles, notifications)
- `src/scripts/back_door.js` - Backend API integration (UserAPI, AccountAPI, etc.)
- `src/apis/firebase.js` - Firebase config/initialization
- `configs.js` - Server URL, blockchain config (testnet/mainnet switching)

### State Management

AppContext provides centralized state via `useAppContext()` hook:
- `STATES`: user, isMobile, isLoading, sidebar/menu toggles, notifications
- `ACTIONS`: updateUser, logNotification, logConfirmation, handleLogOut, etc.

User data is persisted in `sessionStorage` and hydrated on app load via `UserAPI.account.getUserFromUID()`.

### Backend API Integration

`src/scripts/back_door.js` exports typed API clients:
- `UserAPI` - User database operations (get/create/update by UID or username)
- `AccountAPI` - Blockchain account operations (create, register, verify role)
- `CertificateAPI` - Certificate/credit workflows
- `TransactionAPI` - On-chain transaction management

All APIs use axios to call Cloud Functions at `configs.server_url`.

### Firebase Configuration

Multi-site hosting in `firebase.json`:
- `waterquality-trading` target → `dist-wqt/`
- `cloud-bluesignal` target → `dist-cloud/`
- `landing-bluesignal` target → `dist-landing/`

All sites use SPA rewrites (`** → /index.html`).

Vite config builds separate entry points (`index.html`, `cloud.html`, `landing.html`) per target. Each build outputs to its own dist directory.

### Cloudflare Integration

The deployment pipeline automatically triggers Cloudflare builds after Firebase deployment succeeds. This provides CDN caching and edge optimization on top of Firebase Hosting.

**Automatic (CI/CD)**: On merge to `master`, GitHub Actions deploys to Firebase then triggers Cloudflare builds in parallel for all three sites with retry logic (4 attempts, exponential backoff: 2s, 4s, 8s, 16s).

**Manual**: Use `scripts/cloudflare-deploy.sh` or npm scripts to trigger Cloudflare builds locally.

**Required GitHub Secrets (deploy hooks method)**:
- `CLOUDFLARE_DEPLOY_HOOK_WQT` - Deploy hook URL for waterquality-trading
- `CLOUDFLARE_DEPLOY_HOOK_CLOUD` - Deploy hook URL for cloud-bluesignal
- `CLOUDFLARE_DEPLOY_HOOK_LANDING` - Deploy hook URL for bluesignal.xyz

**Alternative (API method)** - Set `USE_CLOUDFLARE_API=true` in GitHub Variables:
- `CLOUDFLARE_ACCOUNT_ID` (secret) - Cloudflare account ID
- `CLOUDFLARE_API_TOKEN` (secret) - API token with Pages permissions
- `CLOUDFLARE_PROJECT_WQT` (variable) - Project name for WQT
- `CLOUDFLARE_PROJECT_CLOUD` (variable) - Project name for Cloud
- `CLOUDFLARE_PROJECT_LANDING` (variable) - Project name for Landing

**Local environment variables** (for npm scripts):
```bash
export CLOUDFLARE_DEPLOY_HOOK_WQT="https://api.cloudflare.com/..."
export CLOUDFLARE_DEPLOY_HOOK_CLOUD="https://api.cloudflare.com/..."
export CLOUDFLARE_DEPLOY_HOOK_LANDING="https://api.cloudflare.com/..."
```

### Blockchain Integration

Configured in `configs.js`:
- `blockchain.MODE` - "test" or "main"
- Testnet: Polygon Amoy (chainId 80002)
- Mainnet: Polygon (chainId 137)
- RPC via Alchemy

Contract interactions via ethers.js (v6), accessed through backend API or direct client calls.

## Important Patterns

### Protected Routes

Routes wrapped in conditional render based on `user?.uid`:
```jsx
{user?.uid && (
  <Route path="/protected" element={<Component />} />
)}
```

### Notifications & Confirmations

Use AppContext actions:
- `logNotification(type, message)` - Shows popup (type: "success", "error", etc.)
- `logConfirmation(message, action)` - Shows confirmation dialog, executes action on accept
- `cancelConfirmation(accepted)` - Dismisses confirmation

### Menu Toggle Pattern

Each mode has independent menu state (`cloudMenuOpen`, `marketMenuOpen`) in AppShell. Menus auto-close on route change via `useEffect` on `location.pathname`.

## Common Workflows

### Adding a New Route

1. Add route component to `src/routes/` or appropriate domain folder
2. Import in `src/App.jsx`
3. Add `<Route>` to CloudRoutes or MarketplaceRoutes
4. Add menu item to CloudMenu or MarketplaceMenu if needed
5. Determine if auth-gated (inside `user?.uid` conditional)

### Calling Backend API

```javascript
import { UserAPI } from "../scripts/back_door";

const data = await UserAPI.account.getUserFromUID(uid);
```

### Using Global State

```javascript
import { useAppContext } from "../context/AppContext";

const { STATES, ACTIONS } = useAppContext();
const { user, isMobile } = STATES;
ACTIONS.logNotification("success", "Operation complete");
```

## Environment Variables

Firebase config and API keys should be in environment variables (typically `.env`):
- Firebase API key, project ID, auth domain, etc.
- Livepeer API key
- Backend/registry API URL (currently hardcoded in `configs.js`)

Cloudflare deployment (for local use):
- `CLOUDFLARE_DEPLOY_HOOK_WQT` - Deploy hook URL for waterquality-trading
- `CLOUDFLARE_DEPLOY_HOOK_CLOUD` - Deploy hook URL for cloud-bluesignal
- `CLOUDFLARE_DEPLOY_HOOK_LANDING` - Deploy hook URL for bluesignal.xyz

Check Firebase config files and existing `.env` examples for exact variable names.

## Notes

- Node.js v20+ required
- Some features use cookies for temporary state where DB integration is incomplete
- Build version tag in App.jsx for debugging deployed versions
- Landing page uses its own entry point (`landing.html`) and is completely isolated from the main app
- Cloud and Marketplace mode detection is runtime-based, not build-time
