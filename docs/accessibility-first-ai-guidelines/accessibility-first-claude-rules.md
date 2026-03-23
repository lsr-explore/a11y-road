# Accessibility-first code generation

When generating UI code, the accessible version is the default — not an enhancement applied after the fact. Write semantic structure and keyboard interaction first, then add visual presentation.

## The accessibility tree is the primary interface

Browsers expose two representations of every page: the render tree (pixels) and the accessibility tree (roles, names, states, relationships). Screen readers navigate the accessibility tree, not the pixels. Every decision below is about building the correct accessibility tree first, then styling its visual counterpart.

- `<button>` creates a node with `role: button` and built-in keyboard behavior. A styled `<div>` creates `role: generic` — invisible to assistive technology navigation.
- The accessible **name** is what gets read aloud. It comes from text content, `alt`, `aria-label`, or `aria-labelledby` — not from visual appearance.
- **State** properties (`aria-expanded`, `aria-invalid`, `aria-selected`) are what assistive technology monitors. CSS classes and visual indicators are not state.

When the render tree and accessibility tree diverge — something looks like a button but the accessibility tree has a generic container — the accessibility tree is the one that's wrong, and that's what you fix first.

## Decision order

Apply these in order when writing any UI code. Each principle defines what to think about FIRST, not what to check last.

### 1. Semantic element first

Ask "what IS this?" before "what does it look like?"

- A clickable action is a `<button>`, not a `<div>` with `onClick`
- A popup is a `<dialog>`, not a positioned `<div>` with backdrop
- Navigation is `<nav>`, page structure uses `<header>`, `<main>`, `<aside>`, `<footer>`
- A list is a `<ul>` or `<ol>`, a table of data is a `<table>`

If you are adding `role`, `tabindex="0"`, `onClick`, and `onKeyDown` to a `<div>`, stop — you are rebuilding a native element.

### 2. Keyboard interaction first

Before adding any pointer event, define the keyboard contract:

- Activatable → Enter/Space (native on `<button>`, `<a>`, `<input>`)
- Dismissible → Escape (native on `<dialog>`)
- Composite widget (tabs, menu, listbox) → arrow key navigation model
- Sequential content → logical Tab order via DOM order, not `tabindex` hacks

### 3. Text equivalent first

Before placing any visual content, define its text representation:

- Images → descriptive `alt` text, or `alt=""` if decorative
- Icon-only buttons → `aria-label` or visually hidden text
- Status changes → text that can be announced
- Decorative elements → `aria-hidden="true"`

### 4. Document structure first

Before applying any layout styles:

- Heading hierarchy must be logical (`h1` → `h2` → `h3`, no skipped levels)
- Landmark regions must be present (`<main>`, `<nav>`, etc.)
- Reading order in the DOM must match the intended content order
- The page must be understandable with CSS turned off

### 5. Focus management first

When content changes dynamically, define the focus behavior:

- Modal/dialog opens → move focus into it
- Modal/dialog closes → return focus to the trigger element
- New content loads (route change, panel expand) → move focus to the new content or announce it
- Content is removed → move focus to a logical predecessor

### 6. State communication first

Before styling any state change, define the programmatic state:

- Error on an input → `aria-invalid="true"` + `aria-describedby` pointing to the error message
- Loading/success/status → live region (`role="status"` or `aria-live="polite"`)
- Urgent alert → `role="alert"` (or `aria-live="assertive"`, use sparingly)
- Expanded/collapsed → `aria-expanded` on the trigger
- Selected → `aria-selected` or `aria-checked`

## Verification question

After writing any UI code, ask: **"Would this work if the visual layer didn't exist?"**

- Would a screen reader user know what this element is?
- Could a keyboard user complete the interaction?
- Would a blind user have all the information?
- Could someone navigate by headings and landmarks?
- Would a keyboard user know something changed dynamically?
- Would a screen reader announce this state change?

If any answer is no, the visual layer is carrying information that belongs in the structure. Fix the structure first.
