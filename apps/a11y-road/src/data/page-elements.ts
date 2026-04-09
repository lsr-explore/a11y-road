/**
 * Static map of all data-a11y-name elements per page.
 * Used by the full-page issue logger where DOM queries are not available.
 * Keep in sync with data-a11y-name attributes in page components.
 */
export const pageElements: Record<string, string[]> = {
  landing: [
    'Hero heading',
    'Hero description',
    'Hero image',
    'Services heading',
    'Services description',
    'CTA heading',
    'CTA description',
    'Book appointment button',
  ],
  team: [
    'Team heading',
    'Team description',
    'Add team member button',
    'Delete member button',
    'Delete confirmation dialog',
    'Team notification',
  ],
  contact: [
    'Contact heading',
    'Contact intro',
    'Contact form',
    'Name field group',
    'Name input',
    'Name error message',
    'Email input',
    'Message input',
    'Send message button',
  ],
};
