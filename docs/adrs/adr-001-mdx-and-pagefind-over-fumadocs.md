# ADR-001: Use @next/mdx and Pagefind instead of Fumadocs

## Status

Accepted

## Date

2026-03-17

## Context

The project needed MDX content rendering for tutorial pages and client-side search. We evaluated Fumadocs (fumadocs-mdx, fumadocs-core, fumadocs-ui) as an integrated documentation framework to replace our existing @next/mdx + Pagefind setup.

A migration branch was created and the following issues were discovered:

- **EMFILE errors**: fumadocs-ui pulls in a large dependency tree (Radix UI, Shiki syntax highlighter, icon sets). Vercel serverless functions have a 1024 file descriptor limit, and cold builds on macOS also hit EMFILE during initial resolution. This posed a deployment risk.
- **Visual conflicts**: Typing into Pagefind search caused the tutorial layout to render a black background, show 404 errors, and produce low-contrast sidebar text. fumadocs-core's route loader appeared to intercept client-side navigation in ways that conflicted with the existing routing setup.
- **Unnecessary abstraction**: The project has a single content collection (tutorials) with a straightforward structure. Fumadocs' content loader, route generation, and layout system added complexity without proportional benefit over @next/mdx.
- **Bundle weight**: fumadocs-ui bundles Shiki grammars, themes, and icon sets that are not needed for this project's use case.

## Decision

Stick with the existing stack:

- **@next/mdx** for MDX compilation and rendering
- **Pagefind** for static client-side search indexing
- **Custom layout components** (TutorialHeader, TutorialSidebar) for tutorial navigation

Future UI improvements (responsive sidebar, improved navigation) will use **shadcn/ui + Radix UI** primitives directly, giving full control over what ships in the bundle.

## Consequences

**Positive:**
- No EMFILE risk on Vercel serverless or CI
- Full control over routing, layout, and bundle size
- Pagefind search continues to work without conflicts
- Simpler dependency tree

**Negative:**
- No built-in table of contents, breadcrumb, or sidebar utilities from fumadocs-core — these will need to be built or sourced from shadcn/Radix when needed
- Manual content loading utilities instead of fumadocs-mdx's generated source

**Neutral:**
- shadcn/ui migration for sidebar and layout responsiveness is a separate future effort

## Alternatives considered

- **Fumadocs (full stack)**: Rejected due to EMFILE risk, visual conflicts, and unnecessary abstraction for a single-collection project.
- **Fumadocs-mdx + fumadocs-core (without fumadocs-ui)**: Partially viable, but fumadocs-core's loader still caused routing conflicts with Pagefind search. The content loading abstraction wasn't needed for one collection.
- **Nextra**: Not evaluated in depth. Similar integrated framework approach with similar concerns about bundle control.
