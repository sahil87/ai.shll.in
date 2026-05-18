---
title: Commands
description: idea command reference — add, list, done, edit, and the worktree-resolution flags.
---

`idea` follows a verb-first command shape. Every command operates on `fab/backlog.md` in the current worktree by default.

## `idea add`

Add a new backlog item.

```bash
idea "refactor auth middleware to use JWT"
idea add "refactor auth middleware to use JWT"   # equivalent
```

The bare `idea <string>` form is the most-used shortcut. New items get a short alphanumeric ID like `[qu1d]` assigned automatically.

## `idea list`

Show open items.

```bash
idea list                    # all open items
idea list --tag refactor     # filter by tag
idea list --all              # include done items
```

## `idea done`

Mark an item as done.

```bash
idea done qu1d
idea done qu1d --reason "merged in #42"
```

## `idea edit`

Open the backlog file in `$EDITOR`.

```bash
idea edit                    # opens fab/backlog.md
```

Useful when you want to bulk-edit, reorder, or add multi-line context that's awkward via `idea add`.

## Worktree resolution

By default, `idea` reads/writes the backlog for the current worktree. This means each worktree (managed by [`wt`](/tools/wt/overview/)) has an isolated backlog — useful for parallel changes.

```bash
idea list                    # current worktree
idea list --main             # the main worktree's backlog
idea list --worktree feat-x  # a named worktree's backlog
```

## Output formats

```bash
idea list --json             # JSON for piping to other tools
idea list --tsv              # tab-separated for spreadsheets
```

---

For the full flag matrix and file format contract, see the [GitHub README](https://github.com/sahil87/idea).
