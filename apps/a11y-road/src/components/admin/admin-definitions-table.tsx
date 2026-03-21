'use client';

import type { A11yIssueDefinition } from '@a11y-road/a11y-kit';
import { useState } from 'react';
import { useAdminData } from './admin-data-provider';

const emptyDefinition: A11yIssueDefinition = {
  id: '',
  title: '',
  description: '',
  wcagCriteria: [],
  impactedUsers: [],
  tags: [],
  testingMethod: 'manual',
};

interface DefinitionFormProps {
  definition: A11yIssueDefinition;
  onSave: (definition: A11yIssueDefinition) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const DefinitionForm = ({ definition, onSave, onCancel, isNew = false }: DefinitionFormProps) => {
  const [form, setForm] = useState(definition);
  const [wcagInput, setWcagInput] = useState(
    definition.wcagCriteria.map((wc) => `${wc.id}:${wc.title}:${wc.level}`).join(', '),
  );
  const [tagsInput, setTagsInput] = useState(definition.tags.join(', '));
  const [impactedInput, setImpactedInput] = useState(definition.impactedUsers.join(', '));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const wcagCriteria = wcagInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const [id = '', title = '', level = 'A'] = item.split(':');
        return { id: id.trim(), title: title.trim(), level: level.trim() as 'A' | 'AA' | 'AAA' };
      });

    onSave({
      ...form,
      wcagCriteria,
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
      {isNew && (
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
      <div>
        <label htmlFor="def-wcag" className="block text-xs font-medium text-gray-700">
          WCAG Criteria (id:title:level, comma-separated)
        </label>
        <input
          id="def-wcag"
          type="text"
          value={wcagInput}
          onChange={(ev) => setWcagInput(ev.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
      </div>
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
      <div>
        <label htmlFor="def-method" className="block text-xs font-medium text-gray-700">
          Testing Method
        </label>
        <select
          id="def-method"
          value={form.testingMethod}
          onChange={(ev) =>
            setForm((prev) => ({
              ...prev,
              testingMethod: ev.target.value as A11yIssueDefinition['testingMethod'],
            }))
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="automated">Automated</option>
          <option value="manual">Manual</option>
          <option value="semi-automated">Semi-automated</option>
        </select>
      </div>
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

  const handleSaveNew = (definition: A11yIssueDefinition) => {
    addDefinition(definition);
    setIsAdding(false);
  };

  const handleSaveEdit = (definition: A11yIssueDefinition) => {
    updateDefinition(definition.id, definition);
    setEditingId(null);
  };

  return (
    <div>
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
              <th className="py-2 pr-4 font-medium text-gray-700">Method</th>
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
                    <td className="py-2 pr-4 text-xs capitalize">{definition.testingMethod}</td>
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
                          onClick={() => deleteDefinition(definition.id)}
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
