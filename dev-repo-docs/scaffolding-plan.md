# Scaffolding Plan

This document describes the tooling, quality checks, testing, and structure
planned for the a11y-road Docusaurus site before content authoring begins.

## Tooling Overview

| Tool                                       | Purpose                                                        |
| ------------------------------------------ | -------------------------------------------------------------- |
| **Biome**                                  | Formatting + general linting for TS, TSX, JSON, CSS            |
| **ESLint** + **eslint-plugin-jsx-a11y**    | A11y-specific linting rules that complement Biome's coverage   |
| **markdownlint-cli2**                      | Lint Markdown/MDX content (heading structure, list style, etc.) |
| **cspell**                                 | Spell checking across docs and code                            |
| **Vitest** + **React Testing Library**     | Component tests for custom React components                    |
| **Playwright** + **@axe-core/playwright**  | E2E tests and automated a11y audits against the built site     |
| **husky** + **lint-staged**                | Pre-commit hooks to run linters on staged files                |
| **Lighthouse CI** (`@lhci/cli`)            | Performance, a11y, SEO scoring in CI                           |

### Biome + ESLint Together

Rather than choosing one or the other, this project uses both:

- **Biome** handles formatting and general code quality linting. It is fast
  (Rust-based), replaces Prettier, and has its own set of a11y rules.
- **ESLint** with `eslint-plugin-jsx-a11y` provides additional accessibility
  rules that Biome does not yet cover (and vice versa). ESLint is configured
  for linting only — no formatting rules, no Prettier.
- Overlapping rules are disabled in ESLint to avoid duplicate diagnostics.
  Biome's `a11y` rule group and `eslint-plugin-jsx-a11y` have partial overlap,
  so the ESLint config explicitly disables rules already covered by Biome.
- Gap: neither tool lints Markdown/MDX content, so `markdownlint-cli2` fills
  that role.

## Interactive Components

### UI Primitives — Radix UI (not shadcn)

The site will include interactive elements (quizzes, toggles, embedded editors).
**Radix UI primitives** are recommended over shadcn/ui:

- shadcn depends on Tailwind CSS, which conflicts with Docusaurus's Infima CSS
  framework. Mixing two CSS systems creates class collisions, specificity wars,
  and build complexity.
- Radix UI provides the same underlying accessible primitives that shadcn is
  built on, but without any styling opinion.
- Radix primitives work naturally with CSS modules, which Docusaurus already
  supports.
- Components like `@radix-ui/react-radio-group`, `@radix-ui/react-tabs`, and
  `@radix-ui/react-dialog` are ideal for building quiz interactions and
  accessible toggles.

### Quiz Component

A reusable `<Quiz>` MDX component for end-of-page knowledge checks:

- Built on Radix `RadioGroup` and `Accordion` primitives.
- Accepts questions/answers via props or frontmatter.
- Provides immediate feedback with accessible announcements (live regions).
- Styled with CSS modules to match the Docusaurus theme.
- No backend needed — purely client-side, no score persistence (for now).

### Embedded Code Editor — Sandpack

For interactive code snippets where developers can edit and run code:

- **Sandpack** (`@codesandbox/sandpack-react`) is recommended over Docusaurus's
  built-in `theme-live-codeblock` (which uses react-live).
- Sandpack supports multi-file editing, npm package imports, and a real bundler
  — needed for demonstrating accessible component patterns with dependencies.
- Can be wrapped as an `<A11yCodeEditor>` MDX component that loads two tabs:
  "Inaccessible" and "Accessible" versions of the same snippet.
- Sandpack's theming supports dark/light mode and can sync with the Docusaurus
  color mode.

### Demo Site (Separate Repository)

A companion site demonstrating real accessibility issues and fixes:

- Hosted separately (its own repo, its own GitHub Pages deployment).
- Two parallel routes for the same content: `/inaccessible/...` and
  `/accessible/...`.
- The a11y-road docs site links to specific demo pages to illustrate concepts.
- This keeps the docs site simple (static content) and the demo site focused
  (interactive examples with intentional a11y failures).

## Internationalization (i18n)

Docusaurus has built-in i18n support. The scaffolding prepares for this:

- `docusaurus.config.ts` already has `i18n.defaultLocale: 'en'` and a `locales`
  array. Adding a new language is a config change + translated content files.
- `pnpm write-translations` generates translation JSON files for UI strings.
- Translated docs go in `i18n/<locale>/docusaurus-plugin-content-docs/current/`.
- No additional packages needed — this is built into Docusaurus.
- **For now**: leave `locales: ['en']` and structure content so it is easy to
  translate later (avoid hardcoded English strings in components, use the
  Docusaurus `<Translate>` component for UI text).

## Theme (Dark/Light Toggle)

Docusaurus already provides a dark/light toggle via Infima. The current config
has `respectPrefersColorScheme: true`, which auto-detects the OS preference.
No additional packages needed. Custom CSS variables in `src/css/custom.css`
control the palette for both modes.

When building custom components (quiz, code editor), use Infima CSS variables
(`--ifm-color-primary`, `--ifm-background-color`, etc.) so they respond to
theme changes automatically. Sandpack's theme can be bound to the Docusaurus
color mode via the `useColorMode` hook.

## Package Installation

### Dev dependencies

```bash
pnpm add -D \
  @biomejs/biome \
  eslint \
  eslint-plugin-jsx-a11y \
  @eslint/js \
  typescript-eslint \
  markdownlint-cli2 \
  cspell \
  vitest \
  @testing-library/react \
  @testing-library/jest-dom \
  @vitejs/plugin-react \
  jsdom \
  playwright \
  @playwright/test \
  @axe-core/playwright \
  husky \
  lint-staged \
  @lhci/cli 
```

### Runtime dependencies

```bash
pnpm add \
  @radix-ui/react-radio-group \
  @radix-ui/react-accordion \
  @radix-ui/react-tabs \
  @codesandbox/sandpack-react
```

## Scripts to Add (package.json)

```json
{
  "scripts": {
    "lint": "biome check . && eslint src/ docs/",
    "lint:fix": "biome check --write . && eslint src/ docs/ --fix",
    "format": "biome format --write .",
    "lint:md": "markdownlint-cli2 \"docs/**/*.md\" \"docs/**/*.mdx\" \"blog/**/*.md\" \"blog/**/*.mdx\"",
    "spellcheck": "cspell \"docs/**\" \"blog/**\" \"src/**\"",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:a11y": "playwright test --grep @a11y",
    "prepare": "husky",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  }
}
```

## Configuration Files to Create

### `biome.json`

- Enable formatting and general linting for TS, TSX, CSS, JSON.
- Enable the `a11y` rule group.
- Do **not** enable formatting rules that overlap with ESLint — Biome owns all
  formatting; ESLint owns only the a11y rules Biome does not cover.
- Ignore `build/`, `.docusaurus/`, `node_modules/`.

### `eslint.config.js` (flat config)

- Use `typescript-eslint` for TS parsing.
- Enable `eslint-plugin-jsx-a11y` recommended rules.
- Disable rules already covered by Biome (e.g., if Biome covers
  `noAriaHiddenOnFocusable`, disable the equivalent ESLint rule).
- No formatting rules — Biome handles all formatting.
- Scope to `src/` only.

### `.markdownlint-cli2.jsonc`

- Enable default rules.
- Disable `MD013` (line length) since docs tend to have long lines.
- Disable `MD033` (inline HTML) since MDX uses JSX in Markdown.

### `cspell.json`

- Add project-specific words: `a11y`, `docusaurus`, `frontmatter`, `mdx`,
  `radix`, `sandpack`, `infima`, etc.
- Point to `docs/`, `blog/`, and `src/` directories.

### `vitest.config.ts`

- Use `@vitejs/plugin-react`.
- Set environment to `jsdom`.
- Include `src/**/*.test.{ts,tsx}`.

### `playwright.config.ts`

- Run against `http://localhost:3000` (a served build).
- Use the `webServer` option to auto-start `pnpm build && pnpm serve` before
  tests.
- Create test projects for desktop and mobile viewports.

### `.husky/pre-commit`

- Run `lint-staged`.

### `lint-staged` (in `package.json`)

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "biome check --write --no-errors-on-unmatched",
      "eslint --no-errors-on-unmatched"
    ],
    "*.{css,json}": "biome check --write --no-errors-on-unmatched",
    "*.{md,mdx}": "markdownlint-cli2"
  }
}
```

## Proposed Directory Structure

```text
a11y-road/
├── .github/
│   └── workflows/
│       ├── ci.yml                  # PR checks: lint, typecheck, build, test, a11y
│       └── deploy.yml              # Build and deploy to GitHub Pages on push to main
├── blog/
│   ├── authors.yml
│   └── tags.yml
├── docs/                           # Markdown/MDX content (auto-generates sidebar)
├── src/
│   ├── components/
│   │   ├── Quiz/
│   │   │   ├── index.tsx
│   │   │   ├── styles.module.css
│   │   │   └── __tests__/
│   │   │       └── Quiz.test.tsx
│   │   ├── A11yCodeEditor/
│   │   │   ├── index.tsx
│   │   │   └── styles.module.css
│   │   └── HomepageFeatures/
│   │       ├── index.tsx
│   │       └── styles.module.css
│   ├── css/
│   │   └── custom.css
│   ├── theme/                      # Swizzled Docusaurus theme components (if any)
│   └── pages/
│       ├── index.tsx
│       └── index.module.css
├── static/
│   └── img/
├── tests/
│   └── e2e/                        # Playwright E2E and a11y tests
│       ├── navigation.spec.ts
│       └── a11y-audit.spec.ts
├── biome.json
├── eslint.config.js
├── cspell.json
├── .markdownlint-cli2.jsonc
├── vitest.config.ts
├── playwright.config.ts
├── docusaurus.config.ts
├── sidebars.ts
├── tsconfig.json
└── package.json
```

### Key changes from the default scaffold

| Change                                                       | Rationale                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------- |
| Remove `docs/tutorial-basics/` and `docs/tutorial-extras/`   | Template content — replaced with real a11y workflow docs       |
| Remove sample blog posts                                     | Template content                                              |
| Remove `src/pages/markdown-page.md`                          | Template page                                                 |
| Remove template SVGs from `static/img/`                      | Docusaurus placeholder illustrations                          |
| Add `src/components/Quiz/`                                   | Reusable end-of-page knowledge check component                |
| Add `src/components/A11yCodeEditor/`                         | Sandpack wrapper for accessible/inaccessible code comparison  |
| Add `src/theme/`                                             | Conventional location for swizzled Docusaurus theme overrides |
| Add `tests/e2e/`                                             | Playwright E2E and a11y audit tests                           |
| Component tests co-located in `src/components/*/__tests__/`  | Keeps tests next to the code they cover                       |
| Add `.github/workflows/`                                     | CI/CD for a public repo on GitHub Pages                       |

## CI Workflows

### `ci.yml` (runs on pull requests)

1. Install dependencies (`pnpm install --frozen-lockfile`)
2. Run `biome check .`
3. Run `eslint src/`
4. Run `markdownlint-cli2`
5. Run `cspell`
6. Run `pnpm typecheck`
7. Run `pnpm build` (also validates broken links)
8. Run `vitest run` (component tests)
9. Run `playwright test` (E2E + a11y audits against the build)
10. Run Lighthouse CI against the build

### `deploy.yml` (runs on push to main)

1. Install dependencies
2. Build the site
3. Deploy to GitHub Pages using `actions/deploy-pages`

## .gitignore Additions

```text
# Test artifacts
test-results/
playwright-report/

# Lighthouse
.lighthouseci/
```

## Repo hygiene / contributor experience

1. Add .nvmrc (or .tool-versions) + packageManager in package.json.
2. Add CONTRIBUTING.md with the exact “local dev loop” and “before you push” commands.
3. Add a docs/CONTRIBUTING.md for content authoring conventions (frontmatter, headings, image rules, etc.).
4. Add CODEOWNERS (even if it’s just you) so PR checks feel “real”.

## Accessibility-specific niceties for the docs site itself

1. Add a simple “Accessibility Statement” page and link it in footer.

   - Add a “Known limitations” section for any third-party widgets (Sandpack, embeds).

## Open Questions

- **Biome + ESLint rule overlap audit**: Before configuring, do a side-by-side
  comparison of Biome's `a11y` rules vs `eslint-plugin-jsx-a11y` recommended
  rules to determine exactly which rules to disable where.
- **Demo site tech stack**: Should the companion demo site also be Docusaurus,
  or a plain Vite + React app (simpler for demonstrating raw HTML/component
  a11y issues without Docusaurus abstractions)?
- **Quiz persistence**: For now, quizzes are stateless. If learner progress
  tracking is desired later, options include localStorage or a lightweight
  backend.
- **Sandpack bundle size**: Sandpack adds significant JS weight. Consider
  lazy-loading it only on pages that use it (React `lazy()` + `Suspense` or
  Docusaurus `BrowserOnly`).

## Order of Implementation

1. Install dev dependencies and runtime dependencies
2. Configure Biome and ESLint (with rule overlap audit)
3. Configure markdownlint and cspell
4. Configure Vitest and Playwright
5. Set up husky + lint-staged
6. Create GitHub Actions workflows (CI + deploy)
7. Scaffold `Quiz` and `A11yCodeEditor` component stubs
8. Prepare i18n structure (use `<Translate>` in components, keep `locales: ['en']`)
9. Update CLAUDE.md with new scripts and conventions
