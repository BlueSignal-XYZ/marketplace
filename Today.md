# Today

_Rebuilt each session. This is a living document — not dated, not archived._

---

## Focus

Outreach to top 5 prospects. CI/CD pipelines. Stripe integration. Sensor calibration.

## Schedule

| Time | Activity | Area | Notes |
|------|----------|------|-------|
| 9:00 | Morning pipeline review | — | Review Dashboard, check CRM, prioritize outreach |
| 9:30 | Outreach: Tank Depot | Sales | (800) 573-6771. Start with Dripping Springs or Cleburne location. Pitch: retail WQM-1 with tank sales. |
| 10:00 | Outreach: Brite Ideas Aquaponics | Sales | Troy Smith, (512) 444-2100. Strongest product-market fit — aquaponics needs WQ monitoring. |
| 10:30 | Outreach: LegaSeay Water Solutions | Sales | Weston Seay, (361) 772-1502. GIS/Water Resources background. Technical early adopter. |
| 11:00 | CI/CD pipeline setup | Engineering | GitHub Actions for wqm-1 (Python: pytest, mypy, flake8) and marketplace (Node: vitest, tsc, eslint) |
| 13:00 | Stripe Connect integration | Engineering | Payment flows for nutrient credit purchases + dealer subscriptions |
| 14:30 | WQM-1 sensor calibration | Engineering | Review calibration code. Plan pH, TDS, turbidity, ORP, temp routines. |
| 15:30 | Outreach: Rain Harvesting Supplies | Sales | Jim Wood, (877) 331-7008. Retailer — could carry WQM-1 in catalog. |
| 16:00 | Outreach: B-E Waterwell Services | Sales | Zack Galloway, (281) 448-4447. Since 1979, biggest service area. |

## Tasks

### High Priority — Sales
- [ ] Call Tank Depot corporate — pitch WQM-1 retail in 14 locations
- [ ] Call Brite Ideas Aquaponics (Troy Smith) — aquaponics WQ monitoring
- [ ] Call LegaSeay Water Solutions (Weston Seay) — continuous monitoring pitch
- [ ] Call Rain Harvesting Supplies (Jim Wood) — retail distribution
- [ ] Call B-E Waterwell Services (Zack Galloway) — well monitoring

### High Priority — Engineering
- [ ] Set up GitHub Actions CI workflow for `wqm-1` repo
- [ ] Set up GitHub Actions CI workflow for `marketplace` repo
- [ ] Continue Stripe Connect integration for Marketplace

### Medium Priority
- [ ] Review WQM-1 sensor calibration code — plan pH, TDS, turbidity, ORP, temp
- [ ] Begin CRM pipeline stage definitions — move prospects through stages as calls happen
- [ ] Update prospect profiles with outreach notes after each call

### Lower Priority
- [ ] Begin dealer onboarding documentation outline
- [ ] SPA tier structure draft (Starter/Growth/Scale/Enterprise)
- [ ] Start sales collateral — WQM-1 product datasheet ($999.99, 6-channel, LoRaWAN, open-source)

## Open Loops

1. **15 prospects loaded** — All in Prospect stage. Top 5 outreach today. Update CRM after each call.
2. **CI/CD blocks dev** — Can't reliably ship without automated tests. Must set up today.
3. **Stripe integration** — Needed before marketplace MVP can launch. Continue this week.
4. **WaterTech West** — May 14-16. 34 days out. Need demo units + booth materials by May 10.
5. **Cap table** — Founder only. Need to model Seed round terms before investor conversations.

## Notes

### Full-Stack Sweep — 2026-04-11

**Phase 1 — Frontend Code Quality**
- ESLint: 0 errors, 74 warnings (all intentionally-downgraded hook rules). Auto-fixed unused imports.
- TypeScript: clean pass (`tsc --noEmit`).
- Fixed `Math.random()` called during render in `NFTCard.jsx` (React purity violation).
- Fixed variable-accessed-before-declaration in `MediaPlayer.jsx` and `GoogleStoreLocator.jsx`.
- Removed 13 unused styled components from `layout.js` and 16 unused animation utilities from `animations.js` (~300 lines of dead code).
- Code splitting: both WQTApp and CloudApp already use `lazyWithRetry()` on 25+ route components with `<Suspense>` fallbacks.

**Phase 2 — Backend & Integrations**
- **Security fix**: Removed hardcoded wallet address (`0x94439f...`) from `SellerDashboard.jsx` — now derived from authenticated user context.
- **Security fix**: Restricted ops-dashboard Firebase RTDB rules to `@bluesignal.xyz` email domain (was any authenticated user).
- **Stripe fix**: Added idempotency key generation to `createPaymentIntent()` to prevent duplicate charges on retries.
- API keys audit: all configs use environment variables. No hardcoded credentials found.

**Phase 3 — Tests & Dependencies**
- Added 19 new tests across 3 files: Stripe checkout flow (7), authenticated API calls with 401 retry (4), wallet utilities (8).
- Full suite: 325 tests pass (was 306), 0 failures.
- Updated 6 dependencies (minor/patch): react-query, firebase, firebase-tools, prettier, react-tooltip, styled-components.
- Fixed 1 high-severity audit vulnerability (`basic-ftp`). 23 remaining are low-severity in transitive deps (alchemy-sdk, firebase-admin, xlsx).

**Phase 4 — Vault**
- Updated Today.md with sweep results.

## End of Day Summary

_To be completed at wrap-up._
