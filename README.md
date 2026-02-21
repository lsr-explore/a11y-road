# A11y Road

Accessibility Across the Product Lifecycle -- a documentation site built with [Docusaurus 3.9](https://docusaurus.io/) and deployed to GitHub Pages.

## Prerequisites

- Node.js >= 20 (see `.nvmrc`)
- pnpm 9.x (`corepack enable && corepack prepare`)

## Getting Started

```bash
pnpm install
pnpm start
```

The dev server starts at `http://localhost:3000/a11y-road/` with hot reload.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm start` | Dev server with hot reload |
| `pnpm build` | Production build to `build/` |
| `pnpm serve` | Serve the production build locally |

### Quality Checks

| Command | Description |
| --- | --- |
| `pnpm lint` | Biome check + ESLint |
| `pnpm lint:fix` | Auto-fix with Biome + ESLint |
| `pnpm format` | Format all files with Biome |
| `pnpm lint:md` | Lint Markdown/MDX with markdownlint-cli2 |
| `pnpm spellcheck` | Spell check docs, blog, and src with cspell |
| `pnpm typecheck` | TypeScript type checking |

### Testing

| Command | Description |
| --- | --- |
| `pnpm test` | Vitest unit/component tests + doc structure validation |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm test:coverage` | Vitest with V8 coverage report |
| `pnpm test:e2e` | Playwright E2E tests (builds the site first) |
| `pnpm test:a11y` | Playwright tests tagged `@a11y` only |
| `pnpm lighthouse` | Lighthouse CI (performance, a11y, SEO, best practices) |

## Project Structure

```text
a11y-road/
├── .github/workflows/       # CI (PR checks) and deploy (GitHub Pages)
├── blog/                     # Blog posts (authors.yml, tags.yml)
├── dev-repo-docs/            # Internal planning docs (not published)
├── docs/                     # Documentation pages (Markdown/MDX)
├── src/
│   ├── components/           # Shared React components + __tests__/
│   ├── css/custom.css        # Global CSS overrides (Infima variables)
│   └── pages/                # Custom pages (homepage at index.tsx)
├── static/                   # Static assets (images, favicon)
├── tests/
│   ├── docs-structure.test.ts  # Doc frontmatter + structure validation
│   └── e2e/                    # Playwright E2E + a11y audit tests
├── biome.json                # Formatting + linting (TS, TSX, CSS, JSON)
├── eslint.config.mjs         # jsx-a11y rules complementing Biome
├── lighthouserc.js           # Lighthouse CI thresholds
├── docusaurus.config.ts      # Site configuration
└── vitest.config.ts          # Test configuration
```

## Tooling

- **Biome** -- formatting + general linting (including a11y rules)
- **ESLint** + **eslint-plugin-jsx-a11y** -- accessibility linting rules that Biome doesn't cover
- **markdownlint-cli2** -- Markdown/MDX linting
- **cspell** -- spell checking
- **Vitest** + **React Testing Library** -- component tests and doc structure validation
- **Playwright** + **axe-core** -- E2E tests and automated a11y audits
- **Lighthouse CI** -- performance, accessibility, SEO, and best practices scoring
- **husky** + **lint-staged** -- pre-commit hooks

## CI Pipeline

Pull requests run the full quality pipeline:

1. Biome check + ESLint + markdownlint + spellcheck
2. TypeScript type checking
3. Production build (catches broken links)
4. Vitest (component tests + doc structure validation)
5. Playwright (E2E + a11y audits)
6. Lighthouse CI (performance/a11y/SEO thresholds)

## Deployment

Pushes to `main` trigger automatic deployment to GitHub Pages via `actions/deploy-pages`.

Site URL: <https://lsr-explore.github.io/a11y-road/>

## License

See [LICENSE](LICENSE) for details.
