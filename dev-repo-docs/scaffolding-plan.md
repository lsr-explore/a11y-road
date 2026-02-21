# Scaffolding Plan

This document describes the tooling, quality checks, testing, and structure
for the a11y-road Docusaurus site. It tracks decisions made during setup and
the current state of each area.

## Status Key

- Done -- implemented and working
- Planned -- decided but not yet implemented
- Deferred -- intentionally postponed
- Removed -- evaluated and rejected

## Tooling Overview

| Tool | Purpose | Status |
| --- | --- | --- |
| **Biome** | Formatting + general linting for TS, TSX, JSON, CSS | Done |
| **ESLint** + **eslint-plugin-jsx-a11y** | A11y-specific linting rules that complement Biome | Done |
| **markdownlint-cli2** | Lint Markdown/MDX content (heading structure, list style, etc.) | Done |
| **cspell** | Spell checking across docs and code | Done |
| **Vitest** + **React Testing Library** | Component tests + doc structure validation | Done |
| **Playwright** + **@axe-core/playwright** | E2E tests and automated a11y audits against the built site | Done |
| **husky** + **lint-staged** | Pre-commit hooks to run linters on staged files | Done |
| **Lighthouse CI** (`@lhci/cli`) | Performance, a11y, SEO scoring in CI | Done |
| **gray-matter** | Frontmatter parsing for doc structure tests | Done |

### Biome + ESLint Together (Done)

Rather than choosing one or the other, this project uses both:

- **Biome** handles formatting and general code quality linting. It is fast
  (Rust-based), replaces Prettier, and has its own set of a11y rules.
- **ESLint** with `eslint-plugin-jsx-a11y` provides additional accessibility
  rules that Biome does not yet cover. ESLint is configured for linting
  only -- no formatting rules, no Prettier.
- Overlapping rules are disabled in ESLint to avoid duplicate diagnostics.
  The ESLint config explicitly disables every `jsx-a11y` rule already covered
  by Biome's `a11y` rule group, with comments mapping each to its Biome
  equivalent.
- Gap: neither tool lints Markdown/MDX content, so `markdownlint-cli2` fills
  that role.

### Storybook (Removed)

Storybook was initially scaffolded but has been removed:

- Too heavy for a documentation site with few custom components.
- `storybook-addon-docusaurus` was pinned to Docusaurus v2 (peer dep conflict).
- The a11y addon's checks are already covered by axe-core in Playwright,
  Biome a11y rules, and eslint-plugin-jsx-a11y.
- **Alternative**: `@docusaurus/theme-live-codeblock` can provide interactive
  component examples directly in MDX pages when needed (deferred until
  components exist to demonstrate).

Removed packages: `storybook`, `@storybook/react-webpack5`,
`@storybook/addon-a11y`, `@storybook/addon-docs`, `@storybook/addon-onboarding`,
`@storybook/addon-webpack5-compiler-swc`, `eslint-plugin-storybook`,
`storybook-addon-docusaurus`.

### Vercel Agent Skills (Partial)

Evaluated three Vercel agent skills:

- **web-design-guidelines** -- Kept. Covers UI/UX and accessibility review
  rules. Inlined into `.agents/skills/web-design-guidelines/SKILL.md` to
  avoid fetching from GitHub on every use.
- **vercel-composition-patterns** -- Removed. Targets complex stateful
  component architectures (compound components, context patterns). Too
  specialized for a docs site with simple presentational components.
- **vercel-react-best-practices** -- Removed. ~80% of its 57 rules target
  Next.js features (server components, server actions, Suspense streaming,
  SWR data fetching) that don't apply to a static Docusaurus site.

## Doc Structure Validation (Done)

A Vitest test (`tests/docs-structure.test.ts`) dynamically discovers all
`.md`/`.mdx` files in `docs/` and validates:

1. **Required frontmatter**: `title`, `description`, `sidebar_position` must
   be present (parsed with `gray-matter`).
2. **Single H1**: Exactly one `#` heading per file (code blocks excluded).
3. **Orphan detection**: Every subdirectory containing docs must have a
   `_category_.json` file.

### markdownlint configuration

- `MD013` (line length) disabled -- docs tend to have long lines.
- `MD033` (inline HTML) disabled -- MDX uses JSX in Markdown.
- `MD025` `front_matter_title` set to `""` -- docs use both frontmatter
  `title` (for metadata/SEO) and an explicit `# Heading` (for content).
  Without this, markdownlint counts the frontmatter title as an H1 and
  reports a false duplicate.

## Lighthouse CI (Done)

Configured in `lighthouserc.js`:

- Audits 4 representative pages: homepage, a doc page, a nested doc page,
  and the blog index.
- Uses `staticDistDir` to serve the build output directly (no separate
  server needed).
- Assertion thresholds:
  - **Accessibility**: error below 0.9 (strict for an a11y-focused site)
  - **Performance**: warn below 0.8
  - **Best practices**: warn below 0.9
  - **SEO**: warn below 0.9
- Results uploaded to temporary public storage (viewable via URL in CI logs).
- Added to CI pipeline after E2E tests.
- Local run: `pnpm lighthouse` (requires a prior `pnpm build`).

## Interactive Components (Planned)

### UI Primitives -- Radix UI (not shadcn)

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

### Quiz Component (Planned)

A reusable `<Quiz>` MDX component for end-of-page knowledge checks:

- Built on Radix `RadioGroup` and `Accordion` primitives.
- Accepts questions/answers via props or frontmatter.
- Provides immediate feedback with accessible announcements (live regions).
- Styled with CSS modules to match the Docusaurus theme.
- No backend needed -- purely client-side, no score persistence (for now).

### Embedded Code Editor -- Sandpack (Planned)

For interactive code snippets where developers can edit and run code:

- **Sandpack** (`@codesandbox/sandpack-react`) is recommended over Docusaurus's
  built-in `theme-live-codeblock` (which uses react-live).
- Sandpack supports multi-file editing, npm package imports, and a real bundler
  -- needed for demonstrating accessible component patterns with dependencies.
- Can be wrapped as an `<A11yCodeEditor>` MDX component that loads two tabs:
  "Inaccessible" and "Accessible" versions of the same snippet.
- Sandpack's theming supports dark/light mode and can sync with the Docusaurus
  color mode.
- **Bundle size concern**: Sandpack adds significant JS weight. Should be
  lazy-loaded only on pages that use it (React `lazy()` + `Suspense` or
  Docusaurus `BrowserOnly`).

### Demo Site (Planned -- Separate Repository)

A companion site demonstrating real accessibility issues and fixes:

- Hosted separately (its own repo, its own GitHub Pages deployment).
- Two parallel routes for the same content: `/inaccessible/...` and
  `/accessible/...`.
- The a11y-road docs site links to specific demo pages to illustrate concepts.
- This keeps the docs site simple (static content) and the demo site focused
  (interactive examples with intentional a11y failures).

## Internationalization (Deferred)

Docusaurus has built-in i18n support. The scaffolding prepares for this:

- `docusaurus.config.ts` has `i18n.defaultLocale: 'en'` with `locales: ['en', 'es']`
  and locale configs for both English and Spanish.
- `pnpm write-translations` generates translation JSON files for UI strings.
- Translated docs go in `i18n/<locale>/docusaurus-plugin-content-docs/current/`.
- No additional packages needed -- this is built into Docusaurus.
- **For now**: structure content so it is easy to translate later (avoid
  hardcoded English strings in components, use the Docusaurus `<Translate>`
  component for UI text).

## Theme (Done)

Docusaurus provides a dark/light toggle via Infima. The current config
has `respectPrefersColorScheme: true`, which auto-detects the OS preference.
No additional packages needed. Custom CSS variables in `src/css/custom.css`
control the palette for both modes.

When building custom components (quiz, code editor), use Infima CSS variables
(`--ifm-color-primary`, `--ifm-background-color`, etc.) so they respond to
theme changes automatically.

## CI Workflows (Done)

### `ci.yml` (runs on pull requests)

1. Install dependencies (`pnpm install --frozen-lockfile`)
2. Biome check
3. ESLint
4. markdownlint
5. Spellcheck
6. TypeScript type checking
7. Production build (also validates broken links via `onBrokenLinks: 'throw'`)
8. Vitest (component tests + doc structure validation)
9. Playwright E2E + a11y audits (installs Chromium, uploads report artifact)
10. Lighthouse CI (performance, a11y, SEO, best practices thresholds)

### `deploy.yml` (runs on push to main)

1. Install dependencies
2. Build the site
3. Deploy to GitHub Pages using `actions/deploy-pages`

## Current Directory Structure

```text
a11y-road/
├── .agents/skills/             # Agent skills (web-design-guidelines)
├── .github/
│   ├── CODEOWNERS
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       ├── ci.yml
│       ├── codeql.yml
│       └── deploy.yml
├── blog/
│   ├── authors.yml
│   └── tags.yml
├── dev-repo-docs/              # Internal planning docs (not published)
├── docs/                       # Markdown/MDX content (auto-generates sidebar)
│   ├── intro.md
│   ├── tutorial-basics/
│   │   └── _category_.json
│   └── tutorial-extras/
│       └── _category_.json
├── src/
│   ├── components/
│   │   ├── HomepageFeatures/
│   │   │   └── __tests__/
│   │   └── ...
│   ├── css/
│   │   └── custom.css
│   ├── __mocks__/              # Vitest mocks for @theme and @docusaurus
│   └── pages/
│       └── index.tsx
├── static/
│   └── img/
├── tests/
│   ├── docs-structure.test.ts  # Doc frontmatter + structure validation
│   └── e2e/                    # Playwright E2E + a11y audit tests
├── biome.json
├── cspell.json
├── eslint.config.mjs
├── lighthouserc.js
├── .markdownlint-cli2.jsonc
├── vitest.config.ts
├── playwright.config.ts
├── docusaurus.config.ts
├── sidebars.ts
├── tsconfig.json
├── CLAUDE.md
└── package.json
```

## Repo Hygiene / Contributor Experience

| Item | Status |
| --- | --- |
| `.nvmrc` + `packageManager` in package.json | Done |
| CODEOWNERS | Done |
| Issue templates | Done |
| PR template | Done |
| Pre-commit hooks (husky + lint-staged) | Done |
| CONTRIBUTING.md | Planned |
| Accessibility Statement page (linked in footer) | Planned |

## Open Questions

- **Demo site tech stack**: Should the companion demo site also be Docusaurus,
  or a plain Vite + React app (simpler for demonstrating raw HTML/component
  a11y issues without Docusaurus abstractions)?
- **Quiz persistence**: For now, quizzes are stateless. If learner progress
  tracking is desired later, options include localStorage or a lightweight
  backend.
- **Sandpack bundle size**: Sandpack adds significant JS weight. Consider
  lazy-loading it only on pages that use it (React `lazy()` + `Suspense` or
  Docusaurus `BrowserOnly`).
- **Live codeblock vs Sandpack**: For simple single-component demos,
  `@docusaurus/theme-live-codeblock` may be sufficient. Sandpack is better
  for multi-file, dependency-heavy examples. May use both.

## Implementation Progress

### Phase 1: Scaffolding (Done)

1. ~~Install dev dependencies~~ Done
2. ~~Configure Biome and ESLint (with rule overlap audit)~~ Done
3. ~~Configure markdownlint and cspell~~ Done
4. ~~Configure Vitest and Playwright~~ Done
5. ~~Set up husky + lint-staged~~ Done
6. ~~Create GitHub Actions workflows (CI + deploy)~~ Done
7. ~~Configure Lighthouse CI~~ Done
8. ~~Add doc structure validation tests~~ Done
9. ~~Evaluate and remove Storybook~~ Done
10. ~~Evaluate and curate agent skills~~ Done

### Phase 2: Content & Components (Next)

1. Replace template docs with real a11y workflow content
2. Replace template blog posts
3. Update homepage content and features
4. Scaffold Quiz component (Radix-based)
5. Scaffold A11yCodeEditor component (Sandpack-based)
6. Add Accessibility Statement page
7. Add CONTRIBUTING.md
8. Prepare i18n structure (`<Translate>` in components, keep `locales: ['en', 'es']`)
