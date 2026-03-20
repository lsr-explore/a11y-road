# A11y Issue UX — Design Doc

## Overview

This feature adds a user-facing experience for practicing accessibility evaluations on the Maple Valley Health demo site. Users can log findings, associate them with WCAG criteria, and receive feedback on their evaluation.

See `docs/a11y-workflow.md` for the existing data model (issue definitions, instances, registry) that this feature builds on.

## Goals

- Let users practice identifying accessibility issues in a realistic context
- Provide structured input for logging findings against specific elements
- Support grading/feedback so users can see how thorough their evaluation was

## Open Questions

- How does grading work? Compare user findings against the known issue registry? Partial credit for close matches?
- Should the experience be timed or untimed?
- Is there a progression model (e.g., start with obvious issues, advance to subtle ones)?
- Should findings persist across sessions (localStorage, DB) or be session-only?

## Two Modes

The site operates in two distinct modes that affect what information is visible:

**Tutorial mode** — the side panel is open, answers are visible. This is educational — the user is learning, not being tested.

**Evaluation mode** — the side panel is hidden. This is a test — the user shouldn't be able to inspect their way to answers.

Both modes use the same React ref registry for element identification (see decision record below).

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

### Decision: Option 2 — React ref registry in both modes

Use the ref registry everywhere. Remove `data-a11y-id` attributes entirely.

**We initially considered Option 3 (mode-based switching)** — using readable `data-a11y-id` in tutorial mode since answers are already visible in the side panel. However, we reconsidered for these reasons:

1. **One code path is simpler than two.** If we're building the ref registry for evaluation mode anyway, using it everywhere means a single identification and highlighting strategy. No branching logic, no maintaining two approaches.

2. **Ref-based highlighting is better regardless of mode.** Direct element access via `ref.current.scrollIntoView()` is more reliable than `querySelector` with string selectors. This is an improvement for the side panel even in tutorial mode.

3. **The accessible/broken toggle works naturally with refs.** The toggle already works through React state (`useA11yMode`). When `A11yDemo` re-renders with different content, the ref still points to the wrapper element. No special handling needed.

4. **Hashing alone isn't enough.** Even hashed attributes reveal *which* elements have issues — the attribute's presence is the tell. Only removing attributes entirely solves this.

5. **Element labels serve double duty.** Each `A11yDemo` gets a `label` prop describing what the element is ("Hero image", "Navigation menu"), not what's wrong with it. These labels power both the side panel highlighting in tutorial mode and the finding logger dropdown in evaluation mode.

### Implementation Approach

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

**In tutorial mode**, the side panel uses the registry to highlight elements when "Highlight" is clicked — same behavior as today, but via refs instead of DOM queries.

**In evaluation mode**, the finding logger uses the registry to populate the element dropdown:

1. **Dropdown** — populated from registry labels ("Hero image", "Email input", etc.). Labels describe elements, not issues — no answers revealed.
2. **User logs finding** — selects "Hero image" + enters "missing alt text" + selects WCAG 1.1.1
3. **Highlighting** — uses `ref.current.scrollIntoView()` directly
4. **Grading** — maps user's selected element → `instanceId` → looks up known issue in registry → compares against user's finding

## Proposed Features

### Randomized Issue Presentation

- Ability to randomize which accessibility breaks are active on the demo site
- Each randomized set gets an ID that can be saved to storage for recall/replay
- Enables different evaluation experiences on repeat visits

### Finding Logger (separate page)

A structured form for reporting an accessibility finding:

- **Element selection** — dropdown populated from the `ElementRegistryProvider` labels
  - Allow selecting multiple elements per finding
  - Labels describe the element ("Hero image"), not the issue
- **WCAG success criteria** — field to enter applicable criteria
  - Allow multiple criteria per finding
  - Consider autocomplete from WCAG 2.1/2.2 criteria list
- **Severity** — select field (critical, serious, moderate, minor — aligns with common audit tools)
- **Solution** — text field for recommended fix
  - Include ability to write HTML (code editor or fenced input)

### Evaluation Grading

- Compare submitted findings against the known issue registry
- Scoring model TBD — options:
  - Percentage of known issues found
  - Weighted by severity
  - Bonus for correct WCAG criteria mapping
  - Penalty for false positives?
- Results page showing: found, missed, and false positive issues

## Relationship to Existing Systems

- **Issue Registry** (`src/data/issues-registry.ts`) — the "answer key" for grading
- **A11yDemo component** — controls which breaks are active; gets `label` prop and ref registration; randomization would toggle subsets. `data-a11y-id` attribute will be removed in favor of the ref registry.
- **Side Panel** — shows all issues in tutorial mode (highlighting via refs); hidden during evaluation mode
- **API route** (`/api/a11y-issues`) — could serve as grading endpoint (compare submission against registry)
- **ElementRegistryProvider** (new) — React context that collects element refs and labels from `A11yDemo` components. Used by the side panel for highlighting in tutorial mode and by the finding logger for element selection in evaluation mode.

## Workflow Design

Map out who does what in the full lifecycle:

- **A11y SME** — creates issue definitions and populates the initial issue registry (see `docs/a11y-workflow.md` for current steps)
- **Developer** — creates issue instances, annotates elements with `A11yDemo` (including `label` prop)
- **Evaluator** (learner) — uses the randomized demo, logs findings via element dropdown, receives grades
- **Admin** — manages issue definitions and registry over time (see User Roles in TODO.md)

Open: How much of the SME/developer workflow could be exposed through the UI vs. requiring code changes?

## Technical Considerations

- Randomization state needs to be serializable (for recall by ID)
- `ElementRegistryProvider` must handle components mounting/unmounting as pages change
- Grading logic could live server-side (API route) or client-side
- DB support for persisting evaluations is planned but low priority — start with localStorage

## Related Docs

- `docs/a11y-workflow.md` — data model, registry helpers, side panel and summary page
- `docs/ai-tutorial-assistant.md` — the AI assistant could help users during evaluations
