# Styling

## Overview

Styling is Tailwind CSS v4 utility classes used in markup, with a "terminal skin" visual identity layered on via theme tokens. There is one stylesheet — `src/styles/global.css` — and after the Starlight removal it contains: `@fontsource/jetbrains-mono` weight imports (400/500/600/700), `@import "tailwindcss"`, a Tailwind v4 `@theme inline` block declaring color/font/animation tokens, two `:root` blocks (`:root` for light, `:root[data-theme="dark"]` for dark) that swap the palette, a small base layer (page `font-family`, `background`, `color`, line-height), and three thin component-companion rules (`main h2::before` for the `##` sage prefix, `.shell-group-label::before` for the `#` sidebar group prefix, `.ascii-rule` for the dashed horizontal rule).

The palette is "phosphor-amber + sage + teal" — warm near-black dark theme and warm-cream "paper terminal" light theme. Dark is the primary mode. An inline init script in `BaseLayout.astro` sets `data-theme="dark"` or `data-theme="light"` on `<html>` before paint to avoid FOUC.

All other terminal flourishes (blinking cursor on the H1, `$` prompts on CTAs, code-block corner labels, tree-list rows, callouts) are expressed as Tailwind utilities in markup composed inside small prop-only Astro components in `src/components/`.

## Requirements

- All component styling MUST use Tailwind utility classes in markup. Component-scoped class rules (`.terminal-cursor { ... }`) SHALL NOT be added unless they replace a clearly more verbose utility chain repeated across multiple components.
- `src/styles/global.css` MAY contain (a) `@import` directives for `@fontsource/jetbrains-mono` weights and Tailwind, (b) a `@theme inline` block declaring color/font/animation tokens, (c) `:root` and `:root[data-theme="dark"]` blocks binding `--c-*` palette variables, (d) a small base layer (html/body defaults), and (e) a small number of base-level companion rules tied to the terminal aesthetic — the current set is `main h2::before`, `.shell-group-label::before`, and `.ascii-rule`. The previous Constitution III ban on all class-based CSS rules has been relaxed for this site after visual-iteration feedback; the rule still favors utilities and components, but a 3-line CSS rule replacing a long utility chain is permitted when it makes the markup substantially clearer.
- Tailwind v4 MUST be integrated via the `@tailwindcss/vite` plugin in `astro.config.mjs`, registered through `vite.plugins`.
- The stylesheet MUST be imported by `BaseLayout.astro` (which all pages route through) so utilities are available on every page. Astro pages SHALL NOT import `global.css` directly.
- Every visible UI element MUST render correctly in both light and dark modes. Token swap is driven by the `:root` / `:root[data-theme="dark"]` blocks — `--c-*` values change between themes; utilities like `bg-bg`, `text-fg`, `text-accent` resolve to the active theme automatically via the `@theme inline` proxy layer. `dark:` Tailwind variants are unnecessary for color tokens and SHOULD NOT be used for them.
- The H1 blinking cursor MUST respect `prefers-reduced-motion` — the `animate-blink` utility is paired with `motion-reduce:animate-none` so reduced-motion users see a static block, not an animation.
- An inline `<script is:inline>` in `BaseLayout`'s `<head>` MUST set `document.documentElement.dataset.theme` from `localStorage('theme')` or `prefers-color-scheme` BEFORE any stylesheet imports — this prevents the light → dark flash on first paint for dark-default users.
- Diagrams MUST be pre-rendered to SVG at author-time and committed under `public/diagrams/` (one file per theme: `*-light.svg`, `*-dark.svg`). The runtime mermaid library SHALL NOT be a dependency. See [diagrams](./diagrams.md).

## Design Decisions

- **Tailwind v4 (not v3).** Uses the Vite-plugin architecture, no separate `tailwind.config.js` for the default config. Tokens declared in `@theme` become utility classes automatically (e.g., `--color-accent` → `bg-accent`, `text-accent`, `border-accent`). Theme-as-tokens is the v4-native ergonomic.
- **`@theme inline` with a `--c-*` proxy layer, not direct hex values in `@theme`.** Tailwind v4's `@theme` block normally inlines values into the generated utility CSS at build time. With `@theme inline`, Tailwind instead resolves utilities to `var(--color-*)` references that hit the cascade at runtime — so the `:root` / `:root[data-theme="dark"]` swap actually drives a theme change without rebuilding. The `--c-*` proxy (`--color-bg: var(--c-bg)`, etc.) is what makes the swap work: `--color-*` is the Tailwind contract; `--c-*` is the value that flips per theme.
- **`@fontsource/jetbrains-mono` (self-hosted) over Google Fonts `<link>`.** Self-hosted woff2s eliminate a runtime third-party request to `fonts.googleapis.com`, give deterministic offline builds, ship inside the same GitHub Pages cache as the rest of the site, and avoid sending visitor IPs to Google. Dependency cost: one npm package across 4 weights.
- **Token-based theming over `dark:` Tailwind variants for color.** Once `bg-bg` resolves through `--color-bg → --c-bg`, the same utility yields different pixels in dark vs light without authoring `dark:` modifiers. This keeps the markup smaller and more readable, and centralizes palette changes in one place. `dark:` is still appropriate for non-color toggles (e.g., `dark:invert` on a logo); for colors, prefer tokens.
- **Constitution III relaxed for this site.** The original constitutional rule was "Tailwind utilities only, no class-based CSS rules". During the Starlight rebuild, visual-iteration feedback was that this rule produced gymnastics (`before:content-['##_']` pseudo-element utilities, wrapper `<div>`s for code-block corner badges) where a 3-line CSS rule would have been much clearer. The rule has been relaxed for this codebase: small base-level rules tied to the terminal aesthetic (e.g., `main h2::before { content: "## "; }`) are permitted when they clearly beat the equivalent utility chain. The spirit (utilities for component styling; CSS for tokens + base + a few aesthetic rules) is retained.
- **Inline theme-init script.** Astro's `<script is:inline>` in `BaseLayout`'s `<head>` reads `localStorage('theme')` and sets `data-theme` synchronously before paint. This is the documented Astro pattern for theme toggles; without it, dark-default users see a brief light flash because the stylesheet ships light tokens as `:root`. The `ThemeToggle` component then handles user clicks (auto → light → dark cycle, persisted to `localStorage`).

## Companion CSS rules in `global.css`

These three rules sit alongside the tokens. They're aesthetic-tied: they're not per-component styling, they're "how this site renders structural elements universally". Each replaces a utility chain that would be repeated 4–7 times.

| Rule | Purpose | Replaces |
|------|---------|----------|
| `main h2::before { content: "## "; color: var(--c-accent-2); }` | Sage `##` prefix on every section heading in `<main>` | `before:content-['##_'] before:text-accent-2` per H2 |
| `.shell-group-label::before { content: "# "; color: var(--c-fg-faint); }` | Faint `# ` prefix on sidebar/TOC group labels | inline `<span># </span>` per label |
| `.ascii-rule::before { content: "──────…"; }` + base styling | One-line ASCII horizontal rule | 120-char dash literal + utility chain in `HRule.astro` |

If a similar rule is added later, it should follow the same test: replaces an obvious utility-chain repetition AND is aesthetic-tied (not per-component).

## Integration Points

- `astro.config.mjs`: `vite.plugins: [tailwindcss()]` — wires Tailwind into the Vite build
- `src/layouts/BaseLayout.astro`: `import '../styles/global.css'` — the only place `global.css` is loaded; all pages route through this layout
- `src/components/Hero.astro`, `HRule.astro`, `ToolRow.astro`, `Sidebar.astro`, `TopBar.astro`, `ThemeToggle.astro`, `TableOfContents.astro`: prop-only Astro components composed of Tailwind utilities. See [site-architecture](./site-architecture.md) for the full component layout.

## Changelog

| Date | Change |
|------|--------|
| 2026-05-17 | Generated from code analysis |
| 2026-05-17 | Terminal skin (change `260517-pdsp-terminal-skin`): `global.css` rewritten as tokens-only file with `@theme inline` + `--c-*` proxy + Starlight `--sl-*` variable bindings. |
| 2026-05-17 | Starlight removal (branch `starlight-removal`): dropped all `--sl-*` variable bindings from `global.css` (no longer needed without Starlight). Added a small base layer (`html { background; color; font-family; font-size; line-height }`) and three companion CSS rules (`main h2::before`, `.shell-group-label::before`, `.ascii-rule`). Stylesheet now loaded via `BaseLayout.astro` import (not `customCss` config). Inline theme-init script moved from Starlight to `BaseLayout`'s `<head>`. Constitution III rule relaxed: small base-level aesthetic CSS rules permitted when they replace repeated utility chains. |
