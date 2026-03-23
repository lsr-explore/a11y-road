# A11y Workflow Tutorial

An overview of accessibility as applied to web development, focused on web software but touching on all parts of the workflow.

## Format

Each page follows a consistent structure:

1. **Scene** — A short narrative vignette featuring the Maple Valley Health team encountering a real accessibility situation. These scenes ground the concepts in recognizable workplace moments.
2. **Core content** — The teaching material, kept practical and direct.
3. **Key takeaways** — Bullet-point summary of what to remember.
4. **Resources** — Links to authoritative sources for deeper reading.

Future additions:

- Short multiple-choice quiz at the end of each page
- Code snippets embedded in workflow pages
- "Let's Apply Our Knowledge" companion pages using the Maple Valley Health demo app

## Running Example: Meet the Team

A Meet the Team page for Maple Valley Health listing doctors, nurses, and staff. Items can be viewed, added, edited, and deleted. A form to add/edit will be used throughout the tutorial. The information stands on its own; companion exercise pages will be separate.

## Narrative Approach

Inspired by The Phoenix Project — concepts are introduced through short workplace scenarios featuring the Maple Valley Health web team. Characters encounter accessibility issues naturally through their work, making the material less abstract and more memorable. The scenes are brief (a few paragraphs), not a full narrative — enough to set context without overwhelming the teaching content.

### Cast (introduced gradually)

- **Priya** — Tech lead. Knows the codebase well, newer to accessibility. Asks the "why" questions.
- **Marcus** — Senior developer. Has a repetitive strain injury, uses keyboard navigation heavily. Brings the lived-experience perspective.
- **Sana** — Product manager. Owns the roadmap and priorities. Drives the point that PMs set the tone — when she asks for a screen reader demo, the team builds for it.
- **Ava** — Designer. Thinks visually, pushes back when constraints feel limiting, but comes around when she sees the design benefits.
- **Jordan** — QA lead. Methodical, wants checklists and processes. Drives the testing and monitoring pages.
- **Dr. Reyes** — A physician at the clinic who is losing her vision. Surfaces the "real user" perspective without being reduced to a prop.

## WebAIM Top 6 Failures

WebAIM conducts an annual assessment of the top million websites. They found that 96% of failures fall into six categories:

| WCAG Failure Type | % of home pages |
|---|---|
| Low contrast text | 79.1% |
| Missing alternative text for images | 55.5% |
| Missing form input labels | 48.2% |
| Empty links | 45.4% |
| Empty buttons | 29.6% |
| Missing document language | 15.8% |

These are covered in depth on the "WCAG in Practice" page.

---

## Page Structure

### Foundations (5 pages)

#### 1. What Is Accessibility?

Definition, key quotes (Berners-Lee, Shawn Lawton Henry), permanent/temporary/situational disabilities, mental models and misconceptions, the mobile-responsive analogy, who benefits. Introduces the Maple Valley Health team and the Meet the Team running example.

Mental models to address:

- "People with disabilities don't use our site"
- "We can't measure the users, so why invest?"
- "It takes too much time and costs too much"
- "It's someone else's job"
- "Accessibility limits creativity"
- The mobile-responsive parallel — remember how much rework happened before mobile-first?

#### 2. People & Assistive Devices

Disability types mapped to assistive technologies (screen readers, switch devices, voice control, magnifiers). W3C user personas and videos. The "developer mental check" questions from wcag-mapping.md. People-first framing — start with who, then what they use.

#### 3. Understanding WCAG

What WCAG is, the four principles (POUR), conformance levels (A/AA/AAA), how to read a success criterion, W3C/WAI context, ARIA intro ("No ARIA is better than bad ARIA"). The "how to read the map" page — kept concise and structural.

#### 4. WCAG in Practice

The WebAIM top-6 failures as the organizing frame. For each: what the issue is, which WCAG criteria it maps to, who it affects, what the fix looks like. Covers: low contrast, missing alt text, missing form labels, empty links, empty buttons, missing document language. The "what actually matters" page.

#### 5. The Legal Landscape

ADA (2024 web rule), Section 508, European Accessibility Act (EAA), WCAG as ISO standard, making the business case. Brief — one page, not a legal treatise.

### Workflow (6 pages)

#### 6. User Research

Including users with disabilities in research. The difference between usability testing with disabled users vs. "can you test my site?" — you wouldn't grab a random iPhone user off the street and ask them to test your app. Recruiting practices.

#### 7. Product & Design

Figma annotations, designing for the rotor menu, contrast tools (contrast-finder.org), AI-assisted a11y review, keyboard-first thinking, requesting demos with assistive tech. Formula: accessibility = usability + device compatibility + standards (WCAG).

#### 8. Development

Semantic HTML, ARIA usage, keyboard navigation, accessible component patterns, repo-level a11y docs, AI assistant guidance. Focus on patterns and principles — tooling has its own page.

#### 9. Developer Tooling

The toolchain page. "Essential starter kit" (eslint-plugin-jsx-a11y, vitest-axe, Chrome DevTools accessibility tree) and "going deeper" (Playwright axe, Storybook a11y addon, Biome). Explains static analysis vs rendered-without-styles vs rendered-with-styles.

#### 10. Testing

Manual testing: screen readers (VoiceOver, NVDA), keyboard-only walkthroughs, browser extensions (axe DevTools, WAVE, ANDI), mobile testing (VoiceOver/TalkBack touch). Separates manual testing from automated tooling.

#### 11. Monitoring & Feedback

CI integration, Playwright tests on production, accessibility statements, user feedback channels, advocating for continued investment. Merges monitoring and user feedback — both are "what happens after launch."

---

## Resources

### Fundamentals

- W3C — Introduction to Web Accessibility: https://www.w3.org/WAI/fundamentals/accessibility-intro/
- W3C — User Stories: https://www.w3.org/WAI/people-use-web/user-stories/
- W3C — How to Meet WCAG (Quick Reference): https://www.w3.org/WAI/WCAG22/quickref/
- Intopia — WCAG 2.2 Map: https://intopia.digital/wp-content/uploads/2023/12/Intopia-WCAG-2.2-Map-Landscape-version.pdf
- W3C — ARIA Authoring Practices Guide (APG): https://www.w3.org/WAI/ARIA/apg/
- W3C — ARIA: https://www.w3.org/TR/wai-aria/

### Keyboard Navigation and Screen Readers

- WebAIM — Keyboard Accessibility: https://webaim.org/techniques/keyboard/
- Deque — Screen Reader Keyboard Shortcuts and Gestures: https://dequeuniversity.com/screenreaders/

### Legal and ISO Standard

- ADA — 2024 Web Rule: https://www.ada.gov/resources/2024-03-08-web-rule/
- W3C — ISO Standard Announcement: https://www.w3.org/WAI/news/2025-10-21/wcag22-iso/
