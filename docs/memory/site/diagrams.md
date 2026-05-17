# Diagrams

## Overview

Diagrams are pre-rendered to SVG at author-time and shipped as static assets. The runtime mermaid library is NOT a dependency. Each diagram has one source `.mmd` file and two output SVGs (light and dark themes); a small `<Diagram>` component swaps between them based on `document.documentElement.dataset.theme` (set by `BaseLayout.astro`'s inline init script and updated by `ThemeToggle.astro`).

The current palette (one diagram: the loop) maps `classDef` strokes to the terminal-skin tokens: `tool` → `#d4a73a` (amber), `agent` → `#7cb342` (sage), `ship` → `#5eb3b3` (teal), `ambient` → `#7c8593` (fg-dim grey). These match the `--c-accent`, `--c-accent-2`, `--c-accent-3`, and `--c-fg-dim` tokens declared in `src/styles/global.css` (see [styling](./styling.md)).

## Requirements

- Diagram sources MUST live in `src/diagrams/*.mmd` (mermaid syntax). The source file SHALL be committed so diagrams can be regenerated reproducibly.
- Each diagram MUST have two pre-rendered outputs in `public/diagrams/`: `{name}-light.svg` and `{name}-dark.svg`. Both files SHALL be committed.
- Pages MUST consume diagrams via the `<Diagram>` component (`src/components/Diagram.astro`), passing `light` and `dark` props with absolute URL paths.
- Diagrams MUST switch correctly when the user toggles theme via `ThemeToggle.astro` (which sets `data-theme` on `<html>`).
- The `mermaid` package SHALL NOT appear in `package.json` dependencies. Rationale: runtime rendering of two static diagrams violates Constitution Principles I (zero runtime) and IV (minimal dependencies).
- `classDef` stroke colors in `.mmd` sources MUST track the palette tokens in `src/styles/global.css`. When the palette changes, both the `.mmd` source AND the two output SVGs MUST be regenerated and committed together. The current mapping (loop diagram): `tool→#d4a73a`, `agent→#7cb342`, `ship→#5eb3b3`, `ambient→#7c8593`.
- Both output SVGs MUST end up with a `transparent` root background. The mermaid CLI's `default` (light) theme inlines `background-color: white` into the root `<svg style="...">`, which clashes with the site's warm-cream `--c-bg` (#f5f1e8). Either pass `-b transparent` at generation time, or strip the white background post-render before committing.

## Regeneration Workflow

When a diagram source changes, regenerate both SVGs:

```sh
npx -y -p @mermaid-js/mermaid-cli mmdc \
  -i src/diagrams/loop.mmd -t default -b transparent \
  -o public/diagrams/loop-light.svg

npx -y -p @mermaid-js/mermaid-cli mmdc \
  -i src/diagrams/loop.mmd -t dark -b transparent \
  -o public/diagrams/loop-dark.svg
```

`mmdc` is run via `npx -y` (ephemeral, no install). Total render time: ~10s per diagram.

**Note on the `-b transparent` flag for light.** Mermaid CLI's `default` theme inserts `style="...; background-color: white;"` on the root `<svg>` element. That white conflicts with the site's non-white light-mode background (`--c-bg: #f5f1e8` — warm cream "paper terminal"), producing a visible white rectangle around the diagram. Passing `-b transparent` to both invocations sets the root style to `background-color: transparent` so the SVG inherits whatever color sits behind it. If a future mermaid CLI version ignores the flag for `default`, fall back to a post-render `sed`/`perl` strip of the `background-color: white` substring before committing.

Commit the resulting `.svg` files alongside the `.mmd` source.

## Design Decisions

- **Pre-render over runtime mermaid.** The site has one diagram. Shipping a ~600KB JS library to render it client-side is overkill, contradicts the static-first ethos, and delays first paint. Pre-rendered SVGs are ~67KB each (still not tiny, but loaded once via `<img>` with `loading="lazy"`).
- **Pre-render over `rehype-mermaid` build plugin.** The plugin works but pulls in `playwright` (~200MB+ build dep), adding significant CI install time. Pre-rendering is a manual step but keeps the build dep-free.
- **Two files, not one with CSS variables.** Mermaid's default and dark themes use different geometry-affecting properties (label colors, contrast). Rather than fight those at the CSS level, ship two pre-rendered files. The cost is regenerating both on every change; the benefit is no theme-related rendering surprises.
- **`<picture>` was considered and rejected.** `<picture media="(prefers-color-scheme: dark)">` only responds to OS preference, not the site's `data-theme` toggle. The `<Diagram>` component uses plain `<img>` + a tiny MutationObserver on `<html>` to handle both OS and manual toggle.
- **`classDef` stroke colors live in the `.mmd` source, not as CSS overrides on the rendered SVG.** Editing strokes after render (via JS, CSS targeting `<svg> path`, or a post-render rewrite) would couple diagram appearance to the consumer page and fight mermaid's own theme system. Keeping colors in the `.mmd` source means the rendered SVG is self-contained and the palette decision is reviewable in one diff alongside the rest of the diagram structure.
- **`-b transparent` over post-render strip.** Both approaches work; the flag is fewer steps and keeps the regeneration workflow a one-liner per diagram. If a future mermaid release regresses on the flag for the `default` theme, the post-render strip is the documented fallback.

## When to Add a New Diagram

1. Author the `.mmd` source under `src/diagrams/`, using the established `classDef` palette (`tool/agent/ship/ambient`) — or extend the palette in both `global.css` and the `.mmd` source in the same change
2. Render both `-light.svg` and `-dark.svg` outputs (see workflow above) with `-b transparent` on both
3. Verify the root `<svg style="...">` ends with `background-color: transparent` in both files
4. Reference via `<Diagram light="/diagrams/X-light.svg" dark="/diagrams/X-dark.svg" alt="..." />`
5. Commit all three files (source + two SVGs)

If the diagram count grows beyond ~5, revisit the `rehype-mermaid` build-plugin tradeoff.

## Changelog

| Date | Change |
|------|--------|
| 2026-05-17 | Generated from code analysis after pre-render migration |
| 2026-05-17 | Terminal skin (change `260517-pdsp-terminal-skin`): documented current palette mapping (`tool→#d4a73a amber, agent→#7cb342 sage, ship→#5eb3b3 teal, ambient→#7c8593 fg-dim grey`) and the `background-color: white` issue with mermaid CLI's `default` theme. Regeneration workflow updated to pass `-b transparent` to both light and dark renders; post-render strip documented as fallback. Loop diagram strokes regenerated against the new palette and both SVGs (light + dark) re-rendered with transparent backgrounds. |
| 2026-05-17 | Starlight removal (branch `starlight-removal`): theme attribute owner changed from Starlight's header toggle to `BaseLayout.astro`'s inline init script + `ThemeToggle.astro`. The `data-theme` attribute on `<html>` remains the contract; the `<Diagram>` component's MutationObserver is unchanged. SVGs themselves are unaffected. |
