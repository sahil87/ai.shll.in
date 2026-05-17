# Site Architecture

## Overview

ai.shll.in is a static Astro 6 site using the Starlight 0.39 integration. All content lives in a single content collection (`docs`) under `src/content/docs/`. The home page uses Starlight's `splash` template with a custom `Hero` component override (registered via `astro.config.mjs` `components: { Hero: './src/components/Hero.astro' }`) so the hero can render a terminal-style shellpath line above the H1, a blinking cursor at the end of the H1, and `$`-prefixed CTAs — while still producing the single canonical `<h1 id="_top">` Starlight expects. Tool pages use the default `doc` template (sidebar + TOC).

The site is a "directory of tools" — the home page presents the loop narrative and renders the seven tools as a tree-list (`├── name  description`) via the `<ToolRow>` component, replacing the previous `<CardGrid>`/`<Card>` layout. Each tool gets a short page under `/tools/` that links out to its full README on GitHub.

## Requirements

- The site MUST build to fully static output (no SSR adapter, no server endpoints, no runtime data fetching for primary content). Rationale: deploys to GitHub Pages, which serves static assets only.
- Page content MUST live in `src/content/docs/` as `.md` or `.mdx` files, consumed via Starlight's `docsLoader()` and `docsSchema()`. Pages SHALL NOT be authored as `.astro` files under a `src/pages/` directory.
- The home page MUST use `template: splash` in its frontmatter to suppress the sidebar and render the hero.
- The home page hero MUST go through the registered `Hero` component override (`src/components/Hero.astro`) — not inline MDX hero markup — so there is exactly one canonical `<h1 id="_top" data-page-title>` per page. Frontmatter SHALL declare `hero:` with `tagline` and `actions` so the override can read them; `title` falls back to the page-level `title` if omitted from `hero:`.
- Tool pages MUST live under `src/content/docs/tools/` and follow the [tool-page-rubric](../conventions/tool-page-rubric.md).
- The sidebar MUST be configured statically in `astro.config.mjs` (not auto-generated from the file tree). Adding a tool requires both a new `.md` file AND a sidebar entry.
- The home-page Tools section MUST render via the `<ToolRow>` component (one row per tool, branch character `├──` for rows 1–6 and `└──` for row 7). `<CardGrid>` and `<Card>` SHALL NOT be imported or used on the home page.

## Design Decisions

- **Starlight over a hand-rolled layout.** Starlight provides dark-mode toggle, sidebar, TOC, search, and theming out of the box — building these from scratch would add complexity without value for a documentation-style site.
- **Starlight `Hero` component override over inline MDX hero markup.** The terminal-skin hero needs (a) a shellpath line above the H1, (b) a blinking cursor inside the H1, and (c) `$` prefixes before each CTA. Starlight's default `hero:` frontmatter cannot express any of these. An initial attempt built a custom MDX hero block, but Starlight's `splash` template still auto-injected its own `<h1 id="_top">` from `title:` frontmatter — producing two competing `<h1>` elements and invalid HTML nesting (`<h1><p>...</p></h1>` after MDX paragraph-wrapping). The fix is the documented Starlight extension point: register a component override under `astro.config.mjs` `components: { Hero: ... }`. The override owns the entire hero region (Starlight does not also inject its default), emits a single canonical `<h1 id="_top" data-page-title>`, and can include arbitrary surrounding markup. Rejected: keeping the custom MDX hero with workarounds (e.g., manually suppressing the auto-injected H1 via CSS) — fragile, fights the framework, and leaves duplicate H1s in the DOM.
- **Single content collection, not multiple.** The `docs` collection serves both the home page and tool pages. There is no separate `tools` collection — tool pages are just `.md` files under `docs/tools/`. [INFERRED] Rationale: matches Starlight's expected single-collection layout and keeps `content.config.ts` minimal.
- **Splash template for home, doc template for tools.** The splash template gives the marketing hero feel for the front door; the doc template gives the docs-site UX for individual tool pages. Different cognitive contexts, different templates.
- **Tool docs are "directory entries", not full docs.** Each tool page is ~30-40 lines: install command, at-a-glance examples, bulleted highlights, link to the GitHub README for the rest. Rationale: the toolkit's full docs live in each tool's own repo, and duplicating them here would create drift.
- **Tree-list for the Tools section, not restyled cards.** Each row is a 3-column CSS Grid (branch / name / description) composed of Tailwind utilities inside `<ToolRow>`. The `tree(1)`-style branch characters (`├── / └──`) directly evoke the metaphor of "seven small CLIs in one toolkit." Rejected: keeping `<CardGrid>`/`<Card>` and deeply overriding their styles — visually weaker, fights Starlight's card chrome, and the user explicitly chose Replace over Restyle.
- **`HRule` and `ToolRow` as Astro components, not inline utility chains.** The ASCII rule's ~120-character dash literal + utility chain repeats four times on the home page; the tree-row's 3-column grid utility chain repeats seven times. Extracting them to prop-only Astro components dedups the literals without violating Constitution III (the component source uses Tailwind utilities in markup — no `<style>` block, no class-based CSS rules). See [styling](./styling.md) for the rule.

## File Layout

```
src/
├── content.config.ts          # docs collection: docsLoader() + docsSchema()
├── content/docs/
│   ├── index.mdx              # home page, template: splash + Hero component override
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
│   ├── Diagram.astro          # swaps light/dark pre-rendered SVGs by Starlight theme attr
│   ├── Hero.astro             # Starlight Hero override — shellpath + canonical <h1> + cursor + $-prefixed CTAs
│   ├── HRule.astro            # ASCII horizontal rule (dashes in fg-faint, aria-hidden)
│   └── ToolRow.astro          # one tree row in the Tools section: branch / name link / description with Docs+GitHub links
├── diagrams/                  # mermaid sources (.mmd), pre-rendered to public/diagrams/
└── styles/global.css          # Tailwind v4 tokens-only entry — see styling.md
```

## Changelog

| Date | Change |
|------|--------|
| 2026-05-17 | Generated from code analysis |
| 2026-05-17 | Terminal skin (change `260517-pdsp-terminal-skin`): home page Tools section migrated from `<CardGrid>`/`<Card>` to a tree-list rendered via the new `<ToolRow>` component. Home-page hero migrated from inline MDX to a Starlight `Hero` component override (`src/components/Hero.astro`) registered via `astro.config.mjs` `components: { Hero: ... }` — rationale: single canonical `<h1 id="_top">` plus Starlight's documented extension point. Added `Hero.astro`, `HRule.astro`, `ToolRow.astro` to `src/components/`. `Mermaid.astro` reference corrected to the actual `Diagram.astro` file. |
