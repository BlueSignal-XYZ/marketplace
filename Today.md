# Today — 2026-04-12 (Sunday)

_Rebuilt each session. Living document — not dated, not archived._

---

## Focus

Sunday cadence: weekly vault maintenance, draft Top-5 cold outreach emails for Monday send, light engineering prep.

## Schedule

| Time | Activity | Area | Notes |
|------|----------|------|-------|
| 07:00 | Morning briefing + weekly maintenance | Ops | Vault cleanup, stale items, draft reviews |
| — | Review 5 staged Gmail drafts | Sales | Confirm pitch angles + recipient lookup before Monday send |
| — | Optional: plan CI/CD workflow files for Monday | Engineering | Sketch `.github/workflows/ci.yml` for marketplace + wqm-1 |
| — | Optional: Stripe Connect spec review | Engineering | Re-read Connect docs before Monday implementation block |

## Monday 2026-04-13 Outreach Schedule

| Time | Prospect | Contact | Phone | Angle |
|------|----------|---------|-------|-------|
| 09:30 | Tank Depot | Corporate (Cleburne or Dripping Springs) | (800) 573-6771 | Retail attach across 14 locations. Warranty-protection narrative. |
| 10:00 | Brite Ideas Aquaponics | Troy Smith | (512) 444-2100 | Strongest PMF — aquaponics lives on water chemistry. |
| 10:30 | LegaSeay Water Solutions | Weston Seay | (361) 772-1502 | Technical buyer — continuous monitoring replaces one-time testing. |
| 15:30 | Rain Harvesting Supplies | Jim Wood (CEO) | (877) 331-7008 | Drop-ship catalog attach. Fills their water-quality SKU gap. |
| 16:00 | B-E Waterwell Services | Zack Galloway (Head of Ops) | (281) 448-4447 | 45-year operator, largest service area — pilot on 3 wells. |

## Tasks

### High Priority — Sales
- [ ] Review 5 Gmail drafts (Tank Depot, Brite Ideas, LegaSeay, Rain Harvesting, B-E Waterwell)
- [ ] Confirm correct recipient email for each (drafts have phone + context but `To:` fields are left blank — look up the right person-specific email before sending)
- [ ] Update each Partner profile's Outreach History after Monday sends

### High Priority — Engineering
- [ ] Sketch GitHub Actions CI for `wqm-1` (pytest, mypy, flake8)
- [ ] Sketch GitHub Actions CI for `marketplace` (vitest, tsc, eslint)
- [ ] Continue Stripe Connect integration plan

### Medium Priority
- [ ] WQM-1 sensor calibration scope (pH, TDS, turbidity, ORP, temperature) — target 2026-04-17
- [ ] SPA tier structure draft (Starter/Growth/Scale/Enterprise) — target 2026-04-25

### Lower Priority
- [ ] Dealer onboarding documentation outline — target 2026-04-30
- [ ] WQM-1 datasheet draft — $999.99, 6-channel, LoRaWAN, open-source
- [ ] WaterTech West booth prep checklist (32 days out)

## Open Loops

1. **15 prospects loaded, Top-5 drafts staged.** Send Monday 2026-04-13 after recipient confirmation.
2. **CI/CD blocks reliable dev.** GitHub Actions configuration needed on both repos — Monday.
3. **Stripe Connect integration.** Idempotency + tests in; settlement + Connect linking pending.
4. **WaterTech West.** May 14-16. 32 days out. Demo units + booth materials by 2026-05-10.
5. **Founder.md missing in this environment.** Email routing defaulted to jacques@bluesignal.xyz (BlueSignal/WQM-1 context) for all 5 drafts. Confirm per-asset before sending.
6. **Firebase sync stubbed.** No Firebase credentials in this session — `/ops-dashboard/*` nodes were not pushed. Local `dashboard/data/*.json` is the source of truth until creds are wired in.

## Notes

### Sunday 2026-04-12 — Weekly Maintenance Summary

**Dashboard cleanup**
- Moved PR #287 (security hardening) and PR #283 (Dependabot axios bump) from "PRs Needing Review" to Completed — both merged before today (0 open PRs on marketplace per GitHub).
- No OVERDUE items as of 2026-04-12.

**Inbox**
- Empty. No items to process.

**Feedback-Log -> Learned-Patterns**
- `Knowledge/Training/Feedback-Log.md` has no entries yet. Nothing to distill.

**Drafts -> Archive**
- `Projects/drafts/Ops-Dashboard-Implementation-Plan.md` — active reference, left in drafts.
- `Projects/drafts/Scheduled-Tasks-Prompts.md` — operational reference, left in drafts.

**Wiki-link health**
- All 15 Partner wiki-links in Dashboard.md now resolve (Partner profile files created this session).

**Stale items**
- None — all Dashboard items added 2026-04-10 (2 days old). First stale review with real signal will be around 2026-04-20.

**Active-initiatives rebuild**
- `dashboard/data/active-initiatives.json` rebuilt with 6 initiatives: WQM-1 Firmware (55%), Marketplace MVP (60%), Cloud Dashboard V2 (30%), Dealer GTM (20%), Ops Dashboard (50%), WaterTech West (10%).

### Phase 4 — Outreach Draft Summary

**Drafts created:** 5 cold outreach emails (category A).
**Category B (follow-up nudges):** 0 — no prospect has prior outreach history yet.
**Category C (partner updates):** 0 — no accounts in Onboarding / Installing / Engaged stages yet.

| Prospect | Org identity | From | Category |
|----------|--------------|------|----------|
| Tank Depot | BlueSignal (WQM-1) | jacques@bluesignal.xyz | Cold outreach |
| Brite Ideas Aquaponics | BlueSignal (WQM-1) | jacques@bluesignal.xyz | Cold outreach |
| LegaSeay Water Solutions | BlueSignal (WQM-1) | jacques@bluesignal.xyz | Cold outreach |
| Rain Harvesting Supplies | BlueSignal (WQM-1) | jacques@bluesignal.xyz | Cold outreach |
| B-E Waterwell Services | BlueSignal (WQM-1) | jacques@bluesignal.xyz | Cold outreach |

All 5 drafts have the BlueSignal signature block (Jacques De Jean | Founder, BlueSignal | bluesignal.xyz | (512) area code placeholder — confirm from Founder.md when available). `To:` left blank on each draft — verify right recipient email before sending.

### Repo Health — 2026-04-12

| Repo | Open PRs | Open Issues | Failing CI | Stale branches |
|------|----------|-------------|-----------|----------------|
| BlueSignal-XYZ/marketplace | 0 | 0 | N/A (no CI configured yet) | 1 (`claude/inspiring-wright-0xHao`) |
| BlueSignal-XYZ/wqm-1 | N/A (access not scoped to this session) | N/A | N/A | N/A |

Marketplace repo is clean — PRs #287 and #283 are merged, master is at 14ad1b9. CI/CD setup is still the highest-priority engineering task.

### Full-Stack Sweep — 2026-04-12

**Phase 1 — Frontend Code Quality**
- ESLint: 0 errors, reduced warnings 58 → 47. `tsc --noEmit` clean.
- **Bug fix**: `LocationCapture.jsx` referenced undefined `reverseGeocode` — replaced with inline Google Maps Geocoder implementation so GPS + map-pin flows now return a formatted address instead of silently throwing.
- Wrapped `loadNotifications`, `loadPortfolio`, `loadProgram`, `loadDevices` in `useCallback` so `useEffect` dependency arrays are correct (fixes stale-closure risk in `NotificationBell`, `CreditPortfolioPage`, `TradingProgramDetailPage`).
- `CheckoutForm` / `OrderConfirmation` Stripe effects now declare `payAmount`, `serverUrl`, `priceID` as deps — effects re-run correctly when inputs change.
- Exposed `StripeAPI`, `QRCodeAPI`, `VirginiaAPI` namespaces from `back_door.js` (were defined but never exported — dead-code flag).
- Removed stale `eslint-disable` in `QRScanner.jsx`; prefixed unused `user` prop in `CloudShell.jsx`.

**Phase 2 — Backend & Integrations**
- **Security regression fix**: `database.rules.json` ops-dashboard node was back to `"auth != null"` (any authenticated user). Restored `@bluesignal.xyz` email-domain restriction + `email_verified === true` check on both read and write.
- **Webhook hardening**: HubSpot webhook no longer accepts requests when `HUBSPOT_CLIENT_SECRET` is missing (was silently skipping signature verification "for backwards compatibility" — classic forge-by-omission hole). Added unequal-buffer-length guard before `timingSafeEqual`.
- **Webhook hardening**: TTN webhook secret comparison is now `crypto.timingSafeEqual` instead of `!==`, eliminating a byte-by-byte timing attack surface.
- **CORS**: added `ops.bluesignal.xyz` + `ops-bluesignal.web.app` to the allow-list (quad-site architecture regression).

**Phase 3 — Tests & Dependencies**
- Added 11 new tests across 2 files:
  - `wallet.test.js`: 5 tests covering `connectAndSign` — null/empty accounts, success path, signer propagation, user-rejection error.
  - `creditAuditService.test.ts`: 6 tests for `getCreditAudit` + `getAuditTrailForDevice` — empty-ID short-circuit, permission-denied warning path, descending-sort contract, empty-result handling.
- Full suite: **342 → 353 passing** (+11), 10 todo, 0 failures.
- Dependencies: `globals` 17.4.0 → 17.5.0 (only safe minor available). All remaining audit findings require major downgrades (alchemy-sdk 3→2, firebase-admin 13→10) or have no upstream fix yet (xlsx) — deferred per sweep rules (minor/patch only).
- Bundle note: `ops.bluesignal.xyz` build not profiled; largest source-tree deps are `mapbox-gl`, `three`, `jspdf`, `lottie-web` — all tree-shaken per-route and loaded via `lazyWithRetry`.

**Phase 4 — Vault**
- Appended sweep summary (this block) to Today.md.

## End of Day Summary

_To be completed at wrap-up._
