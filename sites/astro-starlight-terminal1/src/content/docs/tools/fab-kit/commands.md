---
title: Commands
description: fab-kit command reference — slash commands for agents, CLI commands for humans.
---

`fab-kit` exposes two surfaces:

1. **Slash commands** for AI agents (Claude Code, Codex) — `/fab-new`, `/fab-continue`, etc.
2. **CLI commands** for humans and scripts — `fab change`, `fab status`, etc.

Slash commands wrap a pipeline of CLI calls; the CLI is what runs underneath.

## Slash commands (for agents)

| Command | Purpose |
|---------|---------|
| `/fab-new` | Start a new change — creates intake, activates it |
| `/fab-continue` | Advance to the next stage (spec, apply, review, hydrate) |
| `/fab-ff` | Fast-forward through hydrate, confidence-gated |
| `/fab-fff` | Full pipeline including ship + review-PR |
| `/fab-clarify` | Refine the current stage's artifact |
| `/fab-status` | Show current change state |
| `/fab-switch` | Change which change is active |
| `/git-pr` | Commit, push, and open a PR |
| `/git-pr-review` | Process PR review comments |

Each command's behavior is defined in `.claude/skills/<command>/SKILL.md` — plain markdown the agent reads.

## CLI commands (for humans)

### `fab change`

```bash
fab change new --slug auth-middleware-jwt
fab change list
fab change switch <id-or-name>
fab change rename <new-slug>
fab change archive <id-or-name>
```

### `fab status`

```bash
fab status                              # current change, all stages
fab status finish <change> <stage>      # mark stage done, activate next
fab status reset <change> <stage>       # revert a stage
fab status set-change-type <type>       # fix | feat | refactor | docs | …
```

### `fab score`

```bash
fab score <change>                      # compute SRAD confidence
fab score --check-gate <change>         # exit non-zero below threshold
```

### `fab preflight`

```bash
fab preflight                           # validate init + resolve active change
fab preflight <change>                  # override active change (transient)
```

### `fab log`

```bash
fab log command <skill> <change>        # best-effort telemetry
```

---

For the full CLI reference (every subcommand, every flag), see the [GitHub README](https://github.com/sahil87/fab-kit).
