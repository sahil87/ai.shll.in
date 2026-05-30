---
title: shll
description: Meta-CLI to install, update, and shell-wire the whole toolkit in one command.
---

`shll` composes the per-tool CLIs — it doesn't replace them. One command to install, update, and shell-wire every tool in the toolkit.

## Install

```bash
brew install sahil87/tap/shll   # or: brew install sahil87/tap/all
shll install                    # brew-install every missing roster tool
shll shell-install              # append one composed eval block to your rc file
exec $SHELL
```

## At a glance

```bash
shll install        # bootstrap missing tools
shll update         # `brew update` then upgrade every installed roster tool
shll shell-install  # wire the composed shell-init into your rc file
shll version        # paste-friendly version dump for bug reports
```

- **One-shot install** — idempotent and safe to re-run.
- **One-line shell integration** — one eval block covers `hop`, `wt`, and any future shell-init.
- **One update for everything** — `brew update` once, then upgrade every installed roster tool.
- **No state, no special knowledge** — every subcommand is a thin coordinator over per-tool CLIs.

---

**Install**, **commands**, and **workflows** pages coming soon. For now, the full README — composition model, per-tool contributions, command reference — lives on GitHub:

**→ [github.com/sahil87/shll](https://github.com/sahil87/shll)**
