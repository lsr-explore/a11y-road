export interface TutorialSubPage {
  slug: string;
  title: string;
}

export interface TutorialPage {
  slug: string;
  title: string;
  section: 'foundations' | 'standards' | 'business' | 'workflow';
  children?: TutorialSubPage[];
}

export const tutorialPages: TutorialPage[] = [
  // Foundations
  { slug: 'what-is-accessibility', title: 'What Is Web Accessibility?', section: 'foundations' },
  {
    slug: 'people-and-devices',
    title: 'People & Assistive Devices',
    section: 'foundations',
    children: [
      { slug: 'screen-readers', title: 'Screen Reader Users' },
      { slug: 'keyboard-only', title: 'Keyboard-Only Users' },
      { slug: 'low-vision', title: 'Low Vision Users' },
      { slug: 'color-vision', title: 'Color Vision Differences' },
      { slug: 'cognitive-and-neurological', title: 'Cognitive & Neurological' },
      { slug: 'deaf-and-hard-of-hearing', title: 'Deaf & Hard of Hearing' },
    ],
  },
  { slug: 'try-it-yourself', title: 'Try It Yourself', section: 'foundations' },
  // Standards & Law
  { slug: 'wcag-overview', title: 'Understanding WCAG', section: 'standards' },
  { slug: 'wcag-by-example', title: 'WCAG by Example', section: 'standards' },
  { slug: 'wcag-in-practice', title: 'WCAG in Practice', section: 'standards' },
  { slug: 'wcag-people-map', title: 'WCAG by User Group', section: 'standards' },
  // The Business Case
  { slug: 'business-case', title: 'The Business Case', section: 'business' },
  { slug: 'legal-landscape', title: 'The Legal Landscape', section: 'business' },

  // Workflow
  {
    slug: 'user-research',
    title: 'User Research',
    section: 'workflow',
    children: [{ slug: 'meet-the-team', title: 'Meet the Team' }],
  },
  {
    slug: 'product-and-design',
    title: 'Product & Design',
    section: 'workflow',
    children: [{ slug: 'meet-the-team', title: 'Meet the Team' }],
  },
  {
    slug: 'development',
    title: 'Development',
    section: 'workflow',
    children: [{ slug: 'meet-the-team', title: 'Meet the Team' }],
  },
  {
    slug: 'dev-tools',
    title: 'Developer Tooling',
    section: 'workflow',
    children: [
      { slug: 'eslint-jsx-a11y', title: 'eslint-plugin-jsx-a11y' },
      { slug: 'vitest-axe', title: 'vitest-axe' },
      { slug: 'browser-devtools', title: 'Browser DevTools' },
      { slug: 'playwright-axe', title: 'Playwright + axe' },
      { slug: 'storybook-a11y', title: 'Storybook a11y Addon' },
      { slug: 'meet-the-team', title: 'Meet the Team' },
    ],
  },
  {
    slug: 'testing',
    title: 'Testing',
    section: 'workflow',
    children: [
      { slug: 'screen-reader-testing', title: 'Screen Reader Testing' },
      { slug: 'meet-the-team', title: 'Meet the Team' },
    ],
  },
  {
    slug: 'monitoring-and-feedback',
    title: 'Monitoring & Feedback',
    section: 'workflow',
    children: [{ slug: 'meet-the-team', title: 'Meet the Team' }],
  },
];

export const tutorialSections = [
  { id: 'foundations' as const, title: 'Foundations' },
  { id: 'standards' as const, title: 'Standards' },
  { id: 'business' as const, title: 'The Business Case' },
  { id: 'workflow' as const, title: 'Workflow' },
];
