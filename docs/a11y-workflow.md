# Accessibility Issue Workflow

This document describes how accessibility issues are defined, applied to elements, and surfaced in the side panel and summary page.

## Data Model

The system separates **what** an accessibility issue is from **where** it appears.

### Issue Definition (`A11yIssueDefinition`)

Defined in `src/data/issues-registry.ts` within the `issueDefinitions` array. An accessibility SME creates these. Each definition is a reusable template that can apply to many elements across the site.

Fields:

| Field | Description |
|-------|-------------|
| `id` | Unique slug (e.g. `"missing-alt-text"`) |
| `title` | Human-readable name |
| `description` | General explanation of the issue and why it matters |
| `wcagCriteria` | Array of `{ id, title, level }` — the WCAG success criteria violated |
| `impactedUsers` | Who is affected (e.g. `["Screen reader users"]`) |
| `tags` | Categorization (e.g. `["images"]`, `["forms", "labels"]`) |
| `testingMethod` | `"automated"`, `"manual"`, or `"semi-automated"` |

### Issue Instance (`A11yIssueInstance`)

Defined in `src/data/issues-registry.ts` within the `issueInstances` array. A developer creates these when applying a definition to a specific element.

Fields:

| Field | Description |
|-------|-------------|
| `id` | Unique slug for this instance (e.g. `"landing-hero-img-alt"`) |
| `issueId` | References an `A11yIssueDefinition.id` (e.g. `"missing-alt-text"`) |
| `pageId` | Route segment matching `page-metadata.ts` (e.g. `"landing"`, `"contact"`) |
| `description` | Instance-specific context explaining how this issue manifests here |
| `elementSelector` | CSS selector used for highlighting — always `[data-a11y-id="<instance.id>"]` |

### Resolved Instance (`ResolvedInstance`)

A joined pair of `{ instance, definition }`, created at runtime by the registry helpers. This is what the side panel and summary page consume.

## Type Definitions

All types live in `src/data/a11y-issues.ts`. The registry data and helper functions live in `src/data/issues-registry.ts`.

## Steps to Add an Accessibility Issue

### Step 1: Create or verify the issue definition exists

Check `issueDefinitions` in `src/data/issues-registry.ts` for an existing definition that matches your issue. If one exists, skip to Step 2. Definitions are reusable — `"missing-alt-text"` can apply to any image on any page.

If no matching definition exists, add one:

```ts
{
  id: 'missing-alt-text',
  title: 'Missing alt text',
  description: 'Images that convey meaning must have descriptive alternative text...',
  wcagCriteria: [
    { id: '1.1.1', title: 'Non-text Content', level: 'A' },
  ],
  impactedUsers: ['Screen reader users', 'Users with images disabled'],
  tags: ['images'],
  testingMethod: 'automated',
},
```

### Step 2: Create an instance

Add an entry to `issueInstances` in `src/data/issues-registry.ts`:

```ts
{
  id: 'landing-hero-img-alt',
  issueId: 'missing-alt-text',        // links to the definition
  pageId: 'landing',                   // matches page-metadata.ts
  description: 'The hero image has no alt attribute...',
  elementSelector: '[data-a11y-id="landing-hero-img-alt"]',
},
```

The `elementSelector` must match the `data-a11y-id` attribute you apply in Step 3. By convention, it always follows the pattern `[data-a11y-id="<instance.id>"]`.

### Step 3: Annotate the element in code

Use the `A11yDemo` component (`src/components/a11y-demo.tsx`). It has two modes:

#### Toggle mode — when the broken and fixed versions are different markup

Use `broken` and `fixed` props. `A11yDemo` reads the accessibility toggle and renders the appropriate version. It wraps the content in a `<div data-a11y-id="<instanceId>">`.

```tsx
import { A11yDemo } from '../a11y-demo';

<A11yDemo
  instanceId="landing-hero-img-alt"
  label="Hero image"
  broken={<img src="photo.jpg" />}
  fixed={<img src="photo.jpg" alt="A doctor consulting with a patient" />}
/>
```

#### Children mode — when the parent manages the toggle or you just need to mark an element

Wrap the element with `A11yDemo` using children. The parent component calls `useA11yMode()` to decide what to render. `A11yDemo` applies the `data-a11y-id` attribute.

```tsx
import { A11yDemo } from '../a11y-demo';
import { useA11yMode } from '../providers/a11y-mode-provider';

const { isAccessible } = useA11yMode();

<A11yDemo instanceId="contact-form-labels" label="Name field group">
  {isAccessible ? (
    <label htmlFor="name">Full Name</label>
  ) : null}
  <input name="name" placeholder="Full Name" />
</A11yDemo>
```

Children mode is useful when:

- Multiple issues are interleaved in the same markup (e.g. a form with label, focus, and error issues)
- The issue affects an attribute on an element you can't wrap with toggle mode (e.g. `lang` on `<html>`)
- You need to nest `A11yDemo` wrappers for multiple issues on the same element group

That's it. No other files need updating. The side panel and summary page pick up the new instance automatically.

## How the Side Panel Works

The side panel (`src/components/side-panel/side-panel.tsx`) reads the current route via `usePathname()`, maps it to a `pageId` using `page-metadata.ts`, then calls `getInstancesByPage(pageId)` from the registry. This returns `ResolvedInstance[]` — each instance joined with its definition.

Each instance renders as an expandable `IssueCard` showing:

- The definition's title (collapsed header)
- The instance's description (instance-specific context)
- The definition's description (general explanation)
- WCAG criteria badges, impacted users, tags, testing method

### Highlighting

Each `IssueCard` has a "Highlight" button. When clicked, it:

1. Calls `document.querySelector(instance.elementSelector)` — this finds the element with `data-a11y-id="<instance.id>"` (the `<div>` rendered by `A11yDemo`)
2. Scrolls the element into view with `scrollIntoView({ behavior: 'smooth', block: 'center' })`
3. Applies a red pulsing outline animation via inline styles and the `a11y-highlight-pulse` CSS class
4. Removes the highlight after 3 seconds

This works because `A11yDemo` always renders a `<div data-a11y-id="<instanceId>">` wrapper, and the instance's `elementSelector` targets that attribute.

## How the Summary Page Works

The summary page (`src/app/a11y-summary/page.tsx`) is a server component that calls:

- `getDefinitions()` — all issue definitions
- `getAllInstances()` — all resolved instances
- `getInstanceCountByDefinition()` — a `Map<definitionId, count>`

It renders two sections:

### Issue Types

A card grid showing each definition with an instance count badge (e.g. "1 instance", "3 instances"). This gives a high-level view of how many times each type of issue appears across the site.

### All Instances

A client component (`SummaryTable`) with:

- Filter dropdowns: by Page, by WCAG Criterion
- Sortable columns: Page, Issue Type, Level, Testing Method
- Columns: Page, Issue Type (definition title), Instance (instance description), WCAG Criteria, Level, Impacted Users, Testing Method

## Registry Helpers

| Function | Returns | Description |
|----------|---------|-------------|
| `getInstancesByPage(pageId)` | `ResolvedInstance[]` | All instances on a given page, joined with definitions |
| `getAllInstances()` | `ResolvedInstance[]` | All instances across all pages |
| `getDefinitions()` | `A11yIssueDefinition[]` | All issue definitions |
| `getInstanceCountByDefinition()` | `Map<string, number>` | Count of instances per definition id |

## Page Metadata

Pages are registered in `src/data/page-metadata.ts`. When adding a new page to the site, add an entry here so the side panel and summary table can map `pageId` values to display names and routes.

```ts
{ id: 'landing', name: 'Landing Page', route: '/' },
{ id: 'contact', name: 'Contact Page', route: '/contact' },
```

## Environment Variables

The demo tools (toggle banner, side panel, summary nav link) can be hidden via an environment variable. This is useful for deploying the site without the learning/demo UI.

| Variable | Default | Effect |
| -------- | ------- | ------ |
| `NEXT_PUBLIC_SHOW_A11Y_TOOLS` | `true` (shown) | Set to `"false"` to hide the demo banner, toggle switch, side panel, side panel toggle button, and the A11y Summary nav link |

When set to `"false"`:

- The demo banner and toggle switch are not rendered
- The side panel and its toggle tab are not rendered
- The "A11y Summary" link is removed from the nav
- The `/a11y-summary` route still works if accessed directly — it just isn't linked

See `.env.example` in the app directory for reference. To set locally, create a `.env.local` file:

```sh
NEXT_PUBLIC_SHOW_A11Y_TOOLS=false
```

## Library: `@a11y-road/a11y-kit`

The reusable parts of the a11y system live in `libs/a11y-kit/`. Any Next.js or React app can use this library to implement the same pattern.

### What the library provides

| Export | Description |
| ------ | ----------- |
| `A11yIssueDefinition` | Type for issue templates (created by SME) |
| `A11yIssueInstance` | Type for instances (created by developer) |
| `ResolvedInstance` | Type for joined instance + definition pair |
| `A11yRegistry` | Class that takes definitions and instances, provides query helpers |
| `A11yDemo` | React component for annotating elements (toggle mode or children mode) |
| `A11yModeProvider` / `useA11yMode` | Context for the accessible/broken toggle |
| `SidePanelProvider` / `useSidePanel` | Context for side panel open/close state |
| `highlightElement` | Function to scroll to and pulse-highlight a DOM element by selector |
| `highlightCss` | CSS string for the pulse animation (include in your global styles) |

### Using the library in a new app

```ts
import {
  A11yRegistry,
  A11yModeProvider,
  A11yDemo,
} from '@a11y-road/a11y-kit';

// Create a registry with your own data
const registry = new A11yRegistry(myDefinitions, myInstances);

// Query it
const pageIssues = registry.getResolvedByPage('landing');
const allIssues = registry.getAllResolved();
const counts = registry.getInstanceCountByDefinition();
```

### App-specific data

The actual issue definitions and instances live in the app at `src/data/issues-registry.ts`. The app creates an `A11yRegistry` singleton from its data and exports it for use by components, the API route, and the summary page.

## API Route

`GET /api/a11y-issues` returns resolved instances as JSON. This creates a clean boundary for swapping the in-memory registry with a database in the future.

### Query parameters

| Parameter | Description |
| --------- | ----------- |
| `page` | Filter by page id (e.g. `?page=landing`) |
| `definition` | Filter by definition id (e.g. `?definition=missing-alt-text`) |
| `view` | Set to `definitions` to get the definitions list with instance counts |

### Example responses

**`GET /api/a11y-issues`** — all instances:

```json
{
  "instances": [
    {
      "id": "landing-hero-img-alt",
      "issueId": "missing-alt-text",
      "pageId": "landing",
      "description": "The hero image has no alt attribute...",
      "elementSelector": "[data-a11y-id=\"landing-hero-img-alt\"]",
      "definition": { "id": "missing-alt-text", "title": "Missing alt text", ... }
    }
  ],
  "total": 6
}
```

**`GET /api/a11y-issues?page=contact`** — instances on the contact page only.

**`GET /api/a11y-issues?view=definitions`** — all definitions with instance counts:

```json
{
  "definitions": [ ... ],
  "counts": { "missing-alt-text": 1, "low-contrast-text": 1, ... }
}
```
