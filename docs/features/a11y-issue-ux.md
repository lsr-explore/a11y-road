# A11y Issue UX — Design Doc

## Overview

This feature adds a user-facing experience for practicing accessibility evaluations on the Maple Valley Health demo site. Users can log findings, associate them with WCAG criteria, and receive feedback on their evaluation.

See `docs/a11y-workflow.md` for the data model (issue definitions, instances, registry) and `docs/a11y-userflow.md` for role-based user flows.

## Goals

- Let users practice identifying accessibility issues in a realistic context
- Provide structured input for logging findings against specific elements
- Support grading/feedback so users can see how thorough their evaluation was

## Status

### Completed

- [x] Role-based authentication (learner, tester, content-editor) with demo credentials
- [x] Route protection via `src/proxy.ts` (public, protected, admin routes)
- [x] Server/client layout split with `UserRoleProvider`
- [x] Tester role: demo locked to broken mode, side panel hidden, issue logger visible
- [x] Content editor role: full learner view plus admin pages
- [x] `ElementRegistryProvider` — ref-based element registry (replaced `data-a11y-id` DOM attributes)
- [x] `A11yModeProvider` — supports `forceBroken` prop for tester role
- [x] Issue logger panel with element dropdown, issue type dropdown, WCAG field, description
- [x] Inline feedback on finding submission (correct, partial, not-found)
- [x] Evaluation results page with stats, findings table, missed issues table
- [x] Past evaluation viewing by ID
- [x] Admin dashboard with counts and links
- [x] Admin CRUD for issue definitions, instances, and issue sets
- [x] localStorage persistence for evaluations and admin edits
- [x] Issue sets model (curated subsets of definitions and instances)
- [x] Login page with demo credentials display and show/hide passwords

### Pending changes (see `docs/a11y-observations.md`)

- [ ] Rename admin routes from `/admin` to `/editor`
- [ ] Rename dashboard to "Accessibility Issues Dashboard"
- [ ] Issue type in logger should be free-text, not a dropdown (gives away answers)
- [ ] WCAG criteria should not auto-fill — tester must identify the correct SC
- [ ] Add solution description field to issue instances
- [ ] Add proposed solution field to finding logger
- [ ] Remove `elementSelector` from `A11yIssueInstance` type (ref-based registration replaced it)
- [ ] Remove `definitionIds` from issue sets (sets should only contain instance IDs)
- [ ] Evaluation status bug: add `status` field (`active | submitted`) to prevent reopening ended evaluations on re-login
- [ ] Manual review workflow for evaluations (see `docs/a11y-issue-ux.md` in docs root)
- [ ] AI-assisted solution matching (future)

## Open Questions

- ~~How does grading work? Compare user findings against the known issue registry? Partial credit for close matches?~~ **Resolved.** See Evaluation Scoring below.
- Should the experience be timed or untimed?
- Is there a progression model (e.g., start with obvious issues, advance to subtle ones)?
- ~~Should findings persist across sessions (localStorage, DB) or be session-only?~~ **Resolved.** localStorage now, database later.

## Two Modes — Now Three Roles

The original two-mode design has been implemented as three roles:

| Role | Original mode | What they see |
|------|--------------|---------------|
| **Learner** | Tutorial mode | Side panel with answers, demo toggle, A11y Summary |
| **Tester** | Evaluation mode | Issue logger panel, demo locked to broken, no answers |
| **Content Editor** | (new) | Everything learner sees + admin CRUD pages |

Both learner and tester modes use the same React ref registry for element identification (see decision record below).

## Element Identification — Decision Record

### Problem

The current `A11yDemo` component uses `data-a11y-id` with human-readable slugs (e.g., `data-a11y-id="landing-hero-img-alt"`). These are used by the side panel's "Highlight" button to find and scroll to elements via `querySelector`. However, these attributes reveal the answers — a user can inspect the DOM and see which elements have issues and what kind.

We also need a way for users to select elements when logging findings, and a way to map those selections back to known issues for grading.

### Options Considered

**Option 1: Hash the IDs**
Replace readable slugs with a deterministic hash in the rendered attribute. `landing-hero-img-alt` → `data-a11y-id="x7f2k9"`. The `A11yDemo` component applies the hash, and the side panel/highlighting uses the same hash function to find elements.

- Pros: Simple to implement, minimal architecture change
- Cons: Someone determined could reverse the hashes if they know the possible IDs. Still leaks which elements have issues (even if the type is obscured) — the attribute's presence is the tell. Doesn't help with the element dropdown for the finding logger.

**Option 2: React ref registry**
The `A11yDemo` component registers its DOM element with a context provider. The side panel looks up elements through that context instead of querying the DOM by selector. No data attributes in the HTML at all.

- Pros: No DOM clues whatsoever. The registry also provides a clean element list for the finding logger dropdown. Direct ref access for highlighting is more reliable than `querySelector`.
- Cons: More architecture — requires a context provider, ref registration, and coordination between components.

**Option 3: Mode-based switching (Option 2 in evaluation mode only)**
Keep readable `data-a11y-id` in tutorial mode (answers are already visible in the side panel anyway), but switch to the ref registry in evaluation mode.

- Pros: No unnecessary complexity in tutorial mode. Obfuscation only applied when it matters.
- Cons: Two code paths to maintain for element identification and highlighting.

### Decision: Option 2 — React ref registry in both modes ✅ Implemented

Use the ref registry everywhere. Remove `data-a11y-id` attributes entirely.

**We initially considered Option 3 (mode-based switching)** — using readable `data-a11y-id` in tutorial mode since answers are already visible in the side panel. However, we reconsidered for these reasons:

1. **One code path is simpler than two.** If we're building the ref registry for evaluation mode anyway, using it everywhere means a single identification and highlighting strategy. No branching logic, no maintaining two approaches.

2. **Ref-based highlighting is better regardless of mode.** Direct element access via `ref.current.scrollIntoView()` is more reliable than `querySelector` with string selectors. This is an improvement for the side panel even in tutorial mode.

3. **The accessible/broken toggle works naturally with refs.** The toggle already works through React state (`useA11yMode`). When `A11yDemo` re-renders with different content, the ref still points to the wrapper element. No special handling needed.

4. **Hashing alone isn't enough.** Even hashed attributes reveal *which* elements have issues — the attribute's presence is the tell. Only removing attributes entirely solves this.

5. **Element labels serve double duty.** Each `A11yDemo` gets a `label` prop describing what the element is ("Hero image", "Navigation menu"), not what's wrong with it. These labels power both the side panel highlighting in tutorial mode and the finding logger dropdown in evaluation mode.

### Implementation Approach ✅ Implemented

Add a `label` prop to `A11yDemo` that describes the element:

```tsx
<A11yDemo
  instanceId="landing-hero-img-alt"
  label="Hero image"
  broken={<img src="photo.jpg" />}
  fixed={<img src="photo.jpg" alt="A doctor consulting..." />}
/>
```

Create an `ElementRegistryProvider` context. Each `A11yDemo` registers on mount:

```ts
{ ref: <DOM element>, label: "Hero image", instanceId: "landing-hero-img-alt" }
```

This replaces the current `data-a11y-id` attribute and `querySelector`-based highlighting.

### Highlighting Limitations

Not all issue instances can be wrapped with `A11yDemo`, which means they won't be in the ref registry and can't be highlighted. Known cases:

- **`landing-page-language`** — the issue is on the `<html>` element (missing `lang` attribute). This can't be wrapped with a React component.
- **`team-notification`** — the `TeamNotification` component manages its own accessible/broken toggling without using `A11yDemo`.

For these cases, the "Highlight" button in the `IssueCard` should be hidden when the instance has no registered element. This requires checking the registry before rendering the button.

- [ ] TODO: Hide the "Highlight" button in `IssueCard` when `getElement(instance.id)` returns undefined.

**In learner mode**, the side panel uses the registry to highlight elements when "Highlight" is clicked — same behavior as before, but via refs instead of DOM queries.

**In tester mode**, the finding logger uses the registry to populate the element dropdown:

1. **Dropdown** — populated from registry instance IDs and page context. Currently shows instance IDs; future: show element labels without revealing the issue type.
2. **User logs finding** — selects element + enters issue description + selects WCAG criteria
3. **Highlighting** — uses `ref.current.scrollIntoView()` directly
4. **Grading** — maps user's selected element → `instanceId` → looks up known issue in registry → compares against user's finding

## Evaluation Scoring

Scoring model for a given element (revised from original open question):

- **Correct** — Issue type matches, WCAG matches, solution matches
- **Partial** — Issue type and WCAG match, solution is filled in but doesn't match the expected fix
- **Failure** — Issue type OR WCAG doesn't match, or solution is empty

### What can be reliably auto-matched today

- **WCAG criteria** — exact match against the instance's definition (reliable)
- **Issue type** — free-text comparison against known definitions (approximate, needs fuzzy or AI matching)
- **Solution** — free-text comparison against the solution description (requires manual review or AI)

Currently only WCAG can be reliably auto-matched. Issue type and solution require manual review by a content editor until AI-assisted matching is added.

### Manual review workflow (planned)

Content editors can review tester evaluations and override match results. Each finding shows the tester's answer alongside the correct answer (expected issue type, WCAG criteria, and solution description). Reviewers can override the auto-match result with a note. See `docs/a11y-issue-ux.md` (docs root) for details.

### AI-assisted matching (future)

AI-assisted solution matching will be added later to reduce the manual review burden. The AI would compare the tester's proposed solution against the expected solution description and assess semantic similarity.

## Issue Sets ✅ Implemented (with pending changes)

Issue sets are curated subsets used for evaluations. Currently implemented with both `definitionIds` and `instanceIds`, but will be simplified to instances only (see `docs/a11y-observations.md`).

### Use cases

- **Workshop focus**: Limit to specific issue types (e.g. only form issues) for a focused teaching session
- **Certification**: Generate randomized sets for variability across test sessions
- **Page-specific**: Scope to specific pages for targeted evaluation

### Randomized set generation (planned)

Randomly sample N instances with optional constraints (e.g. "at least one from each page", "at least 3 different issue types"). Each randomized set gets an ID for recall/replay.

## Finding Logger ✅ Implemented (with pending changes)

Currently implemented as a right-side panel (replaces the side panel for testers) with:

- **Element selection** — dropdown populated from issue instance IDs
- **Issue type** — currently a dropdown of definition titles (pending change to free-text)
- **WCAG criteria** — text field, currently auto-fills from selected issue type (pending change to not auto-fill)
- **Description** — text field

### Pending additions

- [ ] Proposed solution field
- [ ] Free-text issue type (replace dropdown)
- [ ] WCAG dialog selector (replace text field)
- [ ] "Other" element option with manual text input
- [ ] Duplicate management
- [ ] Severity field (critical, serious, moderate, minor)

## Relationship to Existing Systems

- **Issue Registry** (`src/data/issues-registry.ts`) — the "answer key" for grading
- **A11yDemo component** — controls which breaks are active; has `label` prop and ref registration. `data-a11y-id` attributes removed in favor of the ref registry.
- **Side Panel** — shows all issues in learner/content-editor mode (highlighting via refs); hidden for testers
- **Issue Logger** (`src/components/issue-logger/`) — visible only for testers; form + findings list + evaluation pages
- **Admin View** (`src/components/admin/`) — visible only for content editors; CRUD for definitions, instances, issue sets
- **API route** (`/api/a11y-issues`) — serves registry data as JSON; could serve as grading endpoint
- **ElementRegistryProvider** — React context that collects element refs and labels from `A11yDemo` components. Used by the side panel for highlighting in learner mode and by the finding logger for element selection in tester mode.
- **UserRoleProvider** (`src/components/providers/user-role-provider.tsx`) — React context providing role and display name from the session cookie

## Workflow Design

| Role | Responsibilities |
|------|-----------------|
| **Content Editor** | Creates/edits issue definitions and instances via admin UI. Creates issue sets for evaluations. Reviews tester evaluations (planned). |
| **Developer** | Creates issue instances in code, annotates elements with `A11yDemo` (including `label` prop) |
| **Tester** | Uses the demo in broken mode, logs findings via the issue logger, views evaluation results |
| **Learner** | Explores the demo with toggle, reviews issues in the side panel, views the A11y Summary |
| **Site Admin** (planned) | User management, role assignment |

## Technical Considerations

- ~~Randomization state needs to be serializable (for recall by ID)~~ Issue sets provide the scoping mechanism; randomized generation is planned
- `ElementRegistryProvider` handles components mounting/unmounting as pages change ✅
- Grading logic currently runs client-side in the `IssueLoggerProvider`
- localStorage persistence implemented for evaluations and admin edits; database support planned

## Related Docs

- `docs/a11y-workflow.md` — data model, registry helpers, side panel and summary page, auth system
- `docs/a11y-userflow.md` — role-based user flows, demo accounts, UI visibility matrix
- `docs/a11y-observations.md` — backlog of UI/UX refinements with checkboxes
- `docs/a11y-issue-ux.md` (docs root) — evaluation review workflow and AI matching notes
- `docs/features/ai-tutorial-assistant.md` — the AI assistant could help users during evaluations
