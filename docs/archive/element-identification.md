# Element Identification for Tester Dropdown — Decision Record

## Problem

The tester's issue logger needs a way to select which element has an issue. The current dropdown shows instance IDs (e.g., `landing-hero-img-alt`) which reveal the accessibility error. It also shows all instances across all pages rather than scoping to the current page.

Two requirements:

1. The element picker must not reveal which elements have known issues
2. It should only show elements on the current page

## Constraint: AI-Detectable Patterns

Any approach that creates a DOM pattern distinguishing issue elements from non-issue elements is vulnerable. An AI assistant could trivially detect patterns like "all elements with `data-a11y-name` on wrapper `<div>` elements are accessibility issues, while non-issue elements have the attribute directly on semantic elements."

This rules out having `A11yDemo` automatically apply a `data-a11y-name` attribute to its wrapper div, since `A11yDemo` renders a `<div ref={elementRef}>` wrapper and non-issue elements would have the attribute on their native element (e.g., `<img>`, `<button>`).

## Options Considered

### Option 1: `A11yDemo` auto-applies `data-a11y-name` from its `label` prop

- Pros: Zero developer friction for issue elements
- Cons: Creates a detectable pattern — wrapper `<div>` with attribute = known issue. An AI assistant would spot this immediately.

### Option 2: `A11yDemo` extracts `data-a11y-name` from children

`A11yDemo` would look for a `data-a11y-name` attribute on its children after mount via `querySelector`. Developer puts the attribute on the meaningful child element.

- Pros: Attribute is on the real element, not a wrapper div
- Cons: Complex implementation. Doesn't solve the coverage problem — non-issue elements still need the attribute manually. Nested `A11yDemo` components (like the contact form) make this fragile.

### Option 3: Build step / script to auto-generate attributes

Scan page components, identify major semantic elements, and auto-assign `data-a11y-name` values.

- Pros: Reduces developer friction significantly
- Cons: Over-engineering for the current stage. Would need review/adjustment step. Build tooling adds maintenance burden.

### Option 4: Interactive element picker (inspect mode)

Tester clicks "Select Element," hovers over the page, elements highlight, click to select. System generates a description from the element's tag, role, text content, aria-label.

- Pros: No DOM attributes needed at all. No developer friction. Closest to how real audit tools work.
- Cons: Fundamentally mouse-driven — puts a significant burden on screen reader and keyboard users who would need to navigate the entire page. Implementation complexity (overlay, mouse tracking, element detection). Too ambitious for demo timeline.

### Option 5: Manual `data-a11y-name` on all major elements (selected)

Developers add `data-a11y-name` to all major elements on each page — both issue and non-issue elements. For `A11yDemo`-wrapped elements, the developer adds the attribute to the meaningful child element inside `A11yDemo` as well. The attribute's presence reveals nothing because it's on everything.

- Pros: No detectable pattern. Attribute is on real elements. Simple to implement. Dropdown populated via `querySelectorAll('[data-a11y-name]')` which is automatically page-scoped.
- Cons: Developer friction — for issue elements, the name effectively goes in two places (the `label` prop on `A11yDemo` and `data-a11y-name` on the child element). Requires discipline to maintain coverage on non-issue elements.

## Decision: Option 5 — Manual `data-a11y-name` on all major elements

**Rationale:**

- It's the simplest approach that doesn't leak information
- The developer friction (two places for issue elements) is acceptable for the current scale
- The dropdown is automatically page-scoped since `querySelectorAll` only returns elements in the current DOM
- No new components, build steps, or complex interactions needed

**If this solution is adopted for the certification application**, revisit with either:

- A build step (Option 3) to reduce developer friction at scale
- An accessible version of the interactive picker (Option 4) that works well with keyboard and screen readers

## Matching Flow

1. Tester selects an element from the dropdown (populated from `data-a11y-name` values on the current page)
2. System checks the `ElementRegistryProvider` — is there a registered `A11yDemo` instance whose label matches the selected `data-a11y-name`?
3. If yes → element has a known issue, proceed with matching against the tester's finding
4. If no → element isn't in the registry as a known issue, flag for manual review (tester may have found a valid issue not yet in the registry)

## Implementation Notes

- `A11yDemo` continues as-is — `label` prop feeds the registry and side panel, no DOM attribute
- Developers add `data-a11y-name` to major elements: headings, forms, inputs, images, buttons, nav landmarks, sections, dialogs
- For `A11yDemo`-wrapped elements, add `data-a11y-name` to the meaningful child element (e.g., `<input data-a11y-name="Name input" .../>` inside the `A11yDemo` wrapper)
- Dropdown queries `document.querySelectorAll('[data-a11y-name]')` for the current page
- An "Other" option with free-text input handles elements without the attribute

## Related

- `docs/a11y-observations.md` — backlog items for the element selector
- `docs/features/a11y-issue-ux.md` — element identification decision record (original ref registry decision)
- `libs/a11y-kit/src/components/a11y-demo.tsx` — current `A11yDemo` implementation
