export interface IssueDescriptionOption {
  id: string;
  wcagCriteria: string[];
  description: string;
  fixes: string[];
}

export const issueDescriptions: IssueDescriptionOption[] = [
  // 1.1.1 Non-text Content (Level A)
  {
    id: 'img-announced-as-image',
    wcagCriteria: ['1.1.1'],
    description: "Image is announced as 'Image'",
    fixes: [
      'Add an alt tag to the image element',
      'Add an empty alt tag to mark the image as decorative',
    ],
  },
  {
    id: 'img-desc-mismatch',
    wcagCriteria: ['1.1.1'],
    description: 'Image description does not reflect the image',
    fixes: ['Update alt text to accurately describe the image content'],
  },
  {
    id: 'img-missing-alt',
    wcagCriteria: ['1.1.1'],
    description: 'Image has no alternative text',
    fixes: [
      'Add descriptive alt text to the image element',
      'Add an empty alt tag to mark the image as decorative',
    ],
  },

  // 1.3.1 Info and Relationships (Level A)
  {
    id: 'form-no-programmatic-label',
    wcagCriteria: ['1.3.1'],
    description: 'Form inputs have no programmatic labels',
    fixes: [
      'Add visible label elements associated with each input via htmlFor/id',
      'Add aria-label or aria-labelledby to the input',
    ],
  },
  {
    id: 'form-placeholder-only',
    wcagCriteria: ['1.3.1'],
    description: 'Form inputs rely on placeholder text instead of labels',
    fixes: ['Add visible label elements — placeholder text is not a substitute for labels'],
  },

  // 1.4.3 Contrast (Minimum) (Level AA)
  {
    id: 'low-contrast-text',
    wcagCriteria: ['1.4.3'],
    description: 'Text does not meet minimum contrast ratio of 4.5:1',
    fixes: [
      'Change the text or background color to achieve at least a 4.5:1 contrast ratio',
      'Increase font size to qualify as large text (3:1 ratio threshold)',
    ],
  },
  {
    id: 'low-contrast-interactive',
    wcagCriteria: ['1.4.3'],
    description: 'Interactive element text has insufficient contrast',
    fixes: ['Adjust colors to meet the 4.5:1 contrast ratio for normal text'],
  },

  // 2.1.1 Keyboard (Level A)
  {
    id: 'not-keyboard-operable',
    wcagCriteria: ['2.1.1'],
    description: 'Interactive element cannot be activated with keyboard',
    fixes: [
      'Replace the non-interactive element with a button or link',
      'Add tabindex="0" and keyboard event handlers',
    ],
  },
  {
    id: 'no-keyboard-focus',
    wcagCriteria: ['2.1.1'],
    description: 'Element is not reachable via Tab key',
    fixes: ['Use a native interactive element (button, a, input) instead of a div or span'],
  },

  // 2.4.3 Focus Order (Level A)
  {
    id: 'focus-not-moved-to-dialog',
    wcagCriteria: ['2.4.3'],
    description: 'Focus is not moved into dialog when opened',
    fixes: [
      'Move focus to the dialog or its first focusable element when opened',
      'Use a native dialog element with built-in focus management',
    ],
  },
  {
    id: 'focus-not-returned',
    wcagCriteria: ['2.4.3'],
    description: 'Focus is not returned to trigger when dialog closes',
    fixes: ['Return focus to the element that opened the dialog when it closes'],
  },

  // 2.4.7 Focus Visible (Level AA)
  {
    id: 'no-visible-focus',
    wcagCriteria: ['2.4.7'],
    description: 'No visible focus indicator on interactive elements',
    fixes: [
      'Remove CSS that suppresses focus outlines (outline: none)',
      'Add a visible focus style that meets WCAG requirements',
    ],
  },

  // 3.1.1 Language of Page (Level A)
  {
    id: 'missing-page-lang',
    wcagCriteria: ['3.1.1'],
    description: 'Page language is not specified',
    fixes: ['Add lang="en" (or appropriate language code) to the html element'],
  },

  // 3.3.1 Error Identification (Level A)
  {
    id: 'errors-not-announced',
    wcagCriteria: ['3.3.1'],
    description: 'Form errors are not announced to screen readers',
    fixes: [
      'Add role="alert" to error message containers',
      'Associate error messages with inputs via aria-describedby',
    ],
  },
  {
    id: 'errors-visual-only',
    wcagCriteria: ['3.3.1'],
    description: 'Error messages are visual only with no programmatic association',
    fixes: [
      'Add aria-describedby on the input pointing to the error message element',
      'Add aria-invalid="true" to the input when in error state',
    ],
  },

  // 4.1.2 Name, Role, Value (Level A)
  {
    id: 'no-accessible-name',
    wcagCriteria: ['4.1.2'],
    description: 'Element has no accessible name or role',
    fixes: [
      'Use a semantic HTML element (button, dialog, nav) instead of a div',
      'Add appropriate ARIA role and accessible name via aria-label or aria-labelledby',
    ],
  },
  {
    id: 'div-as-button',
    wcagCriteria: ['4.1.2'],
    description: 'Non-interactive element used as a button',
    fixes: ['Replace the div/span with a native button element'],
  },
  {
    id: 'div-as-dialog',
    wcagCriteria: ['4.1.2'],
    description: 'Dialog has no semantic role',
    fixes: ['Use a native dialog element', 'Add role="dialog" and aria-label to the container'],
  },

  // 4.1.3 Status Messages (Level AA)
  {
    id: 'status-not-announced',
    wcagCriteria: ['4.1.3'],
    description: 'Status changes are not announced to assistive technology',
    fixes: [
      'Use a live region with role="status" for non-urgent updates',
      'Use role="alert" for urgent status messages',
    ],
  },
  {
    id: 'window-alert-used',
    wcagCriteria: ['4.1.3'],
    description: 'window.alert() used instead of an accessible notification',
    fixes: ['Replace window.alert() with a live region announcement using role="status"'],
  },
];

/** Get issue descriptions that match any of the selected WCAG criteria */
export const getDescriptionsForCriteria = (wcagIds: string[]): IssueDescriptionOption[] => {
  if (wcagIds.length === 0) return issueDescriptions;
  return issueDescriptions.filter((desc) =>
    desc.wcagCriteria.some((criterion) => wcagIds.includes(criterion)),
  );
};

/** Get all unique fixes from selected issue descriptions */
export const getFixesForDescriptions = (descriptionIds: string[]): string[] => {
  const fixes = new Set<string>();
  for (const desc of issueDescriptions) {
    if (descriptionIds.includes(desc.id)) {
      for (const fix of desc.fixes) {
        fixes.add(fix);
      }
    }
  }
  return [...fixes];
};
