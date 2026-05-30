# starlight-terminal

Experiment: can [Starlight](https://starlight.astro.build) carry the terminal aesthetic from `astro-tailwind-terminal1` at documentation scale?

## Why this experiment

The live site uses a hand-rolled Astro + Tailwind setup. That works for ~7 short tool-directory pages but doesn't scale to ~70 pages with CLI reference + workflows per tool. Starlight provides built-in sidebar nav, Pagefind search, prev/next, and a11y out of the box — at the cost of being a "generic doc theme" by default.

This experiment tests whether **Starlight's CSS surface is open enough to fully wear the terminal skin** (JetBrains Mono, paper/dark palettes, `## ` heading prefixes, ASCII rules) while keeping the structural wins.

## Develop

```sh
cd sites/_playground/starlight-terminal
pnpm install
pnpm dev        # http://127.0.0.1:4322
pnpm build      # static output → ./dist/
```

## What's here

- **IA Option A** — per-tool nesting: `Getting started / Tools / Workflows`
- **2 tools fleshed out** — `idea`, `fab-kit` (overview + install + commands + workflows)
- **5 tools stubbed** — `hop`, `wt`, `run-kit`, `tu`, `shll` (overview only, ported from terminal1)
- **Terminal CSS** — `src/styles/terminal.css` overrides Starlight's theme variables

## Not deployed

`_playground/` experiments are excluded from CI. To promote, move to `sites/<name>/` and update `SITE_DIR` in `.github/workflows/deploy.yml`.
