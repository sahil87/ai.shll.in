# Diagrams

## Overview

Diagrams are pre-rendered to SVG at author-time and shipped as static assets. The runtime mermaid library is NOT a dependency. Each diagram has one source `.mmd` file and two output SVGs (light and dark themes); a small `<Diagram>` component swaps between them based on Starlight's theme attribute.

## Requirements

- Diagram sources MUST live in `src/diagrams/*.mmd` (mermaid syntax). The source file SHALL be committed so diagrams can be regenerated reproducibly.
- Each diagram MUST have two pre-rendered outputs in `public/diagrams/`: `{name}-light.svg` and `{name}-dark.svg`. Both files SHALL be committed.
- Pages MUST consume diagrams via the `<Diagram>` component (`src/components/Diagram.astro`), passing `light` and `dark` props with absolute URL paths.
- Diagrams MUST switch correctly when the user toggles theme via Starlight's header button (which sets `data-theme` on `<html>`).
- The `mermaid` package SHALL NOT appear in `package.json` dependencies. Rationale: runtime rendering of two static diagrams violates Constitution Principles I (zero runtime) and IV (minimal dependencies).

## Regeneration Workflow

When a diagram source changes, regenerate both SVGs:

```sh
npx -y -p @mermaid-js/mermaid-cli mmdc \
  -i src/diagrams/loop.mmd -t default \
  -o public/diagrams/loop-light.svg

npx -y -p @mermaid-js/mermaid-cli mmdc \
  -i src/diagrams/loop.mmd -t dark -b transparent \
  -o public/diagrams/loop-dark.svg
```

`mmdc` is run via `npx -y` (ephemeral, no install). Total render time: ~10s per diagram.

Commit the resulting `.svg` files alongside the `.mmd` source.

## Design Decisions

- **Pre-render over runtime mermaid.** The site has one diagram. Shipping a ~600KB JS library to render it client-side is overkill, contradicts the static-first ethos, and delays first paint. Pre-rendered SVGs are ~67KB each (still not tiny, but loaded once via `<img>` with `loading="lazy"`).
- **Pre-render over `rehype-mermaid` build plugin.** The plugin works but pulls in `playwright` (~200MB+ build dep), adding significant CI install time. Pre-rendering is a manual step but keeps the build dep-free.
- **Two files, not one with CSS variables.** Mermaid's default and dark themes use different geometry-affecting properties (label colors, contrast). Rather than fight those at the CSS level, ship two pre-rendered files. The cost is regenerating both on every change; the benefit is no theme-related rendering surprises.
- **`<picture>` was considered and rejected.** `<picture media="(prefers-color-scheme: dark)">` only responds to OS preference, not Starlight's `data-theme` toggle. The `<Diagram>` component uses plain `<img>` + a tiny MutationObserver on `<html>` to handle both OS and manual toggle.

## When to Add a New Diagram

1. Author the `.mmd` source under `src/diagrams/`
2. Render both `-light.svg` and `-dark.svg` outputs (see workflow above)
3. Reference via `<Diagram light="/diagrams/X-light.svg" dark="/diagrams/X-dark.svg" alt="..." />`
4. Commit all three files (source + two SVGs)

If the diagram count grows beyond ~5, revisit the `rehype-mermaid` build-plugin tradeoff.

## Changelog

| Date | Change |
|------|--------|
| 2026-05-17 | Generated from code analysis after pre-render migration |
