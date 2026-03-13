# Workflow Preferences

## Git and commits

- Do not commit changes unless explicitly asked.
- Do not push to a remote unless explicitly asked.
- If drafting a commit message, use conventional commit style such as `feat:`, `fix:`, or `chore:`.

## Commands

- Proceed without asking when running normal project scripts such as `pnpm test`, `pnpm lint`, `pnpm build`, and similar safe verification commands.
- Ask before running `pnpm install`, `pnpm add`, or other dependency-changing commands.
- Ask before running destructive, network-heavy, or environment-altering commands.

## Change strategy

- Read relevant files before editing.
- Prefer the smallest safe change that satisfies the request.
- Avoid broad refactors unless explicitly requested.
- Run appropriate quality checks after making changes.

## Documentation

- Update relevant docs when significant project behavior, architecture, workflow, or setup changes.
- Prefer updating README, project notes, or architecture docs instead of creating vague “memory notes.”