# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Docusaurus 3.9 static site (a11y-road) using the classic preset with TypeScript. Package manager is **pnpm**. Requires Node >= 20.

## Commands

- `pnpm start` — dev server with hot reload
- `pnpm build` — production build to `build/`
- `pnpm serve` — serve the production build locally
- `pnpm typecheck` — run TypeScript type checking (`tsc`)
- `pnpm clear` — clear Docusaurus generated files (`.docusaurus/`)

### Linting & Formatting

- `pnpm lint` — run Biome check + ESLint
- `pnpm lint:fix` — auto-fix with Biome + ESLint
- `pnpm format` — format all files with Biome
- `pnpm lint:md` — lint Markdown/MDX with markdownlint-cli2
- `pnpm spellcheck` — spell check docs, blog, and src with cspell

### Testing

- `pnpm test` — run Vitest unit/component tests
- `pnpm test:watch` — run Vitest in watch mode
- `pnpm test:coverage` — run Vitest with V8 coverage report
- `pnpm test:e2e` — run Playwright E2E tests (builds the site first)
- `pnpm test:e2e:report` — open the Playwright HTML report
- `pnpm test:a11y` — run only Playwright tests tagged `@a11y`

## Architecture

- **docusaurus.config.ts** — main site configuration (metadata, presets, theme, navbar, footer). Uses `future.v4: true` for Docusaurus v4 compatibility.
- **sidebars.ts** — sidebar config; currently auto-generated from `docs/` folder structure.
- **docs/** — documentation pages in Markdown/MDX. Subdirectories use `_category_.json` for ordering and labels.
- **blog/** — blog posts. Authors defined in `blog/authors.yml`, tags in `blog/tags.yml`.
- **src/pages/** — custom React pages (homepage at `index.tsx`, also supports `.md` pages).
- **src/components/** — shared React components used by pages. Component tests go in `__tests__/` subdirectories.
- **src/css/custom.css** — global CSS overrides using Infima CSS variables.
- **static/** — files served as-is at site root (images, favicon, `.nojekyll`).
- **tests/e2e/** — Playwright E2E and accessibility audit tests.

## Tooling

- **Biome** (`biome.json`) — formatting + general linting for TS, TSX, CSS, JSON. Includes a11y rules.
- **ESLint** (`eslint.config.mjs`) — `eslint-plugin-jsx-a11y` rules that Biome doesn't cover. No formatting rules.
- **markdownlint-cli2** (`.markdownlint-cli2.jsonc`) — Markdown/MDX linting.
- **cspell** (`cspell.json`) — spell checking. Add project words to `cspell.json`.
- **Vitest** (`vitest.config.ts`) — component tests with jsdom + React Testing Library. Coverage via `@vitest/coverage-v8`.
- **Playwright** (`playwright.config.ts`) — E2E tests with axe-core for a11y audits. Desktop + mobile viewports.
- **husky + lint-staged** — pre-commit hooks run Biome, ESLint, and markdownlint on staged files.

## Key Conventions

- The `@site/` import alias resolves to the project root (e.g., `@site/src/components/...`, `@site/static/img/...`).
- Theme components come from `@theme/` imports (e.g., `@theme/Layout`, `@theme/Heading`). Customize them via `pnpm swizzle`.
- Broken links throw errors during build (`onBrokenLinks: 'throw'`).
- Color mode respects the user's OS preference (`respectPrefersColorScheme: true`).
- Biome owns all formatting. ESLint is linting-only (a11y rules Biome doesn't cover).
