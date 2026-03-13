# CLAUDE.md

Before executing any shell command:

1. explain the command
2. verify it is safe
3. run the minimal version possible

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
