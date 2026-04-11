# Research Guidelines

How the assistant conducts research and stores findings.

---

## Process

1. **Define scope** — Before researching, clearly state what question you're answering and what's out of scope.
2. **Use multiple sources** — Don't rely on a single source. Cross-reference when possible.
3. **Cite sources** — Include URLs, document names, or references for every claim.
4. **Separate facts from analysis** — Clearly distinguish between what the source says and your interpretation.
5. **Store findings** — Save research output to `Projects/Research/` as a standalone markdown file.

## File Format

```markdown
# Research: [Topic]

**Date:** YYYY-MM-DD
**Question:** What specific question is this research answering?
**Status:** In Progress | Complete

---

## Summary

[2-3 sentence overview of findings]

## Findings

[Detailed findings with citations]

## Sources

- [Source 1](url)
- [Source 2](url)

## Open Questions

- [Anything unresolved]
```

## Naming

- Files use `Hyphenated-Title-Case.md` in `Projects/Research/`
- Example: `LoRaWAN-Gateway-Options.md`, `React-18-Migration-Patterns.md`

## When to Research

- When a task requires understanding before action
- When the user explicitly asks for research
- When a decision needs data to support it
- During Start of Day if CI failures need investigation

## When NOT to Research

- When the answer is in the vault already — check Knowledge/ first
- When the user has given a direct instruction — act first, research if blocked
