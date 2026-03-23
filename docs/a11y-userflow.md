# Accessibility User Flows

This document describes the different user flows for the site.

## Authentication

The site uses demo-only authentication with base64-encoded session cookies. Credentials are stored in `src/data/users.json` (plaintext, server-side only). The login page at `/login` shows a demo credentials section with all available accounts.

- **Public routes**: `/`, `/login`, `/about`, `/tutorial/*`
- **Protected routes**: `/maple-valley-health/*` — requires any authenticated role
- **Admin routes**: `/maple-valley-health/editor/*` — requires `content-editor` role
- Route protection is handled by `src/proxy.ts` (Next.js 16 proxy)

### Demo accounts

| Username | Password | Role | Display Name |
|----------|----------|------|-------------|
| `learner` | `learn123` | learner | Alex Learner |
| `tester` | `test123` | tester | Sam Tester |
| `editor` | `edit123` | content-editor | Morgan Editor |

## User Roles Overview

The following are the currently defined roles:

- **Content Editor** — Can edit accessibility issue definitions, issue instances, and issue sets. Sees everything the learner sees plus admin navigation and pages.
- **Learner** — Can explore the site, toggle between accessible and inaccessible views, view the issues side panel, and review the A11y Summary page.
- **Tester** — Can log accessibility issues found during testing and view evaluation results. The demo is locked to broken mode with no answers visible.

The following role is planned:

- **Site Admin** — TBD — Can view everything the Content Editor can, plus add/edit users and assign user roles.

All roles can view the tutorial (public route, no login required).

The following role is external to the application:

- **Developer** — Applies the issue instances in the code for the defined pages.

> [!IMPORTANT]
> Any changes made by the Content Editor are persisted to localStorage. They must be exported as JSON and given to a developer to be added to the code manually.
> Once a DB is added, the export and manual addition to the code will no longer be needed.

## Role-Based UI Visibility

| Element | Learner | Tester | Content Editor |
|---------|---------|--------|----------------|
| DemoBanner (toggle) | Yes | No | Yes |
| SidePanel (answers) | Yes | No | Yes |
| SidePanelToggle | Yes | No | Yes |
| A11y Summary nav | Yes | No | Yes |
| Issue Logger panel | No | Yes | No |
| Evaluation nav | No | Yes | No |
| Editor nav link | No | No | Yes |
| A11yMode locked broken | No | Yes | No |
| Display name + logout | Yes | Yes | Yes |

## Learner Flow

1. Sign in with learner credentials
2. Arrive at `/maple-valley-health`
3. Use the demo banner toggle to switch between broken and accessible views
4. Open the side panel to see accessibility issues for the current page
5. Click "Highlight" on any issue to scroll to and pulse the affected element
6. Navigate to the A11y Summary page for a filterable, sortable table of all issues
7. Visit `/tutorial` for learning content (accessible without login)

## Tester Flow

1. Sign in with tester credentials
2. Arrive at `/maple-valley-health` — demo is locked to broken mode
3. The issue logger panel is visible on the right side
4. Click "Start Evaluation" to begin a new evaluation session
5. For each issue found:
   - Select the element from the dropdown (populated from `data-a11y-name` on the current page, or choose "Other")
   - Enter the issue type as free text
   - Select WCAG criteria from the searchable multi-select picker
   - Add a description and proposed solution
   - Submit — immediate feedback shows match result with explanation
6. Navigate to `/maple-valley-health/evaluation` to see a list of all evaluations with status (Active/Submitted)
7. Click an evaluation to view the detail page with:
   - Summary stats: total findings, correct matches, partial matches, coverage percentage
   - Findings table with match status and reasons
   - For submitted evaluations: expected answers alongside tester's answers, missed issues table
7. Past evaluations are accessible at `/maple-valley-health/evaluation/[id]`
8. Evaluations are persisted to localStorage under key `a11y-road-evaluations`

### Evaluation Matching

When a finding is submitted, it is compared against the active issue set using Page + Element + WCAG:

- **Correct** — Page matches, element label matches a known instance, and at least one WCAG criterion overlaps
- **Partial** — Page and element match, but WCAG criteria do not overlap
- **Not Found** — Element does not match any known issue in the set

See `docs/features/evaluation-scoring.md` for the full scoring model.

## Content Editor Flow

1. Sign in with editor credentials
2. Arrive at `/maple-valley-health` — same view as learner (toggle, side panel, summary)
3. Navigate to Editor via the header nav link
4. Accessibility Issues Dashboard at `/maple-valley-health/editor` shows counts of definitions, instances, and issue sets
5. Manage issue definitions at `/maple-valley-health/editor/definitions`:
   - View all definitions in a table
   - Inline edit by expanding a row
   - Add new definitions
   - Delete definitions
6. Manage issue instances at `/maple-valley-health/editor/instances`:
   - View all instances with linked issue type
   - Inline edit with dropdowns for issue type and page
   - Add new instances
   - Delete instances
7. Manage issue sets at `/maple-valley-health/editor/issue-sets`:
   - Create named subsets of instances for evaluations
   - Multi-select checkboxes for instances
   - "All" option to include everything
8. Admin edits are persisted to localStorage (keys: `a11y-road-admin-definitions`, `a11y-road-admin-instances`, `a11y-road-issue-sets`)
9. Use "Reset to Defaults" on the dashboard to discard localStorage edits

## Issue Overview

Steps to create a new accessibility issue:

1. Content Editor creates an issue definition (via admin UI or directly in code)
2. Content Editor creates an issue instance, associating it with a definition via `issueId`
3. Developer creates the example in the code using `A11yDemo`, associated with the instance via `instanceId`

A developer or admin can also create issue definitions and issue instances directly in code.

### Issue Definition

Describes a particular accessibility rule that is not implemented. Can be assigned to multiple instances. Should be associated with one or more WCAG success criteria. The `id` is generated from the title and will be associated with one or more issue instances.

```js
{
  id: 'missing-alt-text',
  title: 'Missing alt text',
  description:
    'Images that convey meaning must have descriptive alternative text. Without it, screen reader users have no way to understand the image content.',
  wcagCriteria: [{ id: '1.1.1', title: 'Non-text Content', level: 'A' }],
  impactedUsers: ['Screen reader users', 'Users with images disabled'],
  tags: ['images'],
  testingMethods: ['automated', 'screen-reader'],
},
```

### Issue Instance

Describes a particular instance where an issue definition is applied. Associated with one element in the application (though that element may be duplicated, e.g. list items — confirm this is true, check the delete button on the cards).

```js
{
  id: 'landing-hero-img-alt',
  issueId: 'missing-alt-text',
  pageId: 'landing',
  label: 'Hero image',
  description: 'The hero image has no alt attribute, making it invisible to screen reader users.',
  solutionDescription: 'Add descriptive alt text to the hero image.',
},
```

```html
<A11yDemo
  instanceId="landing-hero-img-alt"
  label="Hero image"
  fixed={
    <Image
      src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=400&fit=crop"
      alt="A doctor in a white coat smiling and consulting with a patient in a modern clinic"
      className="rounded-lg shadow-lg max-w-full h-auto"
      width={600}
      height={400}
    />
  }
  broken={
    // @ts-expect-error Intentionally missing alt to demonstrate a11y violation
    <Image
      src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=400&fit=crop"
      className="rounded-lg shadow-lg max-w-full h-auto"
      width={600}
      height={400}
    />
  }
/>
```

### Issue Set

A curated subset of instances used for evaluations. Content editors create these via the editor UI to scope what testers are evaluated against.

```json
{
  "id": "default-full",
  "name": "Full Assessment",
  "description": "All known issues across all pages",
  "instanceIds": ["all"]
}
```

### Evaluation

A tester's session of findings against a specific issue set. Each evaluation gets a unique ID (e.g. `eval-1711036800000-abc12`).

```ts
{
  id: string;           // unique tag
  issueSetId: string;   // which issue set is being tested against
  userId: string;
  startedAt: string;
  submittedAt?: string; // ISO timestamp when evaluation was submitted
  status: 'active' | 'submitted';
  findings: Finding[];
}
```

## Data Persistence

Currently all user-generated data (evaluations, admin edits) is stored in localStorage:

| Key | Data | Used by |
|-----|------|---------|
| `a11y-road-evaluations` | Evaluation sessions and findings | Tester |
| `a11y-road-admin-definitions` | Edited issue definitions | Content Editor |
| `a11y-road-admin-instances` | Edited issue instances | Content Editor |
| `a11y-road-issue-sets` | Issue sets (curated subsets) | Content Editor / Tester |

Future: replace with database persistence.
