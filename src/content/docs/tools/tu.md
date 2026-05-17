---
title: tu
description: Token/cost tracker for Claude Code, Codex, OpenCode. Multi-machine sync, live watch mode.
---

`tu` tracks what your AI coding sessions are costing you — across tools and machines.

## Install

```bash
brew install sahil87/tap/tu
eval "$(tu shell-init zsh)"   # completion
```

## At a glance

```bash
tu                # today's cost, all tools
tu cc             # today's cost, Claude Code
tu h              # daily cost history
tu cc mh          # monthly cost history, Claude Code
tu m              # this month's cost
```

- **Multi-tool** — `cc` (Claude Code), `co` (Codex), `oc` (OpenCode), `all` (default).
- **Multi-machine sync** — push/pull metrics across laptops via a metrics repo.
- **Live watch mode** — `--watch` for persistent polling.
- **JSON output** — `--json` for scripting.

## Full docs

The full README — flags, multi-machine setup, sync semantics — lives on GitHub:

**→ [github.com/sahil87/tu](https://github.com/sahil87/tu)**
