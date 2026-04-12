# Security Documentation

This directory contains the security posture, audit findings, and hardening
decisions for the BlueSignal marketplace repo.

**Repo is public.** Mythos-class models capable of autonomous vulnerability
discovery reach GA in 2026. Assume the code here will be read adversarially.
The baseline defense is: no secrets in client code, strict Firebase rules,
input validation at every endpoint, owner-scoped queries.

## Files

| File                              | Purpose                                                          |
| --------------------------------- | ---------------------------------------------------------------- |
| `v1.1-hardening-audit.md`         | v1.1 security pass findings + remediation status                 |
| `firebase-rules-audit.md`         | Walk of `database.rules.json` and `firestore.rules`, risk-ranked |
| `cloud-function-endpoints.md`     | Input validation posture per Cloud Function endpoint             |
| `secrets-inventory.md`            | All env vars, where they're used, how they're distributed        |

## Adding a new endpoint

Before merging a PR that adds a Cloud Function or RTDB write path, update
this directory with a section describing:

1. **What it does** — one sentence, plain English.
2. **Auth requirement** — which identity callers need.
3. **Input validation** — what shapes + ranges are enforced, where.
4. **Blast radius** — what data can the caller read/write? What's the worst
   case if a bug lets unauthenticated/unauthorized users hit it?
5. **Rate limit** — expected load, backoff behavior.
6. **Rollback plan** — how do you disable this endpoint in an incident?

If any of these are missing, the endpoint isn't ready for production.

## Reporting vulnerabilities

See `/SECURITY.md` at repo root for the responsible-disclosure contact.
