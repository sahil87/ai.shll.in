---
title: Install
description: Install fab-kit, initialize a project, and verify your agent picks up the slash commands.
---

## Install the CLI

```bash
brew install sahil87/tap/fab-kit
fab --version
```

## Initialize a project

```bash
cd ~/code/your-project
fab init
```

`fab init` is idempotent. It creates:

- `fab/project/config.yaml` — naming conventions, source paths, stage directives
- `fab/project/constitution.md` — your project's MUST/SHOULD/MUST NOT rules (stub)
- `fab/changes/` — directory for per-change folders (empty)
- `.claude/skills/` — slash command definitions for Claude Code
- `docs/memory/index.md`, `docs/specs/index.md` — memory/spec indices

Edit `constitution.md` next. The agent reads it every stage; vague constitutions yield vague specs.

## Verify your agent

In Claude Code (or any agent that loads `.claude/skills/`):

```text
/fab-help
```

You should see the full command list. If not, the skills directory isn't on the agent's load path.

## Update

```bash
brew upgrade sahil87/tap/fab-kit
fab kit sync                # syncs the latest skills into .claude/skills/
```

`fab kit sync` is required after major version upgrades — it rewrites the skill files to match the new CLI.

## What's installed where

- `fab` CLI → `/opt/homebrew/bin/fab`
- Skills/templates → `~/.fab-kit/versions/<version>/`
- Per-project files → `fab/` and `.claude/skills/` in the project root
