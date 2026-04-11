# Custom Instructions

Direct behavioral overrides. **These take highest priority** — they override defaults in CLAUDE.md and patterns in Learned-Patterns.md.

Write instructions as clear, specific directives. The assistant will follow these exactly.

---

## Instructions

### Code Standards — WQM-1 (Python)
- Always include type hints for function parameters and return values.
- Use `logging` module instead of `print()` for all firmware output.
- Sensor calibration functions must include unit tests with known reference values.

### Code Standards — Marketplace (TypeScript/React)
- Prefer `const` over `let`. Never use `var`.
- Use strict TypeScript mode (`strict: true` in tsconfig).
- React components use functional components with hooks — no class components.
- Prefer named exports over default exports.

### Development Workflow
- Always run tests before committing code changes.
- Commit messages use imperative mood and reference issue numbers when applicable (e.g., "Add pH calibration routine (#12)").
- "Deploy" means push to the staging environment first. Never deploy directly to production without explicit confirmation.
- When creating PRs, focus review comments on: error handling, type safety, and test coverage.

### Task Management
- Dashboard.md is the single source of truth for task tracking. All tasks live there until explicitly completed.
- Every TODO must include `(Added YYYY-MM-DD, updated YYYY-MM-DD)` timestamps.
- When completing a task, move it to the Completed section with completion date — don't delete it.

### Communication
- Lead with what changed, then why, then what to do next.
- Use tables for data, prose for narrative. End reports with concrete next steps.
- No corporate jargon. Be direct and concise.
