# Certification Design

This document captures thinking about what would make an accessibility certification credible — not just technically correct scoring, but a process that gives organizations confidence that a certified tester genuinely has the expertise the credential claims.

## What scoring measures vs. what certification requires

Scoring answers: "Did this tester identify the right issues?"

Certification requires answering a harder question: "Can we trust that this person will reliably find accessibility issues in the wild?"

That gap is bridged by process design, not better algorithms.

## Dimensions of certification confidence

### Issue coverage

The evaluation must cover a meaningful breadth of accessibility issues, not just a narrow slice:

- Multiple WCAG principles (Perceivable, Operable, Understandable, Robust)
- Multiple issue types (semantic structure, keyboard access, visual presentation, dynamic content, forms)
- Multiple testing methods (screen reader, keyboard, zoom, color contrast, automated tools)
- Multiple page types (content pages, forms, interactive features, navigation)

A tester who scores perfectly on a set of only contrast issues hasn't demonstrated broad competence.

### Test variability

Testers can't be allowed to memorize answers:

- Randomized issue sets so each evaluation session is different
- Multiple versions of the demo site with different issues seeded in different elements
- Enough issue variety that studying a fixed answer key isn't viable

The platform already has Issue Sets with planned support for random set generation. For certification, this would need to be robust enough that two testers sitting next to each other get meaningfully different evaluations.

### Tool diversity

A certification should require demonstrating competence across multiple assistive technologies:

- Screen reader testing (at least one of NVDA, VoiceOver, JAWS)
- Keyboard-only testing
- Zoom/magnification testing
- Color contrast verification
- Automated tool usage (axe, Lighthouse)

Capturing the tools used per evaluation (planned) would let the certification program verify that a tester has demonstrated competence across methods, not just their strongest one.

### Anti-cheating measures

The current demo site has a significant integrity gap: signing in as a learner role exposes all the answers — the side panel shows every known issue with its description, WCAG criteria, and location. A tester could simply switch roles, study the answers, and switch back.

Potential mitigations:

- **Role-locked sessions** — once an evaluation is started under a tester role, the user cannot switch roles until the evaluation is submitted. The evaluation is invalidated if a role switch is detected.
- **Separate environments** — the learner/demo experience and the certification evaluation run on different deployments, so there's no role-switching path.
- **Proctored sessions** — for high-stakes certification, a proctor observes the tester's session (remote or in-person). The platform could support this by logging tester actions with timestamps.
- **Time constraints** — a reasonable time limit makes it harder to look up every answer externally. The platform already captures start and submitted timestamps.
- **Source code access** — a technically skilled tester could inspect the DOM, read the issues registry, or examine `data-a11y-name` patterns. For certification, the test site would need to be a black box — no source access, possibly hosted remotely with no dev tools access (e.g., a locked-down browser).
- **AI assistance detection** — a tester could use an AI tool to analyze the page and identify issues. This is hard to prevent technically but could be addressed through proctoring or by designing issues that require human judgment (e.g., assessing whether alt text is *meaningful*, not just *present*).

### Consistency across sessions

A single high score could be luck. Certification confidence comes from:

- Multiple evaluation sessions with different issue sets
- Consistent performance across sessions (not one perfect score and two failures)
- Performance across different site types or complexity levels
- Possibly a progression model: basic issues first, then more nuanced ones

### Real-world transfer

The hardest question: does performance on a controlled demo site predict performance on real sites?

- Demo sites have clean, isolated issues — real sites have issues that interact and compound
- Demo sites have a known answer key — real sites require judgment about severity and impact
- Demo sites are small — real sites have hundreds of pages with inconsistent patterns

Possible approaches:

- Include evaluation on a real (or realistic) site as part of the certification
- Require a portfolio of real-world audits reviewed by an expert
- Treat the platform evaluation as one component of certification, not the whole thing

## What the platform can support today

- Capturing tools used per evaluation (planned)
- Randomized issue sets (planned)
- Score history across multiple evaluations
- Time tracking (start/submitted timestamps)
- Match details showing what matched and why

## What would need to change for certification

- Role isolation or separate deployments
- Proctoring support or action logging
- Multiple demo site variants with different issue configurations
- A scoring rubric that weights breadth of coverage, not just correctness
- Administrative tooling for certification program managers
