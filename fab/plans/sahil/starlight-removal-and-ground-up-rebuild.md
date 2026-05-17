# Strip Starlight, rebuild ground-up

> **Author**: handoff from a previous agent who was running this redesign
> through the fab pipeline. The fab pipeline does not fit visual/marketing
> work well — it validates structural facts (one `<h1>`, build passes) but
> has no model of taste. Two PRs were merged (#4, #5) and the site looks
> okay but is at ~60% mockup fidelity. The user wants to drop Starlight
> entirely and rebuild from scratch in pure Astro+Tailwind to reach 100%
> mockup fidelity.
>
> **Pick this up cold.** This document is the entire context. Read it
> end-to-end before touching anything.
>
> **Do NOT use the fab pipeline for this work.** Just branch off `main`,
> iterate in the browser with the user, ship one PR. The user explicitly
> opted out of `/fab-new`, `/fab-continue`, etc. for this redesign.

---

## TL;DR

The site is currently built on Astro 6 + Starlight 0.39. Starlight provides
sidebar, theme toggle, TOC, search, and page chrome. We are dropping
Starlight in favor of a hand-rolled Astro layout that matches the approved
mockup at `~/.agent/diagrams/ai-shll-in-terminal-skin.html`.

**Outcome**: visual parity with the mockup, ~80 KB lighter build, simpler
mental model, no `--sl-color-*` variable wrangling.

**Estimated effort**: ~1 focused day for the swap + ~half-day of polish.

---

## Context: why we're doing this

### What worked

The current site (after PRs #4 and #5) has:

- Correct dark + light palette (warm near-black phosphor / paper-cream)
- JetBrains Mono everywhere
- A blinking cursor on the H1
- `$` prompts on CTAs and install lines
- ASCII rules between sections
- `## ` sage prefix on H2 headings
- Tools rendered as a `├──` tree-list
- Loop diagram regenerated with the new palette
- Single canonical `<h1>` per page, clean anchor IDs
- AA contrast in both themes

That work is **all preserved** in this rebuild — just lifted out from under
Starlight and reattached to a hand-rolled layout.

### What didn't work

The user compared the live site to the original mockup and concluded:

> "The colors and styles in this mockup are perfect. Everything including
> the left panel has changed in the implementation."

Specifically:

1. **The sidebar in the mockup is hand-drawn** — `# Start here` / `# Tools`
   group labels read as shell comments in faint muted color, items have a
   clean `border-left: 2px solid amber` accent on active, no Starlight
   group-expand caret. The implementation has Starlight's sidebar which
   uses a different padding rhythm, a `v` caret on each group, and a
   different active state.
2. **The top bar in the mockup** has `[ai.shll.in]` brand in brackets, a
   subtle search affordance, a `theme: dark` indicator chip, and right-
   aligned plain-text social links (`GitHub`, `Discord`, `X`). The
   implementation has Starlight's top bar — logo + brand text, search to
   the right of the brand, theme toggle button (not a chip), social icons
   as small SVGs.
3. **The hero feels different** — mockup hero gets full content width and
   the H1 doesn't wrap; implementation H1 wraps to 2 lines because the
   splash template constrains content width differently.
4. **Mental tax** — every change involves asking "is this Starlight or
   ours?" and reaching for `--sl-color-*` variables to bend things.

The structural disagreement is small (Starlight can be themed pretty far)
but the cumulative drift is enough that the user wants a clean slate.

### Why fab didn't fit

For a future reference if you're tempted to use the pipeline for visual
work — don't, here's why:

- Spec writing has no useful vocabulary for "feels generous" or "looks
  right" — RFC 2119 verbs map to structural facts only.
- Review sub-agents validate facts; they cannot validate aesthetics. We
  passed review with 41/43 acceptance items checked, on a page that the
  user immediately flagged as visually inferior to the mockup it was
  spec'd against.
- The pipeline's minimum overhead (intake → spec → plan → apply → review →
  hydrate) is minutes per iteration. Visual iteration is *seconds* in a
  browser. The structure is pure friction here.
- Constitution III ("Tailwind utilities only, no custom CSS beyond theme
  tokens") forced workarounds (`before:content-['##_']` pseudo-element,
  wrapper-`<div>` for code corner badges) where a 3-line CSS rule would
  have been simpler. The constitution is a good rule for the toolkit's
  code but counterproductive for a one-page marketing site.

For this rebuild, just iterate in the browser with the user. Commit when
it looks right. Open one PR.

---

## The plan

### Phase 0: branch off main

```bash
git fetch origin main
git checkout -b starlight-removal origin/main
```

Verify you're at commit `568ccea` (Merge PR #5) or newer.

The user is OK with a single bigger PR for the whole swap, not many small
ones. Don't fragment.

### Phase 1: read the inputs

Before writing any code, read these three things in order. **Do not skip.**

1. **The mockup**: `~/.agent/diagrams/ai-shll-in-terminal-skin.html`.
   This is the visual contract. Open it in a browser. The user has
   approved this design verbatim — colors, spacing, layout, all of it.

   To view it via the run-kit iframe (the user works in tmux + rk):

   ```sh
   PORT=8731
   pgrep -f "http.server.*$PORT" >/dev/null || \
     (python3 -m http.server --bind 127.0.0.1 $PORT \
        -d /home/sahil/.agent/diagrams >/dev/null 2>&1 &)
   tmux new-window -n mockup
   tmux set-option -w @rk_type iframe
   tmux set-option -w @rk_url /proxy/$PORT/ai-shll-in-terminal-skin.html
   ```

   The user can then `Ctrl-b 0..9` to that window to compare against
   your work-in-progress.

2. **The current live site**:
   - `src/content/docs/index.mdx` — current home page
   - `src/content/docs/tools/*.md` — 7 tool pages + `index.md` landing
   - `src/components/Hero.astro`, `HRule.astro`, `ToolRow.astro`,
     `Diagram.astro` — these are all custom, all utility-class-based,
     all reusable as-is
   - `src/styles/global.css` — palette tokens + `@theme` block. Most of
     this is keepable; only the Starlight `--sl-*` variable bindings get
     dropped.
   - `astro.config.mjs` — current Starlight + Tailwind config

3. **The mermaid loop diagram**:
   - `src/diagrams/loop.mmd` (source)
   - `public/diagrams/loop-light.svg`, `loop-dark.svg` (pre-rendered)

   These are unchanged from current state. Keep them.

### Phase 2: dependency surgery

#### Remove

```bash
pnpm remove @astrojs/starlight @astrojs/mdx
```

`@astrojs/mdx` can probably go too — only `index.mdx` uses MDX currently,
and we can convert the home page to `.astro` with embedded components
(cleaner anyway). If you keep MDX, that's fine — just one fewer thing to
strip.

You'll lose:
- Starlight's pagefind search integration (we'll not replace it — 8 pages
  don't need search)
- Starlight's sidebar/TOC/footer pagination components
- Starlight's theme persistence + auto-toggle
- Starlight's content collection schema (`docsSchema()`)

#### Keep

- `astro` (^6.3.3) — the core SSG
- `@tailwindcss/vite` (^4.3.0) + `tailwindcss` (^4.3.0)
- `@fontsource/jetbrains-mono` (^5.2.8)

#### Add (if needed)

Nothing. Astro core has everything else (file-based routing, layouts,
content collections, asset handling).

### Phase 3: file structure

Target layout:

```
src/
├── content/
│   ├── config.ts                 # content collection schema (new, replaces content.config.ts)
│   ├── tools/                    # MOVED from content/docs/tools/
│   │   ├── idea.md
│   │   ├── hop.md
│   │   ├── fab-kit.md
│   │   ├── wt.md
│   │   ├── run-kit.md
│   │   ├── tu.md
│   │   └── shll.md
├── pages/
│   ├── index.astro               # home (rebuild — was index.mdx)
│   ├── tools/
│   │   ├── index.astro           # tools landing
│   │   └── [tool].astro          # dynamic route for each tool
├── layouts/
│   ├── BaseLayout.astro          # NEW — shared chrome (topbar, theme script, fonts, meta)
│   └── DocLayout.astro           # NEW — BaseLayout + sidebar + TOC + main + footer-nav (for tool pages)
├── components/
│   ├── TopBar.astro              # NEW — `[ai.shll.in]` + search-chip + theme-chip + social
│   ├── Sidebar.astro             # NEW — `# Start here` / `# Tools` groups with active-state
│   ├── TableOfContents.astro     # NEW — optional, for tool pages
│   ├── ThemeToggle.astro         # NEW — inline button that flips html[data-theme]
│   ├── Hero.astro                # KEEP — already utility-class-based, drop Starlight imports
│   ├── HRule.astro               # KEEP as-is
│   ├── ToolRow.astro             # KEEP as-is
│   └── Diagram.astro             # KEEP as-is
├── styles/
│   └── global.css                # KEEP @theme tokens; STRIP all --sl-* bindings
├── data/
│   └── tools.ts                  # NEW — array of {slug, label, blurb} feeding sidebar + tree-list
└── diagrams/
    └── loop.mmd                  # KEEP

public/
├── CNAME                         # KEEP
├── diagrams/
│   ├── loop-light.svg            # KEEP
│   └── loop-dark.svg             # KEEP
├── logo.svg                      # KEEP — may not be used; the mockup uses [ai.shll.in] text
├── og-image.png                  # KEEP
├── favicon.svg / favicon.ico     # KEEP
└── robots.txt                    # KEEP
```

Notes:

- `src/content/docs/` → `src/content/tools/` (drop the "docs" wrapper that
  was a Starlight convention).
- Home moves from `src/content/docs/index.mdx` → `src/pages/index.astro`.
- Tool pages move from `src/content/docs/tools/{name}.md` →
  `src/content/tools/{name}.md`, rendered by `src/pages/tools/[tool].astro`
  via `getStaticPaths()`.
- The tools landing `src/content/docs/tools/index.md` becomes
  `src/pages/tools/index.astro` (Astro page, not markdown — it has a
  table that's easier to author in Astro+Tailwind).

### Phase 4: component-by-component build

Build in dependency order. After each component, eyeball it against the
mockup.

#### 4.1 `src/styles/global.css`

Strip the Starlight integration block. Final shape:

```css
/* JetBrains Mono — self-hosted via @fontsource. */
@import "@fontsource/jetbrains-mono/400.css";
@import "@fontsource/jetbrains-mono/500.css";
@import "@fontsource/jetbrains-mono/600.css";
@import "@fontsource/jetbrains-mono/700.css";

@import "tailwindcss";

@theme inline {
  --font-mono: "JetBrains Mono", "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;
  --color-bg: var(--c-bg);
  --color-surface: var(--c-surface);
  --color-surface-2: var(--c-surface-2);
  --color-border: var(--c-border);
  --color-fg: var(--c-fg);
  --color-fg-dim: var(--c-fg-dim);
  --color-fg-faint: var(--c-fg-faint);
  --color-accent: var(--c-accent);
  --color-accent-2: var(--c-accent-2);
  --color-accent-3: var(--c-accent-3);
  --animate-blink: blink 1.1s steps(2, start) infinite;
  @keyframes blink {
    50% { opacity: 0; }
  }
}

/* Light theme — paper-terminal — default. */
:root {
  --c-bg: #f5f1e8;
  --c-surface: #ede7d6;
  --c-surface-2: #e4dcc4;
  --c-border: #c9bfa5;
  --c-fg: #2a2620;
  --c-fg-dim: #6b6256;
  --c-fg-faint: #a39a87;
  --c-accent: #a8761a;
  --c-accent-2: #5a7a2e;
  --c-accent-3: #2e6868;

  color-scheme: light;
  background: var(--c-bg);
  color: var(--c-fg);
  font-family: var(--font-mono);
}

/* Dark theme — primary, set on <html data-theme="dark">. */
:root[data-theme="dark"] {
  --c-bg: #0b0d10;
  --c-surface: #12161b;
  --c-surface-2: #1a1f26;
  --c-border: #232932;
  --c-fg: #d8dce4;
  --c-fg-dim: #7c8593;
  --c-fg-faint: #4a525e;
  --c-accent: #d4a73a;
  --c-accent-2: #7cb342;
  --c-accent-3: #5eb3b3;

  color-scheme: dark;
}
```

**Constitution III note**: the original site's constitution forbids
component-scoped CSS rules in `global.css`. **Relax this for the rebuild.**
The user has explicitly accepted that the Constitution-III rule was
counterproductive for visual work. You may add a small number of utility-
companion rules in `global.css` if it makes the markup substantially
cleaner — e.g., a single `html { background: var(--c-bg); }` is fine.
Just don't go wild — keep the spirit (Tailwind utilities for *components*
in markup; `global.css` for *base + tokens*).

Do NOT update `fab/project/constitution.md`. The user wants to step back
from fab governance for this rebuild.

#### 4.2 `src/components/ThemeToggle.astro`

Replaces Starlight's theme toggle. Three behaviors:

1. On page load, set `<html data-theme="dark|light">` from localStorage,
   falling back to OS preference, defaulting to dark.
2. Render a small button or `<details>`-style picker with "Auto / Light /
   Dark" — the mockup just shows `theme: dark` as a chip, so a 3-option
   dropdown is overkill. Either:
   - A single button cycling Auto → Light → Dark on click
   - A small native `<select>` styled to look like the mockup's chip
3. Persist the choice to `localStorage` under a key (use `theme` or
   `site-theme`).

Inline script approach (Astro lets you put `<script>` in `.astro` files
that Vite bundles). Keep it ~30 lines. Run the dark-default script
**inline in `<head>`** to prevent FOUC (flash of unstyled content) — see
Astro's "Theme Toggle" example in their docs.

Visual: in the mockup it reads like `theme: dark` (small caps, faint
color, sits at the right edge of the topbar before the social links).

#### 4.3 `src/components/TopBar.astro`

The site-wide top navigation. Layout (left → right):

- `[ai.shll.in]` — brand text in brackets, sage open bracket, sage close
  bracket, fg color for the text. Font 14-16px / weight 600.
- Search-affordance chip (optional — see note below)
- Spacer (flex-grow)
- `theme: dark` chip (the ThemeToggle output)
- `GitHub` / `Discord` / `X` — plain-text social links in fg-dim, hover
  to accent. Match the mockup exactly — these are *text*, not icons. The
  mockup deliberately doesn't use Lucide-style SVG icons.

**Search**: the mockup shows a search chip but the site doesn't actually
have search anymore (we dropped pagefind). Two options:
- (a) Remove the search chip entirely. Cleanest.
- (b) Keep a non-functional decorative chip. Bad — broken affordance.
- (c) Wire up a real client-side search later. Out of scope for this PR.

**Recommend (a)** — remove the chip. The 8-page site doesn't need search;
the sidebar is the navigation.

Bottom border on the topbar: `border-b border-fg-faint` (the visible
hairline shade fix from PR #5 — keep this contrast).

#### 4.4 `src/components/Sidebar.astro`

Left sidebar for tool subpages. Drives off `src/data/tools.ts`. Layout
exactly per mockup:

```
# Start here
  Overview                      ← link to /

# Tools
  All tools                     ← link to /tools/
  idea                          ← link to /tools/idea/  ← active-state highlight
  hop
  fab-kit
  wt
  run-kit
  tu
  shll
```

Visual rules:
- Group label (`# Start here`, `# Tools`): `text-fg-dim text-xs
  uppercase tracking-wider`. The `#` is part of the label string, sage
  color via inline `<span>` or `before:content-['#_']`.
- Item: padding-y 1, padding-x 2, color `text-fg-dim`, on hover
  `text-fg`.
- **Active item**: left-border-2 accent, `text-accent`, slight
  `bg-accent/5` tint. Use the current page path to detect active —
  Astro exposes `Astro.url.pathname`.
- Right border on the sidebar: `border-r border-fg-faint`.

Width: ~220-240px. Use `w-60` (240px) or `w-56` (224px).

#### 4.5 `src/components/TableOfContents.astro` (optional)

Right-side TOC for tool pages. The mockup includes one — it lists the
page's H2s. Two implementation paths:

- **Option A (recommended for v1)**: omit the TOC entirely. The tool
  pages are 30-40 lines — they don't need a TOC. The mockup has one for
  visual symmetry but the user explicitly said tool pages are short
  "directory entries" elsewhere in the codebase memory.
- **Option B**: build one. In Astro, use `import.meta.glob` + the
  page's heading metadata from Astro's `headings` API (when rendering
  markdown), or use a `rehype-extract-toc` plugin. Adds complexity.

**Recommend Option A**. Skip the TOC. Use the saved space to widen the
content column.

#### 4.6 `src/layouts/BaseLayout.astro`

Wraps every page. Responsibilities:

- `<html lang="en">` with the inline theme-init script in `<head>`
- `<head>` meta tags (OG image, twitter card, favicon, canonical) —
  match what Starlight was emitting (check current `dist/index.html` for
  the meta set)
- Imports `global.css`
- Renders `<TopBar />`
- Renders `<slot />` for page content
- Renders a small footer if any (optional)

Theme-init script (paste into `<head>` *before* the stylesheet imports):

```html
<script is:inline>
  (function () {
    try {
      var t = localStorage.getItem('theme');
      if (t !== 'light' && t !== 'dark') {
        t = window.matchMedia('(prefers-color-scheme: light)').matches
          ? 'light' : 'dark';
      }
      document.documentElement.dataset.theme = t;
    } catch (e) {
      document.documentElement.dataset.theme = 'dark';
    }
  })();
</script>
```

Default to dark (matches the current site's behavior).

#### 4.7 `src/layouts/DocLayout.astro`

Extends `BaseLayout` for tool pages. Adds the left sidebar. Layout:

```
<BaseLayout>
  <div class="flex">
    <Sidebar class="hidden md:block" />        ← hidden on mobile
    <main class="flex-1 max-w-3xl mx-auto p-8">
      <h1>{frontmatter.title}</h1>
      <slot />
    </main>
  </div>
</BaseLayout>
```

Mobile sidebar: collapsed by default. Either a hamburger button that
toggles a slide-over, or just push the sidebar above content on
`md:` breakpoint. Match what the mockup does — looking at the mockup,
there's no explicit mobile design, so just hide on `<md` and stack
content full-width.

#### 4.8 `src/data/tools.ts`

Single source of truth for the 7 tools. Sidebar and home-page tree-list
both consume this. Shape:

```ts
export interface Tool {
  slug: string;
  label: string;        // display name (== slug for now, but keep separate)
  blurb: string;        // one-line description for the tree-list (HTML-safe)
}

export const tools: Tool[] = [
  { slug: 'idea',    label: 'idea',    blurb: 'Plain-Markdown backlog — worktree-aware, queryable from the CLI, feeds <code>/fab-new</code>.' },
  { slug: 'hop',     label: 'hop',     blurb: 'Fuzzy-nav, batch-git, and run-anything-inside-any-repo from one <code>hop.yaml</code> config.' },
  { slug: 'fab-kit', label: 'fab-kit', blurb: '7-stage pipeline that forces AI agents to plan before they code.' },
  { slug: 'wt',      label: 'wt',      blurb: 'Opinionated <code>git worktree</code> wrapper — one worktree per change, zero conflicts.' },
  { slug: 'run-kit', label: 'run-kit', blurb: 'Browser dashboard for tmux + Claude Code workspaces. Mobile-friendly via Tailscale.' },
  { slug: 'tu',      label: 'tu',      blurb: 'Token/cost tracker for Claude Code, Codex, OpenCode. Multi-machine sync, live watch.' },
  { slug: 'shll',    label: 'shll',    blurb: 'Meta-CLI — <code>shll install / update / shell-install</code> to wire and maintain the whole toolkit.' },
];
```

Use this list in `Sidebar.astro` (loop to render items) and in
`pages/index.astro` (loop to render `<ToolRow>` rows).

#### 4.9 `src/pages/index.astro`

Rewrite the home page in pure Astro, matching the mockup. Structure:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import HRule from '../components/HRule.astro';
import ToolRow from '../components/ToolRow.astro';
import Diagram from '../components/Diagram.astro';
import { tools } from '../data/tools.ts';
---

<BaseLayout title="A complete AI coding workflow"
            description="Small Go CLIs that compose into one loop — spec → parallel agent sessions → ship.">
  <Hero
    title="A complete AI coding workflow"
    tagline="Open-source AI coding toolkit by @sahil87, CTO of Noon..."
    actions={[
      { text: 'Install everything →', link: '#install', variant: 'primary' },
      { text: 'Browse the tools ↗',  link: '/tools/',   variant: 'secondary' },
    ]}
  />

  <main class="mx-auto max-w-3xl px-4 pb-16">
    <HRule />
    <h2 id="the-loop">## The loop</h2>
    <p>One idea fans out into many parallel agent sessions...</p>
    <Diagram light="/diagrams/loop-light.svg" dark="/diagrams/loop-dark.svg" alt="..." />
    <p><strong>Inside the loop:</strong> ...</p>
    <p><strong>Wrapping the loop:</strong> ...</p>

    <HRule />
    <h2 id="install">## Install</h2>
    <pre><code>$ brew install sahil87/tap/all
$ shll shell-install
$ exec $SHELL</code></pre>
    <p>Later, <code>shll update</code> upgrades...</p>

    <HRule />
    <h2 id="tools">## Tools</h2>
    {tools.map((t, i) => (
      <ToolRow name={t.slug} branch={i === tools.length - 1 ? '└──' : '├──'}>
        <Fragment set:html={t.blurb} />
      </ToolRow>
    ))}

    <HRule />
    <h2 id="community">## Community</h2>
    <p>Questions, feature requests... <a href="https://discord.gg/32XHh5mJYn">Join the Discord</a></p>
  </main>
</BaseLayout>
```

The `## The loop`-style `##` prefix in the H2: in the current site this
is a `before:content-['##_']` Tailwind utility. **Simpler approach now
that we're free of Constitution III**: put a global rule in `global.css`:

```css
main h2::before {
  content: '## ';
  color: var(--c-accent-2);
}
```

Single declaration, applies to all H2s in `<main>`, no per-element class.
Removes the `before:content-['##_']` repetition.

(Or keep the Tailwind utility approach — both work. The CSS rule is just
less noisy.)

For the install code block: in MDX it was fenced markdown with
expressive-code adding a terminal frame. In pure Astro, you can either:
- Use a plain `<pre><code>` and style it via global CSS (gives you total
  control over the look — match the mockup's faint border, corner label)
- Add an Astro syntax-highlighter (`shiki` is built into Astro). Then
  `<Code code={...} lang="bash" />` gets you syntax highlighting.

Mockup uses no syntax highlighting — just dim grey command text on a
slightly-darker surface bg. Match that. Skip shiki for the install
block.

#### 4.10 `src/pages/tools/[tool].astro`

Dynamic route for tool detail pages. Uses Astro's content collection
+ `getStaticPaths`:

```astro
---
import { getCollection, getEntry } from 'astro:content';
import DocLayout from '../../layouts/DocLayout.astro';

export async function getStaticPaths() {
  const tools = await getCollection('tools');
  return tools.map(t => ({ params: { tool: t.slug }, props: { tool: t } }));
}

const { tool } = Astro.props;
const { Content } = await tool.render();
---
<DocLayout title={tool.data.title} description={tool.data.description}>
  <Content />
</DocLayout>
```

The 7 tool markdown files keep their current shape (frontmatter +
content). Move them from `src/content/docs/tools/` to
`src/content/tools/`, and update `src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const tools = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { tools };
```

#### 4.11 `src/pages/tools/index.astro`

The "All tools" landing page. Mirror the current `src/content/docs/
tools/index.md` — a short intro + a two-column table grouping tools by
"inside the loop" vs "wrapping the loop." Rebuild in Astro+Tailwind for
parity with the rest of the site.

#### 4.12 `astro.config.mjs`

Strip the Starlight integration. Final shape:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ai.shll.in',
  vite: { plugins: [tailwindcss()] },
});
```

That's it. No more `integrations:` array.

If you keep MDX, add `mdx()` back:

```js
import mdx from '@astrojs/mdx';
// ...
export default defineConfig({
  site: 'https://ai.shll.in',
  integrations: [mdx()],
  vite: { plugins: [tailwindcss()] },
});
```

### Phase 5: verify

After everything is wired:

```bash
pnpm install
pnpm build
```

Build should complete clean with no warnings. Inspect `dist/index.html`:

- Exactly one `<h1>`
- No `sl-*` classes anywhere (Starlight is gone)
- No `astro-` scoped-style hashes from Starlight components
- Inline theme-init script in `<head>`
- All JetBrains Mono fonts served from `/_astro/`
- No external font/CSS requests

Then `pnpm dev` and screenshot in both themes (Playwright is installed
locally in `/tmp/node_modules/playwright` from the previous session, or
re-install). Compare side-by-side with the mockup.

### Phase 6: iterate with the user

Spin up dev server, point rk iframe at it, point another rk iframe at
the mockup. Switch between them. Pixel-by-pixel feedback. Fix in
seconds, no agent overhead.

This is where the previous attempt got 60% — because review was
agents, not the user. **For this rebuild, the user IS the review.**

### Phase 7: ship

One PR. Title: `refactor: drop Starlight, rebuild ground-up`. Body
should call out:

- What was removed (Starlight, MDX if dropped, pagefind, ~80 KB+ in
  built JS)
- What was preserved (all visual decisions from #4 and #5, the loop
  diagram, the palette, JBM)
- What this enables going forward (direct Tailwind+CSS, no theme
  variable wrangling)

Don't include a Co-Authored-By trailer.

---

## Things to watch out for

### Theme-toggle FOUC

If the theme-init script runs after the stylesheet loads, the page will
flash light-then-dark on first paint for dark-default users. **Put the
init script inline in `<head>` BEFORE any stylesheet imports.** Astro's
`<script is:inline>` does this. Test by hard-refreshing in dark mode and
watching for the flash.

### Starlight removal cascade

Starlight's `docsSchema()` extends Zod with some custom fields. When you
swap to your own collection schema (`z.object({ title, description })`),
double-check that no tool page references a Starlight-specific field
(like `template: splash` or `hero:`). They shouldn't — the tool pages
are plain markdown with just title + description — but verify.

### The home page's `hero:` frontmatter

Currently `src/content/docs/index.mdx` has `hero:` frontmatter consumed
by the custom `Hero.astro` override. After the rebuild, the hero is
just an `<Hero />` component invocation in `index.astro` with props
passed directly. Drop the `hero:` frontmatter entirely.

### MDX vs Astro for the home page

The current home is `.mdx`. If you keep `@astrojs/mdx`, you can keep it
as `.mdx`. If you drop MDX, the home becomes `.astro`. Either works.
**Slight recommendation: drop MDX**, port the home to `.astro`. One less
dependency, slightly more explicit (the JSX-in-markdown ambiguity that
caused the cycle-1 bugs in the original attempt is gone).

### Tool markdown rendering

Tool pages stay as plain `.md`. They render via Astro's built-in
markdown handler (no MDX needed). Frontmatter is `title` + `description`.
The body is straightforward markdown (paragraphs, `## Install`, fenced
code blocks, bullet list).

If you want syntax highlighting on the `## Install` and `## At a glance`
code blocks, Astro's built-in shiki integration handles that — just
configure `markdown.shikiConfig` in `astro.config.mjs` with a theme that
matches the palette. Or skip syntax highlighting entirely (mockup
doesn't have it). User's choice.

### Sidebar mobile behavior

The mockup doesn't show a mobile design. Cheapest acceptable behavior:
hide sidebar on `<md` (768px), stack content full-width. If the user
wants a hamburger drawer later, add it. Don't over-engineer it in v1.

### Active-page detection in Sidebar

Astro exposes `Astro.url.pathname`. The sidebar item for `/tools/idea/`
is active when `Astro.url.pathname === '/tools/idea/'` (note the
trailing slash — Astro defaults to trailing slashes for content pages,
unless you set `trailingSlash: 'never'` in `astro.config.mjs`). Test
both `/tools/idea` and `/tools/idea/` cases.

### Diagram component

`src/components/Diagram.astro` is fine as-is. It has a `<style>` block
with a `.diagram` class — that's a component-scoped style, not a global
class rule, so Astro scopes it and it's safe. Don't touch this file
unless you find a bug.

### Cleanup at end

After the swap, search for leftover Starlight references:

```bash
grep -r "starlight\|sl-color\|sl-font\|sl-text-" src/ docs/memory/ \
  2>/dev/null | grep -v node_modules
```

Update or remove what you find. Especially in `docs/memory/site/*` — those
files document the Starlight architecture and will be stale.

The previous agent updated `docs/memory/site/styling.md`, `site-architecture.md`,
`diagrams.md`, and `astro-config.md` to reflect the Starlight setup. After the
rebuild, those four files need updating again. The user can be asked
whether to do this inline or in a follow-up PR. The fab `docs/memory/`
structure is independent of the fab pipeline — it's just project documentation
and is worth keeping current even though we're not running fab for this work.

---

## Definition of done

The user gets to define this. But a reasonable bar:

1. Home page in dark mode matches the mockup at desktop width when
   placed side-by-side (the user has been doing this with two rk iframe
   windows — keep doing that).
2. Home page in light mode is the paper-terminal aesthetic, fully
   functional, AA contrast.
3. Tool subpages render with the new sidebar + topbar, palette
   inherited correctly, type scale correct (H1 36px, H2 24px, body 14px).
4. `pnpm build` exits 0 with no warnings.
5. Build size is meaningfully smaller than current Starlight build
   (current ~1 MB JS+CSS; expect ~200-300 KB after the swap).
6. The user explicitly says "this is right, ship it."

When you reach DOD #6, commit, push, open one PR, done.

---

## Constraints from the user's global rules

These come from `~/.claude/CLAUDE.md` and apply to all work:

- **Senior coding partner**: challenge suboptimal approaches; don't just
  comply. If something in this plan looks wrong, push back before
  building.
- **Readability over cleverness**: prefer the obvious code over the
  clever one.
- **Run tests before assuming things work**: in this case, "tests" = the
  Playwright screenshot pipeline + the user's eyes on the rk iframe.
- **Never include `Co-Authored-By: Claude`** in commits or PRs.
- **Number proposed changes/suggestions** for easy reference ("1. Rename
  X, 2. Extract Y") when offering options to the user.

---

## Open questions to surface to the user before committing

When you start, ask the user (in one message, numbered):

1. **MDX yes/no?** Drop `@astrojs/mdx` entirely (home page becomes
   `.astro`)? Or keep for flexibility?
2. **Syntax highlighting on tool-page install blocks?** Configure Astro's
   built-in shiki, or leave code blocks plain like the mockup?
3. **TOC on tool pages?** Skip (recommended), or build a small one?
4. **Update `docs/memory/site/*.md` in this same PR**, or split into a
   follow-up?

Don't proceed until those are answered.

---

## What success looks like

When this is done:

- The site looks like the mockup.
- `astro.config.mjs` is ~6 lines.
- `pnpm-lock.yaml` is significantly smaller.
- The next "make X bigger" or "shift this 4px" is a direct edit in a
  `.astro` file with browser feedback in <1 second.
- No `--sl-color-text-invert` mapping decisions ever again.

Good luck.
