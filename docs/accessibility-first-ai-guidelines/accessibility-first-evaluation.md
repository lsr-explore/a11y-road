# Accessibility-First Guidance: Evaluation Plan

## Goal

Test whether the accessibility-first rules file (`.claude/rules/accessibility-first.md`) measurably changes the baseline accessibility of AI-generated code — not by reviewing after the fact, but by comparing what gets generated with and without the guidance.

## Test subject

A team page with CRUD functionality: card grid listing team members, add form, edit form, delete with confirmation dialog. Uses `team-members.ts` as seed data (7 members — physicians and nurses with name, role, specialty, location, education, interests, photo URL).

---

## Setup

### 1. Create two fresh Next.js projects

```sh
# Project A: control (no guidance)
npx create-next-app@latest team-eval-control --typescript --tailwind --app --eslint

# Project B: test (with accessibility-first rules)
npx create-next-app@latest team-eval-a11y --typescript --tailwind --app --eslint
```

### 2. Seed both projects

Copy into both:

- `src/data/team-members.ts` — the TeamMember type and 7 seed records

Copy into Project B only:

- `.claude/rules/accessibility-first.md` — the rules file

### 3. Add WCAG techniques data to both

Copy `wcag2-2.json` into both projects at `src/data/wcag2-2.json`. This is not for generation — it provides a structured framework for the evaluation step.

### 4. Generate code — identical prompt, both projects

Open a fresh Claude Code session in each project. Use the same prompt with no accessibility instructions:

> Build a generic landing page for a health site called Maple Valley Health with heading and a footer.  The heading should have a menu item that navigates to a team page. Build a team page that lists all team members from `app/team-members.ts` in a card grid. Include: add a new team member via a form, edit an existing team member, and delete with a confirmation dialog. The add and edit forms should route to a new page. The delete action should be a trash can icon and the edit action should be the words "edit profile"

---
## Evaluation

### 5. WCAG technique audit

After generation is complete in each project, give a second prompt:

> Evaluate this site from an accessibility perspective. Use the WCAG 2.2 techniques in `src/data/wcag2-2.json` to systematically check the generated code against applicable AA success criteria. For each finding, cite the technique ID.

The `wcag2-2.json` file contains the full WCAG 2.2 structure with sufficient, advisory, and failure techniques for each success criterion. This gives the evaluation a repeatable framework — same criteria applied to both projects.

### 6. Score by principle

For each of the six accessibility-first principles, record per project:

| Principle | Control (no rules) | A11y-first (with rules) |
| --- | --- | --- |
| 1. Semantic elements | ? | ? |
| 2. Keyboard interaction | ? | ? |
| 3. Text equivalents | ? | ? |
| 4. Document structure | ? | ? |
| 5. Focus management | ? | ? |
| 6. State communication | ? | ? |

Score each cell as one of:

- **Correct by default** — the generated code handled it without prompting
- **Partially correct** — the right idea was there but incomplete (e.g., `alt={name}` without descriptive context)
- **Missing** — the guidance didn't shift the behavior; would need manual correction

### 7. Diff the technique findings

Compare the WCAG technique results between the two projects. The delta shows exactly which techniques were satisfied by default with guidance that weren't without it.

---

## What the WCAG data provides

- **`wcag-criteria.json`** — flat lookup of criteria IDs, titles, and levels. Useful for labeling findings but Claude already knows this mapping.
- **`wcag2-2.json`** — full structure with techniques (sufficient, advisory, failure) per success criterion. This is the valuable one. It enables systematic checks: did the code use H37 (alt on img), H44 (label for input), ARIA6 (aria-label), F59 (failure: script making div act as link)?

The structured technique data makes the evaluation repeatable rather than relying on recall.

---

## Refinement

Any principle that scored the same in both projects didn't shift behavior. For those:

1. Identify whether the language was too abstract or too easily ignored
2. Rewrite with sharper, more directive framing
3. Retest with a fresh generation

The goal is not perfection but a measurable improvement in baseline accessibility of generated code.
