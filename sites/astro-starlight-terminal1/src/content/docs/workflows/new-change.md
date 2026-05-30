---
title: Start a new change
description: The cleanest path from backlog item to active worktree with an agent.
---

Five commands, one minute, end-to-end.

## The flow

```bash
idea "add CSV export to reports page"
# captured as [k3m1]

idea list
# [k3m1] add CSV export to reports page

wt create csv-export --from-idea k3m1
# new worktree, branch, and fab change folder

cd ../<repo>.worktrees/csv-export
rk riff --skill /fab-fff
```

That's it. The agent is now driving the pipeline; you watch in the dashboard.

## What just happened, in detail

1. `idea "..."` appends an item to `fab/backlog.md` with a generated ID `[k3m1]`.
2. `wt create csv-export --from-idea k3m1`:
   - Creates a git worktree at `../<repo>.worktrees/csv-export/`
   - Creates a git branch `<YYMMDD>-<XXXX>-csv-export`
   - Runs the per-worktree init script (default: `fab change new --slug csv-export --from-idea k3m1`)
   - The init script creates `fab/changes/<YYMMDD>-<XXXX>-csv-export/intake.md` seeded from the backlog item
3. `rk riff --skill /fab-fff`:
   - Spawns a Claude Code agent in a new tmux pane
   - Sends `/fab-fff` as the first input
   - Agent runs the full pipeline autonomously

## Without `wt` (single-repo, no worktrees)

```bash
idea "add CSV export to reports page"
fab change new --slug csv-export --from-idea k3m1
git checkout -b $(fab resolve --folder)
# then: /fab-fff in your agent
```

Workable, but you lose the parallelism. The toolkit assumes worktrees as the default unit of work.

## Without `rk` (no dashboard)

```bash
# in the worktree:
claude                  # or codex, cursor — any agent
# in the agent: /fab-fff
```

You lose the cross-session view, but the pipeline runs identically. `rk` is convenience, not contract.

## Without `idea` (one-off change)

```bash
wt create csv-export
cd ../<repo>.worktrees/csv-export
fab change new --slug csv-export
# then: /fab-new "add CSV export to reports page"   (or just /fab-fff)
```

`fab change new` without `--from-idea` produces an empty intake; the slash command's first prompt fills it in.
