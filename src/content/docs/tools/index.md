---
title: All tools
description: Index of the @sahil87 AI coding toolkit — small Go CLIs that compose into a complete AI coding workflow.
---

Each tool is a small, single-purpose Go CLI. They work standalone and compose into a loop: capture → spec → parallel agent sessions → ship.

## The loop

| Tool | Role |
|------|------|
| [**idea**](/tools/idea/) | Capture — plain-Markdown backlog, feeds `/fab-new`. |
| [**fab-kit**](/tools/fab-kit/) | Spec — 7-stage AI pipeline that plans before coding. |
| [**wt**](/tools/wt/) | Isolate — one git worktree per change, one AI session per worktree. |
| [**run-kit**](/tools/run-kit/) | Orchestrate — browser dashboard for tmux + Claude Code workspaces. |

## Wrapping the loop

| Tool | Role |
|------|------|
| [**hop**](/tools/hop/) | Navigate — fuzzy-cd, batch-git, run-anything across repos. |
| [**tu**](/tools/tu/) | Track — token/cost for Claude Code, Codex, OpenCode. |
| [**shll**](/tools/shll/) | Maintain — meta-CLI to install, update, and shell-wire the whole toolkit. |

## Install everything

```bash
brew install sahil87/tap/all
shll shell-install
exec $SHELL
```

Or install a single tool — each tool page has its own `brew install` line.
