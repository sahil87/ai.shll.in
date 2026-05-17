# ai.shll.in

Source for **[ai.shll.in](https://ai.shll.in)** — the landing page for the [@sahil87](https://github.com/sahil87) AI coding toolkit (`idea`, `hop`, `fab-kit`, `wt`, `run-kit`, `tu`, `shll`).

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) + Tailwind v4. Deploys to GitHub Pages via `.github/workflows/` on every push to `main`.

## Develop

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output → ./dist/
pnpm preview    # preview the build locally
```

Node ≥ 22.12 and pnpm 10. The `dist/` directory is gitignored — never commit it; CI is the single source of truth for what's live.

## Layout

```
src/
├── content/docs/         # MDX pages (Starlight content collection)
│   ├── index.mdx         # home (splash template)
│   └── tools/            # one page per tool
├── components/           # Astro components (Mermaid, etc.)
└── styles/global.css     # Tailwind entry — kept to one @import line
public/                   # static assets (CNAME, favicons)
astro.config.mjs          # Starlight sidebar, integrations
```

## Conventions

The project follows a written [constitution](./fab/project/constitution.md) — most notably:

- **Static-first, zero runtime** — no SSR, no client data fetching for primary content
- **Content as source of truth** — page text lives in `src/content/docs/`, not hardcoded in templates
- **Tailwind utilities only** — no custom CSS architecture
- **Dark-mode parity** — every UI element renders in both themes

New contributions should read the constitution before adding dependencies or new patterns.

## License

See [LICENSE](./LICENSE) (if present) or the repo root.
