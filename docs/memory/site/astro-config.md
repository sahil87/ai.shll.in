# Astro Config

## Overview

`astro.config.mjs` is the single configuration file for the entire site. It wires the site URL, the Tailwind Vite plugin, and the Starlight integration (which configures title, description, social links, sidebar, and custom CSS).

There is no `tailwind.config.js`, no separate sidebar/navigation config, no env-driven configuration. Everything is in one file.

## Requirements

- `site` MUST be set to `https://ai.shll.in` (the production URL with custom domain). Rationale: Astro uses this for absolute URLs in `<link rel="canonical">` and sitemap generation.
- The Tailwind v4 Vite plugin MUST be registered via `vite.plugins: [tailwindcss()]`. See [styling](./styling.md).
- Starlight MUST be the only Astro integration. Additional integrations SHALL be justified against [Constitution Principle IV](../../../fab/project/constitution.md) (minimal dependencies) before adding.
- The Starlight sidebar MUST be configured statically (manually listed entries), not auto-generated from the file tree. Adding or removing a tool requires updating the sidebar block alongside the content file.
- Social links MUST be configured via Starlight's `social` array (GitHub, Discord, X). Pages SHALL NOT hardcode duplicate social link blocks.
- `customCss` MUST include `./src/styles/global.css` so Tailwind utilities are available on every page.

## Design Decisions

- **Single config file.** No split between `astro.config.mjs` / `tailwind.config.js` / `starlight.config.ts`. Rationale: small surface area, easier to read at a glance, no risk of config files drifting out of sync.
- **Static sidebar over auto-generation.** Manually-curated entries give exact control over labels and order. Auto-generation from the file tree would tie the sidebar order to filesystem sort order (alphabetical), which doesn't match the loop's narrative order (idea → fab-kit → wt → run-kit, then hop/tu/shll).
- **Sidebar order matches the toolkit's loop, not alphabetical.** First entry is "All tools" (the `/tools/` index), then individual tools roughly in execution order. [INFERRED] — verified against the loop diagram in `src/content/docs/index.mdx`.
- **`@astrojs/mdx` registered as a peer.** Required for the `.mdx` home page. Declared in `package.json` dependencies but not explicitly listed in `integrations:` — Starlight integrates MDX support automatically. [INFERRED]

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

## Changelog

| Date | Change |
|------|--------|
| 2026-05-17 | Generated from code analysis |
