# Quality Checks

## Overview

All quality checks can be run individually or together via `pnpm check:all`.

## Tools

### Biome — Formatting + Linting

- **Config**: `biome.json`
- **Run**: `pnpm format:check` (check) / `pnpm format` (auto-fix)
- Handles formatting (indentation, quotes, trailing commas) and general JS/TS linting
- Accessibility rules disabled (handled by ESLint jsx-a11y)
- CSS linting disabled (handled by Stylelint)

### ESLint — Accessibility Linting

- **Config**: `apps/a11y-road/eslint.config.mjs`
- **Run**: `pnpm lint`
- Runs across all projects (app, a11y-kit lib, e2e) via `nx run-many`
- Includes `eslint-plugin-jsx-a11y` (recommended ruleset) on the app
- Also includes Nx module boundary enforcement and Next.js rules
- Disable specific a11y rules per-case as needed in the ESLint config

### Stylelint — CSS Linting

- **Config**: `.stylelintrc.json`
- **Run**: `pnpm stylelint`
- Uses `stylelint-config-standard` + `stylelint-config-tailwindcss`
- Tailwind `@tailwind` directives are allowed

### TypeScript — Type Checking

- **Run**: `pnpm typecheck`
- Runs `tsc --noEmit` via Nx
- Strict mode enabled in `tsconfig.base.json`

### Vitest — Unit & Component Tests

- **Config**: `apps/a11y-road/vitest.config.ts`
- **Run**: `pnpm test` / `pnpm test:watch` / `pnpm test:coverage`
- Uses jsdom environment with `@testing-library/react`
- Accessibility testing via `vitest-axe` (axe-core integration)
- Coverage via `@vitest/coverage-v8` (reporters: text, html, lcov)
- Coverage output: `coverage/apps/a11y-road/`

### Playwright — E2E Tests

- **Config**: `apps/maple-valley-health-e2e/playwright.config.ts`
- **Run**: `pnpm e2e`
- Includes `@axe-core/playwright` accessibility audits
- Tests run across Chromium, Firefox, and WebKit

### Knip — Unused Code Detection

- **Config**: `knip.config.ts`
- **Run**: `pnpm knip`
- Detects unused files, exports, dependencies, and types
- Workspace-aware configuration for the Nx monorepo

## CI Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) runs three parallel jobs:

1. **Quality Checks**: Biome, ESLint, Stylelint, TypeScript, Knip
2. **Unit Tests**: Vitest with coverage (uploaded as artifact)
3. **E2E Tests**: Playwright on Chromium (report uploaded as artifact)

Lockfile integrity enforced via `pnpm install --frozen-lockfile`.

## Scripts Reference

| Script | Description |
|--------|-------------|
| `pnpm format` | Auto-format with Biome |
| `pnpm format:check` | Check formatting (CI) |
| `pnpm lint` | ESLint (all projects, includes jsx-a11y) |
| `pnpm stylelint` | Lint CSS files |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm test` | Run unit tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm e2e` | Run Playwright E2E tests |
| `pnpm knip` | Check for unused code |
| `pnpm clean` | Remove build artifacts and caches |
| `pnpm check:all` | Run all checks (except E2E) |
