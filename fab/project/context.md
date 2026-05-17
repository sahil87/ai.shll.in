# Project Context

Landing page for the **shll AI coding toolkit** at [ai.shll.in](https://ai.shll.in). A single-page marketing site (with a small `/tools/` directory) that serves as the front door into seven Go CLIs: `idea`, `hop`, `fab-kit`, `wt`, `run-kit`, `tu`, `shll`.

## Tech stack

- **[Astro 6](https://astro.build)** — static site generator. No SSR adapter, no server endpoints. `astro build` produces fully static HTML/CSS/JS.
- **[Starlight 0.39](https://starlight.astro.build)** — Astro's docs framework. Provides the sidebar, theming, page templates (`splash`, `doc`), and built-in dark mode.
- **[Tailwind CSS v4](https://tailwindcss.com)** — utility-first styling, integrated via `@tailwindcss/vite`. The single entry file `src/styles/global.css` contains only `@import "tailwindcss";`.
- **[MDX](https://mdxjs.com)** (`@astrojs/mdx`) — for embedding Astro components in markdown pages.
- **Mermaid (build-time only)** — diagrams are pre-rendered to SVG at author-time via `npx mmdc` (mermaid CLI run ephemerally). Sources live in `src/diagrams/*.mmd`, outputs in `public/diagrams/`. No runtime mermaid dependency. See [docs/memory/site/diagrams.md](../../docs/memory/site/diagrams.md).
- **pnpm 10** — package manager. Frozen lockfile in CI.
- **Node ≥ 22.12** — declared in `package.json` engines.

## Layout

```
src/
├── content/docs/             # Starlight content collection (loader + schema in content.config.ts)
│   ├── index.mdx             # home page, template: splash
│   └── tools/                # one .md page per tool + tools/index.md
├── diagrams/                 # mermaid sources (.mmd), pre-rendered to public/diagrams/
├── components/
│   └── Diagram.astro         # swaps light/dark pre-rendered SVGs by theme
└── styles/global.css         # Tailwind entry — one line
public/                       # static assets (CNAME for custom domain, favicon)
astro.config.mjs              # Starlight integration, sidebar config, social links
```

## Conventions

- **Content lives in `src/content/docs/`** — typed via `src/content.config.ts` using Starlight's `docsLoader()` and `docsSchema()`. Pages consume content via Starlight routing — no manual `getCollection()` calls.
- **Pages use Starlight templates** — `template: splash` for the home (no sidebar, hero), default `doc` template for tool pages (sidebar + TOC).
- **Sidebar is configured statically** in `astro.config.mjs` — manually listed, not auto-generated from the file tree. Adding a tool requires both a new `.md` file and a sidebar entry.
- **Social links** (GitHub, Discord, X) live in the Starlight `social` config, not hardcoded in pages.
- **Dark-mode parity is enforced by the constitution** — every Tailwind class with a color uses `dark:` variants. Mermaid switches themes via `data-theme` / `prefers-color-scheme`.

## Deployment

GitHub Pages via `.github/workflows/deploy.yml` on push to `main`. The workflow runs `pnpm install --frozen-lockfile` then `pnpm build`, uploads `./dist`, and deploys via `actions/deploy-pages@v4`. Custom domain `ai.shll.in` set via `public/CNAME`.

The `dist/` directory is gitignored — never committed. CI is the single source of truth for the deployed site (Constitution VI).

## What this project is NOT

- Not a docs site for any one tool — each tool's full docs live in its own repo's README. Pages here are deliberately short "directory entries" linking out.
- Not server-rendered — no API routes, no SSR, no runtime data fetching. If a feature needs a server, redesign it around build-time data or reject it.
- Not styled with custom CSS — Tailwind utilities only. `global.css` is the only stylesheet and contains one import.
