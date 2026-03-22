'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Evaluation, Finding, IssueSet, MatchDetails } from '../../data/evaluation-types';
import defaultIssueSets from '../../data/issue-sets.json';
import { issueDefinitions, registry } from '../../data/issues-registry';

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

const parseWcagIds = (criteria: string): string[] =>
  criteria
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const matchFinding = (
  finding: Omit<Finding, 'id' | 'timestamp' | 'matchResult' | 'matchedInstanceId' | 'matchDetails'>,
  issueSet: IssueSet,
): {
  matchResult: Finding['matchResult'];
  matchedInstanceId?: string;
  matchDetails: MatchDetails;
} => {
  const allInstances = registry.getInstances();
  const setInstances = issueSet.instanceIds.includes('all')
    ? allInstances
    : allInstances.filter((inst) => issueSet.instanceIds.includes(inst.id));

  const findingWcag = parseWcagIds(finding.wcagCriteria);

  // Find the best matching instance
  for (const inst of setInstances) {
    const pageMatched = inst.pageId === finding.pageId;
    const elementMatched = inst.id === finding.elementId;

    if (!elementMatched) continue;

    const definition = issueDefinitions.find((def) => def.id === inst.issueId);
    const expectedWcag = definition?.wcagCriteria.map((wc) => wc.id) ?? [];
    const wcagMatched =
      findingWcag.length > 0 && findingWcag.some((wcId) => expectedWcag.includes(wcId));

    if (pageMatched && elementMatched && wcagMatched) {
      return {
        matchResult: 'correct',
        matchedInstanceId: inst.id,
        matchDetails: { pageMatched, elementMatched, wcagMatched, reason: 'All criteria matched' },
      };
    }

    if (pageMatched && elementMatched) {
      return {
        matchResult: 'partial',
        matchedInstanceId: inst.id,
        matchDetails: {
          pageMatched,
          elementMatched,
          wcagMatched,
          reason: `Element matched but WCAG criteria did not (expected: ${expectedWcag.join(', ')})`,
        },
      };
    }
  }

  // Check for page-only matches (element on right page but wrong element selected)
  const pageMatch = setInstances.find((inst) => inst.pageId === finding.pageId);
  if (pageMatch) {
    return {
      matchResult: 'not-found',
      matchedInstanceId: undefined,
      matchDetails: {
        pageMatched: true,
        elementMatched: false,
        wcagMatched: false,
        reason: 'Page matched but element did not match any known issue',
      },
    };
  }

  return {
    matchResult: 'not-found',
    matchedInstanceId: undefined,
    matchDetails: {
      pageMatched: false,
      elementMatched: false,
      wcagMatched: false,
      reason: 'No matching issue found',
    },
  };
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
    (
      input: Omit<
        Finding,
        'id' | 'timestamp' | 'matchResult' | 'matchedInstanceId' | 'matchDetails'
      >,
    ): Finding => {
      const issueSet =
        issueSets.find((set) => set.id === currentEvaluation?.issueSetId) ??
        (issueSets[0] as IssueSet);
      const { matchResult, matchedInstanceId, matchDetails } = matchFinding(input, issueSet);

      const finding: Finding = {
        ...input,
        id: `finding-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: new Date().toISOString(),
        matchResult,
        matchedInstanceId,
        matchDetails,
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
          ev.id === currentEvaluation.id
            ? { ...ev, status: 'submitted' as const, submittedAt: new Date().toISOString() }
            : ev,
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
