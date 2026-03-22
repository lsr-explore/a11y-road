'use client';

import type { A11yIssueDefinition, TestingMethod } from '@a11y-road/a11y-kit';
import { testingMethodLabels } from '@a11y-road/a11y-kit';
import { useCallback, useEffect, useRef, useState } from 'react';
import wcagCriteriaData from '../../data/wcag-criteria.json';
import { useAdminData } from './admin-data-provider';

type WcagCriterion = { id: string; title: string; level: 'A' | 'AA' | 'AAA' };

const allTestingMethods = Object.keys(testingMethodLabels) as TestingMethod[];

const emptyDefinition: A11yIssueDefinition = {
  id: '',
  title: '',
  description: '',
  wcagCriteria: [],
  impactedUsers: [],
  tags: [],
  testingMethods: [],
};

const WcagCriteriaSelector = ({
  selected,
  onChange,
}: {
  selected: WcagCriterion[];
  onChange: (criteria: WcagCriterion[]) => void;
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

  const selectedIds = new Set(selected.map((wc) => wc.id));

  const filtered = (wcagCriteriaData as WcagCriterion[]).filter(
    (wc) => wc.id.includes(search) || wc.title.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleCriterion = (wc: WcagCriterion) => {
    if (selectedIds.has(wc.id)) {
      onChange(selected.filter((item) => item.id !== wc.id));
    } else {
      onChange([...selected, { id: wc.id, title: wc.title, level: wc.level }]);
    }
  };

  const removeCriterion = (wcId: string) => {
    onChange(selected.filter((item) => item.id !== wcId));
  };

  return (
    <div ref={panelRef} className="relative">
      <span className="block text-xs font-medium text-gray-700 mb-1" id="wcag-criteria-label">
        WCAG Criteria
      </span>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {selected.map((wc) => (
            <span
              key={wc.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-800"
            >
              {wc.id} {wc.title}
              <button
                type="button"
                onClick={() => removeCriterion(wc.id)}
                className="hover:text-indigo-600"
                aria-label={`Remove ${wc.id} ${wc.title}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm text-left bg-white hover:bg-gray-50"
        aria-expanded={isOpen}
        aria-labelledby="wcag-criteria-label"
      >
        {selected.length === 0 ? 'Select WCAG criteria...' : 'Add more criteria...'}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-2 border-b border-gray-100">
            <label htmlFor="wcag-search" className="sr-only">
              Search WCAG criteria
            </label>
            <input
              id="wcag-search"
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
                className="flex items-center gap-2 px-2 py-1 text-sm hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(wc.id)}
                  onChange={() => toggleCriterion(wc)}
                />
                <span className="font-mono text-xs text-gray-500">{wc.id}</span>
                <span className="truncate">{wc.title}</span>
                <span className="ml-auto text-xs text-gray-400">{wc.level}</span>
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

const TestingMethodsSelector = ({
  selected,
  onChange,
}: {
  selected: TestingMethod[];
  onChange: (methods: TestingMethod[]) => void;
}) => {
  const toggle = (method: TestingMethod) => {
    if (selected.includes(method)) {
      onChange(selected.filter((item) => item !== method));
    } else {
      onChange([...selected, method]);
    }
  };

  return (
    <fieldset>
      <legend className="text-xs font-medium text-gray-700 mb-1">Testing Methods</legend>
      <div className="space-y-1 border border-gray-200 rounded-md p-2 bg-white">
        {allTestingMethods.map((method) => {
          const info = testingMethodLabels[method];
          const inputId = `method-${method}`;
          return (
            <div key={method} className="flex items-start gap-2 text-sm">
              <input
                id={inputId}
                type="checkbox"
                checked={selected.includes(method)}
                onChange={() => toggle(method)}
                className="mt-0.5"
              />
              <label htmlFor={inputId}>
                <span className="font-medium cursor-pointer">{info.label}</span>
                <span className="block text-xs text-gray-500">{info.description}</span>
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};

interface DefinitionFormProps {
  definition: A11yIssueDefinition;
  onSave: (definition: A11yIssueDefinition) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const DefinitionForm = ({ definition, onSave, onCancel, isNew = false }: DefinitionFormProps) => {
  const [form, setForm] = useState(definition);
  const [tagsInput, setTagsInput] = useState(definition.tags.join(', '));
  const [impactedInput, setImpactedInput] = useState(definition.impactedUsers.join(', '));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({
      ...form,
      tags: tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      impactedUsers: impactedInput
        .split(',')
        .map((user) => user.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 rounded-md">
      {isNew ? (
        <div>
          <label htmlFor="def-id" className="block text-xs font-medium text-gray-700">
            ID
          </label>
          <input
            id="def-id"
            type="text"
            value={form.id}
            onChange={(ev) => setForm((prev) => ({ ...prev, id: ev.target.value }))}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
      ) : (
        <p className="text-xs text-gray-500">
          <span className="font-medium text-gray-700">ID:</span>{' '}
          <span className="font-mono">{form.id}</span>
        </p>
      )}
      <div>
        <label htmlFor="def-title" className="block text-xs font-medium text-gray-700">
          Title
        </label>
        <input
          id="def-title"
          type="text"
          value={form.title}
          onChange={(ev) => setForm((prev) => ({ ...prev, title: ev.target.value }))}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label htmlFor="def-desc" className="block text-xs font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="def-desc"
          value={form.description}
          onChange={(ev) => setForm((prev) => ({ ...prev, description: ev.target.value }))}
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
      </div>
      <WcagCriteriaSelector
        selected={form.wcagCriteria}
        onChange={(criteria) => setForm((prev) => ({ ...prev, wcagCriteria: criteria }))}
      />
      <div>
        <label htmlFor="def-impacted" className="block text-xs font-medium text-gray-700">
          Impacted Users (comma-separated)
        </label>
        <input
          id="def-impacted"
          type="text"
          value={impactedInput}
          onChange={(ev) => setImpactedInput(ev.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label htmlFor="def-tags" className="block text-xs font-medium text-gray-700">
          Tags (comma-separated)
        </label>
        <input
          id="def-tags"
          type="text"
          value={tagsInput}
          onChange={(ev) => setTagsInput(ev.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
      </div>
      <TestingMethodsSelector
        selected={form.testingMethods}
        onChange={(methods) => setForm((prev) => ({ ...prev, testingMethods: methods }))}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          {isNew ? 'Add' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export const AdminDefinitionsTable = () => {
  const { definitions, addDefinition, updateDefinition, deleteDefinition } = useAdminData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const showBanner = (message: string) => {
    setBanner(message);
    setTimeout(() => setBanner(null), 3000);
  };

  const handleSaveNew = (definition: A11yIssueDefinition) => {
    addDefinition(definition);
    setIsAdding(false);
    showBanner(`Added definition "${definition.title}"`);
  };

  const handleSaveEdit = (definition: A11yIssueDefinition) => {
    updateDefinition(definition.id, definition);
    setEditingId(null);
    showBanner(`Updated definition "${definition.title}"`);
  };

  const handleDelete = (definition: A11yIssueDefinition) => {
    deleteDefinition(definition.id);
    showBanner(`Deleted definition "${definition.title}"`);
  };

  return (
    <div>
      {banner && (
        <div
          role="status"
          className="mb-4 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800"
        >
          {banner}
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Issue Definitions</h2>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Add Definition
        </button>
      </div>

      {isAdding && (
        <div className="mb-4">
          <DefinitionForm
            definition={emptyDefinition}
            onSave={handleSaveNew}
            onCancel={() => setIsAdding(false)}
            isNew
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="py-2 pr-4 font-medium text-gray-700">Title</th>
              <th className="py-2 pr-4 font-medium text-gray-700">WCAG</th>
              <th className="py-2 pr-4 font-medium text-gray-700">Methods</th>
              <th className="py-2 pr-4 font-medium text-gray-700">Tags</th>
              <th className="py-2 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {definitions.map((definition) => (
              <tr key={definition.id} className="border-b border-gray-100">
                {editingId === definition.id ? (
                  <td colSpan={5} className="py-2">
                    <DefinitionForm
                      definition={definition}
                      onSave={handleSaveEdit}
                      onCancel={() => setEditingId(null)}
                    />
                  </td>
                ) : (
                  <>
                    <td className="py-2 pr-4">
                      <span className="font-medium">{definition.title}</span>
                      <br />
                      <span className="text-xs text-gray-500 font-mono">{definition.id}</span>
                    </td>
                    <td className="py-2 pr-4 text-xs text-gray-600">
                      {definition.wcagCriteria.map((wc) => wc.id).join(', ')}
                    </td>
                    <td className="py-2 pr-4 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {definition.testingMethods.map((method) => (
                          <span
                            key={method}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-700"
                          >
                            {testingMethodLabels[method].label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {definition.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(definition.id)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(definition)}
                          className="text-xs text-red-600 hover:text-red-800 underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
