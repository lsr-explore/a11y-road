import type { A11yIssueDefinition, A11yIssueInstance } from '@a11y-road/a11y-kit';
import { A11yRegistry } from '@a11y-road/a11y-kit';

export const issueDefinitions: A11yIssueDefinition[] = [
  {
    id: 'missing-alt-text',
    title: 'Missing alt text',
    description:
      'Images that convey meaning must have descriptive alternative text. Without it, screen reader users have no way to understand the image content.',
    wcagCriteria: [{ id: '1.1.1', title: 'Non-text Content', level: 'A' }],
    impactedUsers: ['Screen reader users', 'Users with images disabled'],
    tags: ['images'],
    testingMethod: 'automated',
  },
  {
    id: 'low-contrast-text',
    title: 'Low contrast text',
    description:
      'Text must have a contrast ratio of at least 4.5:1 against its background for normal text, or 3:1 for large text. Low contrast makes content difficult or impossible to read for users with low vision.',
    wcagCriteria: [{ id: '1.4.3', title: 'Contrast (Minimum)', level: 'AA' }],
    impactedUsers: ['Low vision users', 'Users in bright environments'],
    tags: ['color', 'contrast'],
    testingMethod: 'automated',
  },
  {
    id: 'missing-page-language',
    title: 'Missing page language',
    description:
      'The <html> element must have a lang attribute so screen readers can select the correct pronunciation rules and voice profile.',
    wcagCriteria: [{ id: '3.1.1', title: 'Language of Page', level: 'A' }],
    impactedUsers: ['Screen reader users'],
    tags: ['html', 'language'],
    testingMethod: 'automated',
  },
  {
    id: 'missing-form-labels',
    title: 'Missing form labels',
    description:
      'Form inputs must have visible <label> elements associated via htmlFor/id. Placeholder text is not a substitute — it disappears when typing and is not reliably announced by screen readers.',
    wcagCriteria: [
      { id: '1.3.1', title: 'Info and Relationships', level: 'A' },
      { id: '4.1.2', title: 'Name, Role, Value', level: 'A' },
    ],
    impactedUsers: ['Screen reader users', 'Users with cognitive disabilities'],
    tags: ['forms', 'labels'],
    testingMethod: 'automated',
  },
  {
    id: 'missing-focus-indicator',
    title: 'No visible focus indicator',
    description:
      'Interactive elements must have a visible focus indicator so keyboard users can tell which element has focus. Removing outline with CSS breaks this.',
    wcagCriteria: [{ id: '2.4.7', title: 'Focus Visible', level: 'AA' }],
    impactedUsers: ['Keyboard users', 'Users with motor disabilities'],
    tags: ['forms', 'focus'],
    testingMethod: 'manual',
  },
  {
    id: 'errors-not-announced',
    title: 'Form errors not announced',
    description:
      'Error messages must be programmatically associated with their inputs (via aria-describedby) and announced to screen readers (via role="alert"). Visual-only errors are invisible to assistive technology.',
    wcagCriteria: [{ id: '3.3.1', title: 'Error Identification', level: 'A' }],
    impactedUsers: ['Screen reader users'],
    tags: ['forms', 'errors'],
    testingMethod: 'semi-automated',
  },
  {
    id: 'non-semantic-dialog',
    title: 'Non-semantic dialog',
    description:
      'Dialogs must use the native <dialog> element or have role="dialog" with proper ARIA attributes. A plain <div> overlay has no semantic meaning, traps no focus, and cannot be dismissed with the Escape key.',
    wcagCriteria: [
      { id: '4.1.2', title: 'Name, Role, Value', level: 'A' },
      { id: '2.4.3', title: 'Focus Order', level: 'A' },
    ],
    impactedUsers: ['Screen reader users', 'Keyboard users'],
    tags: ['dialog', 'focus'],
    testingMethod: 'manual',
  },
  {
    id: 'inaccessible-notification',
    title: 'Inaccessible status notification',
    description:
      'Status messages must be announced to screen readers without moving focus. Use role="alert" or role="status" for live region announcements. Using window.alert() blocks interaction, while missing notifications leave users unaware of state changes.',
    wcagCriteria: [{ id: '4.1.3', title: 'Status Messages', level: 'AA' }],
    impactedUsers: ['Screen reader users'],
    tags: ['notifications', 'aria'],
    testingMethod: 'manual',
  },
  {
    id: 'non-interactive-delete',
    title: 'Non-interactive delete control',
    description:
      'Interactive controls must use semantic elements like <button>. A <div> with an onClick handler has no role, no keyboard access, and no accessible name. Screen reader users and keyboard users cannot activate it.',
    wcagCriteria: [
      { id: '4.1.2', title: 'Name, Role, Value', level: 'A' },
      { id: '2.1.1', title: 'Keyboard', level: 'A' },
    ],
    impactedUsers: ['Screen reader users', 'Keyboard users', 'Users with motor disabilities'],
    tags: ['buttons', 'keyboard'],
    testingMethod: 'automated',
  },
];

const issueInstances: A11yIssueInstance[] = [
  {
    id: 'landing-hero-img-alt',
    issueId: 'missing-alt-text',
    pageId: 'landing',
    description: 'The hero image has no alt attribute, making it invisible to screen reader users.',
  },
  {
    id: 'landing-cta-contrast',
    issueId: 'low-contrast-text',
    pageId: 'landing',
    description:
      'The CTA button uses light gray text (#d1d5db) on a near-white background (#f3f4f6), with a contrast ratio of ~1.3:1.',
  },
  {
    id: 'landing-page-language',
    issueId: 'missing-page-language',
    pageId: 'landing',
    description: 'The <html> element is missing a lang attribute on this page.',
  },
  {
    id: 'contact-form-labels',
    issueId: 'missing-form-labels',
    pageId: 'contact',
    description:
      'The contact form inputs rely on placeholder text only — no <label> elements are present.',
  },
  {
    id: 'contact-focus-indicator',
    issueId: 'missing-focus-indicator',
    pageId: 'contact',
    description:
      'Contact form inputs have outline: none applied via CSS, removing all visible focus indication.',
  },
  {
    id: 'contact-error-announcement',
    issueId: 'errors-not-announced',
    pageId: 'contact',
    description:
      'Contact form error messages appear visually but lack role="alert" and aria-describedby, so screen readers do not announce them.',
  },
  {
    id: 'team-delete-dialog',
    issueId: 'non-semantic-dialog',
    pageId: 'team',
    description:
      'The delete confirmation dialog is a plain <div> overlay with no semantic role, no focus management, and no keyboard support.',
  },
  {
    id: 'team-notification',
    issueId: 'inaccessible-notification',
    pageId: 'team',
    description:
      'Success notifications use window.alert() for additions, an auto-dismiss toast without ARIA for edits, and no notification at all for deletions.',
  },
  {
    id: 'team-delete-button',
    issueId: 'non-interactive-delete',
    pageId: 'team',
    description:
      'The delete button on team cards is a <div> with onClick — it has no role, no accessible name, no focus indicator, and cannot be activated via keyboard.',
  },
];

export const registry = new A11yRegistry(issueDefinitions, issueInstances);
