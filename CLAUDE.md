# CLAUDE.md

## Code Style

- **Arrow functions only** — no `function` declarations. Use `export const Foo = () => {}`.
- **No single-character variables** — minimum 2 characters. Use descriptive names in callbacks (e.g., `item` not `r`, `criterion` not `c`, `event` not `e`, `left`/`right` not `a`/`b`).
- **File naming** — kebab-case for all files and directories.
- **`const` over `let`** where possible.
- **Import ordering** — follow Biome defaults.

## Test Conventions

- **Co-located test files** — place `*.spec.tsx` next to the source file.
- **Mock data in separate files** — keep mock/fixture data shareable, not inline in tests.

## Workflow Preferences

- **Do not commit** — I will review and commit manually using squash merges. Follow conventional commit style (`feat:`, `fix:`, `chore:`, etc.) when drafting messages.
- **Do not push** to remote without asking.
- **Proceed without asking** when running package.json scripts (`pnpm test`, `pnpm lint`, `pnpm build`, etc.).
- **Ask before running** `pnpm install` or `pnpm add` — confirm dependency changes first.
- **Run quality checks** after making changes to verify nothing broke.
- **Update memory notes** when significant project changes are made.

## Project Conventions

- **pnpm** as package manager.
- **Nx** for task orchestration — use `run-many -t <target>` to cover all projects.
- **Biome** for formatting + general JS/TS linting.
- **ESLint** for accessibility (jsx-a11y) and semantic linting.
- **Stylelint** for CSS.
- **Vitest** for unit/component tests, **Playwright** for e2e.
- **knip** for unused code detection.

## Quality Checks

Run `pnpm check:all` to verify everything, or individual checks:

```sh
pnpm format:check   # Biome formatting
pnpm lint            # ESLint (all projects)
pnpm stylelint       # CSS linting
pnpm typecheck       # TypeScript
pnpm knip            # Unused code
pnpm test            # Vitest
```
