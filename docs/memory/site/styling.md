# Styling

## Overview

Styling is exclusively Tailwind CSS v4 utility classes used in markup. There is one stylesheet — `src/styles/global.css` — and it contains a single `@import "tailwindcss";` line. No component-scoped CSS, no CSS-in-JS, no PostCSS configuration beyond the Tailwind Vite plugin.

Dark mode is provided by Starlight's built-in theme toggle, which sets `data-theme="dark"` on the `<html>` element. All custom UI must render correctly in both modes.

## Requirements

- All styling MUST use Tailwind utility classes directly in markup. Custom CSS classes SHALL NOT be defined.
- `src/styles/global.css` MUST contain only `@import "tailwindcss";` and (optionally) Tailwind v4 theme tokens. It SHALL NOT contain component-scoped rules.
- Tailwind v4 MUST be integrated via the `@tailwindcss/vite` plugin in `astro.config.mjs`, registered through `vite.plugins`.
- The stylesheet MUST be registered with Starlight via `customCss: ['./src/styles/global.css']` so it is included in the build output.
- Every visible UI element MUST render correctly in both light and dark modes using Tailwind's `dark:` variants. Element-specific dark/light handling SHALL use `dark:` modifiers, not separate stylesheets.
- Diagrams MUST be pre-rendered to SVG at author-time and committed under `public/diagrams/` (one file per theme: `*-light.svg`, `*-dark.svg`). The runtime mermaid library SHALL NOT be a dependency. See [diagrams](./diagrams.md).

## Design Decisions

- **Tailwind v4 (not v3).** v4 is the current major; uses the new Vite-plugin architecture, no separate `tailwind.config.js` required for the default config. Rationale: this is a green-field project, no migration burden.
- **No custom CSS architecture.** This is a single-page marketing site with a small `/tools/` directory. Introducing BEM, CSS Modules, or a CSS-in-JS layer would be unjustified complexity for the surface area.
- **Starlight's theme system, not a custom one.** Starlight ships a polished dark/light toggle with persistence. Reimplementing this would duplicate work and risk inconsistency with Starlight's own components.

## Integration Points

- `astro.config.mjs`: `vite.plugins: [tailwindcss()]` — wires Tailwind into the Vite build
- `astro.config.mjs`: `starlight({ customCss: ['./src/styles/global.css'] })` — includes the stylesheet in every page
- `src/styles/global.css`: the entry file — kept to one line on purpose; deviations require justification against [the constitution](../../../fab/project/constitution.md) Principle III

## Changelog

| Date | Change |
|------|--------|
| 2026-05-17 | Generated from code analysis |
