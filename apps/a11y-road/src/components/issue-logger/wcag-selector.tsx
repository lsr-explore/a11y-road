'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import wcagCriteriaData from '../../data/wcag-criteria.json';

type WcagCriterion = { id: string; title: string; level: 'A' | 'AA' | 'AAA' };

export const WcagSelector = ({
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
