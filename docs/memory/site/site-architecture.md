# Site Architecture

## Overview

ai.shll.in is a static Astro 6 site using the Starlight 0.39 integration. All content lives in a single content collection (`docs`) under `src/content/docs/`. The home page uses Starlight's `splash` template (no sidebar, hero block); tool pages use the default `doc` template (sidebar + TOC).

The site is a "directory of tools" — the home page presents the loop narrative and tool cards, and each tool gets a short page under `/tools/` that links out to its full README on GitHub.

## Requirements

- The site MUST build to fully static output (no SSR adapter, no server endpoints, no runtime data fetching for primary content). Rationale: deploys to GitHub Pages, which serves static assets only.
- Page content MUST live in `src/content/docs/` as `.md` or `.mdx` files, consumed via Starlight's `docsLoader()` and `docsSchema()`. Pages SHALL NOT be authored as `.astro` files under a `src/pages/` directory.
- The home page MUST use `template: splash` in its frontmatter to suppress the sidebar and render the hero.
- Tool pages MUST live under `src/content/docs/tools/` and follow the [tool-page-rubric](../conventions/tool-page-rubric.md).
- The sidebar MUST be configured statically in `astro.config.mjs` (not auto-generated from the file tree). Adding a tool requires both a new `.md` file AND a sidebar entry.

## Design Decisions

- **Starlight over a hand-rolled layout.** Starlight provides dark-mode toggle, sidebar, TOC, search, and theming out of the box — building these from scratch would add complexity without value for a documentation-style site.
- **Single content collection, not multiple.** The `docs` collection serves both the home page and tool pages. There is no separate `tools` collection — tool pages are just `.md` files under `docs/tools/`. [INFERRED] Rationale: matches Starlight's expected single-collection layout and keeps `content.config.ts` minimal.
- **Splash template for home, doc template for tools.** The splash template gives the marketing hero feel for the front door; the doc template gives the docs-site UX for individual tool pages. Different cognitive contexts, different templates.
- **Tool docs are "directory entries", not full docs.** Each tool page is ~30-40 lines: install command, at-a-glance examples, bulleted highlights, link to the GitHub README for the rest. Rationale: the toolkit's full docs live in each tool's own repo, and duplicating them here would create drift.

## File Layout

```
src/
├── content.config.ts          # docs collection: docsLoader() + docsSchema()
├── content/docs/
│   ├── index.mdx              # home page, template: splash
│   └── tools/
│       ├── index.md           # tools landing page
│       ├── idea.md
│       ├── hop.md
│       ├── fab-kit.md
│       ├── wt.md
│       ├── run-kit.md
│       ├── tu.md
│       └── shll.md
├── components/
│   └── Mermaid.astro          # client-side mermaid renderer
└── styles/global.css          # tailwind entry — one @import line
```

## Changelog

| Date | Change |
|------|--------|
| 2026-05-17 | Generated from code analysis |
