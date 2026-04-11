# Ops Dashboard Implementation Plan

## Objective

Merge the agentic-harness vault into the marketplace repo. Build a live ops dashboard as the 4th site (ops.bluesignal.xyz). Firebase Realtime DB for data, Firebase Auth for gating. Scheduled tasks update everything round the clock. No more codespace.

---

## Target Monorepo Structure

```
marketplace/
├── CLAUDE.md                         ← vault instruction manual
├── Dashboard.md                      ← priority task index
├── Today.md                          ← daily working doc
├── Inbox/                            ← quick capture
├── Knowledge/
│   ├── Assistant-Guidelines/
│   ├── BlueSignal/
│   ├── People/
│   ├── Reminders/
│   └── Training/
├── Projects/
│   ├── Research/
│   ├── drafts/
│   └── archive/
├── dashboard/
│   └── data/                         ← 18 JSON files (local copy, synced to Firebase)
├── src/
│   ├── trading/                      ← waterquality.trading
│   ├── cloud/                        ← cloud.bluesignal.xyz
│   ├── landing/                      ← bluesignal.xyz
│   └── ops/                          ← ops.bluesignal.xyz (NEW)
│       ├── main.tsx
│       ├── App.tsx                   ← Firebase Auth gate + router
│       ├── auth/
│       │   └── LoginScreen.tsx       ← email/password login
│       ├── layout/
│       │   ├── Sidebar.tsx           ← 4 collapsible groups
│       │   ├── Topbar.tsx            ← title, date, refresh, last-synced
│       │   └── DashboardLayout.tsx   ← responsive grid
│       ├── panels/
│       │   ├── NeedsActionPanel.tsx
│       │   ├── TopAccountsPanel.tsx
│       │   ├── TodaysAgendaPanel.tsx
│       │   ├── DealerCallsPanel.tsx
│       │   ├── InitiativesPanel.tsx  ← progress bars + milestones
│       │   ├── PipelinePanel.tsx     ← stats + bar chart + deals
│       │   ├── SPAAlertsPanel.tsx
│       │   ├── DealerHealthPanel.tsx ← horizontal bars + trends
│       │   ├── OpenLoopsPanel.tsx
│       │   ├── CRMPanel.tsx          ← EDITABLE: stage workflow, add/edit/delete customers
│       │   ├── ForecastPanel.tsx     ← Q2/Q3 committed vs best-case
│       │   ├── ProductsPanel.tsx     ← pricing + margins
│       │   ├── CompetitivePanel.tsx  ← competitor cards + battle cards
│       │   ├── StaleItemsPanel.tsx
│       │   ├── TerritoryPanel.tsx    ← dealer cards by location
│       │   ├── EventsPanel.tsx       ← calendar + vendor tiers
│       │   └── TeamCapPanel.tsx      ← EDITABLE: team mgmt, funding rounds, cap chart
│       ├── hooks/
│       │   ├── useFirebaseData.ts    ← subscribe to /ops-dashboard/{node}
│       │   ├── useAuth.ts            ← Firebase Auth state
│       │   └── useWriteBack.ts       ← push UI edits to Firebase
│       ├── components/
│       │   ├── PriorityBadge.tsx
│       │   ├── ProgressBar.tsx
│       │   ├── EditableCell.tsx      ← click-to-edit for tables
│       │   ├── StageSelect.tsx       ← CRM pipeline dropdown
│       │   └── AddForm.tsx           ← reusable add-record form
│       └── theme/
│           └── tokens.ts             ← dark mode design system
├── package.json
├── vite.config.ts                    ← 4 entry points
├── firebase.json                     ← hosting + Realtime DB rules
└── .github/workflows/
```

---

## Quad-Site Layout

| # | Service | Domain | Purpose |
|---|---------|--------|---------|
| 1 | Trading | waterquality.trading | Nutrient credit marketplace |
| 2 | Cloud Console | cloud.bluesignal.xyz | IoT device dashboards |
| 3 | Landing Page | bluesignal.xyz | Product showcase |
| 4 | **Ops Dashboard** | **ops.bluesignal.xyz** | **Live CRM, pipeline, team, cap table** |

---

## Scheduled Tasks (Updated — All Point to Marketplace)

| # | Task | Schedule | Repo |
|---|------|----------|------|
| 1 | wqm-1: Full System Sweep | Daily 12:00 AM | wqm-1 |
| 2 | Marketplace: Full Stack Sweep | Daily 4:00 AM | marketplace |
| 3 | Morning Briefing + Vault Ops | Daily 7:00 AM | marketplace |

Task 1 stays on wqm-1. Tasks 2 and 3 now both target marketplace (vault files are in the same repo). Task 1's harness update phase changes from "clone agentic-harness" to "clone marketplace".

---

## Phase 1: Merge Repos

1. Clone agentic-harness into the marketplace repo:
   ```bash
   git clone BlueSignal-XYZ/agentic-harness /tmp/harness
   cp -r /tmp/harness/{CLAUDE.md,Dashboard.md,Today.md,Inbox,Knowledge,Projects,dashboard} .
   ```
2. Update CLAUDE.md vault structure section to reflect the monorepo layout
3. Update .gitignore if needed (skip vault temp files)
4. Verify all wiki-links in Dashboard.md still resolve
5. Commit: "Merge agentic-harness vault into marketplace monorepo"

---

## Phase 2: Firebase Data Layer

### Realtime DB Structure

```
/ops-dashboard/
  /needs-action-today
  /todays-agenda
  /top-accounts
  /open-loops
  /active-initiatives
  /customers              ← read/write (CRM edits from UI)
  /pipeline-snapshot
  /dealer-health
  /dealer-calls
  /spa-alerts
  /forecast
  /products-pricing
  /competitive-intel
  /stale-items
  /territory-map
  /events-programs
  /team-cap-table         ← read/write (team/cap edits from UI)
  /last-synced            ← ISO timestamp
```

### Security Rules

```json
{
  "ops-dashboard": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### Auth Setup

- Create Firebase Auth user: jacques@bluesignal.xyz (email/password)
- Add more users later when team grows

---

## Phase 3: Build the Ops Dashboard

### Auth Gate

LoginScreen.tsx: email + password form → Firebase Auth → on success, render dashboard. useAuth.ts hook wraps onAuthStateChanged. Unauthenticated = login screen only.

### Data Layer

useFirebaseData.ts: subscribes to /ops-dashboard/{node} via onValue. Live updates — when Task 3 pushes new data at 7am, browser refreshes automatically.

useWriteBack.ts: for editable panels, writes to Firebase on every change.

### Key Editable Panels

**CRMPanel.tsx (eliminates codespace for CRM work):**
- Pipeline stage dropdown: Prospect → Aware → Onboarding → Installing → Engaged → Retention → Re-Engage
- Add new customer form (name, contact, type, stage, notes)
- Inline edit any field (click to edit)
- Delete with confirmation
- All writes → Firebase /ops-dashboard/customers
- Next Task 3 run reads changes back into vault

**TeamCapPanel.tsx (eliminates codespace for team building):**
- Team table: add/edit/remove members (name, role, equity %, start date, status)
- Assign users to roles via dropdown
- Funding rounds: add/edit (round name, amount, valuation, date, investors)
- Cap table bar chart: ownership splits (founder %, pool %, investors %)
- All writes → Firebase /ops-dashboard/team-cap-table
- Next Task 3 run reads changes back into vault

### Styling

Port from dashboard/styles.css to Styled Components. Keep exact dark palette:
- --bg: #0c0e14 (main background)
- --surface: #14171f (cards, sidebar)
- --accent: #4f8ff7 (blue primary)
- --green: #34d399, --yellow: #fbbf24, --red: #f87171
- Responsive grid, mobile sidebar overlay

### Vite Config

Add 4th entry point to vite.config.ts:
```ts
input: {
  // ...existing (trading, cloud, landing)
  ops: resolve(__dirname, 'src/ops/index.html'),
}
```

---

## Phase 4: Update Scheduled Task Prompts

### Task 1 (wqm-1, 12am) — change Phase 4:

Replace "Clone agentic-harness" with "Clone marketplace" in the harness update phase. Same files, same paths, different repo.

### Task 2 (Marketplace, 4am) — add vault awareness:

Note that vault files (CLAUDE.md, Dashboard.md, Knowledge/, etc.) live at the repo root. Code quality sweep covers src/ only — skip vault markdown files during linting.

### Task 3 (Morning Briefing, 7am) — major update:

Remove all "clone agentic-harness" references — vault files are local now.

Add Phase 3.5 after PRODUCE:

```
PHASE 3.5 — FIREBASE SYNC
- Read all JSON files in dashboard/data/.
- Write each file's contents to /ops-dashboard/{node} in Firebase Realtime DB.
- Set /ops-dashboard/last-synced to current ISO timestamp.
- Check if /ops-dashboard/customers or /ops-dashboard/team-cap-table were
  modified in Firebase since last sync (compare timestamps). If so, read
  those changes BACK and update the local JSON files and relevant vault
  files (Dashboard.md, customers.json, partner profiles, etc.).
```

This creates bidirectional sync: harness pushes TO Firebase, UI edits pull BACK into the vault.

---

## Phase 5: Hosting & DNS

1. Add ops.bluesignal.xyz to Firebase Hosting (or Cloudflare Pages)
2. CNAME ops.bluesignal.xyz → hosting provider
3. Deploy with the rest of the marketplace sites

---

## Bidirectional Data Flow

```
YOU edit CRM on ops.bluesignal.xyz at 2pm
  → Firebase updates instantly
  → Dashboard reflects change for anyone viewing
  → 7am next day: Task 3 reads Firebase changes back into vault
  → Updates customers.json, Dashboard.md, partner profiles
  → Drafts follow-up emails based on new pipeline stages
  → Pushes vault + code changes to GitHub

OVERNIGHT TASKS push new data
  → 12am: wqm-1 sweep results → marketplace vault files
  → 4am: marketplace code sweep results → vault files
  → 7am: briefing rebuilds Today.md → pushes to Firebase
  → Your browser auto-refreshes via Realtime DB subscription
```

---

## Verification Checklist

- [ ] All vault files present in marketplace repo root
- [ ] CLAUDE.md references correct monorepo paths
- [ ] All 4 Vite entry points build (npm run build)
- [ ] Login to ops.bluesignal.xyz with Firebase Auth
- [ ] All 17 panels render with Firebase Realtime DB data
- [ ] Edit customer stage in CRM → Firebase updates instantly
- [ ] Edit team member → cap table recalculates
- [ ] Add funding round → bar chart updates
- [ ] Run Task 3 manually → Firebase nodes update → dashboard refreshes
- [ ] Run Task 1 (wqm-1) → pushes to marketplace repo
- [ ] UI edits in Firebase → next Task 3 reads them back into vault

---

## Dependencies

No new packages needed. Marketplace already has:
- React 18, Vite 4, TypeScript, Styled Components
- Firebase (Auth, Realtime DB, Hosting)
- React Query (for data management)
