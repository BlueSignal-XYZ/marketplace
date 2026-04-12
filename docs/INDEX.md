# Documentation Index

Top-level reference for the `docs/` subtree. The marketplace repo keeps a
small set of MDs at the root (README, CLAUDE, CONTRIBUTING, CODE_OF_CONDUCT,
SECURITY, CHANGELOG, LICENSE); everything else lives here.

Vault files (`Dashboard.md`, `Today.md`, `Inbox/`, `Knowledge/`, `Projects/`)
remain at the root because they drive the operational automation, not the
codebase.

## Map

### `docs/architecture/`
Technical design docs. Module boundaries, data models, cross-cutting patterns.

### `docs/audit/`
Point-in-time engineering audits. Each file is a snapshot of the codebase
at a given milestone — findings, risks, remediation status.

- `AUDIT_FINDINGS.md` — pre-launch findings from 2026-Q1 audit
- `BETA_AUDIT_REPORT.md` — beta-phase code review
- `E2E_INTEGRATION_AUDIT.md` — end-to-end flow verification
- `cloud_audit.md`, `sales_audit.md`, `wqt_audit.md` — per-product audits

### `docs/hardware/`
WQM-1 / gateway hardware integration docs.

- `GATEWAY_COMMISSIONING.md` — installer commissioning walk-through
- `GATEWAY_FIRMWARE_PROMPT.md` — firmware AI-assist prompt

### `docs/journeys/`
User journey maps by persona.

- `user_journeys.md` — farmer, buyer, installer, utility flows

### `docs/operations/`
Runtime / deployment / QA procedures.

- `AUDIT_SUMMARY.md` — executive summary of audit findings
- `DEPLOY_INSTRUCTIONS.md` — step-by-step deploy to Firebase + Cloudflare
- `DEPLOY_SMOKE_TEST.md` — post-deploy smoke checklist
- `SHIP_READINESS.md` — v1 launch readiness matrix
- `SHIP_READINESS_v2.md` — v1.1 launch readiness matrix
- `MOBILE_TABLET_QA.md` — device-matrix QA protocol
- `MARKETPLACE_HARDENING_PROMPT.md` — v1.1 hardening brief
- `wqt-triage.md` — WQT incident-response triage

### `docs/security/`
Security posture, audit findings, hardening decisions.

- `README.md` — overview and process for adding new endpoints
- `v1.1-hardening-audit.md` — v1.1 security pass
- `secrets-inventory.md` — all env vars, where they live, rotation policy
- `SECURITY_AUDIT_REPORT.md` — prior security audit
- `ENV_AUDIT.md` — env-var coverage audit
- `ENV_VARIABLE_AUDIT.md` — env-var presence check

## Root-level MDs (not moved)

- `README.md` — project overview and setup
- `CLAUDE.md` — AI-agent operating manual (principles, security, ADRs)
- `CONTRIBUTING.md` — contributor guide
- `CODE_OF_CONDUCT.md` — community standards
- `SECURITY.md` — responsible-disclosure contact
- `CHANGELOG.md` — version history
- `LICENSE` — license terms
- `Dashboard.md`, `Today.md` — vault operational docs (not code docs)

## Navigation conventions

- Files in `docs/` use plain-case filenames for historical consistency.
- Vault files use Hyphenated-Title-Case (see `CLAUDE.md` Vault Rules).
- Cross-references within `docs/` use relative paths; cross-references
  into the vault use absolute `[[Knowledge/...]]` wiki-links.
