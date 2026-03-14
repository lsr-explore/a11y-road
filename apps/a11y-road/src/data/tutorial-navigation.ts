export interface TutorialSubPage {
  slug: string;
  title: string;
}

export interface TutorialPage {
  slug: string;
  title: string;
  section: 'foundations' | 'standards' | 'workflow';
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
  { slug: 'wcag-in-practice', title: 'WCAG in Practice', section: 'standards' },
  { slug: 'legal-landscape', title: 'The Legal Landscape', section: 'standards' },

  // Workflow
  { slug: 'user-research', title: 'User Research', section: 'workflow' },
  { slug: 'product-and-design', title: 'Product & Design', section: 'workflow' },
  { slug: 'development', title: 'Development', section: 'workflow' },
  { slug: 'dev-tools', title: 'Developer Tooling', section: 'workflow' },
  { slug: 'testing', title: 'Testing', section: 'workflow' },
  { slug: 'monitoring-and-feedback', title: 'Monitoring & Feedback', section: 'workflow' },
];

export const tutorialSections = [
  { id: 'foundations' as const, title: 'Foundations' },
  { id: 'standards' as const, title: 'Standards & Law' },
  { id: 'workflow' as const, title: 'Workflow' },
];
