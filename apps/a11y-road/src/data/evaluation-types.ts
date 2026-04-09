export type Severity = 'critical' | 'serious' | 'moderate' | 'minor' | 'best-practices';

export type ImpactedUser =
  | 'keyboard-only'
  | 'screen-reader'
  | 'deaf'
  | 'color-blind'
  | 'low-vision'
  | 'cognitive-impairment';

export type ToolUsed =
  | 'keyboard'
  | 'screen-reader'
  | 'axe-dev-tools'
  | 'color-contrast-checker'
  | 'zoom';

export const severityOptions: { value: Severity; label: string }[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'serious', label: 'Serious' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'minor', label: 'Minor' },
  { value: 'best-practices', label: 'Best Practices' },
];

export const impactedUserOptions: { value: ImpactedUser; label: string }[] = [
  { value: 'keyboard-only', label: 'Keyboard only user' },
  { value: 'screen-reader', label: 'Screen Reader user' },
  { value: 'deaf', label: 'Deaf' },
  { value: 'color-blind', label: 'Color Blind' },
  { value: 'low-vision', label: 'Low Vision' },
  { value: 'cognitive-impairment', label: 'Cognitive impairment' },
];

export const toolUsedOptions: { value: ToolUsed; label: string }[] = [
  { value: 'keyboard', label: 'Keyboard' },
  { value: 'screen-reader', label: 'Screen Reader' },
  { value: 'axe-dev-tools', label: 'Axe dev tools' },
  { value: 'color-contrast-checker', label: 'Color Contrast Checker' },
  { value: 'zoom', label: 'Zoom' },
];

export interface IssueSet {
  id: string;
  name: string;
  description: string;
  instanceIds: string[];
}

export type EvaluationStatus = 'active' | 'submitted';

export interface Evaluation {
  id: string;
  issueSetId: string;
  userId: string;
  startedAt: string;
  submittedAt?: string;
  status: EvaluationStatus;
  findings: Finding[];
}

export interface MatchDetails {
  pageMatched: boolean;
  elementMatched: boolean;
  wcagMatched: boolean;
  reason: string;
}

export interface Finding {
  id: string;
  pageId: string;
  elementId: string;
  issueTypeId: string;
  wcagCriteria: string;
  description: string;
  proposedSolution?: string;
  timestamp: string;
  matchResult: 'correct' | 'partial' | 'not-found';
  matchedInstanceId?: string;
  matchDetails?: MatchDetails;
  severity?: Severity;
  impactedUsers?: ImpactedUser[];
  issueDescriptions?: string[];
  fixDescriptions?: string[];
  toolsUsed?: ToolUsed[];
}
