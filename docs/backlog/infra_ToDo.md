# Infrastructure To Do

Quality checks and tooling to port from `next-template` into `a11y-road`.

## Already in place

| Area                  | Tool                        | Status |
| --------------------- | --------------------------- | ------ |
| Formatting + linting  | Biome                       | done   |
| Accessibility linting | ESLint + jsx-a11y           | done   |
| CSS linting           | Stylelint                   | done   |
| Markdown linting      | markdownlint-cli            | done   |
| Type checking         | TypeScript (strict)         | done   |
| Unused code           | knip                        | done   |
| Unit tests            | Vitest + vitest-axe         | done   |
| E2E tests             | Playwright + axe-core       | done   |
| CI pipeline           | GitHub Actions (multi-job)  | done   |
| Dependency updates    | Dependabot (grouped)        | done   |
| PR template           | `.github/pull_request_template.md` | done |
| Module boundaries     | NX enforce-module-boundaries | done  |

## To add

### 1. Git hooks (Husky + commitlint)

**What:** Pre-commit hook runs `pnpm format:check && pnpm lint && pnpm typecheck`.
Commit-msg hook validates conventional commit format via commitlint.

**Why:** Catches issues before they reach CI. Enforces consistent commit messages
(`feat:`, `fix:`, `chore:`, etc.) which aligns with the workflow rules already in
`.claude/rules/workflow.md`.

**Packages:**

- `husky`
- `@commitlint/cli`
- `@commitlint/config-conventional`

### 2. Circular dependency detection scripts

**What:** Add `pnpm circular` and `pnpm depcruise` scripts.
`dependency-cruiser` is already installed but has no package.json scripts wired up.
Consider adding `madge` as a complementary check.

**Why:** Circular dependencies cause subtle bugs and make refactoring harder.
next-template runs these in CI as a dedicated "Static Analysis" job.

**Packages already installed:**

- `dependency-cruiser`

**May need:**

- `madge` (optional, provides a simpler CLI + graphical output)

### 3. Bundle size checks (size-limit)

**What:** Enforce maximum bundle sizes for JS and CSS.
next-template limits JS (first load) to 300 kB gzipped and CSS to 30 kB gzipped.

**Why:** Prevents accidental bundle bloat from landing in main. Particularly important
for an accessibility-focused project since performance is an accessibility concern.

**Packages:**

- `@size-limit/preset-app` (or `@size-limit/file` for static builds)
- `size-limit`

### 4. CodeQL security scanning

**What:** Add `.github/workflows/codeql.yml` for automated security analysis.
Runs on push to main, PRs, and weekly schedule.

**Why:** Free static security analysis from GitHub. Catches potential vulnerabilities
in JS/TS code automatically.

**Packages:** None (GitHub Actions only).

### 5. Docker dev environment

**What:** Add `Dockerfile.dev` and `docker-compose.dev.yml` for containerized
development. Include scripts: `docker:dev`, `docker:dev:down`, `docker:dev:clean`.

**Why:** Reproducible development environment. Eliminates "works on my machine"
issues for contributors.

**Why:** Reproducible dev environment across platforms. Some contributors prefer
Docker over local installs, and Windows support is a consideration.

## Decisions (resolved)

- **Dependabot ignore list:** Keep ignoring Tailwind v4+ and ESLint v10+ for now.
  Project still needs Tailwind v4 migration, and an ESLint plugin is incompatible
  with v10. Revisit after those migrations are complete.
- **E2E in CI:** Re-enable after shadcn migration is complete and e2e tests are
  written. Blocked until then.
- **size-limit thresholds:** Will likely be larger than next-template's 300 kB JS /
  30 kB CSS defaults. Run a build and measure before setting limits.
- **Docker:** Yes, include it. Some contributors prefer Docker over local installs,
  and Windows support is a consideration.

## Additional items

### 1. Storybook + accessibility

**What:** Add Storybook with the `@storybook/addon-a11y` addon. next-template uses
`@storybook/nextjs-vite` (v10) with the a11y addon configured to treat violations
as errors.

**Why:** Provides an interactive component playground where devs can see a11y
violations in real time. Good reference material for the tutorial — devs can
explore accessible vs inaccessible component variants side by side.

**Key config from next-template:**

- Framework: `@storybook/nextjs-vite`
- a11y addon set to `test: 'error'` (violations fail, not just warn)
- Addons: a11y, docs, vitest integration, chromatic
- ESLint plugin: `eslint-plugin-storybook`
- Scripts: `storybook` (dev on port 6006), `build-storybook`

**Packages:**

- `storybook`
- `@storybook/nextjs-vite`
- `@storybook/addon-a11y`
- `@storybook/addon-docs`
- `eslint-plugin-storybook`

### 2. Stylelint config alignment

**What:** Update `.stylelintrc.json` to align with next-template improvements.
No new packages needed — just config updates.

**Current gaps vs next-template:**

- Missing `function-no-unknown` rule (should ignore `theme()`, `oklch()`)
- Missing at-rule ignores for Tailwind v4 syntax: `@theme`, `@custom-variant`,
  `@utility`, `@variant`, `@source`, `@import`
- Missing `import-notation: null` (suppresses false positives on CSS imports)
- Missing ignore patterns for build output (`.next/**`, `coverage/**`)
- a11y-road still ignores `pagefind/**` — likely stale after fumadocs removal
- a11y-road uses `stylelint-config-tailwindcss` extension (next-template handles
  Tailwind via manual at-rule/function ignores instead)

### 3. Migrate markdownlint-cli to markdownlint-cli2

**What:** Replace `markdownlint-cli` with `markdownlint-cli2`.

**Why markdownlint-cli2:**

- Actively maintained successor to markdownlint-cli
- Config file (`.markdownlint-cli2.jsonc`) supports an `ignores` array directly
  rather than relying on CLI glob patterns
- Supports `--fix` flag (a11y-road doesn't expose a fix script today)
- More nuanced rule config — e.g. `MD024: { "siblings_only": true }` allows
  duplicate headings in different sections, useful for tutorial content

**Changes needed:**

- Swap `markdownlint-cli` for `markdownlint-cli2` in devDependencies
- Rename `.markdownlint.jsonc` to `.markdownlint-cli2.jsonc`
- Restructure config to `{ "config": { ... }, "ignores": [ ... ] }` format
- Update package.json scripts and add a `markdownlint:fix` script
- Consider linting `.md` files in addition to `.mdx`

### 4. robots.ts

**What:** Add a `robots.ts` route handler for search engine directives.

### 5. sitemap.ts

**What:** Add a `sitemap.ts` route handler for XML sitemap generation.

### 6. Observability

**What:** Add structured logging and/or error tracking.
next-template uses `pino` + `pino-pretty` for structured logging.

### 7. Bundle analyzer

**What:** Add `@next/bundle-analyzer` with an `ANALYZE=true` env flag.
next-template has this wired into `next.config.ts`.

### 8. Error boundary

**What:** Add React error boundary component for graceful error handling.

### 9. error.tsx, not-found.tsx, loading.tsx

**What:** Add Next.js conventional error/loading UI files.

### 10. Security headers in next.config.ts

**What:** Add security headers to `next.config.ts`.
next-template includes CSP, HSTS, X-Frame-Options, and other headers.

## Suggested priority order

1. [ ] - Docker dev environment - unblocks contributors on any platform
2. [ ] - Git hooks (Husky + commitlint) - high impact, low effort
3. [ ] - Security headers in next.config.js - low effort, immediate safety win
4. [ ] - Storybook + accessibility - tutorial reference material
5. [ ] - CodeQL workflow - copy and adapt, no dependencies to install
6. [ ] - Circular dependency scripts - already installed, just needs wiring
7. [ ] - error.tsx, not-found.tsx, loading.tsx - standard Next.js resilience
8. [ ] - Error boundary - graceful runtime error handling
9. [ ] - Stylelint config alignment - config-only, no new packages
10. [ ] - Migrate markdownlint-cli to markdownlint-cli2 - better config, fix support
11. [ ] - Bundle size checks (size-limit) - need to measure baseline first
12. [ ] - Bundle analyzer - nice-to-have diagnostic tool
13. [ ] - robots.ts - SEO housekeeping
14. [ ] - sitemap.ts - SEO housekeeping
15. [ ] - Observability - structured logging

## Implementation plan

### Packages to install

Run these commands one at a time to avoid shell parsing issues:

```sh
# Production dependency
pnpm add pino

# Husky + commitlint
pnpm add -D husky @commitlint/cli @commitlint/config-conventional

# Storybook
pnpm add -D storybook @storybook/nextjs-vite @storybook/addon-a11y @storybook/addon-docs eslint-plugin-storybook

# Markdownlint (swap cli for cli2)
pnpm add -D markdownlint-cli2
pnpm remove markdownlint-cli

# Bundle tools
pnpm add -D size-limit @size-limit/file @next/bundle-analyzer

# Logging (dev only)
pnpm add -D pino-pretty

# Initialize husky
pnpm exec husky init
```

### Files to create

| File | Item |
| ---- | ---- |
| `Dockerfile.dev` | 1. Docker |
| `docker-compose.dev.yml` | 1. Docker |
| `.dockerignore` | 1. Docker |
| `.husky/pre-commit` | 2. Git hooks |
| `.husky/commit-msg` | 2. Git hooks |
| `commitlint.config.ts` | 2. Git hooks |
| `.storybook/main.ts` | 4. Storybook |
| `.storybook/preview.ts` | 4. Storybook |
| `.github/workflows/codeql.yml` | 5. CodeQL |
| `apps/a11y-road/src/app/error.tsx` | 7. Error pages |
| `apps/a11y-road/src/app/not-found.tsx` | 7. Error pages |
| `apps/a11y-road/src/app/loading.tsx` | 7. Error pages |
| `libs/a11y-ui/src/components/error-boundary.tsx` | 8. Error boundary |
| `.markdownlint-cli2.jsonc` | 10. Markdownlint |
| `.size-limit.json` | 11. Bundle size |
| `apps/a11y-road/src/app/robots.ts` | 13. robots |
| `apps/a11y-road/src/app/sitemap.ts` | 14. sitemap |
| `libs/a11y-kit/src/lib/logger.ts` | 15. Observability |

### Files to modify

| File | Items |
| ---- | ----- |
| `package.json` | 1, 2, 4, 6, 10, 11, 12 (scripts) |
| `apps/a11y-road/next.config.js` | 3 (security headers), 12 (bundle analyzer) |
| `.stylelintrc.json` | 9 (config alignment) |
| `knip.config.ts` | 2, 4 (ignore new packages) |
| `libs/a11y-ui/src/index.ts` | 8 (export error boundary) |
| `libs/a11y-kit/src/index.ts` | 15 (export logger) |

### Files to delete

| File | Item |
| ---- | ---- |
| `.markdownlint.jsonc` | 10. Replaced by `.markdownlint-cli2.jsonc` |

### Notes

- `next.config.js` is touched by items 3 + 12 — will batch those edits together
- `package.json` scripts touched by 7 items — will batch those too
- Existing `dep` script has a typo (`src.` → `src`) — will fix when adding circular dependency scripts
- Storybook may need a root-level PostCSS config for Tailwind resolution
- CSP headers need testing — dev mode allows `unsafe-eval` for HMR
- Bundle size limits should be set after running a build to measure baseline
