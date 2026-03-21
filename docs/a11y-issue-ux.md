# A11y Issue UX Notes

This document captures UX decisions and planned features discussed during development.

## Evaluation Review & Overrides

Content editors (or future site admins) should be able to manually review tester evaluations and override match results. This is needed because:

- Automated matching can only reliably verify WCAG criteria (exact match against the instance's definition)
- Issue type matching is approximate when the tester enters free-text descriptions
- Solution matching requires judgment — a tester's proposed fix may be valid but worded differently than the stored solution description

### Review workflow

1. Tester submits an evaluation
2. Content editor opens the evaluation in a review mode
3. For each finding, the reviewer can see the tester's answer alongside the correct answer (expected issue type, WCAG criteria, and solution description from the instance)
4. The reviewer can override the match result (correct, partial, failure) with a note explaining the override
5. Overridden results are reflected in the evaluation stats

### AI-assisted matching (future)

AI-assisted solution matching will be added later to reduce the manual review burden. The AI would compare the tester's proposed solution against the expected solution description and assess semantic similarity. Manual override would still be available as a fallback.
