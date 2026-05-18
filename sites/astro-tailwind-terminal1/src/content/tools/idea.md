---
title: idea
description: Plain-Markdown backlog tracker — worktree-aware, queryable from the CLI, feeds /fab-new.
---

`idea` captures and manages a per-repo backlog in a plain Markdown file (`fab/backlog.md`). The file is the contract: hand-edit it, grep it, diff it, review it in PRs.

## Install

```bash
brew install sahil87/tap/idea
```

## At a glance

```bash
idea "refactor auth middleware to use JWT"   # add
idea list                                    # show open
idea done qu1d                               # mark done
```

- **Plain Markdown, not a database** — the backlog is a checked-in file.
- **Per-repo, not global** — every repo has its own backlog.
- **Worktree-aware** — reads/writes the current worktree's backlog by default; `--main` opts into the shared one.
- **Short, addressable IDs** — `[qu1d]`-style IDs you can type into any command.
- **Hooks into fab-kit** — same `fab/backlog.md` that `/fab-new` reads.

## Full docs

The full README — command reference, file format contract, worktree resolution table, integration patterns — lives on GitHub:

**→ [github.com/sahil87/idea](https://github.com/sahil87/idea)**
