export type TestingMethod =
  | 'screen-reader'
  | 'keyboard'
  | 'zoom'
  | 'color-contrast'
  | 'automated'
  | 'semi-automated';

export const testingMethodLabels: Record<TestingMethod, { label: string; description: string }> = {
  'screen-reader': {
    label: 'Screen Reader',
    description: 'Test with a screen reader (e.g. NVDA, VoiceOver, JAWS)',
  },
  keyboard: {
    label: 'Keyboard',
    description: 'Test all interactions using only the keyboard',
  },
  zoom: {
    label: 'Zoom / Magnification',
    description: 'Test at 200%+ zoom to verify layout and readability',
  },
  'color-contrast': {
    label: 'Color Contrast',
    description: 'Check color contrast ratios meet WCAG thresholds',
  },
  automated: {
    label: 'Automated',
    description: 'Detectable by automated tools (e.g. axe-core, Lighthouse)',
  },
  'semi-automated': {
    label: 'Semi-automated',
    description: 'Flagged by tools but requires manual verification',
  },
};

export interface A11yIssueDefinition {
  id: string;
  title: string;
  description: string;
  wcagCriteria: { id: string; title: string; level: 'A' | 'AA' | 'AAA' }[];
  impactedUsers: string[];
  tags: string[];
  testingMethods: TestingMethod[];
}

export interface A11yIssueInstance {
  id: string;
  issueId: string;
  pageId: string;
  description: string;
  solutionDescription?: string;
}

export interface ResolvedInstance {
  instance: A11yIssueInstance;
  definition: A11yIssueDefinition;
}

export type UserRole = 'learner' | 'tester' | 'content-editor';

export interface UserProfile {
  username: string;
  password: string;
  role: UserRole;
  displayName: string;
}
