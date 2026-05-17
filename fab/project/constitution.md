# ai.shll.in Constitution

## Core Principles

### I. Static-First, Zero Runtime
The site MUST build to fully static output via `astro build` — no SSR adapters, no server endpoints, no client-side data fetching for primary content. Rationale: deployment is GitHub Pages (see `.github/`), which serves static assets only. Any feature requiring a server SHALL be rejected or redesigned around build-time data.

### II. Content as Source of Truth
Tool listings, copy, and other structured data MUST live in `src/content/` collections (typed via `src/content.config.ts`), not hardcoded in `.astro` page files. Rationale: keeps editorial changes diff-friendly and prevents page templates from drifting into ad-hoc data dumps. Pages SHALL consume content via `getCollection()`.

### III. Tailwind Utilities, No Custom CSS
Styling MUST use Tailwind utility classes (v4) directly in markup. Custom CSS files in `src/styles/` SHOULD only contain `@import "tailwindcss";` and theme tokens — never component-scoped rules. Rationale: this is a single-page marketing site; introducing a CSS architecture is unjustified complexity.

### IV. Minimal Dependencies
New runtime or build dependencies MUST be justified against a concrete page-visible need. Each addition SHALL document why an existing dependency or built-in Astro feature cannot serve. Rationale: the toolkit this site advertises is itself a study in small composable tools — the site MUST embody that ethos.

### V. Dark Mode Parity
Every visible UI element MUST render correctly in both light and dark modes (via `dark:` variants). Mermaid diagrams SHALL switch themes via `prefers-color-scheme` (see `src/pages/index.astro:152-157`). Rationale: visitors arrive from terminal-heavy contexts where dark is the default expectation.

### VI. Deploy via CI, Never Manually
Deployments to GitHub Pages MUST go through the `.github/workflows/` pipeline on push to `main`. The `dist/` directory SHALL NOT be committed (it is gitignored). Rationale: manual deploys diverge from source; CI is the single source of truth for what is live.

## Additional Constraints

### Accessibility
Interactive elements (links, `<details>` toggles) MUST be keyboard-navigable and have visible focus states. Color contrast SHALL meet WCAG AA in both themes. Decorative diagrams SHOULD have a textual explanation adjacent (the "The loop" / "Wrapping it" paragraphs accompanying the mermaid graphs are the pattern).

### External Links
Outbound links to other projects in the toolkit (`sahil87/*`, `noon.design`, Discord, etc.) MUST remain accurate. Broken or stale links MUST be fixed before any other landing-page work. Rationale: the site's value is as a directory into the rest of the toolkit — every dead link erodes that.

### Test Integrity
Tests MUST conform to the implementation spec — never the other way around. When tests fail, the fix SHALL either (a) update the tests to match the spec, or (b) update the implementation to match the spec. Modifying implementation code solely to accommodate test fixtures or test infrastructure is prohibited. Specs are the source of truth; tests verify conformance to specs.

## Governance

**Version**: 1.0.0 | **Ratified**: 2026-05-17 | **Last Amended**: 2026-05-17
