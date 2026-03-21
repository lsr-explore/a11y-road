'use client';

import { useCallback, useRef, useState } from 'react';
import { issueDefinitions, registry } from '../../data/issues-registry';
import { FindingsList } from './findings-list';
import { useIssueLogger } from './issue-logger-provider';

const allInstances = registry.getInstances();

export const IssueLoggerPanel = () => {
  const { currentEvaluation, submitFinding, startEvaluation, issueSets } = useIssueLogger();
  const [elementId, setElementId] = useState('');
  const [issueTypeId, setIssueTypeId] = useState('');
  const [wcagCriteria, setWcagCriteria] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState<{
    message: string;
    type: 'correct' | 'partial' | 'not-found';
  } | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const handleIssueTypeChange = (value: string) => {
    setIssueTypeId(value);
    const definition = issueDefinitions.find((def) => def.id === value);
    if (definition) {
      setWcagCriteria(definition.wcagCriteria.map((wc) => wc.id).join(', '));
    }
  };

  const handleSubmit = useCallback(
    (formEvent: React.FormEvent) => {
      formEvent.preventDefault();
      if (!elementId || !issueTypeId) return;

      const finding = submitFinding({
        elementId,
        issueTypeId,
        wcagCriteria,
        description,
      });

      const definition = issueDefinitions.find((def) => def.id === issueTypeId);
      if (finding.matchResult === 'correct') {
        setFeedback({
          message: `Correct — matches known issue "${definition?.title}" on this element.`,
          type: 'correct',
        });
      } else if (finding.matchResult === 'partial') {
        setFeedback({
          message: `Partial match — related to a known issue but not an exact match.`,
          type: 'partial',
        });
      } else {
        setFeedback({
          message: 'Not found in the current issue set.',
          type: 'not-found',
        });
      }

      setElementId('');
      setIssueTypeId('');
      setWcagCriteria('');
      setDescription('');
    },
    [elementId, issueTypeId, wcagCriteria, description, submitFinding],
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
                  <option value="">Select element…</option>
                  {allInstances.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.id} ({inst.pageId})
                    </option>
                  ))}
                  <option value="other">Other (manual)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="issue-type-select"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Issue Type
                </label>
                <select
                  id="issue-type-select"
                  value={issueTypeId}
                  onChange={(ev) => handleIssueTypeChange(ev.target.value)}
                  required
                  className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select issue type…</option>
                  {issueDefinitions.map((def) => (
                    <option key={def.id} value={def.id}>
                      {def.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="wcag-criteria"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  WCAG Criteria
                </label>
                <input
                  id="wcag-criteria"
                  type="text"
                  value={wcagCriteria}
                  onChange={(ev) => setWcagCriteria(ev.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. 1.1.1"
                />
              </div>

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
                  placeholder="Describe the issue…"
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
