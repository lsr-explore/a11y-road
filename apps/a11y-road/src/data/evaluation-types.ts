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
}
