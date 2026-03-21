export interface IssueSet {
  id: string;
  name: string;
  description: string;
  definitionIds: string[];
  instanceIds: string[];
}

export interface Evaluation {
  id: string;
  issueSetId: string;
  userId: string;
  startedAt: string;
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
