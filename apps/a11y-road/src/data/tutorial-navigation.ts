export interface TutorialPage {
  slug: string;
  title: string;
  section: 'foundations' | 'workflow';
}

export const tutorialPages: TutorialPage[] = [
  // Foundations
  { slug: 'what-is-accessibility', title: 'What Is Web Accessibility?', section: 'foundations' },
  { slug: 'people-and-devices', title: 'People & Assistive Devices', section: 'foundations' },
  { slug: 'wcag-overview', title: 'Understanding WCAG', section: 'foundations' },
  { slug: 'wcag-in-practice', title: 'WCAG in Practice', section: 'foundations' },
  { slug: 'legal-landscape', title: 'The Legal Landscape', section: 'foundations' },

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
  { id: 'workflow' as const, title: 'Workflow' },
];
