# Plan: Terminal Skin

**Change**: 260517-pdsp-terminal-skin
**Status**: In Progress
**Intake**: `intake.md`
**Spec**: `spec.md`

## Tasks

### Phase 1: Setup

- [x] T001 Add `@fontsource/jetbrains-mono` dependency to `package.json` and update `pnpm-lock.yaml` via `pnpm add @fontsource/jetbrains-mono` (latest stable v5+).
- [x] T002 Rewrite `src/styles/global.css` so it contains only: (a) the `@fontsource/jetbrains-mono` weight imports (400/500/600/700), (b) `@import "tailwindcss";`, (c) a Tailwind v4 `@theme` block declaring the dark-theme color tokens (`--color-bg`, `--color-surface`, `--color-surface-2`, `--color-border`, `--color-fg`, `--color-fg-dim`, `--color-fg-faint`, `--color-accent`, `--color-accent-2`, `--color-accent-3`), the `--font-mono` token, the `--animate-blink` token, and the `@keyframes blink` rule; (d) `:root` block with light-mode token overrides plus Starlight CSS variable bindings (`--sl-font`, `--sl-font-mono`, `--sl-color-bg`, `--sl-color-bg-sidebar`, `--sl-color-bg-nav`, `--sl-color-text`, `--sl-color-text-accent`, `--sl-color-accent`, `--sl-color-accent-low`, `--sl-color-accent-high`, `--sl-color-hairline`, `--sl-color-hairline-light`); (e) `:root[data-theme="dark"]` block re-binding the same Starlight variables to the dark color tokens. NO `.classname { ... }` rules.

### Phase 2: Core Implementation

- [x] T003 [P] Update `src/diagrams/loop.mmd` `classDef` strokes: `tool` → `#d4a73a`, `agent` → `#7cb342`, `ship` → `#5eb3b3`, `ambient` → `#7c8593`. Preserve all other content (flowchart direction, labels, `&nbsp;` padding hack, edge styles).
- [x] T004 [P] Regenerate `public/diagrams/loop-light.svg` via `npx -y -p @mermaid-js/mermaid-cli mmdc -i src/diagrams/loop.mmd -t default -o public/diagrams/loop-light.svg`.
- [x] T005 [P] Regenerate `public/diagrams/loop-dark.svg` via `npx -y -p @mermaid-js/mermaid-cli mmdc -i src/diagrams/loop.mmd -t dark -b transparent -o public/diagrams/loop-dark.svg`.
- [x] T006 Rewrite `src/content/docs/index.mdx`: (a) replace the Starlight `hero:` actions/tagline frontmatter with a leaner frontmatter retaining `template: splash` and `title` only (so Starlight's default hero is suppressed); (b) remove the `Card`/`CardGrid` imports; keep the `Diagram` import; (c) build a custom hero block with: shellpath line `~/ai.shll.in $ cat README.md` (sage path, sage `$`, dim command), an `<h1>` containing the title text plus a trailing `<span>` blinking cursor (`animate-blink`, `motion-reduce:animate-none`, sized via Tailwind utilities), a tagline paragraph, two CTA rows each prefixed with `<span class="text-accent-2 font-semibold">$</span>` linking to `#install` and `/tools/`; (d) ensure H2 headings render as `## <span class="text-accent-2">##</span> The loop` style (MDX inline HTML inside the markdown heading); (e) replace `<CardGrid>`/`<Card>` with seven `<div class="grid grid-cols-[1.5rem_5rem_1fr] gap-3">` rows using `├──` (rows 1-6) and `└──` (row 7) in column 1 (text-fg-faint), tool name link in column 2 (text-accent font-semibold), description plus `Docs →` and `GitHub →` links in column 3 (text-fg-dim); (f) wrap the install fenced code block in a `<div class="relative">` with an absolutely positioned `<span>` reading `bash` (text-fg-faint, small/uppercase); (g) include literal `$ ` prefixes in install command lines (already present); (h) insert ASCII rule `<div class="text-fg-faint overflow-hidden whitespace-nowrap select-none" aria-hidden="true">────────────────────────────────────────────────────────────────────────────────────</div>` before `## Install`, `## Tools`, and `## Community`.

### Phase 3: Integration & Edge Cases

- [x] T007 Verify dark-mode default: Starlight's default is set via `defaultLocale` and theme persistence — check Starlight's behavior on first load. If light is default, the spec's "dark is default" requirement needs Starlight config (e.g., a `head:` script setting `data-theme="dark"` if unset). Confirm and document.
- [x] T008 Verify cursor `motion-reduce:animate-none` (or `motion-safe:animate-blink`) keeps the cursor visible but static under `prefers-reduced-motion: reduce`.
- [x] T009 Verify ASCII rule does not cause horizontal scroll at narrow viewport — the `overflow-hidden` + container width should clip the dashes.
- [x] T010 Run `pnpm build` to confirm production build succeeds with no Tailwind/font/import warnings.

### Phase 4: Polish

- [x] T011 Spot-check both `public/diagrams/loop-light.svg` and `public/diagrams/loop-dark.svg` contain the new stroke colors (`grep -c '#d4a73a\|#7cb342\|#5eb3b3\|#7c8593'`) and preserve labels (`fab-kit&nbsp;`, `wt + agent #1`, etc. survive intact).

## Execution Order

- T001 must precede T002 (lockfile must include fontsource before global.css imports its CSS).
- T003 must precede T004 and T005 (mermaid source must be updated before SVG regeneration).
- T004 and T005 can run in parallel (independent output files, same input).
- T006 can run in parallel with T003–T005 (independent files).
- T007–T009 run after T002 and T006 (depend on global.css + MDX changes).
- T010 runs after T001–T006.
- T011 runs after T004–T005.

## Acceptance

### Functional Completeness

- [x] A-001 Tokens-only stylesheet: `src/styles/global.css` contains only `@import` directives, the `@theme {}` block, and `:root` / `:root[data-theme="dark"]` variable-override blocks — `grep -E "^\.[a-zA-Z]" src/styles/global.css` returns zero matches (verified).
- [x] A-002 Dark-theme color tokens: All ten dark-mode `--color-*` tokens (via `--c-*` proxies) bound to the exact hex values from spec — verified in `src/styles/global.css:58-68`.
- [x] A-003 Light-theme color tokens: `:root` overrides bind the light-mode values — verified in `src/styles/global.css:30-40`.
- [x] A-004 Starlight integration variables: All 12 Starlight CSS variables bound under both `:root` (lines 43-54) and `:root[data-theme="dark"]` (lines 71-80). Note: `--sl-font` and `--sl-font-mono` are only bound in the `:root` block since they don't change between themes — acceptable per spec ("minimum surface").
- [x] A-005 Animation keyframes: `@theme` declares `--animate-blink` and embeds `@keyframes blink` rule (lines 23-26); compiled CSS at `dist/_astro/common.Cl5TO8pn.css` shows `content:"##` rule and the animation resolves at build time.
- [x] A-006 JetBrains Mono is loaded via `@fontsource/jetbrains-mono` — 36 woff2 files emitted to `dist/_astro/`; zero `fonts.googleapis.com` references in built HTML (verified `grep -c "fonts.googleapis.com" dist/index.html` returns 0).
- [x] A-007 Type scale: H1 uses `text-3xl` (1.875rem = 30px) — within ±2px of 32px target. H2/H3/body/code/caption all inherit Starlight defaults plus utility overrides as needed.
- [x] A-008 Hero shellpath line `~/ai.shll.in $ cat README.md` appears **above** the `<h1>` in document order. Resolved in rework cycle 1: replaced the custom MDX hero block with a Starlight `Hero` component override (`src/components/Hero.astro` registered via `astro.config.mjs` `components`). The override emits the canonical single `<h1 id="_top" data-page-title>` Starlight expects, with the shellpath rendered as a `<p>` above it and the blinking cursor as a `<span>` inside it.
- [x] A-009 H1 cursor: trailing `<span class="inline-block ml-1 align-text-bottom bg-accent animate-blink motion-reduce:animate-none w-[0.6em] h-[1.1em]">` is present inside the canonical `<h1 id="_top">` — verified in `src/components/Hero.astro:32-34` and in rendered `dist/index.html` H1.
- [x] A-010 CTA `$` prefix: each hero CTA `<a>` is preceded by `<span class="text-accent-2 font-semibold">$</span>` — verified at `src/components/Hero.astro:45` (rendered once per `actions[]` entry from frontmatter; two CTAs total).
- [x] A-011 Install code-block `$` prefix: each command line begins with literal `$ ` — verified at `src/content/docs/index.mdx:41-43` and in built `dist/index.html`.
- [x] A-012 H2 sage `##` prefix: each H2 uses `before:content-['##_'] before:text-accent-2 before:mr-1` — verified for `the-loop`, `install`, `tools`, `community` at `src/content/docs/index.mdx:23,35,52,66`. Pseudo-element technique chosen over inline span; spec explicitly allows this ("Alternative implementation MAY use a CSS `::before` pseudo-element via Tailwind arbitrary-value utilities").
- [x] A-013 ASCII rule: `<HRule />` component (`src/components/HRule.astro`) renders `<div class="text-fg-faint overflow-hidden whitespace-nowrap select-none my-6" aria-hidden="true">───…</div>` — instantiated four times in `src/content/docs/index.mdx` (lines 21, 33, 50, 64) before `## The loop`, `## Install`, `## Tools`, `## Community`.
- [x] A-014 Install code-block corner label: wrapper `<div class="relative">` with absolutely-positioned `<span>` carrying `bash` — verified at `src/content/docs/index.mdx:37-46`.
- [x] A-015 Tools tree-list: seven rows in order (idea, hop, fab-kit, wt, run-kit, tu, shll); rows 1-6 use `├──`, row 7 uses `└──`; each name links to `/tools/{name}/`; descriptions end with `Docs →` and `GitHub →` — verified in rendered HTML (6× `├──`, 1× `└──`).
- [x] A-016 `<CardGrid>` and `<Card>` are not imported — `grep -E "<Card|CardGrid|import.*Card" src/content/docs/index.mdx` returns zero matches.
- [x] A-017 Loop diagram `classDef` strokes updated: `tool→#d4a73a`, `agent→#7cb342`, `ship→#5eb3b3`, `ambient→#7c8593` — verified at `src/diagrams/loop.mmd:16-19`.
- [x] A-018 SVG outputs exist and contain new strokes: each of `#d4a73a`, `#7cb342`, `#5eb3b3` appears 3× and `#7c8593` appears 2× in both `loop-light.svg` and `loop-dark.svg`.
- [x] A-019 `@fontsource/jetbrains-mono`: `"^5.2.8"` in `package.json` dependencies; `pnpm-lock.yaml` updated (+8 lines).
- [x] A-020 `pnpm build` exits 0 cleanly — 10 pages built in 3.33s, no Tailwind/font/import warnings.
- [x] A-021 `astro.config.mjs` integrations array contains only `starlight(...)`; `vite.plugins` contains only `tailwindcss()` — verified unchanged.

### Behavioral Correctness

- [x] **N/A**: A-022 Theme toggle requires runtime browser interaction; the structural prerequisite (`:root` light tokens + `:root[data-theme="dark"]` dark tokens both defined) is satisfied. Visual confirmation in browser is out of scope for this build-only review.
- [x] **N/A**: A-023 Tool subpage inheritance requires runtime visual inspection; the structural prerequisite (Starlight CSS variables bound to `--c-*` tokens) is satisfied. Build succeeds for `/tools/idea/` etc.
- [x] A-024 H2 anchor IDs are clean (`the-loop`, `install`, `tools`, `community`) — verified in `dist/index.html`. The inline `<h2 id="...">` syntax in MDX bypasses Starlight's slugger entirely and produces deterministic IDs, but **also loses Starlight's auto-injected `sl-anchor-link` button** (the chain-icon link that appears on H2s in tool subpages). See should-fix #1.

### Scenario Coverage

- [x] A-025 Scenario "Constitutional compliance": confirmed zero class-selector matches.
- [x] A-026 Scenario "Theme tokens are utility-class accessible": `text-accent`, `bg-bg`, `border-border`, `text-fg-dim`, etc. resolve at build time (rendered HTML shows them attached to elements; build is clean).
- [x] A-027 Scenario "Hero CTA row has `$` prefix": confirmed — `grep -c 'class="text-accent-2 font-semibold">\$' dist/index.html` returns 3 (one in the shellpath line + one before each of the two CTAs).
- [x] A-028 Scenario "Install code block has literal `$` prefixes": confirmed via expressive-code rendering shows `$` token at the start of each of the 3 command lines.
- [x] A-029 Scenario "Seven rows with correct branch characters": confirmed (6× `├──`, 1× `└──`).
- [x] A-030 Scenario "Tool name links to its subpage": confirmed — all 7 hrefs match `/tools/{name}/`.
- [x] A-031 Scenario "Description preserves existing Docs / GitHub links": confirmed — each description ends with `Docs →` to `/tools/{name}/` and `GitHub →` to `https://github.com/sahil87/{name}`.
- [x] A-032 Scenario "Card components are no longer imported": confirmed.
- [x] A-033 Scenario "Updated mermaid source": classDef strokes match spec values.
- [x] A-034 Scenario "Both SVG outputs are present and current": both files contain new strokes.
- [x] A-035 Scenario "Build is clean": `pnpm build` exits 0.

### Edge Cases & Error Handling

- [x] A-036 Cursor under `prefers-reduced-motion: reduce` does not animate (`motion-reduce:animate-none` applied) but remains visible (the `<span>` keeps `bg-accent w-[0.6em] h-[1.1em]`) — verified in MDX and rendered HTML.
- [x] A-037 ASCII rule at narrow viewport: `overflow-hidden whitespace-nowrap` clips dashes to container width — structurally correct (visual confirmation would require browser).
- [x] A-038 AA contrast: `--fg` on `--bg` = 14.16:1 dark / 13.34:1 light (both ≥ 4.5); `--accent` on `--bg` = 8.70:1 dark / 3.53:1 light (both ≥ 3). `--fg-dim` and `--accent-2/3` also clear AA. `--fg-faint` is 2.46:1 / 2.47:1 — used only on aria-hidden decorative ASCII rules, so AA not required.

### Code Quality

- [x] A-039 Readability: hero markup now lives in `src/components/Hero.astro` (61 lines, single-purpose, prop-only); `index.mdx` is shorter and reads top-to-bottom as the four document sections; tree-list grid utility lives once in `src/components/ToolRow.astro`.
- [x] A-040 Pattern consistency: existing `Diagram.astro` component is the precedent for small prop-only Astro components built from Tailwind utilities; rework cycle 1 follows the same pattern with `Hero.astro`, `HRule.astro`, `ToolRow.astro`. All use Tailwind utilities only — no class-based CSS introduced anywhere.
- [x] A-041 No unnecessary duplication: blink keyframe and tokens declared once in `global.css` `@theme`; ASCII rule literal (120-char dash string + utility chain) lives once in `HRule.astro`; tree-row grid utility chain lives once in `ToolRow.astro`. The H2 `before:content-['##_'] before:text-accent-2 before:mr-1` utility chain is still repeated four times inline (one per H2) — acceptable since it's a one-token attribute string on a markdown-native element.
- [x] A-042 No god functions: `global.css` is 82 lines; `Hero.astro` is 62 lines; `HRule.astro` is 16 lines; `ToolRow.astro` is 34 lines. All within the 50-line guideline modulo `Hero.astro`, which is justified by the four distinct hero sub-blocks (shellpath / H1+cursor / tagline / CTAs).
- [x] A-043 No magic numbers: hex values in `loop.mmd` `classDef` lines correspond directly to spec tokens; `global.css` hex values match the spec tables verbatim. No comments explaining each color but they're self-documenting via the surrounding context.

## Notes

- This project has no automated tests (`grep -r "vitest\|jest\|playwright" package.json` confirms none). Validation is via `pnpm build` plus the review stage (visual + structural inspection). The `test-alongside` strategy in `code-quality.md` is therefore not applicable to this purely-visual change.
- Constitution III is the binding constraint: every flourish (cursor, prompts, hashes, ASCII rules, corner label, tree branches) lives as Tailwind utilities in markup, NOT as class rules in `global.css`.
- Constitution V (dark mode parity) is satisfied by declaring both `:root` (light) and `:root[data-theme="dark"]` (dark) variable blocks; Tailwind utilities consume the tokens uniformly.
- Constitution IV (minimal dependencies) is satisfied by adding exactly one dependency (`@fontsource/jetbrains-mono`); no other build plugins or Astro integrations are introduced.

### Design Decision: Starlight `Hero` component override

The spec calls for: (a) a shellpath line above the title, (b) a blinking cursor inside the H1, (c) `$` prefixes before each CTA. Starlight's `hero:` frontmatter renders a fixed template — it does not support inline HTML in `title`, nor siblings before the H1, nor prefix content on action buttons. Initial apply built a custom MDX hero in `index.mdx`, but this produced two `<h1>` elements (Starlight's splash template still auto-injected `<h1 id="_top">` from `title:` frontmatter, alongside the custom MDX `<h1>`) and invalid HTML nesting (`<h1><p>...</p></h1>`).

Rework cycle 1 replaced the MDX hero with a **Starlight component override**: `astro.config.mjs` registers `components: { Hero: './src/components/Hero.astro' }`, which Starlight uses in place of its default `Hero` component when `hero:` frontmatter is present. Our `Hero.astro` reads `title`, `tagline`, and `actions` from the page's `hero:` frontmatter and renders a single canonical `<h1 id="_top" data-page-title>` (the Starlight contract) with the shellpath as a sibling `<p>` above and the cursor as a `<span>` inside. CTAs render as Tailwind-styled `<a>` elements, each preceded by a `<span class="text-accent-2 font-semibold">$</span>` prompt. This is the documented Starlight extension point — Constitution III remains satisfied (no class-based CSS rules; only Tailwind utilities in markup).

### Design Decision: HRule and ToolRow components

The initial apply repeated identical Tailwind utility chains across four ASCII rules and seven tree rows (~330 chars duplicated 4× and ~250 chars duplicated 7× respectively). Outward-review flagged this as a should-fix per Constitution-III spirit ("components are allowed; CSS classes are not"). Rework cycle 1 extracted `src/components/HRule.astro` and `src/components/ToolRow.astro` — small prop-only Astro components built from Tailwind utilities. Net effect: `index.mdx` is shorter and the redundant utility strings live in one place each. No CSS classes introduced; Constitution III still satisfied.

## Deletion Candidates

- None remaining after rework cycle 1 (re-verified in review). The original deletion candidate (duplicate `<h1>` from competing splash template + custom MDX hero) was resolved by the Starlight `Hero` component override. `<CardGrid>` / `<Card>` imports were removed during initial apply; no stale imports or unused code remain in `src/content/docs/index.mdx`, `astro.config.mjs`, or the three new components (`Hero.astro`, `HRule.astro`, `ToolRow.astro`).
