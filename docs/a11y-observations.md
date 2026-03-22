# A11y Observations

This document captures observations and suggested changes.

Milestones

- Certification - These are items that will be needed if we flesh out certification flow.  For now, these items can be deferred.
- Advanced Features - These are items that are a bit larger in scope and can be tackled later.
- Needs Design - Items that need fleshing out before working on.

## General

- [x] ~~Rename Admin Dashboard to Accessibility Issues Dashboard~~
- [x] ~~Rename route /admin to /editor~~ — route is now `/editor`, nav label is "Editor", sub-page back links say "Back to Dashboard"

## Issue Definitions

- [ ] Title - show ID that will be generated
- [ ] WCAG Criteria - Show a popup of all WCAG criteria and allow selecting multiple and auto populating the field with chiclets with an x to delete
- [ ] Testing Method - Replace the current single-value field with a multi-select of specific testing methods (screen reader, keyboard, zoom, color contrast, automated, semi-automated). Include a definition of what each method means.
- [ ] Should display a success banner that indicates what has been added/edited/deleted
- [ ] Allow json export (Milestone: Certification)

## Issue Instances

- [x] ~~Remove element selector~~ — removed `elementSelector` from `A11yIssueInstance` type, admin form, and all registry data
- [ ] Show id that is generated when editing/adding
- [ ] Show list of issue definition ids to select from when adding an issue
- [ ] Export to json (Milestone: Certification)
- [ ] In the table, display the full text in multiline cell
- [ ] Allow sorting by Page or ID
- [ ] Should display a success banner that indicates what has been added/edited/deleted
- [ ] Add a solution description field - describes what the "fixed" version does (e.g. "add descriptive alt text to the hero image"). This is used for evaluation matching.

## Issue Sets (Milestone: Certification)

- [x] ~~Remove `definitionIds` from the `IssueSet` model~~ — removed from type, default JSON, form UI, and table display
- [ ] Instances should be a dialog with a way to filter by page or definition type
- [ ] Instance should show definition id
- [ ] Ability to add all by page or all by definition id 
- [ ] Support random set generation - randomly sample N instances with optional constraints (e.g. "at least one from each page", "at least 3 different issue types"). Useful for certification scenarios where variability is needed across multiple test sessions.

### Use cases for sets

- **Workshop focus**: Limit to specific issue types (e.g. only form issues) for a focused teaching session
- **Certification**: Generate randomized sets for variability across test sessions
- **Page-specific**: Scope to specific pages for targeted evaluation

## Logging an Issue

- [ ] If other is selected, should include a text field for someone to type in something
- [ ] Issue type should be a free-text field rather than a dropdown selector — the dropdown gives away the answer
- [ ] WCAG criteria should be a dialog selector (not auto-filled — tester must identify the correct SC as part of the evaluation)
- [ ] Should have a field for proposed solution
- [ ] Need a way to manage duplicates (Milestone: Needs Design) — Rather than duplicate detection, allow testers to edit or delete their own findings from the evaluation page before submission. For scoring: if two findings match the same known issue instance, only the best-scoring one counts. This handles accidental duplicates without blocking legitimate multiple issues on the same element.
- [ ] Need a different way to identify an element - the id reveals the accessibility error
- [ ] Display only elements found on the current page - see docs/features/element-identification.md

## Evaluation Scoring

Scoring model for a given element:

- **Correct** — Issue type matches, WCAG matches, solution matches
- **Partial** — Issue type and WCAG match, solution is filled in but doesn't match the expected fix
- **Failure** — Issue type OR WCAG doesn't match, or solution is empty

### What can be reliably matched today

- **WCAG criteria** — exact match against the instance's definition (reliable)
- **Issue type** — free-text comparison against known definitions (approximate, needs fuzzy or AI matching)
- **Solution** — free-text comparison against the solution description (requires manual review or AI)

Currently only WCAG can be reliably auto-matched. Issue type and solution require manual review by a content editor until AI-assisted matching is added. See [a11y-issue-ux.md](a11y-issue-ux.md) for the review workflow.

## Evaluation

- [ ] Only show missed issues after evaluation has been submitted
- [x] ~~Rename End Evaluation to Submit Evaluation~~
- [ ] Make the Evaluation Results page the default landing page when a tester clicks Evaluation. Show active evaluations (with Resume action) alongside past evaluations (with View Results action).
- [x] ~~Logging out and back in should not reset an evaluation status.~~ — Added `status` field (`active | submitted`) to `Evaluation` type. Resume logic now only resumes evaluations with `status: 'active'`. `endEvaluation` sets status to `submitted`.
- [ ] An ended evaluation should display start and end date/time and stats as seen on the individual evaluations page.
- [ ] Show the correct answer alongside the tester's answer for each finding (expected issue type, WCAG criteria, and solution description from the instance)
- [ ] Identify issues that don't match known issues.  It may be a valid issue, so it should be flagged for manual review.

## Resolved Questions

- [x] ~~How would a tester select or be assigned a specific test set?~~ — For now, testers auto-start with the default set. Future: assignment model where a content editor assigns a set to a tester, or a selection screen where the tester picks one.
- [x] ~~Why does an Issue Set have a field for Definitions? Shouldn't it only have instances?~~ — Agreed, sets should only have instances. Definition scope is derived from the instances in the set. Filtering by definition type is a UI convenience when building the set.
