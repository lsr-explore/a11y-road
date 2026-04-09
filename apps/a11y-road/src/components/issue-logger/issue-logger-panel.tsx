'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Finding } from '../../data/evaluation-types';
import { getPageByRoute } from '../../data/page-metadata';
import { FindingsList } from './findings-list';
import { useIssueLoggerPanel } from './issue-logger-panel-provider';
import { useIssueLogger } from './issue-logger-provider';
import { WcagSelector } from './wcag-selector';

const queryPageElements = (): string[] => {
  if (typeof document === 'undefined') return [];
  const nodes = document.querySelectorAll('[data-a11y-name]');
  return [
    ...new Set(
      Array.from(nodes)
        .map((node) => node.getAttribute('data-a11y-name') ?? '')
        .filter(Boolean),
    ),
  ];
};

export const IssueLoggerPanel = () => {
  const {
    currentEvaluation,
    submitFinding,
    updateFinding,
    deleteFinding,
    startEvaluation,
    issueSets,
  } = useIssueLogger();
  const { isOpen, close } = useIssueLoggerPanel();
  const pathname = usePathname();
  const currentPage = getPageByRoute(pathname);
  const [pageElements, setPageElements] = useState<string[]>([]);
  const [elementId, setElementId] = useState('');
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers DOM re-query on navigation
  useEffect(() => {
    const timer = setTimeout(() => setPageElements(queryPageElements()), 100);
    return () => clearTimeout(timer);
  }, [pathname]);
  const [otherElement, setOtherElement] = useState('');
  const [issueType, setIssueType] = useState('');
  const [wcagCriteria, setWcagCriteria] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [editingFindingId, setEditingFindingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: 'correct' | 'partial' | 'not-found';
  } | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const justSubmittedRef = useRef(false);

  // Dismiss feedback when navigating to a different page
  // biome-ignore lint/correctness/useExhaustiveDependencies: only dismiss on page change
  useEffect(() => {
    setFeedback(null);
  }, [pathname]);

  // Dismiss feedback when a form field changes (but not right after submit clears the form)
  // biome-ignore lint/correctness/useExhaustiveDependencies: dismiss on any field change
  useEffect(() => {
    if (justSubmittedRef.current) {
      justSubmittedRef.current = false;
      return;
    }
    setFeedback(null);
  }, [elementId, otherElement, issueType, wcagCriteria, description, proposedSolution]);

  const clearForm = useCallback(() => {
    setElementId('');
    setOtherElement('');
    setIssueType('');
    setWcagCriteria([]);
    setDescription('');
    setProposedSolution('');
    setEditingFindingId(null);
  }, []);

  const handleEdit = useCallback(
    (finding: Finding) => {
      const isKnownElement = pageElements.includes(finding.elementId);
      setElementId(isKnownElement ? finding.elementId : 'other');
      if (!isKnownElement) setOtherElement(finding.elementId);
      setIssueType(finding.issueTypeId);
      setWcagCriteria(finding.wcagCriteria.split(', ').filter(Boolean));
      setDescription(finding.description);
      setProposedSolution(finding.proposedSolution ?? '');
      setEditingFindingId(finding.id);
      setFeedback(null);
    },
    [pageElements],
  );

  const setFeedbackFromResult = useCallback(
    (result: { matchResult: Finding['matchResult']; matchDetails?: { reason: string } }) => {
      const reason = result.matchDetails?.reason ?? '';
      if (result.matchResult === 'correct') {
        setFeedback({ message: 'Correct — all criteria matched.', type: 'correct' });
      } else if (result.matchResult === 'partial') {
        setFeedback({ message: `Partial match — ${reason}`, type: 'partial' });
      } else {
        setFeedback({ message: `Not found — ${reason}`, type: 'not-found' });
      }
    },
    [],
  );

  const handleSubmit = useCallback(
    (formEvent: React.FormEvent) => {
      formEvent.preventDefault();
      const resolvedElementId = elementId === 'other' ? otherElement : elementId;
      if (!resolvedElementId || !issueType) return;

      const findingData = {
        pageId: currentPage?.id ?? 'unknown',
        elementId: resolvedElementId,
        issueTypeId: issueType,
        wcagCriteria: wcagCriteria.join(', '),
        description,
        proposedSolution: proposedSolution || undefined,
      };

      if (editingFindingId) {
        const updated = updateFinding(editingFindingId, findingData);
        if (updated) {
          setFeedbackFromResult(updated);
        }
      } else {
        const finding = submitFinding(findingData);
        setFeedbackFromResult(finding);
      }

      justSubmittedRef.current = true;
      clearForm();
    },
    [
      elementId,
      otherElement,
      issueType,
      wcagCriteria,
      description,
      proposedSolution,
      editingFindingId,
      submitFinding,
      updateFinding,
      currentPage,
      clearForm,
      setFeedbackFromResult,
    ],
  );

  const handleStartEvaluation = () => {
    const defaultSet = issueSets[0];
    if (defaultSet) {
      startEvaluation(defaultSet.id, 'tester');
    }
  };

  const findingsCount = currentEvaluation?.findings.length ?? 0;

  if (!isOpen) return null;

  return (
    <aside
      className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto flex flex-col"
      aria-label="Issue logger"
    >
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">
          Issue Logger
          {findingsCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              {findingsCount}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={close}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close issue logger"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {!currentEvaluation ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-600 mb-4">
              Start an evaluation to begin logging accessibility issues.
            </p>
            <button
              type="button"
              onClick={handleStartEvaluation}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Start Evaluation
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-700">Page:</span>{' '}
                {currentPage?.name ?? 'Unknown page'}
              </p>
              <div>
                <label
                  htmlFor="element-select"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Element
                </label>
                <select
                  id="element-select"
                  value={elementId}
                  onChange={(ev) => setElementId(ev.target.value)}
                  required
                  className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select element...</option>
                  {pageElements.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                  <option value="other">Other (describe below)</option>
                </select>
              </div>

              {elementId === 'other' && (
                <div>
                  <label
                    htmlFor="other-element"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Describe Element
                  </label>
                  <input
                    id="other-element"
                    type="text"
                    value={otherElement}
                    onChange={(ev) => setOtherElement(ev.target.value)}
                    required
                    placeholder="e.g. hero image, main navigation..."
                    className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="issue-type-input"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Issue Type
                </label>
                <input
                  id="issue-type-input"
                  type="text"
                  value={issueType}
                  onChange={(ev) => setIssueType(ev.target.value)}
                  required
                  placeholder="Describe the type of issue..."
                  className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <WcagSelector selected={wcagCriteria} onChange={setWcagCriteria} />

              <div>
                <label
                  htmlFor="finding-description"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="finding-description"
                  value={description}
                  onChange={(ev) => setDescription(ev.target.value)}
                  rows={2}
                  className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Describe the issue..."
                />
              </div>

              <div>
                <label
                  htmlFor="proposed-solution"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Proposed Solution
                </label>
                <textarea
                  id="proposed-solution"
                  value={proposedSolution}
                  onChange={(ev) => setProposedSolution(ev.target.value)}
                  rows={2}
                  className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="How would you fix this issue?"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {editingFindingId ? 'Update Finding' : 'Submit Finding'}
                </button>
                {editingFindingId && (
                  <button
                    type="button"
                    onClick={clearForm}
                    className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {feedback && (
              <div
                ref={statusRef}
                role="status"
                className={`mt-3 rounded-md p-3 text-sm flex items-start justify-between gap-2 ${
                  feedback.type === 'correct'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : feedback.type === 'partial'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <span>{feedback.message}</span>
                <button
                  type="button"
                  onClick={() => setFeedback(null)}
                  className="shrink-0 opacity-60 hover:opacity-100"
                  aria-label="Dismiss feedback"
                >
                  &times;
                </button>
              </div>
            )}

            <FindingsList
              findings={currentEvaluation.findings.filter(
                (finding) => !currentPage || finding.pageId === currentPage.id,
              )}
              onEdit={handleEdit}
              onDelete={deleteFinding}
            />
          </>
        )}
      </div>
    </aside>
  );
};
