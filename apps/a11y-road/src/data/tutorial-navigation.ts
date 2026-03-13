export interface TutorialPage {
  slug: string;
  title: string;
  section: 'foundations' | 'workflow';
}

export const tutorialPages: TutorialPage[] = [
  // Foundations
  { slug: 'what-is-accessibility', title: 'What Is Accessibility?', section: 'foundations' },
  { slug: 'wcag-overview', title: 'WCAG Overview', section: 'foundations' },
  { slug: 'assistive-devices', title: 'Assistive Devices', section: 'foundations' },

  // Workflow
  { slug: 'user-research', title: 'User Research', section: 'workflow' },
  { slug: 'product-and-design', title: 'Product & Design', section: 'workflow' },
  { slug: 'development', title: 'Development', section: 'workflow' },
  { slug: 'testing', title: 'Testing', section: 'workflow' },
  { slug: 'monitoring', title: 'Monitoring', section: 'workflow' },
  { slug: 'user-feedback', title: 'User Feedback', section: 'workflow' },
];

export const tutorialSections = [
  { id: 'foundations' as const, title: 'Foundations' },
  { id: 'workflow' as const, title: 'Workflow' },
];
