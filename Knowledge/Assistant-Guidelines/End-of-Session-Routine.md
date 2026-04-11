# End of Session Routine

Run this routine when the user says "wrap up", "end session", "done for now", or similar.

---

## Steps

### 1. Save Vault Changes

Commit any modified vault files to preserve state between sessions:

```bash
git add -A
git commit -m "vault: auto-save session changes [$(date +%Y-%m-%d)]"
git push origin HEAD
```

Files that commonly change during a session:
- `Dashboard.md` — Task updates
- `Today.md` — Daily progress
- `Knowledge/Training/Feedback-Log.md` — New corrections
- `Knowledge/Training/Learned-Patterns.md` — Distilled patterns
- `dashboard/data/*.json` — Pipeline data updates
- Any new files in `Inbox/`, `Projects/`, or `Knowledge/`

### 2. Update Dashboard

Mark any completed tasks in `Dashboard.md`. Move them to the Completed section with today's date.

### 3. Summarize

Provide a brief end-of-session summary:
- What was accomplished
- What changed in the vault
- Any open items that carry forward to next session

---

## Notes

- If there are no changes to commit, skip the git step.
- Never commit `.env` or secret files — the `.gitignore` should prevent this, but double-check.
- This routine ensures that the next session (or another team member opening the Codespace) sees fresh data.
