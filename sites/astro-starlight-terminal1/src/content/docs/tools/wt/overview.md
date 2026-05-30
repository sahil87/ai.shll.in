---
title: wt
description: Opinionated git worktree wrapper — one worktree per change, one AI session per worktree, zero conflicts.
---

`wt` wraps `git worktree` with opinionated defaults: worktrees are sibling directories (`<repo>.worktrees/<name>/`), names are memorable adjective-noun pairs, and a shell wrapper makes `cd`-into-worktree from a menu work.

## Install

```bash
brew install sahil87/tap/wt
eval "$(wt shell-init)"   # in ~/.zshrc — needed for "Open here" cd
```

## At a glance

```bash
wt create                # new worktree with a random name
wt list                  # show every worktree
wt open lively-otter     # menu: editor / terminal / file manager / cd here
wt delete lively-otter   # remove (with optional branch cleanup)
```

- **Sibling layout, not clutter** — `<repo>.worktrees/<name>/`, never inside the main repo.
- **Memorable names** — `lively-otter`, `bold-fox`, not `feature-1`.
- **Real `cd` from a menu** — the shell wrapper lets `wt open` change your shell's directory.
- **Per-worktree init** — each new worktree runs an init script (default `fab sync`).

---

**Install**, **commands**, and **workflows** pages coming soon. For now, the full README — `wt create --base` start-point table, every flag, `wt open` context-aware behavior — lives on GitHub:

**→ [github.com/sahil87/wt](https://github.com/sahil87/wt)**
