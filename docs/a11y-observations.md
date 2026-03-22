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

- [x] ~~Title - show ID when editing~~ — ID shown as read-only text when editing, editable field when adding
- [x] ~~WCAG Criteria - multi-select with chiclets~~ — searchable dropdown from wcag-criteria.json, selected criteria shown as chiclets with remove buttons
- [x] ~~Testing Method - multi-select~~ — changed from single `testingMethod` to `testingMethods: TestingMethod[]` with 6 options (screen reader, keyboard, zoom, color contrast, automated, semi-automated) with descriptions
- [x] ~~Should display a success banner that indicates what has been added/edited/deleted~~
- [ ] Allow json export (Milestone: Certification)

## Issue Instances

- [x] ~~Remove element selector~~ — removed `elementSelector` from `A11yIssueInstance` type, admin form, and all registry data
- [x] ~~Show id when editing/adding~~ — ID shown as read-only text when editing, editable field when adding
- [x] ~~Show list of issue definition ids to select from when adding an issue~~ — dropdown now shows title and ID together
- [ ] Export to json (Milestone: Certification)
- [x] ~~In the table, display the full text in multiline cell~~ — changed from `truncate` to `whitespace-normal`
- [x] ~~Allow sorting by Page or ID~~ — sortable column headers with ascending/descending toggle
- [x] ~~Should display a success banner that indicates what has been added/edited/deleted~~
- [x] ~~Add a solution description field~~ — added `solutionDescription` (optional) to `A11yIssueInstance` type, form, table, and all registry data

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

- [x] ~~If other is selected, should include a text field~~ — "Other (describe below)" option shows a free-text input for element description
- [x] ~~Issue type should be a free-text field~~ — replaced dropdown with free-text input; no longer auto-fills WCAG criteria
- [x] ~~WCAG criteria should be a dialog selector~~ — searchable multi-select picker from wcag-criteria.json; tester must identify the correct SC
- [x] ~~Should have a field for proposed solution~~ — added `proposedSolution` field to Finding type and issue logger form
- [ ] Need a way to manage duplicates (Milestone: Needs Design) — Rather than duplicate detection, allow testers to edit or delete their own findings from the evaluation page before submission. For scoring: if two findings match the same known issue instance, only the best-scoring one counts. This handles accidental duplicates without blocking legitimate multiple issues on the same element.
- [ ] Need a different way to identify an element - the id reveals the accessibility error
- [ ] Display only elements found on the current page - see docs/features/element-identification.md
- [ ] Need a way to dismiss the banner that displays after an issue is submitted.  Dismiss if the page is changed or one of the fields is updated in the issue logger.  Also add an x to be able to dismiss it.

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

- [x] ~~Only show missed issues after evaluation has been submitted~~ — missed issues section only renders when `status === 'submitted'`
- [x] ~~Rename End Evaluation to Submit Evaluation~~
- [x] ~~Make the Evaluation Results page the default landing page~~ — evaluation page always shows evaluations list with status badges (Active/Submitted) and Resume/View Results actions
- [x] ~~Logging out and back in should not reset an evaluation status.~~ — Added `status` field (`active | submitted`) to `Evaluation` type. Resume logic now only resumes evaluations with `status: 'active'`. `endEvaluation` sets status to `submitted`.
- [x] ~~An ended evaluation should display start and end date/time and stats~~ — detail page shows start time, submitted time (when available), status badge, and full stats
- [x] ~~Show the correct answer alongside the tester's answer~~ — submitted evaluations show an "Expected" column with the matched definition's title, WCAG criteria, and solution description
- [x] ~~Identify issues that don't match known issues~~ — findings with `not-found` status show "Needs review" label, and a summary banner shows the count of flagged findings
- [ ] Figure out how to present the tester's answer and the expected answer in the table. (Milestone: Needs Design)
- [ ] Issue Logger side panel should be hidden when in the Evaluation view.
- [ ] Description of scoring criteria
- [x] Include page in the Findings displayed on the Evaluation
- [ ] Saved results should include which fields matched and why something failed or was marked as partial

## Resolved Questions

- [x] ~~How would a tester select or be assigned a specific test set?~~ — For now, testers auto-start with the default set. Future: assignment model where a content editor assigns a set to a tester, or a selection screen where the tester picks one.
- [x] ~~Why does an Issue Set have a field for Definitions? Shouldn't it only have instances?~~ — Agreed, sets should only have instances. Definition scope is derived from the instances in the set. Filtering by definition type is a UI convenience when building the set.
