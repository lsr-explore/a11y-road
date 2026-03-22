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
  status: EvaluationStatus;
  findings: Finding[];
}

export interface Finding {
  id: string;
  elementId: string;
  issueTypeId: string;
  wcagCriteria: string;
  description: string;
  timestamp: string;
  matchResult: 'correct' | 'partial' | 'not-found';
  matchedInstanceId?: string;
}
