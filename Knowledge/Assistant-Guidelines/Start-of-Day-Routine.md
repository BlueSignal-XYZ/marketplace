# Start of Day Routine

Run this routine at the beginning of each working session. Three phases: Gather, Process, Produce.

---

## Phase 1 — Gather

Collect information without making decisions.

1. **Check Inbox/** — Read all files in `Inbox/`. Note new items but don't act yet.
2. **Review open PRs** — Check GitHub for open pull requests on BlueSignal-XYZ repos (wqm-1, marketplace).
3. **Check CI status** — Look for failing builds or tests on active branches.
4. **Scan Dashboard.md** — Review the current priority list for context.
5. **Check Reminders/** — Look for any date-triggered reminders for today.

---

## Phase 2 — Process

Execute instructions and triage.

1. **Act on Inbox/ items** — Process each Inbox item:
   - If it's a direct instruction, execute it immediately
   - If it's a task, add to Dashboard.md with priority and dates
   - If it's reference info, file it in the appropriate Knowledge/ directory
   - Delete or archive processed Inbox items
2. **Triage Dashboard** — Re-sort Dashboard.md by current priority. Flag any blocked items.
3. **Research as needed** — If any task requires investigation, conduct it and store findings in `Projects/Research/`.
4. **Update project knowledge** — If you learned something new about WQM-1 or Marketplace, update the relevant knowledge file.

---

## Phase 3 — Produce

Rebuild daily files and deliver briefing.

1. **Rebuild Today.md** — Set today's focus, list tasks pulled from Dashboard, add any notes.
2. **Deliver briefing** — Summarize for the user:
   - What's in the Inbox (processed items)
   - PR/CI status highlights
   - Today's priority tasks
   - Any judgment calls made (and why)
   - Any blocked items needing attention

---

## Notes

- If no Inbox items exist and no PRs/CI issues are found, skip to Phase 3 and rebuild Today.md from Dashboard priorities.
- The briefing should be concise — aim for under 20 lines unless there's significant activity.
- Flag anything that requires a decision from the user rather than making assumptions.
