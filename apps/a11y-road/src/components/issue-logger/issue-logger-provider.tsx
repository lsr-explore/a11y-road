'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Evaluation, Finding, IssueSet } from '../../data/evaluation-types';
import defaultIssueSets from '../../data/issue-sets.json';
import { registry } from '../../data/issues-registry';

const STORAGE_KEY = 'a11y-road-evaluations';

interface IssueLoggerContextValue {
  currentEvaluation: Evaluation | null;
  evaluations: Evaluation[];
  issueSets: IssueSet[];
  startEvaluation: (issueSetId: string, userId: string) => void;
  submitFinding: (
    finding: Omit<Finding, 'id' | 'timestamp' | 'matchResult' | 'matchedInstanceId'>,
  ) => Finding;
  clearFindings: () => void;
  endEvaluation: () => void;
  getEvaluationById: (id: string) => Evaluation | undefined;
}

const IssueLoggerContext = createContext<IssueLoggerContextValue>({
  currentEvaluation: null,
  evaluations: [],
  issueSets: defaultIssueSets as IssueSet[],
  startEvaluation: () => {},
  submitFinding: () => ({}) as Finding,
  clearFindings: () => {},
  endEvaluation: () => {},
  getEvaluationById: () => undefined,
});

const generateId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7);
  return `eval-${timestamp}-${random}`;
};

const loadEvaluations = (): Evaluation[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Evaluation[]) : [];
  } catch {
    return [];
  }
};

const saveEvaluations = (evaluations: Evaluation[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluations));
};

const matchFinding = (
  finding: Omit<Finding, 'id' | 'timestamp' | 'matchResult' | 'matchedInstanceId'>,
  issueSet: IssueSet,
): { matchResult: Finding['matchResult']; matchedInstanceId?: string } => {
  const allInstances = registry.getInstances();
  const setInstances = issueSet.instanceIds.includes('all')
    ? allInstances
    : allInstances.filter((inst) => issueSet.instanceIds.includes(inst.id));

  // Exact match: same element and same issue type
  const exactMatch = setInstances.find(
    (inst) => inst.id === finding.elementId && inst.issueId === finding.issueTypeId,
  );
  if (exactMatch) {
    return { matchResult: 'correct', matchedInstanceId: exactMatch.id };
  }

  // Partial match: same element but different issue type, or same issue type on same page
  const partialMatch = setInstances.find(
    (inst) => inst.id === finding.elementId || inst.issueId === finding.issueTypeId,
  );
  if (partialMatch) {
    return { matchResult: 'partial', matchedInstanceId: partialMatch.id };
  }

  return { matchResult: 'not-found' };
};

export const IssueLoggerProvider = ({ children }: { children: React.ReactNode }) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [currentEvaluation, setCurrentEvaluation] = useState<Evaluation | null>(null);
  const [mounted, setMounted] = useState(false);

  const issueSets = useMemo(() => {
    const stored =
      typeof window !== 'undefined' ? localStorage.getItem('a11y-road-issue-sets') : null;
    if (stored) {
      try {
        return JSON.parse(stored) as IssueSet[];
      } catch {
        return defaultIssueSets as IssueSet[];
      }
    }
    return defaultIssueSets as IssueSet[];
  }, []);

  useEffect(() => {
    const loaded = loadEvaluations();
    setEvaluations(loaded);
    // Resume any active evaluation
    const activeEvaluation = loaded.find((ev) => ev.status === 'active');
    if (activeEvaluation) {
      setCurrentEvaluation(activeEvaluation);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      saveEvaluations(evaluations);
    }
  }, [evaluations, mounted]);

  const startEvaluation = useCallback((issueSetId: string, userId: string) => {
    const newEval: Evaluation = {
      id: generateId(),
      issueSetId,
      userId,
      startedAt: new Date().toISOString(),
      status: 'active',
      findings: [],
    };
    setCurrentEvaluation(newEval);
    setEvaluations((prev) => [...prev, newEval]);
  }, []);

  const submitFinding = useCallback(
    (input: Omit<Finding, 'id' | 'timestamp' | 'matchResult' | 'matchedInstanceId'>): Finding => {
      const issueSet =
        issueSets.find((set) => set.id === currentEvaluation?.issueSetId) ??
        (issueSets[0] as IssueSet);
      const { matchResult, matchedInstanceId } = matchFinding(input, issueSet);

      const finding: Finding = {
        ...input,
        id: `finding-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: new Date().toISOString(),
        matchResult,
        matchedInstanceId,
      };

      setCurrentEvaluation((prev) => {
        if (!prev) return prev;
        return { ...prev, findings: [...prev.findings, finding] };
      });
      setEvaluations((prev) =>
        prev.map((ev) =>
          ev.id === currentEvaluation?.id ? { ...ev, findings: [...ev.findings, finding] } : ev,
        ),
      );

      return finding;
    },
    [currentEvaluation, issueSets],
  );

  const clearFindings = useCallback(() => {
    setCurrentEvaluation((prev) => {
      if (!prev) return prev;
      return { ...prev, findings: [] };
    });
    setEvaluations((prev) =>
      prev.map((ev) => (ev.id === currentEvaluation?.id ? { ...ev, findings: [] } : ev)),
    );
  }, [currentEvaluation]);

  const endEvaluation = useCallback(() => {
    if (currentEvaluation) {
      setEvaluations((prev) =>
        prev.map((ev) =>
          ev.id === currentEvaluation.id ? { ...ev, status: 'submitted' as const } : ev,
        ),
      );
    }
    setCurrentEvaluation(null);
  }, [currentEvaluation]);

  const getEvaluationById = useCallback(
    (id: string): Evaluation | undefined => evaluations.find((ev) => ev.id === id),
    [evaluations],
  );

  const value = useMemo<IssueLoggerContextValue>(
    () => ({
      currentEvaluation,
      evaluations,
      issueSets,
      startEvaluation,
      submitFinding,
      clearFindings,
      endEvaluation,
      getEvaluationById,
    }),
    [
      currentEvaluation,
      evaluations,
      issueSets,
      startEvaluation,
      submitFinding,
      clearFindings,
      endEvaluation,
      getEvaluationById,
    ],
  );

  return <IssueLoggerContext.Provider value={value}>{children}</IssueLoggerContext.Provider>;
};

export const useIssueLogger = () => useContext(IssueLoggerContext);
