'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { registry } from '../../data/issues-registry';
import { getPageByRoute } from '../../data/page-metadata';
import wcagCriteriaData from '../../data/wcag-criteria.json';
import { FindingsList } from './findings-list';
import { useIssueLogger } from './issue-logger-provider';

type WcagCriterion = { id: string; title: string; level: 'A' | 'AA' | 'AAA' };

const allInstances = registry.getInstances();

const WcagSelector = ({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (criteria: string[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClickOutside]);

  const allCriteria = wcagCriteriaData as WcagCriterion[];
  const filtered = allCriteria.filter(
    (wc) => wc.id.includes(search) || wc.title.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleCriterion = (wcId: string) => {
    if (selected.includes(wcId)) {
      onChange(selected.filter((id) => id !== wcId));
    } else {
      onChange([...selected, wcId]);
    }
  };

  return (
    <div ref={panelRef} className="relative">
      <label htmlFor="wcag-picker-trigger" className="block text-xs font-medium text-gray-700 mb-1">
        WCAG Criteria
      </label>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {selected.map((wcId) => {
            const wc = allCriteria.find((item) => item.id === wcId);
            return (
              <span
                key={wcId}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-800"
              >
                {wcId} {wc?.title ?? ''}
                <button
                  type="button"
                  onClick={() => toggleCriterion(wcId)}
                  className="hover:text-indigo-600"
                  aria-label={`Remove ${wcId}`}
                >
                  &times;
                </button>
              </span>
            );
          })}
        </div>
      )}
      <button
        id="wcag-picker-trigger"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm text-left bg-white hover:bg-gray-50 shadow-sm"
        aria-expanded={isOpen}
      >
        {selected.length === 0 ? 'Select WCAG criteria...' : 'Add more...'}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-2 border-b border-gray-100">
            <label htmlFor="wcag-logger-search" className="sr-only">
              Search WCAG criteria
            </label>
            <input
              id="wcag-logger-search"
              type="search"
              value={search}
              onChange={(ev) => setSearch(ev.target.value)}
              placeholder="Search by ID or title..."
              className="block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
            />
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {filtered.map((wc) => (
              <label
                key={wc.id}
                htmlFor={`wcag-log-${wc.id}`}
                className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  id={`wcag-log-${wc.id}`}
                  type="checkbox"
                  checked={selected.includes(wc.id)}
                  onChange={() => toggleCriterion(wc.id)}
                />
                <span className="font-mono text-gray-500">{wc.id}</span>
                <span className="truncate">{wc.title}</span>
              </label>
            ))}
            {filtered.length === 0 && (
              <p className="px-2 py-1 text-sm text-gray-500">No matching criteria</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const IssueLoggerPanel = () => {
  const { currentEvaluation, submitFinding, startEvaluation, issueSets } = useIssueLogger();
  const pathname = usePathname();
  const currentPage = getPageByRoute(pathname);
  const [elementId, setElementId] = useState('');
  const [otherElement, setOtherElement] = useState('');
  const [issueType, setIssueType] = useState('');
  const [wcagCriteria, setWcagCriteria] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [feedback, setFeedback] = useState<{
    message: string;
    type: 'correct' | 'partial' | 'not-found';
  } | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(
    (formEvent: React.FormEvent) => {
      formEvent.preventDefault();
      const resolvedElementId = elementId === 'other' ? otherElement : elementId;
      if (!resolvedElementId || !issueType) return;

      const finding = submitFinding({
        pageId: currentPage?.id ?? 'unknown',
        elementId: resolvedElementId,
        issueTypeId: issueType,
        wcagCriteria: wcagCriteria.join(', '),
        description,
        proposedSolution: proposedSolution || undefined,
      });

      const reason = finding.matchDetails?.reason ?? '';
      if (finding.matchResult === 'correct') {
        setFeedback({
          message: 'Correct — all criteria matched.',
          type: 'correct',
        });
      } else if (finding.matchResult === 'partial') {
        setFeedback({
          message: `Partial match — ${reason}`,
          type: 'partial',
        });
      } else {
        setFeedback({
          message: `Not found — ${reason}`,
          type: 'not-found',
        });
      }

      setElementId('');
      setOtherElement('');
      setIssueType('');
      setWcagCriteria([]);
      setDescription('');
      setProposedSolution('');
    },
    [
      elementId,
      otherElement,
      issueType,
      wcagCriteria,
      description,
      proposedSolution,
      submitFinding,
      currentPage,
    ],
  );

  const handleStartEvaluation = () => {
    const defaultSet = issueSets[0];
    if (defaultSet) {
      startEvaluation(defaultSet.id, 'tester');
    }
  };

  const findingsCount = currentEvaluation?.findings.length ?? 0;

  return (
    <aside
      className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto flex flex-col"
      aria-label="Issue logger"
    >
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-sm font-semibold text-gray-900">
          Issue Logger
          {findingsCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              {findingsCount}
            </span>
          )}
        </h2>
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
                  {allInstances.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.id} ({inst.pageId})
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

              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Submit Finding
              </button>
            </form>

            {feedback && (
              <div
                ref={statusRef}
                role="status"
                className={`mt-3 rounded-md p-3 text-sm ${
                  feedback.type === 'correct'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : feedback.type === 'partial'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <FindingsList findings={currentEvaluation.findings} />
          </>
        )}
      </div>
    </aside>
  );
};
