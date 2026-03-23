'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Finding } from '../../data/evaluation-types';
import wcagCriteriaData from '../../data/wcag-criteria.json';

type WcagCriterion = { id: string; title: string; level: 'A' | 'AA' | 'AAA' };

const DialogWcagSelector = ({
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
      <label htmlFor="dialog-wcag-picker" className="block text-sm font-medium text-gray-700 mb-1">
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
        id="dialog-wcag-picker"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-left bg-white hover:bg-gray-50 shadow-sm"
        aria-expanded={isOpen}
      >
        {selected.length === 0 ? 'Select WCAG criteria...' : 'Add more...'}
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-2 border-b border-gray-100">
            <label htmlFor="dialog-wcag-search" className="sr-only">
              Search WCAG criteria
            </label>
            <input
              id="dialog-wcag-search"
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
                htmlFor={`dialog-wcag-${wc.id}`}
                className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  id={`dialog-wcag-${wc.id}`}
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

interface EditFindingDialogProps {
  finding: Finding;
  onSave: (
    findingId: string,
    updates: Omit<
      Finding,
      'id' | 'timestamp' | 'matchResult' | 'matchedInstanceId' | 'matchDetails'
    >,
  ) => void;
  onClose: () => void;
}

export const EditFindingDialog = ({ finding, onSave, onClose }: EditFindingDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [elementId, setElementId] = useState(finding.elementId);
  const [issueType, setIssueType] = useState(finding.issueTypeId);
  const [wcagCriteria, setWcagCriteria] = useState<string[]>(
    finding.wcagCriteria.split(', ').filter(Boolean),
  );
  const [description, setDescription] = useState(finding.description);
  const [proposedSolution, setProposedSolution] = useState(finding.proposedSolution ?? '');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const handleSubmit = (formEvent: React.FormEvent) => {
    formEvent.preventDefault();
    if (!elementId || !issueType) return;

    onSave(finding.id, {
      pageId: finding.pageId,
      elementId,
      issueTypeId: issueType,
      wcagCriteria: wcagCriteria.join(', '),
      description,
      proposedSolution: proposedSolution || undefined,
    });
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="w-full max-w-lg rounded-lg border border-gray-200 shadow-xl p-0 backdrop:bg-black/50"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Finding</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          <span className="font-medium text-gray-700">Page:</span> {finding.pageId}
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="edit-element" className="block text-sm font-medium text-gray-700 mb-1">
              Element
            </label>
            <input
              id="edit-element"
              type="text"
              value={elementId}
              onChange={(ev) => setElementId(ev.target.value)}
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="edit-issue-type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Issue Type
            </label>
            <input
              id="edit-issue-type"
              type="text"
              value={issueType}
              onChange={(ev) => setIssueType(ev.target.value)}
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <DialogWcagSelector selected={wcagCriteria} onChange={setWcagCriteria} />

          <div>
            <label
              htmlFor="edit-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              rows={3}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="edit-proposed-solution"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Proposed Solution
            </label>
            <textarea
              id="edit-proposed-solution"
              value={proposedSolution}
              onChange={(ev) => setProposedSolution(ev.target.value)}
              rows={3}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </dialog>
  );
};
