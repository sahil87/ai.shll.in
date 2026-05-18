# site

Site-level architecture and configuration: how content is organized, how it's styled, how Astro is configured.

| File | Description | Last Updated |
|------|-------------|--------------|
| [site-architecture](./site-architecture.md) | Pure Astro + Tailwind layout: hand-rolled chrome (TopBar/Sidebar/TOC/ThemeToggle), BaseLayout + DocLayout, tools collection, single source of truth in `src/data/tools.ts` | 2026-05-17 |
| [styling](./styling.md) | Tailwind v4 tokens + small base layer + 3 companion CSS rules, terminal-skin palette + JetBrains Mono, `@theme inline` + `--c-*` proxy theming | 2026-05-17 |
| [astro-config](./astro-config.md) | `astro.config.mjs` (6 lines) — site URL + Tailwind Vite plugin. No integrations. Head metadata lives in `BaseLayout`; sidebar lives in `src/data/tools.ts` | 2026-05-17 |
| [diagrams](./diagrams.md) | Pre-rendered SVG diagrams, current palette mapping, regeneration workflow (with `-b transparent`), theme-swap component | 2026-05-17 |
