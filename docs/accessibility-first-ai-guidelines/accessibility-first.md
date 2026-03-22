# Accessibility-First Code Generation

## The Principle

**Accessibility first** is a development approach analogous to **mobile first** in responsive design.

- **Mobile first**: Design for the most constrained viewport first, then enhance for larger screens. Write `min-width` media queries, not `max-width`. The small screen is the default.
- **Accessibility first**: Design for the most constrained interaction model first, then enhance for visual/pointer users. Write semantic structure and keyboard interaction first. The visual presentation is the enhancement.

This means: **start from semantic structure and keyboard/screen reader interaction, then add visual presentation** — not "add accessibility to visual code" but "add visual presentation to accessible code."

The accessible version is the default code path, not the enhanced version.

---

## The Accessibility Tree: The Real Interface

Browsers build two parallel representations of every page:

1. **The render tree** — what gets painted to the screen. Pixels, layout, color, visual hierarchy.
2. **The accessibility tree** — what gets exposed to assistive technology. A structured tree of nodes, each with a **role** (what it is), a **name** (what it's called), a **state** (its current condition), and **relationships** (what it's connected to).

Screen readers don't see pixels. They navigate the accessibility tree. When a screen reader says "button, Submit" it's reading the role and name from an accessibility tree node — not performing OCR on a styled `<div>`.

This is why accessibility first is a structural practice, not a visual one. Every principle in this document is ultimately about building the right accessibility tree:

- **Semantic elements** create nodes with correct roles automatically — `<button>` produces a node with `role: button`, while `<div>` produces `role: generic` (essentially invisible to navigation).
- **Keyboard interaction** is tied to roles — native roles come with built-in keyboard behavior; generic containers do not.
- **Text equivalents** populate the **accessible name** — the label assistive technology reads aloud.
- **Document structure** defines the tree's shape — headings create a navigable outline, landmarks create jumpable regions.
- **Focus management** determines which node in the tree is active after a change.
- **State communication** populates the state properties — `aria-expanded`, `aria-invalid`, `aria-selected` — that assistive technology monitors for changes.

When you write a `<div>` and style it to look like a button, the render tree shows a button-shaped rectangle. The accessibility tree shows a generic container with no role, no keyboard behavior, and no name. The two trees have diverged, and one of them is broken.

**Accessibility first means: build the accessibility tree correctly, then style its visual counterpart.**

---

## Core Principles

These are **decision-order principles** — they define what you think about FIRST when writing code, not what you check LAST.

### 1. Start with the semantic element

Before writing any markup, ask **"what IS this?"** — not "what does it look like?"

A button is a `<button>`. A dialog is a `<dialog>`. A navigation is a `<nav>`. A list of items is a `<ul>`. A heading is an `<h2>`.

Never start with a generic container and add behavior to make it act like something that already exists as an HTML element. If you find yourself adding `role`, `tabindex`, `onClick`, and `onKeyDown` to a `<div>`, you're rebuilding a native element poorly.

**The test**: If you removed all CSS and JavaScript, would the element still communicate its purpose?

### 2. Start with keyboard interaction

Before adding pointer events, define how keyboard users will interact.

- If it's activatable, it needs **Enter/Space**
- If it's dismissible, it needs **Escape**
- If it's a composite widget (tabs, menu, listbox), define the **arrow key model**
- If it has a sequence, define the **Tab order**

The keyboard interaction is the primary interface; the pointer interaction is the enhancement.

**The test**: Can you complete every task without a mouse?

### 3. Start with the text equivalent

Before placing visual content, define what it communicates in text.

- Every meaningful image needs a **text alternative**
- Every icon-only button needs a **label**
- Every status change needs an **announcement**
- Decorative content should be explicitly marked as such (`alt=""`, `aria-hidden="true"`)

The text equivalent is the primary content; the visual rendering is one presentation of it.

**The test**: If every image and icon disappeared, would the user still have all the information?

### 4. Start with the document structure

Before styling, ensure the **heading hierarchy**, **landmark regions**, and **reading order** make sense without CSS.

If you turn off all styles, can a user still:

- Understand the page structure?
- Navigate by headings?
- Identify the main content, navigation, and complementary regions?

The document structure is the foundation; visual layout is layered on top.

**The test**: Does the page make sense when rendered as a flat outline?

### 5. Start with focus management

When content appears dynamically (modals, panels, notifications, route changes), define **where focus goes**. When it disappears, define **where focus returns**.

Focus is how keyboard users know what changed. If you don't manage it, the change is invisible to them.

- Modal opens → focus moves to the modal (or its first interactive element)
- Modal closes → focus returns to the element that triggered it
- Content loads → focus moves to the new content or an announcement is made
- Error appears → focus moves to the error or the error is announced via a live region

**The test**: After every dynamic change, does the user know where they are?

### 6. Start with state communication

Before styling state changes (errors, loading, success, selection), define how they're communicated to assistive technology.

- Errors need **`aria-describedby`** linking them to their inputs
- Invalid fields need **`aria-invalid`**
- Status updates need **live regions** (`role="alert"`, `role="status"`, `aria-live`)
- Selection state needs **`aria-selected`** or **`aria-checked`**
- Expanded/collapsed state needs **`aria-expanded`**

The visual indicator (red border, green checkmark, spinner) is one channel. The programmatic state is the primary one.

**The test**: If you couldn't see the screen, would you know the current state of every interactive element?

---

## The Inversion Test

For each principle, the core question is: **"Would this work if the visual layer didn't exist?"**

| Question | Principle |
| -------- | --------- |
| Would a screen reader user know this is a button? | Semantic element |
| Could a keyboard user activate this? | Keyboard interaction |
| Would a blind user know what this image communicates? | Text equivalent |
| Could someone navigate this page by headings alone? | Document structure |
| Would a keyboard user know a modal just opened? | Focus management |
| Would a screen reader announce this error? | State communication |

If the answer to any of these is "no," the visual layer is carrying information that should be in the structure.

---

## Afterthought vs. Accessibility First

This is not a checklist to run after writing code. It's a way of thinking about the **order of decisions** when writing code.

| Afterthought approach | Accessibility-first approach |
| --------------------- | ---------------------------- |
| Build a `<div>` with click handler, then add `role="button"` and `tabindex` | Start with `<button>` — keyboard and screen reader support are built in |
| Build the form, then add error messages, then add `aria-describedby` | Define the error association first: input → error message → `aria-describedby`. Then style it |
| Build the modal overlay, then add focus trapping | Start with `<dialog>` — focus trapping is built in. Then style the overlay |
| Show a toast notification, then wonder why screen readers missed it | Start with `role="status"` or `role="alert"`. Then add the visual animation |
| Style the page layout, then add landmark roles | Start with `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`. Then apply the grid |

---

## Applying This Guidance

These principles apply to anyone writing front-end code — whether by hand, with AI assistance, or reviewing generated output. They are framework-agnostic and standard-agnostic: they don't reference specific WCAG criteria because the goal is to change the default mental model, not provide a compliance checklist.

When evaluating whether these principles are working:

1. Use them when generating code in real tasks
2. Note where the principles successfully changed the default — accessible code was generated without needing correction
3. Note where they didn't — inaccessible code was still generated despite the guidance
4. Refine the principles based on what actually shifts behavior vs. what's just aspirational

The goal is not perfection but a measurable improvement in the baseline accessibility of generated code.
