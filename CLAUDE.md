# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bluesignal Marketplace is a React SPA that operates in **dual-mode architecture**: a marketplace frontend (waterquality.trading) and a cloud monitoring dashboard (cloud.bluesignal.xyz). Both modes share the same codebase but have different routing, navigation, and features based on hostname detection.

## Tech Stack

- **Frontend**: React 18 + Vite (SPA)
- **Routing**: React Router v6
- **State**: AppContext (React Context API) in `src/context/AppContext.jsx`
- **Styling**: Styled Components
- **Auth & Database**: Firebase Authentication + Realtime Database
- **Hosting**: Firebase Hosting (multi-site: waterquality-trading, cloud-bluesignal)
- **Backend API**: Cloud Functions at `us-central1-app-neptunechain.cloudfunctions.net/app`
- **Blockchain**: Polygon (Amoy testnet / mainnet) via Alchemy, ethers.js
- **Media**: Livepeer for video upload/streaming
- **Charts**: Chart.js + react-chartjs-2
- **Maps**: @react-google-maps/api, mapbox-gl

## Development Commands

```bash
# Development server (localhost:3000)
npm run dev

# Build for production (default: waterquality.trading)
npm run build

# Build for specific sites
npm run build:wqt    # WaterQuality.Trading
npm run build:cloud  # BlueSignal Cloud

# Deploy to Firebase
firebase deploy

# Deploy specific sites
npm run deploy:wqt    # Build + deploy waterquality.trading
npm run deploy:cloud  # Build + deploy cloud.bluesignal.xyz
```

## Architecture

### Mode Detection (`src/App.jsx`)

The app detects mode based on hostname:
- **Cloud mode**: `cloud.bluesignal.xyz`, `*.cloud.bluesignal.xyz`, `cloud-bluesignal.web.app`, or `?app=cloud`
- **Marketplace mode**: `waterquality.trading`, `*.waterquality.trading`, `waterquality-trading.web.app`, or default

Mode determines which header, menu, and route set to render.

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
- `waterquality-trading` target → `dist/`
- `cloud-bluesignal` target → `dist/`

Both sites use SPA rewrites (`** → /index.html`).

Vite config builds multiple entry points (`index.html`, `cloud.html`) but current setup deploys same `dist/` for both targets. Mode detection happens at runtime via hostname.

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

Check Firebase config files and existing `.env` examples for exact variable names.

## Notes

- Node.js v20+ required
- Some features use cookies for temporary state where DB integration is incomplete
- Build version tag in App.jsx for debugging deployed versions
- Mode detection is runtime-based, not build-time (both builds are identical)
