# Tool Page Rubric

## Overview

Every tool documented at `src/content/docs/tools/{name}.md` follows the same shape. The rubric is short on purpose — these pages are "directory entries" pointing to each tool's full README on GitHub, not full docs.

This pattern is observable across all seven tool pages (`idea.md`, `hop.md`, `fab-kit.md`, `wt.md`, `run-kit.md`, `tu.md`, `shll.md`) and is the expected shape for any new tool added to the toolkit.

## Requirements

Every tool page MUST contain the following sections, in order:

1. **Frontmatter** — `title` (the tool name) and `description` (one sentence, ≤140 chars, the elevator pitch). SHALL be valid Starlight `docsSchema()` frontmatter.
2. **Opening paragraph** — One short paragraph (1-2 sentences) describing what the tool is. SHALL NOT exceed two sentences.
3. **`## Install`** — A `bash` code block with the `brew install sahil87/tap/{tool}` line and any required shell-init eval (e.g., `eval "$(tool shell-init zsh)"`).
4. **`## At a glance`** — A `bash` code block with 4-6 representative commands and inline `# comment` annotations. Followed by a bulleted list of distinguishing properties (3-6 bullets).
5. **`## Full docs`** — One sentence pointing to the GitHub README, followed by `**→ [github.com/sahil87/{tool}](https://github.com/sahil87/{tool})**` as the link.

Tool pages SHALL NOT contain:

- Long-form command reference (every flag, every subcommand)
- Architecture diagrams (those belong in the tool's own README)
- Changelog or version history
- Screenshots (the toolkit is CLI-first; if a tool needs a screenshot, link to the GitHub README)

## Bullet Style

Bullets in the "At a glance" section MUST use the pattern: **bold short claim** — em-dash — short explanation. Examples from existing pages:

- **Plain Markdown, not a database** — the backlog is a checked-in file.
- **Substring navigation** — `h ou<TAB>` matches `outbox`.
- **One-shot install** — idempotent and safe to re-run.

Rationale: scannable on mobile, parallel structure across the toolkit, easy to extend.

## Sidebar Coupling

Every new tool page MUST also have a corresponding sidebar entry in `astro.config.mjs` under the "Tools" group. See [astro-config](../site/astro-config.md). Adding a page without a sidebar entry leaves the page unreachable from navigation (only via direct URL).

## Design Decisions

- **Short pages, not deep docs.** Each tool's authoritative docs live in its own repo README. Duplicating them here invites drift. The site is a directory; the READMEs are the destination.
- **Brew install line in every page.** Even though `shll install` installs everything, individual brew lines let visitors install one tool without buying into the whole toolkit.
- **`At a glance`, not `Usage`.** The section is deliberately a teaser, not a tutorial. The name signals "skim this, then read the full README."

## Changelog

| Date | Change |
|------|--------|
| 2026-05-17 | Generated from code analysis |
