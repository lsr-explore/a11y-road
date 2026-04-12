# Manifest Export: Demo Site to Testing Platform

This document describes the data flow for exporting accessibility break information from the demo site into a separate testing platform. The goal is to decouple the two systems so the demo site is the source of truth for what breaks exist, and the testing platform manages test sets, scoring, and tester workflows.

## Overview

There are three systems involved:

1. **Demo site** — developers build pages with intentional accessibility breaks
2. **Export script** — a Playwright script that crawls the running demo site and produces a JSON manifest
3. **Testing platform** — a separate application that imports the manifest and manages test administration

```
Demo Site                    Export Script              Testing Platform
-----------                  -------------              ----------------
A11yDemo components    -->   Playwright crawl     -->   Import manifest
data-a11y-name attrs         + bridge query             Build test sets
issues-registry.ts           = manifest.json            Tester dropdowns
page-metadata.ts                                        Scoring/matching
```

## Step 1: Developer creates breaks in the demo site

Developers do three things per break:

### a. Wrap the broken element in `A11yDemo`

```tsx
// apps/a11y-road/src/components/landing/hero-section.tsx
<A11yDemo instanceId="landing-hero-img-alt" label="Hero image">
  ...
</A11yDemo>
```

| Prop | Purpose | Where it flows |
|------|---------|----------------|
| `instanceId` | Unique identifier for this break instance | `issues-registry.ts` `id` field, manifest `instanceId` |
| `label` | Human-readable name, must match `data-a11y-name` | Used to join DOM elements to break data in the export |

### b. Add `data-a11y-name` to the element

```tsx
<img data-a11y-name="Hero image" src="..." />
```

This attribute goes on **all significant elements**, not just broken ones. This prevents the attribute's presence from revealing which elements have issues.

For elements inside an `A11yDemo` wrapper, the `data-a11y-name` value **must match** the `label` prop on `A11yDemo`. This is the join key used by the export script.

**Why the duplication?** The `label` on `A11yDemo` and the `data-a11y-name` attribute serve different purposes and live in different systems:

- `data-a11y-name` is a DOM attribute on **all** significant elements — both broken and non-broken. Its presence on an element reveals nothing about whether that element has an accessibility issue. The export script reads these from the live DOM to build the complete element inventory.
- `A11yDemo` `label` only exists on elements that have breaks. It registers with the `ElementRegistry` (React context, in JavaScript memory, not visible in the DOM). The export script reads these via the bridge to identify which elements have breaks.

The export script joins these two by matching values: when a `data-a11y-name` in the DOM matches a `label` from the `ElementRegistry`, that element is marked as having a break. Without this separation, either the element list would be incomplete (missing non-broken elements) or the break information would be exposed in the DOM where testers could inspect it.

### c. Register the instance in `issues-registry.ts`

```typescript
// apps/a11y-road/src/data/issues-registry.ts
const issueInstances: A11yIssueInstance[] = [
  {
    id: 'landing-hero-img-alt',       // must match A11yDemo instanceId
    issueId: 'missing-alt-text',      // references an issue definition
    pageId: 'landing',                // references page-metadata.ts
    label: 'Hero image',             // must match A11yDemo label and data-a11y-name
    description: '...',
    solutionDescription: '...',
  },
];
```

### Field alignment summary

These three values **must be consistent** across all three locations:

| Location | Field | Example value |
|----------|-------|---------------|
| `<A11yDemo>` | `instanceId` | `landing-hero-img-alt` |
| `issues-registry.ts` instance | `id` | `landing-hero-img-alt` |
| `<A11yDemo>` | `label` | `Hero image` |
| `data-a11y-name` attribute | value | `Hero image` |
| `issues-registry.ts` instance | `label` | `Hero image` |

## Step 2: Issue definitions

Issue definitions describe **types** of accessibility problems. They are defined in `issues-registry.ts`:

```typescript
const issueDefinitions: A11yIssueDefinition[] = [
  {
    id: 'missing-alt-text',          // issueId — referenced by instances
    title: 'Missing alt text',
    wcagCriteria: [{ id: '1.1.1', title: 'Non-text Content', level: 'A' }],
    impactedUsers: ['Screen reader users'],
    tags: ['images'],
    testingMethods: ['automated', 'screen-reader'],
  },
];
```

In the decoupled model, issue definitions will live in the **testing platform**, not the demo site. The demo site only needs the `issueId` to identify what type of break each instance is.

## Step 3: Page metadata

Pages are defined in `page-metadata.ts`:

```typescript
// apps/a11y-road/src/data/page-metadata.ts
export const pages: PageMeta[] = [
  { id: 'landing', name: 'Landing Page', route: '/maple-valley-health' },
  { id: 'team',    name: 'Team Page',    route: '/maple-valley-health/team' },
  { id: 'contact', name: 'Contact Page', route: '/maple-valley-health/contact' },
];
```

The export script currently has its own page list with interaction configs. This should eventually read from a shared JSON input file.

## Step 4: Export script

The Playwright export script (`apps/a11y-road/scripts/export-manifest.ts`) does the following:

1. **Authenticates** — logs in as the learner user (sees accessible mode, all elements visible)
2. **For each page:**
   a. Navigates to the page
   b. Queries all `[data-a11y-name]` elements from the DOM — collects `name` and `htmlTag`
   c. Calls `window.__a11yManifest()` — the export bridge returns:
      - `registeredElements`: all mounted `A11yDemo` components (from `ElementRegistry`)
      - `resolvedInstances`: all issue instances joined with their definitions (from `A11yRegistry`)
   d. Matches DOM elements to break data: if a DOM element's `data-a11y-name` matches a resolved instance's `label` AND is registered in the `ElementRegistry`, it has a break
3. **For stateful pages** (forms, dialogs): performs configured interactions, then re-collects to capture new elements (error messages, dialogs)
4. **Outputs `manifest.json`**

### How `issueId` reaches the manifest

```
issues-registry.ts          A11yRegistry              Export Bridge            Manifest
-------------------         ------------              -------------            --------
instance.issueId    -->     getAllResolved()    -->    resolvedInstances  -->   element.issueId
                            joins instance                                     (via label match)
                            with definition
```

The `issueId` is stored in `issues-registry.ts` on each instance. The `A11yExportBridge` component reads it via `registry.getAllResolved()` and exposes it through `window.__a11yManifest()`. The export script matches by label and includes it in the output.

### Export bridge

The bridge (`apps/a11y-road/src/components/providers/a11y-export-bridge.tsx`) is a React component that:
- Reads the `ElementRegistry` (runtime — knows which `A11yDemo` components are mounted)
- Reads the `A11yRegistry` (static — knows break metadata from `issues-registry.ts`)
- Exposes `window.__a11yManifest()` — callable by Playwright but invisible in DevTools Elements panel
- Only mounts when `NEXT_PUBLIC_ENABLE_MANIFEST_EXPORT=true`

## Step 5: Manifest output format

```json
{
  "exportedAt": "2026-04-09T...",
  "site": "maple-valley-health",
  "pages": [
    {
      "id": "landing",
      "name": "Landing Page",
      "route": "/maple-valley-health",
      "states": [
        {
          "state": "default",
          "elements": [
            { "name": "Hero heading",  "htmlTag": "h1",  "hasBreak": false },
            { "name": "Hero image",    "htmlTag": "img", "hasBreak": true,
              "instanceId": "landing-hero-img-alt", "issueId": "missing-alt-text" },
            { "name": "Services heading", "htmlTag": "h2", "hasBreak": false }
          ]
        }
      ]
    }
  ]
}
```

### Manifest element fields

| Field | Present | Source | Purpose |
|-------|---------|--------|---------|
| `name` | Always | DOM `data-a11y-name` | Element identifier; populates the tester's element dropdown |
| `htmlTag` | Always | DOM `tagName` | The HTML element (e.g., `img`, `button`, `h1`, `div`, `input`) |
| `hasBreak` | Always | Matching logic | Whether this element has an accessibility break |
| `instanceId` | When `hasBreak` | `issues-registry.ts` | Unique break instance identifier; join key to testing platform |
| `issueId` | When `hasBreak` | `issues-registry.ts` | Type of break (e.g., `missing-alt-text`); maps to issue definitions in testing platform |

## Step 6: Testing platform (separate application)

The testing platform imports the manifest and uses it to:

### Define a11y issues

Issue definitions (WCAG criteria, descriptions, severity, impacted users) live in the testing platform. Each has an `issueId` that matches what the demo site exports.

### Build test sets

A test set selects a subset of break instances from the manifest. Each break instance (`instanceId`) is associated with an issue definition (`issueId`).

### Tester experience

The tester sees two dropdowns:

1. **Page** — populated from the manifest's page list (`name` field)
2. **Element** — populated from the manifest's element list for the selected page (`name` field); includes all elements, not just broken ones

The tester selects a page and element, then identifies what accessibility issue they found. The platform scores their finding against the manifest's answer key.

## Data ownership summary

| Data | Owner | Location |
|------|-------|----------|
| Page definitions | Demo site | `page-metadata.ts` |
| Element names | Demo site | `data-a11y-name` attributes |
| Break instances (instanceId, issueId) | Demo site | `issues-registry.ts` |
| Break-to-element mapping | Demo site | `A11yDemo` label matching `data-a11y-name` |
| Issue definitions (WCAG, descriptions) | Testing platform | Testing platform database |
| Test sets | Testing platform | Testing platform database |
| Tester findings and scoring | Testing platform | Testing platform database |

## Running the export

```sh
# Prerequisites
# 1. Set NEXT_PUBLIC_ENABLE_MANIFEST_EXPORT=true in .env.local
# 2. Start the dev server
pnpm dev

# Run the export (outputs manifest.json)
pnpm export:manifest

# Custom output path
MANIFEST_OUTPUT=path/to/output.json pnpm export:manifest
```

## Dynamic elements

Some `data-a11y-name` values are generated at runtime from data (e.g., `"Dr. Sarah Chen card"`, `"Edit Dr. Sarah Chen profile"` on team cards). The export script captures these because it crawls the live DOM. For per-occurrence breaks (where only one instance of a repeated element has an issue), the `A11yDemo` wrapper would use a dynamic `instanceId` and `label` matching the specific element's `data-a11y-name`.

## Security consideration

Break information (which elements have issues) must not be visible to testers inspecting the demo site with DevTools. The export bridge stores data in JavaScript memory, not in DOM attributes. It is only accessible via `window.__a11yManifest()` and only mounts when the env var is enabled — which should be off in tester-facing environments.
