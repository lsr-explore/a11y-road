# A11y Road

An accessibility workflow tutorial built with Next.js, Nx, and MDX. The tutorial walks through building accessibility into every stage of a product team's workflow — from user research through monitoring and feedback.

## Prerequisites

- **Node.js** >= 20
- **pnpm** (package manager)

### Optional global tools

These are not required for development but are used by specific scripts.

#### Pandoc (PDF export)

[Pandoc](https://pandoc.org/) converts the tutorial MDX pages into a single PDF. It requires a LaTeX engine (`xelatex`), which is included with BasicTeX.

**macOS (Homebrew):**

```sh
brew install pandoc
brew install --cask basictex
```

After installing BasicTeX, open a new terminal and run:

```sh
sudo tlmgr update --self
sudo tlmgr install fancyhdr
```

The `fancyhdr` package is used by the PDF header template.

**Verify installation:**

```sh
pandoc --version
xelatex --version
```

## Getting Started

```sh
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:3000` (or the next available port).

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start the Next.js dev server |
| `pnpm build` | Production build (also generates the search index) |
| `pnpm test` | Run Vitest unit/component tests |
| `pnpm test:all` | Run tests for all projects |
| `pnpm test:all:coverage` | Run all tests with coverage |
| `pnpm lint` | ESLint (includes jsx-a11y) |
| `pnpm format:check` | Biome formatting check |
| `pnpm stylelint` | CSS linting |
| `pnpm markdownlint` | MDX linting |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm knip` | Unused code detection |
| `pnpm check:all` | Run all quality checks and tests |
| `pnpm e2e` | Playwright end-to-end tests |
| `pnpm search:index` | Rebuild the Pagefind search index (requires a prior build) |
| `pnpm pandoc` | Generate the tutorial PDF via Pandoc |
| `pnpm clean` | Remove build artifacts and caches |

## Search

Site search is powered by [Pagefind](https://pagefind.app/). The search index is generated automatically during `pnpm build` via the `postbuild` script. Only tutorial pages marked with `data-pagefind-body` are indexed.

- The generated index lives in `apps/a11y-road/public/pagefind/` and is gitignored.
- In development, search uses the index from the most recent build. Run `pnpm build` at least once to populate it.
- To re-index without a full build, run `pnpm search:index` (requires a prior build).

## PDF Export

The `pnpm pandoc` script uses Pandoc with `xelatex` to compile all tutorial MDX pages into a single PDF. Configuration lives in `pandoc/pdf-templates/`:

- `pdf-defaults.yaml` — Pandoc defaults file listing input pages, output path, and layout options
- `pdf-header.tex` — LaTeX header (page numbering, footer)

Output is written to `pandoc/output/a11y-road-tutorial.pdf`.

## Project Structure

This is an Nx monorepo with the following projects:

- **apps/a11y-road** — The main Next.js tutorial application
- **apps/maple-valley-health-e2e** — Playwright e2e tests
- **libs/a11y-kit** — Shared accessibility component library

## Tooling

- **Nx** — Task orchestration
- **Biome** — Formatting and JS/TS linting
- **ESLint** — Accessibility linting (jsx-a11y) and semantic checks
- **Stylelint** — CSS linting
- **Vitest** — Unit and component tests
- **Playwright** — End-to-end tests
- **knip** — Unused code detection
- **Pagefind** — Static search indexing
- **Pandoc** — PDF generation
