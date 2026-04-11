# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bluesignal Marketplace is a React SPA that operates in **quad-site architecture**:
- **Marketplace** (waterquality.trading) - Nutrient credit marketplace
- **Cloud** (cloud.bluesignal.xyz) - Device monitoring dashboard
- **Landing** (bluesignal.xyz) - WQM-1 product landing page (isolated entry point)
- **Ops Dashboard** (ops.bluesignal.xyz) - Internal CRM, pipeline, team, cap table (isolated entry point, auth-gated)

The Cloud and Marketplace modes share the same codebase (`src/main.jsx`) with different routing based on hostname detection. The Landing page and Ops Dashboard are completely separate entry points with no shared dependencies.

This repo also contains the **BlueSignal operational vault** at the root — markdown files, knowledge base, and dashboard data that power the scheduled task automation and the Ops Dashboard.

## Tech Stack

- **Frontend**: React 18 + Vite (SPA)
- **Routing**: React Router v6 (Cloud/Marketplace only; Landing uses anchor links)
- **State**: AppContext (React Context API) in `src/context/AppContext.jsx` (Cloud/Marketplace only)
- **Styling**: Styled Components
- **Auth & Database**: Firebase Authentication + Realtime Database (Cloud/Marketplace only)
- **Hosting**: Firebase Hosting (multi-site: waterquality-trading, cloud-bluesignal, landing-bluesignal, ops-bluesignal)
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
npm run build:ops      # BlueSignal Ops Dashboard (ops.bluesignal.xyz)

# Deploy to Firebase
firebase deploy

# Deploy specific sites
npm run deploy:wqt      # Build + deploy waterquality.trading
npm run deploy:cloud    # Build + deploy cloud.bluesignal.xyz
npm run deploy:landing  # Build + deploy bluesignal.xyz
npm run deploy:ops      # Build + deploy ops.bluesignal.xyz

# Deploy all sites (Firebase + Cloudflare)
npm run deploy:all      # Build all, deploy to Firebase, trigger Cloudflare

# Full deployment (Firebase + Cloudflare) per site
npm run deploy:full:wqt      # Deploy WQT to Firebase then trigger Cloudflare
npm run deploy:full:cloud    # Deploy Cloud to Firebase then trigger Cloudflare
npm run deploy:full:landing  # Deploy Landing to Firebase then trigger Cloudflare
npm run deploy:full:ops      # Deploy Ops to Firebase then trigger Cloudflare

# Trigger Cloudflare builds only (no Firebase deploy)
npm run cloudflare:trigger         # Trigger all sites
npm run cloudflare:trigger:wqt     # Trigger WQT only
npm run cloudflare:trigger:cloud   # Trigger Cloud only
npm run cloudflare:trigger:landing # Trigger Landing only
npm run cloudflare:trigger:ops     # Trigger Ops only

# Seed ops dashboard data to Firebase RTDB
npm run seed:ops

# Test isolated entry points locally
# Landing: BUILD_TARGET=landing npm run dev
# Ops Dashboard: BUILD_TARGET=ops npm run dev
```

## Architecture

### Mode Detection (`src/utils/modeDetection.js`)

The app detects mode based on hostname (used by Cloud/Marketplace builds only):
- **Landing mode**: `bluesignal.xyz`, `www.bluesignal.xyz`, `sales-bluesignal.web.app`, or `?app=landing`
- **Cloud mode**: `cloud.bluesignal.xyz`, `*.cloud.bluesignal.xyz`, `cloud-bluesignal.web.app`, or `?app=cloud`
- **Marketplace mode**: `waterquality.trading`, `*.waterquality.trading`, `waterquality-trading.web.app`, or default

Note: In production, the landing page and ops dashboard use their own entry points and do NOT go through `App.jsx` or mode detection. The detection exists only so Cloud/Marketplace builds correctly exclude landing/ops hostnames.

### Landing Page Architecture (`src/pages/landing/`)

The landing page is a **completely isolated subtree** with:
- Its own `main.jsx` entry point (no React Router, no Firebase, no AppContext)
- Its own theme (`styles/theme.js`), global styles, and typography system
- Styled Components + CSS-only animations (IntersectionObserver for scroll reveals)
- Zero imports from `src/components/`, `src/context/`, `src/scripts/`, or `src/styles/`

### Ops Dashboard Architecture (`src/ops/`)

The ops dashboard is a **completely isolated subtree** with:
- Its own `main.tsx` entry point (TypeScript, no React Router, no AppContext)
- Its own Firebase initialization (`firebase.ts` — Auth + Realtime Database only)
- Its own dark theme (`theme/tokens.ts`), global styles
- Auth-gated: email/password login via Firebase Auth, zero public routes
- 17 panels reading from Firebase RTDB `/ops-dashboard/{node}` via live `onValue` subscriptions
- 2 editable panels (CRM, Team & Cap Table) with write-back to Firebase
- `<meta name="robots" content="noindex, nofollow">` — internal tool, never indexed

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
- `src/ops/` - Ops Dashboard (ops.bluesignal.xyz) — isolated entry point
  - `main.tsx` - React entry point
  - `App.tsx` - Auth gate + dashboard shell
  - `firebase.ts` - Lightweight Firebase init (auth + RTDB)
  - `auth/` - LoginScreen
  - `layout/` - Sidebar, Topbar, DashboardLayout
  - `panels/` - 17 panel components (NeedsAction, CRM, TeamCap, etc.)
  - `hooks/` - useAuth, useFirebaseData, useWriteBack
  - `components/` - Panel, DataTable, PriorityBadge, EditableCell, etc.
  - `theme/` - tokens.ts, GlobalStyles.ts
- `Dashboard.md` - Priority task index (vault)
- `Today.md` - Daily working doc (vault)
- `Inbox/` - Quick capture (vault)
- `Knowledge/` - Assistant guidelines, BlueSignal knowledge, people, training (vault)
- `Projects/` - Research, drafts, archive (vault)
- `dashboard/data/` - 17 JSON files synced to Firebase RTDB (vault)
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
- `ops-bluesignal` target → `dist-ops/`

All sites use SPA rewrites (`** → /index.html`).

Vite config builds separate entry points (`index.html`, `cloud.html`, `landing.html`, `ops.html`) per target. Each build outputs to its own dist directory.

### Cloudflare Integration

The deployment pipeline automatically triggers Cloudflare builds after Firebase deployment succeeds. This provides CDN caching and edge optimization on top of Firebase Hosting.

**Automatic (CI/CD)**: On merge to `master`, GitHub Actions deploys to Firebase then triggers Cloudflare builds in parallel for all three sites with retry logic (4 attempts, exponential backoff: 2s, 4s, 8s, 16s).

**Manual**: Use `scripts/cloudflare-deploy.sh` or npm scripts to trigger Cloudflare builds locally.

**Required GitHub Secrets (deploy hooks method)**:
- `CLOUDFLARE_DEPLOY_HOOK_WQT` - Deploy hook URL for waterquality-trading
- `CLOUDFLARE_DEPLOY_HOOK_CLOUD` - Deploy hook URL for cloud-bluesignal
- `CLOUDFLARE_DEPLOY_HOOK_LANDING` - Deploy hook URL for bluesignal.xyz
- `CLOUDFLARE_DEPLOY_HOOK_OPS` - Deploy hook URL for ops.bluesignal.xyz

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
- Ops dashboard uses its own entry point (`ops.html`) and is completely isolated from the main app
- Cloud and Marketplace mode detection is runtime-based, not build-time

---

# Vault Operations

This repo includes the BlueSignal operational vault — markdown files, knowledge base, and dashboard data that drive daily operations and scheduled task automation.

## Vault Overview

The vault is the single source of truth for assistant behavior. On every session start, read this file first.

Two core projects:
- **WQM-1** — Autonomous water quality monitoring hardware (Raspberry Pi, Python firmware, LoRaWAN, SQLite). See [[Knowledge/BlueSignal/WQM-1]].
- **Marketplace** — React/TypeScript/Vite platform for nutrient credit trading, IoT device monitoring, and the BlueSignal landing page. See [[Knowledge/BlueSignal/Marketplace]].

For organization context, see [[Knowledge/BlueSignal/Overview]].

## Core Principles

1. **Act on Inbox/ immediately.** Items in `Inbox/` are direct instructions. Execute them rather than deferring to a backlog.
2. **Track everything until acknowledged.** Every task stays visible in `Dashboard.md` or `Today.md` until explicitly completed or removed.
3. **Show judgment calls.** When triaging, prioritizing, or interpreting ambiguous requests, explain the reasoning transparently.
4. **Write in Markdown.** All output uses Markdown formatting. No exceptions.
5. **The vault is the source of truth.** If something contradicts the vault, flag it — don't silently override.
6. **Check Training/ before repeated tasks.** Before acting on topics that have been corrected before, consult `Knowledge/Training/` files.

## Context Management

- **Load on demand.** Don't read every file at session start. Load what's needed for the current task.
- **Direct reads for known paths.** If you know where a file is, read it directly rather than searching.
- **Delegate verbose tasks.** For large research or multi-file operations, break work into focused steps.
- **Use Projects/Research/ for outputs.** Store research findings as markdown files, not inline in conversations.

## Routines

### Start of Day
See [[Knowledge/Assistant-Guidelines/Start-of-Day-Routine]] for the full three-phase morning workflow:
1. **Gather** — Check Inbox/, review open PRs, check CI status
2. **Process** — Triage tasks, update Dashboard, research as needed
3. **Produce** — Rebuild Today.md, deliver briefing

### Weekly Maintenance
See [[Knowledge/Assistant-Guidelines/Weekly-Maintenance]] for vault cleanup:
- Archive completed drafts
- Clean processed Inbox/ items
- Review stale TODOs
- Update knowledge files with new learnings

### End of Session
See [[Knowledge/Assistant-Guidelines/End-of-Session-Routine]] for wrap-up:
- Auto-commit all vault changes to preserve state
- Update Dashboard with completed tasks
- Deliver end-of-session summary

## Pipeline Discipline

### Dealer Journey Stages
```
Prospect -> Aware -> Onboarding -> Installing -> Engaged -> Retention
                                                                |
                                                        Re-Engage (win-back)
```

### Alert Rules
- Any account silent **14+ days** -> flag for re-engagement
- Any Onboarding account not progressing in **30 days** -> escalate
- Any Installing account with no sensor data in **21 days** -> risk of churn
- Retention accounts with declining activity -> flag Re-Engage risk
- SPA expiring within **30 days** with no renewal activity -> alert

### Positioning
**Never sell features. Sell risk reduction.**
1. Quantify the cost of waiting
2. Show proof from similar dealers in similar markets
3. Reduce perceived risk (training, support, warranty, data quality guarantees)
4. Make the first order easy (SPA, starter package, co-marketing)

### Communication
- Sharp, courteous, direct. No corporate jargon.
- Skip pleasantries. Lead with value.
- Always include a clear next step or ask.

## Vault Rules

### Naming
- Filenames use `Hyphenated-Title-Case.md` (no spaces, no underscores)
- Directories use `Hyphenated-Title-Case/` or lowercase when conventional (e.g., `drafts/`, `archive/`)

### Timestamps
- Every TODO includes creation and update dates: `(Added YYYY-MM-DD, updated YYYY-MM-DD)`
- Archive files use date prefix: `YYYY-MM-DD-Title.md`

### Wiki-Links
- Use full paths from vault root: `[[Knowledge/BlueSignal/WQM-1]]`
- Links reference the file without `.md` extension

### Draft Lifecycle
1. Active drafts live in `Projects/drafts/`
2. When finalized, move to `Projects/archive/` with date prefix
3. Update any Dashboard references when archiving

## Training Protocol

The assistant improves over time through three mechanisms:

1. **Custom Instructions** (`Knowledge/Training/Custom-Instructions.md`) — Direct behavioral overrides. **Highest priority.**
2. **Learned Patterns** (`Knowledge/Training/Learned-Patterns.md`) — Distilled patterns from feedback, organized by category.
3. **Feedback Log** (`Knowledge/Training/Feedback-Log.md`) — Running log of corrections and preferences.

**Before acting on any recurring topic:** Check Custom-Instructions first, then Learned-Patterns, then Feedback-Log, then fall back to defaults in this file.

## Vault Structure

```
marketplace/
├── CLAUDE.md                          # This file
├── Dashboard.md                       # Priority-sorted task index
├── Today.md                           # Daily working task list (living doc)
├── Inbox/                             # Quick capture — drop tasks/notes here
├── Knowledge/
│   ├── Assistant-Guidelines/          # Behavioral rules and routines
│   ├── BlueSignal/                    # Organization knowledge base
│   ├── People/                        # Contact directory
│   ├── Reminders/                     # Date-based reference items
│   └── Training/                      # Trainability mechanism
├── Projects/
│   ├── Research/                      # Research outputs and notes
│   ├── drafts/                        # Active work in progress
│   └── archive/                       # Completed drafts (date-prefixed)
├── dashboard/
│   └── data/                          # 17 JSON files synced to Firebase RTDB
├── src/
│   ├── ops/                           # Ops Dashboard (ops.bluesignal.xyz)
│   ├── pages/landing/                 # Landing page (bluesignal.xyz)
│   └── ...                            # Cloud + Marketplace (shared codebase)
└── ...
```

## Scheduled Tasks

Three daily automated tasks maintain the vault and codebase:

| # | Task | Schedule | Repo |
|---|------|----------|------|
| 1 | wqm-1: Full System Sweep | Daily 12:00 AM | wqm-1 |
| 2 | Marketplace: Full Stack Sweep | Daily 4:00 AM | marketplace |
| 3 | Morning Briefing + Vault Ops | Daily 7:00 AM | marketplace |

Full prompts in `Projects/drafts/Scheduled-Tasks-Prompts.md`.

## Connected Tools

### Available MCP Integrations
- **GitHub** (prefix: `mcp__github__`) — PRs, issues, branches, commits, code search, reviews
- **Google Calendar** (prefix: `mcp__631b6488__`) — Events, scheduling, free time
- **Gmail** (prefix: `mcp__68c48fab__`) — Search, read, draft emails
- **Cloudflare** (prefix: `mcp__99312f83__`) — D1, KV, R2, Workers
- **Crypto Market Data** (prefix: `mcp__4a2f2b1c__`) — Order book, trades, candles
