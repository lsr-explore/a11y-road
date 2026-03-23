# TODO

## Sidebar (shadcn migration)

- [ ] Fix sidebar scroll behavior — sidebar should not scroll with page content; needs visual debugging
- [ ] Styling sweep (Laurie)
- [ ] Fix missing CSS variables for focus ring (`--ring`, `--ring-offset`) on mobile close button
- [ ] Update components.json aliases to `@a11y-road/a11y-ui/...` paths (without src/)
- [ ] Fix lint errors in shadcn components
- [ ] UX review: parent pages with children use button+chevron instead of Link

## Tutorial Content

- [ ] Rewrite User Research Meet the Team — should be formative research for a new page, not usability testing of an existing one
- [ ] Decide on Meet the Team sub-page branding/prefix (e.g., "A11y in Action:", "Applying What We've Learned:")
- [ ] Add recommended prompts to ground in standards truth
- [ ] Run text through copyscape to check for any accidental plagiarism
- [ ] Create mindmap of WCAG by User disability
- [ ] Find Accessibility SME to review and edit tutorial

## Footer

- [ ] Accessibility statement page
- [ ] Privacy policy page
- [ ] Contact page
- [ ] Social links (GitHub, LinkedIn)
- [ ] Update about page with actual GitHub repo URL

## Search

- [ ] Verify Pagefind works on first Vercel deploy (postbuild hook + URL correctness)

## Infrastructure / Tooling

- [ ] Debug Playwright e2e test errors (`apps/maple-valley-health-e2e/`)
- [x] Vercel deployment setup
- [ ] Add docker support - for local development
- [ ] Add DB support
  - [ ] A11y issues
  - [ ] Issues Registry
- [ ] understand use of common cache in node_modules for libs/a11y-ui/vite.config.mts - specifies ../../node_modules/.vite/libs/a11y-ui
- [ ] add pino logging

```js
 That cacheDir setting points Vite's cache to the workspace root's
  node_modules/.vite/ directory instead of letting each sub-project create its own
   .vite cache folder locally.

  In an Nx monorepo this is common for a couple reasons:

  1. Shared cache location — keeps all Vite caches in one predictable place
  (node_modules/.vite/) rather than scattered across libs/a11y-ui/.vite,
  libs/a11y-kit/.vite, etc.
  2. Clean cleanup — node_modules is already gitignored and gets wiped on pnpm
  install or clean, so the cache doesn't need separate cleanup.
  3. Avoids conflicts — the libs/a11y-ui suffix namespaces it so multiple projects
   don't stomp on each other's caches.

  It's a standard pattern that Nx generators produce when scaffolding Vite-based
  library projects.
```

## Tutorial Features

- [ ] Light/dark theme toggle - only on tutorial
- [ ] AI tutorial assistant (design doc at `docs/ai-tutorial-assistant.md`)
  - [ ] W3C copyright review before indexing WCAG/APG content
- [ ] Add reference to W3C All ACT Rules - https://www.w3.org/WAI/standards-guidelines/act/rules/
- [ ] Fix responsiveness - evaluate what needs to be adjusted - mobile, tablet, landscape and profile and resizing the browser window
- [ ] Design header and interaction
- [ ] Design footer
- [ ] Cache search results so someone can return to them - add link to return to results.

## Demo Maple Valley Health Features

- [ ] Migrate Patient Scheduler experience - tables, calendars
- [ ] Verify that all pages have examples from the most common issues reported in the Web AIM Million report
- [ ] Fix responsiveness - evaluate what needs to be adjusted - mobile, tablet, landscape and profile and resizing the browser window
- [ ] Fix heading shift
- [ ] Design Header
- [ ] Design Footer
- [ ] Before/after code comparison view — show how simple the fixes are (code diff or inline code view, not side-by-side pages)
- [ ] Accessibility metrics dashboard — stats view on top of the summary page (issues by category, WCAG level coverage, pass rate)
- [ ] Export evaluation as PDF/report — downloadable report of user findings with grading results
- [ ] Hide "Highlight" button in IssueCard when element is not in the ref registry (e.g., `landing-page-language`, `team-notification`)
- [x] ~~Remove unused `elementSelector` field from `A11yIssueInstance` type and registry data~~ — removed, replaced by `label` field and `data-a11y-name` attributes

## A11y Issue UX and management

- [x] ~~See design doc at `docs/a11y-issue-ux.md`~~ — content moved to `docs/features/evaluation-scoring.md` and `docs/backlog/a11y-observations.md`

## Design

- [ ] Logo for A11yRoad
- [ ] Logo for Maple Valley Health
- [ ] Find images for tutorial - see notes tagged with "{/*IMAGE:" in the tutorial docs

## Documentation

- [ ] Create diagram and steps for adding accessibility issues and descriptions
- [ ] Case study page — "How this was built" covering architecture decisions (a11y-kit library, issue registry pattern, MDX pipeline). Source material: ADRs, design docs

## Landing Page

- [ ] Update landing page
  - [ ] Add image
  - [ ] Add more description
  - [ ] Add "who this is for" section and different ways to use the site
  - [ ] Highlight the interactive evaluation mode as a key feature

## Quality

- [ ] unit tests - 90% coverage
- [ ] Playwright tests
- [ ] Tutorial accessibility evaluation (use Accessible Community - Ta11y and https://www.a11yproject.com/checklist/)
  - [ ] Add skiplink
- [ ] Maple Valley Health accessibility evaluation (use Accessible Community - Ta11y and https://www.a11yproject.com/checklist/)
  - [ ] Add skiplink for issues and for accessible version

## User Roles

- [ ] Maple Valley Health
  - [ ] Admin - access to add/edit doctors
  - [ ] User
- [ ] Site
  - [ ] Admin
    - [ ] Edit Accessibility issues
    - [ ] Edit Issues - registry

## CI

- [ ] Add security tool checker
- [ ] Add dependabot
- [ ] Add github copilot for pr reviews
