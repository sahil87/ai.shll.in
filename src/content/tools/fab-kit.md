---
title: fab-kit
description: 7-stage pipeline that forces AI agents to plan before they code. Claude Code, Codex, Cursor, Windsurf.
---

`fab-kit` is a development toolkit for AI-assisted coding. It includes a 7-stage pipeline (intake → spec → apply → review → hydrate → ship → review-PR), standalone CLI tools, and batch orchestration for running multiple AI agents in parallel. Plain markdown prompts, no SDK, no vendor lock-in.

## Install

```bash
brew install sahil87/tap/fab-kit
fab init      # in a project directory
```

## The 7 stages

| # | Stage | Purpose |
|---|-------|---------|
| 1 | **Intake** | Capture intent, scope, approach |
| 2 | **Spec** | Define requirements |
| 3 | **Apply** | Generate plan, execute the tasks |
| 4 | **Review** | Sub-agent validates against spec and constitution |
| 5 | **Hydrate** | Save learnings into project memory |
| 6 | **Ship** | Commit, push, create PR |
| 7 | **Review-PR** | Triage and fix PR review comments |

## Key ideas

- **Self-contained change folders** — each change has its own spec, plan, and status.
- **Project constitution** — `fab/project/constitution.md` defines MUST/SHOULD/MUST NOT rules; every spec, plan, and review checks against it.
- **Shared memory that grows** — design decisions hydrate into `docs/memory/`, loaded as context for future changes.
- **SRAD autonomy framework** — confidence-scored decisions: proceed silently, proceed with marker, or block and ask.

## Full docs

The full README — every slash command, the assembly-line workflow, integration with `wt` and `idea`, configuration — lives on GitHub:

**→ [github.com/sahil87/fab-kit](https://github.com/sahil87/fab-kit)**
