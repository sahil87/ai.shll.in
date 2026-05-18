---
title: Install everything
description: One brew tap, one install command, the whole toolkit.
---

```bash
brew install sahil87/tap/shll
shll install              # installs idea, hop, fab-kit, wt, run-kit, tu
eval "$(shll shell-init zsh)"
```

That's it. `shll install` is idempotent and safe to re-run; it will only update tools that have moved.

## Verify

```bash
shll doctor
```

`doctor` checks each tool's binary, version, and shell wiring. Any red lines are actionable — follow the suggestion next to each.

## Per-tool install

If you only want one tool, every tool has its own brew formula:

```bash
brew install sahil87/tap/idea
brew install sahil87/tap/fab-kit
# etc.
```

Skip the meta-installer; you opt in piece by piece.

## Update

```bash
shll update
```

Updates every installed tool to the latest tap version. To pin a specific tool, install it directly via brew instead of through `shll install`.

---

Next: head to a [tool overview](/tools/idea/overview/) or learn the [daily flow](/workflows/daily-flow/).
