# Astro Config

## Overview

`astro.config.mjs` is the single configuration file for the entire site. It wires the site URL, the Tailwind Vite plugin, and the Starlight integration (which configures title, description, social links, sidebar, custom CSS, and the `Hero` component override that owns the home-page hero region).

There is no `tailwind.config.js`, no separate sidebar/navigation config, no env-driven configuration. Everything is in one file.

## Requirements

- `site` MUST be set to `https://ai.shll.in` (the production URL with custom domain). Rationale: Astro uses this for absolute URLs in `<link rel="canonical">` and sitemap generation.
- The Tailwind v4 Vite plugin MUST be registered via `vite.plugins: [tailwindcss()]`. See [styling](./styling.md).
- Starlight MUST be the only Astro integration. Additional integrations SHALL be justified against [Constitution Principle IV](../../../fab/project/constitution.md) (minimal dependencies) before adding.
- The Starlight sidebar MUST be configured statically (manually listed entries), not auto-generated from the file tree. Adding or removing a tool requires updating the sidebar block alongside the content file.
- Social links MUST be configured via Starlight's `social` array (GitHub, Discord, X). Pages SHALL NOT hardcode duplicate social link blocks.
- `customCss` MUST include `./src/styles/global.css` so Tailwind utilities are available on every page.
- Starlight's `components` key MUST register `Hero: './src/components/Hero.astro'` so the home page's `splash` template uses the custom hero override (shellpath + canonical `<h1 id="_top">` with blinking cursor + `$`-prefixed CTAs) instead of Starlight's default hero template. See [site-architecture](./site-architecture.md).

## Design Decisions

- **Single config file.** No split between `astro.config.mjs` / `tailwind.config.js` / `starlight.config.ts`. Rationale: small surface area, easier to read at a glance, no risk of config files drifting out of sync.
- **Static sidebar over auto-generation.** Manually-curated entries give exact control over labels and order. Auto-generation from the file tree would tie the sidebar order to filesystem sort order (alphabetical), which doesn't match the loop's narrative order (idea → fab-kit → wt → run-kit, then hop/tu/shll).
- **Sidebar order matches the toolkit's loop, not alphabetical.** First entry is "All tools" (the `/tools/` index), then individual tools roughly in execution order. [INFERRED] — verified against the loop diagram in `src/content/docs/index.mdx`.
- **`@astrojs/mdx` registered as a peer.** Required for the `.mdx` home page. Declared in `package.json` dependencies but not explicitly listed in `integrations:` — Starlight integrates MDX support automatically. [INFERRED]
- **`components: { Hero: ... }` override, not a hand-rolled splash template.** Starlight exposes a documented `components` map keyed by Starlight's component names — registering a path for `Hero` swaps the default hero implementation when the page frontmatter contains a `hero:` block. The override receives `Astro.locals.starlightRoute.entry.data.hero` (title, tagline, actions) and renders whatever markup it wants. Rationale: this is the framework's intended extension point — no need to fork the `splash` template, no need to drop to a custom `.astro` page, and no risk of duplicate `<h1>` injection. Rejected: building a parallel hero block inline in MDX (Starlight's `splash` template still auto-injects its own `<h1 id="_top">` from `title:`, producing two competing H1s) or forking the entire splash template (high maintenance burden on Starlight upgrades).

## Sidebar Structure

```
Start here
  └─ Overview              → /
Tools
  ├─ All tools             → /tools/
  ├─ idea                  → /tools/idea/
  ├─ hop                   → /tools/hop/
  ├─ fab-kit               → /tools/fab-kit/
  ├─ wt                    → /tools/wt/
  ├─ run-kit               → /tools/run-kit/
  ├─ tu                    → /tools/tu/
  └─ shll                  → /tools/shll/
```

Update both the sidebar block AND the `src/content/docs/tools/` directory in the same change.

## Component Overrides

Starlight allows replacing built-in UI components by passing a `components` map to the integration. Currently registered:

| Starlight component | Replaced by | Purpose |
|---------------------|-------------|---------|
| `Hero` | `src/components/Hero.astro` | Render the home-page hero with shellpath line above the H1, blinking cursor inside the H1, and `$`-prefixed CTA buttons, while emitting the single canonical `<h1 id="_top" data-page-title>` Starlight expects. |

Adding a new override means: (1) authoring an `.astro` component that satisfies the contract of the Starlight component being replaced (see Starlight's source for the props/slots it provides), (2) listing it under `components:` here, and (3) documenting it in this table and in [site-architecture](./site-architecture.md).

## Changelog

| Date | Change |
|------|--------|
| 2026-05-17 | Generated from code analysis |
| 2026-05-17 | Terminal skin (change `260517-pdsp-terminal-skin`): added `components: { Hero: './src/components/Hero.astro' }` to the Starlight integration. Documented the rationale (single canonical `<h1>` + Starlight's documented extension point) and added a Component Overrides section listing currently-registered overrides. |
