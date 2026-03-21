export interface A11yIssueDefinition {
  id: string;
  title: string;
  description: string;
  wcagCriteria: { id: string; title: string; level: 'A' | 'AA' | 'AAA' }[];
  impactedUsers: string[];
  tags: string[];
  testingMethod: 'automated' | 'manual' | 'semi-automated';
}

export interface A11yIssueInstance {
  id: string;
  issueId: string;
  pageId: string;
  description: string;
  elementSelector: string;
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
