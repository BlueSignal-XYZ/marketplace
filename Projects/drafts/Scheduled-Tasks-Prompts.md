# Scheduled Tasks — Production Prompts

One task per repo. Each runs a full-stack maintenance sweep and writes results back to the vault (now at the marketplace repo root).

---

## Quick Reference

| # | Task | Schedule | Repo |
|---|------|----------|------|
| 1 | wqm-1: Full System Sweep | Daily 12:00 AM | wqm-1 |
| 2 | Marketplace: Full Stack Sweep | Daily 4:00 AM | marketplace |
| 3 | Morning Briefing + Vault Ops | Daily 7:00 AM | marketplace |

**Daily execution order:** 12am (wqm-1) → 4am (marketplace) → 7am (marketplace briefing reads results from both)

---

## 1. wqm-1: Full System Sweep

- **Repo:** wqm-1
- **Schedule:** Every day at 12:00 AM

**Prompt:**
```
You are maintaining the WQM-1 autonomous water quality monitor — a Raspberry Pi Zero 2W running Python firmware with dual ADS1115 ADCs, SX1262 LoRa radio, u-blox GPS, and SQLite WAL storage. The codebase is ~85% Python with shell scripts and minimal HTML/CSS for local config.

Run a complete system sweep across three phases:

PHASE 1 — CODE QUALITY
- Fix dead code, unused imports, type hint gaps, and Python anti-patterns.
- Run flake8 and mypy if configured. Fix all warnings.
- Ensure all modules use the logging module (not print()).
- Check SQLite queries for proper parameterization and WAL mode usage.
- Review LoRaWAN payload encoding (Cayenne LPP format) for correctness.
- Commit fixes to a claude/ branch.

PHASE 2 — TEST COVERAGE
- Analyze test coverage with pytest. Identify untested modules.
- Write missing tests prioritizing: sensor calibration routines (pH, TDS, turbidity, ORP, temperature), SQLite data storage and WAL buffering, LoRaWAN payload encoding/decoding, GPS coordinate parsing, power management logic.
- Run the full test suite. Fix any failures. Commit only passing tests.

PHASE 3 — DEPENDENCY AUDIT
- Check requirements.txt and any pinned deps for outdated packages and known vulnerabilities (pip-audit or safety if available).
- Remove unused dependencies. Update safe patches (minor/patch versions only).
- Run tests after updates to confirm nothing broke. Commit changes.

PHASE 4 — VAULT UPDATE
- Clone marketplace repo (vault files are at the repo root).
- Read Dashboard.md. If "WQM-1 Firmware Completion" initiative progress changed based on work done, update the percentage and relevant milestone statuses.
- Update dashboard/data/active-initiatives.json — update the "WQM-1 Firmware Completion" milestone statuses (especially "Sensor calibration routines" and "CI/CD pipeline") if this session's work moved them forward.
- Add a note to Today.md under the Notes section summarizing what was fixed, tested, and updated. Include counts (e.g., "Fixed 3 type hint gaps, added 5 tests for pH calibration, updated 2 deps").
- Commit and push marketplace.
```

---

## 2. Marketplace: Full Stack Sweep

- **Repo:** marketplace
- **Schedule:** Every day at 4:00 AM

**Prompt:**
```
You are maintaining the BlueSignal Marketplace — a unified React 18/TypeScript/Vite platform serving four services: waterquality.trading (nutrient credit trading), cloud.bluesignal.xyz (IoT device dashboards), bluesignal.xyz (landing page), and ops.bluesignal.xyz (internal ops dashboard). Backend is Firebase (Auth, Realtime DB, Cloud Functions). Blockchain is Polygon via ethers.js v6. Payments via Stripe. Tests use Vitest + React Testing Library.

NOTE: This repo also contains the operational vault at its root (Dashboard.md, Today.md, Knowledge/, Projects/, dashboard/data/). Skip vault markdown files during linting — they are not code.

Run a complete full-stack sweep across four phases:

PHASE 1 — FRONTEND CODE QUALITY
- Fix dead code, unused components, unused imports, and TypeScript anti-patterns.
- Run ESLint and tsc --noEmit for type checking. Fix all errors and warnings.
- Review React components for performance issues: missing memoization on expensive renders, unnecessary re-renders, missing key props in lists.
- Check for proper code splitting and lazy loading on route boundaries.
- Review Styled Components for unused styles or duplicate theme values.
- Commit fixes to a claude/ branch.

PHASE 2 — BACKEND & INTEGRATIONS REVIEW
- Review Firebase security rules for proper authentication checks.
- Check Cloud Functions for error handling, proper async/await patterns, and timeout configurations.
- Review Stripe integration for proper error handling, webhook verification, and idempotency.
- Check ethers.js/Polygon integration for proper error handling, gas estimation, and transaction retry logic.
- Review API keys and secrets usage — ensure nothing is hardcoded (should use environment variables).
- Commit fixes.

PHASE 3 — TEST COVERAGE + DEPENDENCY AUDIT
- Run vitest with coverage. Identify untested components and utility functions.
- Write missing tests prioritizing: payment flows (Stripe), device dashboard data rendering, nutrient credit listing/trading logic, authentication flows, blockchain transaction handling.
- Run the full suite. Fix failures. Commit passing tests.
- Run npm audit. Check for outdated packages. Update safe patches (minor/patch only).
- Check bundle size — flag any single dependency over 100KB gzipped.
- Run tests after updates. Commit changes.

PHASE 4 — VAULT UPDATE
- Vault files are at the repo root (Dashboard.md, Today.md, Knowledge/, Projects/, dashboard/data/).
- Read Dashboard.md. If "Nutrient Credit Marketplace MVP" or "Cloud Dashboard V2" initiative progress changed based on work done, update percentages and milestone statuses.
- Update dashboard/data/active-initiatives.json with any milestone status changes.
- Add a note to Today.md under Notes summarizing what was fixed, tested, and updated. Include specifics (e.g., "Fixed 2 TypeScript errors, added Stripe webhook tests, updated 3 deps, bundle size reduced by 15KB").
- Commit and push marketplace.
```

---

## 3. Morning Briefing + Vault Ops

- **Repo:** marketplace
- **Schedule:** Every day at 7:00 AM

**Prompt:**
```
Read CLAUDE.md first — it is the instruction manual for this vault. The vault files (Dashboard.md, Today.md, Knowledge/, Projects/, dashboard/data/) live at the marketplace repo root.

You are running the daily operations task for the BlueSignal operational vault. This task has two modes depending on the day. ALWAYS run the Daily Briefing. On Sundays, ALSO run Weekly Maintenance after the briefing.

=== DAILY BRIEFING (every day) ===

PHASE 1 — GATHER
- Read Dashboard.md and Today.md for current state.
- Read all profiles in Knowledge/People/Partners/. Check each prospect's Outreach History for staleness (no contact in 7+ days = flag).
- Read dashboard/data/customers.json for current CRM pipeline stages.
- Check GitHub repos BlueSignal-XYZ/wqm-1 and BlueSignal-XYZ/marketplace using GitHub MCP tools: open PRs, open issues, failing CI, stale branches.

PHASE 2 — PROCESS
- Update Dashboard.md: flag any tasks past their target date as OVERDUE. Update (updated YYYY-MM-DD) timestamps on changed items.
- Move prospects through pipeline stages in customers.json if outreach history shows progress (e.g., Prospect → Aware after first contact).
- If CI is failing on either repo, add to dashboard/data/needs-action-today.json as high priority.
- If any PRs are open and overdue (>3 days), add to needs-action-today.json.

PHASE 3 — PRODUCE
- Rebuild Today.md with today's date, prioritized tasks from Dashboard.md, and outreach calls for the day (include phone numbers and pitch angles from partner profiles).
- Update these dashboard JSON files to match current state:
  - dashboard/data/needs-action-today.json — high priority action items
  - dashboard/data/todays-agenda.json — today's schedule
  - dashboard/data/top-accounts.json — highest priority accounts
  - dashboard/data/open-loops.json — unresolved items needing follow-up
- Add repo health summary to Today.md Notes section (PR count, CI status, issue count for each repo).

PHASE 3.5 — FIREBASE SYNC
- Read all JSON files in dashboard/data/.
- Write each file's contents to /ops-dashboard/{node} in Firebase Realtime DB (node name = filename without .json, hyphens preserved).
- Set /ops-dashboard/last-synced to current ISO timestamp.
- Check if /ops-dashboard/customers or /ops-dashboard/team-cap-table were modified in Firebase since last sync (compare timestamps or check for differences). If so, read those changes BACK and update the local JSON files and relevant vault files (Dashboard.md, customers.json, partner profiles, etc.).
- This creates bidirectional sync: this task pushes TO Firebase, UI edits in the ops dashboard pull BACK into the vault.

PHASE 4 — OUTREACH & FOLLOW-UP DRAFTS
Using the Gmail MCP tool (gmail_create_draft), create draft emails for each of the following categories. Write as Jacques De Jean (the founder) — first person, direct, sharp, no corporate jargon. Lead with value, not features. Every email must have a clear next step or ask. Do NOT send — leave all as drafts for review.

IMPORTANT — Read Knowledge/People/Team/Founder.md (local, gitignored) before drafting any email. It is the single source of truth for Jacques' identity, positioning rules, email routing (sender + CC), signature blocks, audience tone matrix, and scenario handling across the three organizations.

Apply Founder.md verbatim:
- § 3 Positioning Rules — determines which entity to lead with and how / whether to cross-mention.
- § 4 Email Routing — pick the correct From / CC / signature block per org context; never blur brands. If an email would touch multiple orgs, draft it for the primary org only and stage a separate follow-up thread for the second.
- § 5 Audience Tone Matrix — match tone to builder / technical buyer / utility / investor.
- § 6 Common Scenarios — canonical responses for recurring question patterns (including monitoring-of-AWG-output type crossovers).

Use HTML contentType for all emails and append the matching signature block from Founder.md § 4. If the org context is unclear, apply the default routing specified in Founder.md § 4.

A) COLD PROSPECT OUTREACH
For each prospect in Knowledge/People/Partners/ whose CRM stage is "Prospect" and has NO outreach history yet:
- Read their full profile (business type, location, owner name, services, WQM-1 fit analysis).
- Determine which org context fits this prospect (most current prospects are BlueSignal/WQM-1).
- Draft a personalized email to their contact email (or general business email from profile).
- Subject: Short, specific to their business — not generic. Example: "Water monitoring for [their specialty]"
- Body: 2-3 paragraphs max. Open with something specific to their business (not "I came across your company"). Pitch WQM-1 as risk reduction, not features. Reference their market, their pain point, their opportunity. End with a concrete ask (call, demo, visit).
- Set the correct "from" address and CC per routing rules above.
- After drafting, update the prospect's profile in Knowledge/People/Partners/ with: date, "Initial outreach email drafted (via [org])" in Outreach History.

B) FOLLOW-UP NUDGES
For each prospect whose last contact was 7+ days ago AND who has not explicitly declined:
- Read their profile and previous outreach history to understand context.
- Use the same org context and sender as the original outreach.
- Draft a follow-up email — do NOT repeat the first pitch. Add a new angle: market data, a case study reference, a seasonal relevance, or a simple "checking in with one quick question."
- Keep it under 4 sentences. End with a low-friction ask (reply, quick call, yes/no question).
- Update the prospect's profile with: date, "Follow-up email drafted (via [org])" in Outreach History.

C) PARTNER UPDATES
For any account in customers.json with stage "Onboarding", "Installing", or "Engaged":
- Draft a status update email referencing their specific deployment or onboarding progress.
- Determine org context from the account's relationship (BlueSignal hardware deployment vs. Aquaria network vs. WQT marketplace).
- Include: what's been done, what's next, any action items on their side, and an offer to help.
- Tone: supportive, proactive, brief. Show you're paying attention to their account.
- Update their profile with: date, "Partner update email drafted (via [org])" in Outreach History.

After drafting all emails, add a summary to Today.md Notes: how many drafts created, for which accounts, which category (outreach/follow-up/update), and which org identity was used.

=== WEEKLY MAINTENANCE (Sundays only) ===

If today is Sunday, run these additional steps BEFORE Phase 4 (so the briefing email includes the maintenance summary):

1. Dashboard cleanup: Move completed tasks to the Completed section with today's date. Flag tasks past target date as OVERDUE. Update all (updated YYYY-MM-DD) timestamps.
2. Clean Inbox/ — process any items, move to appropriate location or add to Dashboard.md. Delete processed items.
3. Review Knowledge/Training/Feedback-Log.md — distill any new entries into Knowledge/Training/Learned-Patterns.md.
4. Rebuild dashboard/data/active-initiatives.json from Dashboard.md project statuses. Update progress percentages and milestone statuses based on actual state.
5. Verify all wiki-links in Dashboard.md resolve to real files. Fix broken links.
6. Update dashboard/data/stale-items.json with any tasks or outreach older than 10 days with no update.
7. Archive completed drafts from Projects/drafts/ to Projects/archive/ with date prefix.

Commit and push all changes.
```
