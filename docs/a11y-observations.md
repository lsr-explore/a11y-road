# A11y Observations

This document captures observations and suggested changes.

Milestones

- Certification - These are items that will be needed if we flesh out certification flow.  For now, these items can be deferred.
- Advanced Features - These are items that are a bit larger in scope and can be tackled later.

## General

- [ ] Rename Admin Dashboard to Accessibility Issues Dashboard
- [ ] Rename route /admin to /editor - we will have a site admin role with an /admin landing page

## Issue Definitions

- [ ] Title - show ID that will be generated
- [ ] WCAG Criteria - Show a popup of all WCAG criteria and allow selecting multiple and auto populating the field with chiclets with an x to delete
- [ ] Testing Method - Replace the current single-value field with a multi-select of specific testing methods (screen reader, keyboard, zoom, color contrast, automated, semi-automated). Include a definition of what each method means.
- [ ] Should display a success banner that indicates what has been added/edited/deleted
- [ ] Allow json export (Milestone: Certification)

## Issue Instances

- [ ] Remove element selector - no longer used. Also remove from `A11yIssueInstance` type in a11y-kit since ref-based registration replaced it.
- [ ] Show id that is generated when editing/adding
- [ ] Show list of issue definition ids to select from when adding an issue
- [ ] Export to json (Milestone: Certification)
- [ ] In the table, display the full text in multiline cell
- [ ] Allow sorting by Page or ID
- [ ] Should display a success banner that indicates what has been added/edited/deleted
- [ ] Add a solution description field - describes what the "fixed" version does (e.g. "add descriptive alt text to the hero image"). This is used for evaluation matching.

## Issue Sets (Milestone: Certification)

- [ ] Sets should consist of only instances (remove definitionIds from the model). Instances can be filtered by definition type and page when building the set, but the set itself only stores instance IDs.
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
- [ ] Need a way to manage duplicates (Milestone: Advanced Features)
- [ ] Need a different way to identify an element - the id reveals the accessibility error
- [ ] Display only elements found on the current page

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
- [ ] Rename End Evaluation to Submit Evaluation
- [ ] Landing page should be a list of evaluations where a user may have several assigned to them
- [ ] Logging out and back in should not reset an evaluation status. When I logged out and back in an evaluation that was ended was reopened. **Bug**: Need to add a `status` field (`active | submitted`) to the Evaluation type so ended evaluations are not resumed on login.
- [ ] An ended evaluation should display start and end date/time and stats as seen on the individual evaluations page.
- [ ] Show the correct answer alongside the tester's answer for each finding (expected issue type, WCAG criteria, and solution description from the instance)
- [ ] Identify issues that don't match known issues.  It may be a valid issue, so it should be flagged for manual review.

## Resolved Questions

- [x] ~~How would a tester select or be assigned a specific test set?~~ — For now, testers auto-start with the default set. Future: assignment model where a content editor assigns a set to a tester, or a selection screen where the tester picks one.
- [x] ~~Why does an Issue Set have a field for Definitions? Shouldn't it only have instances?~~ — Agreed, sets should only have instances. Definition scope is derived from the instances in the set. Filtering by definition type is a UI convenience when building the set.
