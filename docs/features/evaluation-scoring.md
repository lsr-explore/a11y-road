# Evaluation Scoring

## Current Scoring Model

Scoring is based on three criteria: **Page + Element + WCAG**.

| Result | Criteria |
|---|---|
| **Correct** | Page matches, element matches, and at least one WCAG criterion overlaps |
| **Partial** | Page and element match, but WCAG criteria do not overlap |
| **Not Found** | Element does not match any known issue in the set |

### Match Details

Each finding stores `matchDetails` with:

- `pageMatched` — tester was on the correct page
- `elementMatched` — selected `data-a11y-name` matches a known issue's label
- `wcagMatched` — at least one WCAG success criterion overlaps with the expected criteria
- `reason` — human-readable explanation of the score

### Fields not yet scored

- **Issue type** — free text, requires fuzzy or AI matching against known definition titles
- **Proposed solution** — free text, requires comparison against `solutionDescription` on the instance

These fields are captured but currently only used for display and manual review by a content editor.

## Open Challenges

### Shared elements across pages

The header, footer, and navigation are present on every page but are not currently in the element dropdown (which queries `data-a11y-name` within `<main>`). This creates several problems:

- A tester may notice a legitimate accessibility issue in the nav, header, or footer and have no way to report it against a known issue
- Some shared element issues are page-specific (e.g., an active nav state that removes focus indicators, or a skip link that doesn't work on a particular page layout)
- For the current demo site, restricting to `<main>` content is acceptable since no issues are intentionally seeded in shared elements
- For a certification scenario, shared elements would need to be handled — possibly as a "global" scope that appears in the dropdown on every page, or as a separate evaluation category

### Multiple instances of the same element

The team page has multiple delete buttons (one per card), all with `data-a11y-name="Delete member button"`. The dropdown deduplicates these, so the tester selects "Delete member button" once. But:

- If the issue only affects one specific card's delete button, the tester can't distinguish which one
- The current matching treats any "Delete member button" finding as matching the single `team-delete-button` instance
- A future approach might use more specific names (e.g., "Delete Dr. Smith button") but that changes with data

### Issue type matching

With free-text issue type input, the tester might write "no alt text" while the known issue is titled "Missing alt text". These mean the same thing but won't match automatically. Options:

- **Fuzzy string matching** — compare normalized strings, but fragile with varied phrasing
- **AI-assisted matching** — use an LLM to compare the tester's description against known definitions
- **Manual review** — content editor reviews and confirms matches (current approach for issue type)

### WCAG criteria granularity

A known issue may map to multiple WCAG criteria (e.g., a non-semantic dialog maps to both 4.1.2 and 2.4.3). Current scoring counts a match if *any* criterion overlaps. This means:

- A tester who identifies only one of two applicable criteria gets "correct"
- A tester who identifies a related but different criterion gets "not found" for WCAG even if the element is right
- Future: could score WCAG completeness (e.g., "identified 1 of 2 applicable criteria")

### Solution matching

`proposedSolution` on the finding and `solutionDescription` on the instance are both free text. Meaningful comparison requires either:

- Keyword extraction and overlap scoring
- AI-assisted semantic comparison
- Manual review by a content editor

### Duplicate findings

If a tester submits two findings for the same element, current behavior:

- Both findings are stored and scored independently
- The evaluation detail page shows both
- Planned: only the best-scoring finding per element should count toward the final score (see a11y-observations.md)

### Scoring elements with no known issue

When a tester reports an issue on an element that isn't a known issue (e.g., "Email input" on the contact page), the finding gets `not-found`. But this doesn't distinguish between:

- A false positive (tester incorrectly flagged a non-issue element)
- A genuine issue the content editor hasn't registered yet

Currently these are flagged as "Needs review" for manual triage.

### WCAG as the only scoring axis

The current model assumes every accessibility issue maps to one or more WCAG success criteria. This works well for structured evaluation — the issues seeded in this demo site all have clear WCAG mappings — but it wouldn't capture all real-world accessibility problems.

**Issues that technically pass WCAG but are still barriers:**

- An accessible name that's present but unhelpful (e.g., `aria-label="button"` passes 4.1.2 but is useless to a screen reader user)
- Reading order that's technically "meaningful" per 1.3.2 but practically confusing because the visual layout creates different expectations
- A form that's labeled and keyboard-operable but so cognitively complex that users with learning disabilities can't complete it

**Gaps in WCAG AA coverage:**

- Cognitive load — no AA criterion limits interface complexity or information density
- Plain language — 3.1.5 (Reading Level) is AAA only; at AA there's no readability requirement
- Honoring `prefers-reduced-motion` for ambient animation — 2.3.3 covers animation from interactions but not all motion
- Supporting `prefers-color-scheme` or `forced-colors` — no specific success criterion

These edge cases sit in the space between "passes WCAG" and "is actually accessible" — the difference between compliance and usability. They're also the kind of judgment calls that are hard to capture in a checklist or automated scoring, which is why manual expert review remains important even with structured evaluation tools.

For this project, the WCAG-based scoring model is sufficient. But the limitation should be acknowledged: a perfect score doesn't mean a perfectly accessible site, only that the tester correctly identified the known issues against their WCAG criteria.
