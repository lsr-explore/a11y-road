'use client';

import { Badge, Button } from '@a11y-road/a11y-ui';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FindingsList } from '@/components/issue-logger/findings-list';
import { useIssueLogger } from '@/components/issue-logger/issue-logger-provider';
import { WcagSelector } from '@/components/issue-logger/wcag-selector';
import type { Finding, ImpactedUser, Severity, ToolUsed } from '@/data/evaluation-types';
import { impactedUserOptions, severityOptions, toolUsedOptions } from '@/data/evaluation-types';
import {
  getDescriptionsForCriteria,
  getFixesForDescriptions,
  issueDescriptions,
} from '@/data/issue-descriptions';
import { pageElements } from '@/data/page-elements';
import { pages } from '@/data/page-metadata';

/* ------------------------------------------------------------------ */
/*  Reusable multi-select dropdown                                     */
/* ------------------------------------------------------------------ */

interface MultiSelectDropdownProps {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const MultiSelectDropdown = ({
  id,
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select...',
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClickOutside]);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={`${id}-trigger`} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            return (
              <Badge key={value} variant="secondary" className="gap-1 text-xs">
                {option?.label ?? value}
                <button
                  type="button"
                  onClick={() => toggle(value)}
                  className="ml-0.5 hover:text-foreground/80"
                  aria-label={`Remove ${option?.label ?? value}`}
                >
                  &times;
                </button>
              </Badge>
            );
          })}
        </div>
      )}
      <button
        id={`${id}-trigger`}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-expanded={isOpen}
      >
        <span className={selected.length === 0 ? 'text-muted-foreground' : ''}>
          {selected.length === 0 ? placeholder : `${selected.length} selected`}
        </span>
        <svg
          className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-56 overflow-y-auto">
          <fieldset>
            <legend className="sr-only">{label}</legend>
            {options.map((option) => (
              <label
                key={option.value}
                htmlFor={`${id}-${option.value}`}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
              >
                <input
                  id={`${id}-${option.value}`}
                  type="checkbox"
                  checked={selected.includes(option.value)}
                  onChange={() => toggle(option.value)}
                  className="rounded border-gray-300"
                />
                {option.label}
              </label>
            ))}
            {options.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-500">No options available</p>
            )}
          </fieldset>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

const LogIssuePage = () => {
  const {
    currentEvaluation,
    submitFinding,
    updateFinding,
    deleteFinding,
    startEvaluation,
    issueSets,
  } = useIssueLogger();

  // Form state
  const [selectedPageId, setSelectedPageId] = useState('');
  const [selectedElement, setSelectedElement] = useState('');
  const [wcagCriteria, setWcagCriteria] = useState<string[]>([]);
  const [severity, setSeverity] = useState<Severity | ''>('');
  const [impactedUsers, setImpactedUsers] = useState<ImpactedUser[]>([]);
  const [selectedDescriptions, setSelectedDescriptions] = useState<string[]>([]);
  const [selectedFixes, setSelectedFixes] = useState<string[]>([]);
  const [toolsUsed, setToolsUsed] = useState<ToolUsed[]>([]);
  const [editingFindingId, setEditingFindingId] = useState<string | null>(null);

  // Feedback state
  const [feedback, setFeedback] = useState<{
    message: string;
    type: 'correct' | 'partial' | 'not-found';
  } | null>(null);
  const justSubmittedRef = useRef(false);

  // Derived data
  const elements = useMemo(
    () => (selectedPageId ? (pageElements[selectedPageId] ?? []) : []),
    [selectedPageId],
  );

  const availableDescriptions = useMemo(
    () =>
      getDescriptionsForCriteria(wcagCriteria).map((desc) => ({
        value: desc.id,
        label: desc.description,
      })),
    [wcagCriteria],
  );

  const availableFixes = useMemo(() => {
    const fixes = getFixesForDescriptions(selectedDescriptions);
    return fixes.map((fix) => ({ value: fix, label: fix }));
  }, [selectedDescriptions]);

  // Cascading resets — reset downstream fields when upstream selection changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional cascade on page change
  useEffect(() => {
    setSelectedElement('');
  }, [selectedPageId]);

  useEffect(() => {
    setSelectedDescriptions((prev) => {
      const validIds = new Set(availableDescriptions.map((desc) => desc.value));
      const filtered = prev.filter((id) => validIds.has(id));
      return filtered.length === prev.length ? prev : filtered;
    });
  }, [availableDescriptions]);

  useEffect(() => {
    setSelectedFixes((prev) => {
      const validFixes = new Set(availableFixes.map((fix) => fix.value));
      const filtered = prev.filter((fix) => validFixes.has(fix));
      return filtered.length === prev.length ? prev : filtered;
    });
  }, [availableFixes]);

  // Dismiss feedback on field change (but not right after submit)
  // biome-ignore lint/correctness/useExhaustiveDependencies: dismiss on any field change
  useEffect(() => {
    if (justSubmittedRef.current) {
      justSubmittedRef.current = false;
      return;
    }
    setFeedback(null);
  }, [
    selectedPageId,
    selectedElement,
    wcagCriteria,
    severity,
    selectedDescriptions,
    selectedFixes,
  ]);

  const clearForm = useCallback(() => {
    setSelectedPageId('');
    setSelectedElement('');
    setWcagCriteria([]);
    setSeverity('');
    setImpactedUsers([]);
    setSelectedDescriptions([]);
    setSelectedFixes([]);
    setToolsUsed([]);
    setEditingFindingId(null);
  }, []);

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

  const handleEdit = useCallback((finding: Finding) => {
    setSelectedPageId(finding.pageId);
    // Delay element set so the cascading reset from page change runs first
    setTimeout(() => {
      setSelectedElement(finding.elementId);
    }, 0);
    setWcagCriteria(finding.wcagCriteria.split(', ').filter(Boolean));
    setSeverity(finding.severity ?? '');
    setImpactedUsers(finding.impactedUsers ?? []);
    setSelectedDescriptions(finding.issueDescriptions ?? []);
    setSelectedFixes(finding.fixDescriptions ?? []);
    setToolsUsed(finding.toolsUsed ?? []);
    setEditingFindingId(finding.id);
    setFeedback(null);
  }, []);

  const handleSubmit = useCallback(
    (formEvent: React.FormEvent) => {
      formEvent.preventDefault();
      if (!selectedPageId || !selectedElement) return;

      const descriptionText = selectedDescriptions
        .map((id) => issueDescriptions.find((desc) => desc.id === id)?.description)
        .filter(Boolean)
        .join('; ');

      const fixText = selectedFixes.join('; ');

      const findingData = {
        pageId: selectedPageId,
        elementId: selectedElement,
        issueTypeId: descriptionText || 'Unspecified',
        wcagCriteria: wcagCriteria.join(', '),
        description: descriptionText,
        proposedSolution: fixText || undefined,
        severity: severity || undefined,
        impactedUsers: impactedUsers.length > 0 ? impactedUsers : undefined,
        issueDescriptions: selectedDescriptions.length > 0 ? selectedDescriptions : undefined,
        fixDescriptions: selectedFixes.length > 0 ? selectedFixes : undefined,
        toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined,
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
      selectedPageId,
      selectedElement,
      wcagCriteria,
      severity,
      impactedUsers,
      selectedDescriptions,
      selectedFixes,
      toolsUsed,
      editingFindingId,
      submitFinding,
      updateFinding,
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

  const pageFindings = useMemo(
    () =>
      currentEvaluation?.findings.filter(
        (finding) => !selectedPageId || finding.pageId === selectedPageId,
      ) ?? [],
    [currentEvaluation, selectedPageId],
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Log an Issue</h1>
      <p className="text-sm text-gray-600 mb-8">
        Document accessibility issues found during your evaluation.
      </p>

      {!currentEvaluation ? (
        <div className="text-center py-12 rounded-lg border border-gray-200 bg-white">
          <p className="text-sm text-gray-600 mb-4">
            Start an evaluation to begin logging accessibility issues.
          </p>
          <Button onClick={handleStartEvaluation}>Start Evaluation</Button>
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-lg border border-gray-200 bg-white p-4 sm:p-6"
          >
            {/* Row 1: Page + Element (side by side on larger screens) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="page-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Page
                </label>
                <select
                  id="page-select"
                  value={selectedPageId}
                  onChange={(ev) => setSelectedPageId(ev.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a page...</option>
                  {pages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="element-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Element
                </label>
                <select
                  id="element-select"
                  value={selectedElement}
                  onChange={(ev) => setSelectedElement(ev.target.value)}
                  required
                  disabled={!selectedPageId}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {selectedPageId ? 'Select an element...' : 'Select a page first'}
                  </option>
                  {elements.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: WCAG Criteria + Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <WcagSelector selected={wcagCriteria} onChange={setWcagCriteria} />

              <div>
                <label
                  htmlFor="severity-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Severity
                </label>
                <select
                  id="severity-select"
                  value={severity}
                  onChange={(ev) => setSeverity(ev.target.value as Severity)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select severity...</option>
                  {severityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Who is impacted */}
            <MultiSelectDropdown
              id="impacted-users"
              label="Who is impacted"
              options={impactedUserOptions.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              selected={impactedUsers}
              onChange={(values) => setImpactedUsers(values as ImpactedUser[])}
              placeholder="Select impacted users..."
            />

            {/* Row 4: Describe the issue */}
            <MultiSelectDropdown
              id="issue-descriptions"
              label="Describe the issue"
              options={availableDescriptions}
              selected={selectedDescriptions}
              onChange={setSelectedDescriptions}
              placeholder={
                wcagCriteria.length === 0
                  ? 'Select WCAG criteria first to filter issues...'
                  : 'Select issue descriptions...'
              }
            />

            {/* Row 5: Describe the fix */}
            <MultiSelectDropdown
              id="fix-descriptions"
              label="Describe the fix"
              options={availableFixes}
              selected={selectedFixes}
              onChange={setSelectedFixes}
              placeholder={
                selectedDescriptions.length === 0
                  ? 'Select an issue description first...'
                  : 'Select fix descriptions...'
              }
            />

            {/* Row 6: Tools used */}
            <MultiSelectDropdown
              id="tools-used"
              label="Tools used"
              options={toolUsedOptions.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              selected={toolsUsed}
              onChange={(values) => setToolsUsed(values as ToolUsed[])}
              placeholder="Select tools used..."
            />

            {/* Submit / Cancel */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="submit" className="sm:flex-none">
                {editingFindingId ? 'Update Finding' : 'Submit Finding'}
              </Button>
              {editingFindingId && (
                <Button type="button" variant="outline" onClick={clearForm}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>

          {/* Feedback */}
          {feedback && (
            <div
              role="status"
              className={`mt-4 rounded-md p-4 text-sm flex items-start justify-between gap-2 ${
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

          {/* Findings list */}
          <div className="mt-6">
            <FindingsList findings={pageFindings} onEdit={handleEdit} onDelete={deleteFinding} />
          </div>
        </>
      )}
    </div>
  );
};

export default LogIssuePage;
