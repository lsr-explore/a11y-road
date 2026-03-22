'use client';

import type { A11yIssueInstance } from '@a11y-road/a11y-kit';
import { useState } from 'react';
import { pages } from '../../data/page-metadata';
import { useAdminData } from './admin-data-provider';

const emptyInstance: A11yIssueInstance = {
  id: '',
  issueId: '',
  pageId: '',
  label: '',
  description: '',
  solutionDescription: '',
};

type SortField = 'id' | 'pageId';
type SortDirection = 'asc' | 'desc';

interface InstanceFormProps {
  instance: A11yIssueInstance;
  definitionOptions: { id: string; title: string }[];
  onSave: (instance: A11yIssueInstance) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const InstanceForm = ({
  instance,
  definitionOptions,
  onSave,
  onCancel,
  isNew = false,
}: InstanceFormProps) => {
  const [form, setForm] = useState(instance);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 rounded-md">
      {isNew ? (
        <div>
          <label htmlFor="inst-id" className="block text-xs font-medium text-gray-700">
            ID
          </label>
          <input
            id="inst-id"
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
        <label htmlFor="inst-issue" className="block text-xs font-medium text-gray-700">
          Issue Type
        </label>
        <select
          id="inst-issue"
          value={form.issueId}
          onChange={(ev) => setForm((prev) => ({ ...prev, issueId: ev.target.value }))}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="">Select issue type...</option>
          {definitionOptions.map((def) => (
            <option key={def.id} value={def.id}>
              {def.title} ({def.id})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="inst-page" className="block text-xs font-medium text-gray-700">
          Page
        </label>
        <select
          id="inst-page"
          value={form.pageId}
          onChange={(ev) => setForm((prev) => ({ ...prev, pageId: ev.target.value }))}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="">Select page...</option>
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="inst-label" className="block text-xs font-medium text-gray-700">
          Label (matches data-a11y-name)
        </label>
        <input
          id="inst-label"
          type="text"
          value={form.label}
          onChange={(ev) => setForm((prev) => ({ ...prev, label: ev.target.value }))}
          required
          placeholder="e.g. Hero image, Name input..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label htmlFor="inst-desc" className="block text-xs font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="inst-desc"
          value={form.description}
          onChange={(ev) => setForm((prev) => ({ ...prev, description: ev.target.value }))}
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label htmlFor="inst-solution" className="block text-xs font-medium text-gray-700">
          Solution Description
        </label>
        <textarea
          id="inst-solution"
          value={form.solutionDescription ?? ''}
          onChange={(ev) => setForm((prev) => ({ ...prev, solutionDescription: ev.target.value }))}
          rows={2}
          placeholder="Describe what the fixed version does (used for evaluation matching)"
          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
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

export const AdminInstancesTable = () => {
  const { definitions, instances, addInstance, updateInstance, deleteInstance } = useAdminData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const definitionOptions = definitions.map((def) => ({ id: def.id, title: def.title }));

  const showBanner = (message: string) => {
    setBanner(message);
    setTimeout(() => setBanner(null), 3000);
  };

  const handleSaveNew = (instance: A11yIssueInstance) => {
    addInstance(instance);
    setIsAdding(false);
    showBanner(`Added instance "${instance.id}"`);
  };

  const handleSaveEdit = (instance: A11yIssueInstance) => {
    updateInstance(instance.id, instance);
    setEditingId(null);
    showBanner(`Updated instance "${instance.id}"`);
  };

  const handleDelete = (instance: A11yIssueInstance) => {
    deleteInstance(instance.id);
    showBanner(`Deleted instance "${instance.id}"`);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedInstances = [...instances].sort((left, right) => {
    const leftVal = left[sortField];
    const rightVal = right[sortField];
    const cmp = leftVal.localeCompare(rightVal);
    return sortDirection === 'asc' ? cmp : -cmp;
  });

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return '';
    return sortDirection === 'asc' ? ' \u2191' : ' \u2193';
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
        <h2 className="text-lg font-semibold text-gray-800">Issue Instances</h2>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Add Instance
        </button>
      </div>

      {isAdding && (
        <div className="mb-4">
          <InstanceForm
            instance={emptyInstance}
            definitionOptions={definitionOptions}
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
              <th className="py-2 pr-4 font-medium text-gray-700">
                <button
                  type="button"
                  onClick={() => toggleSort('id')}
                  className="hover:text-indigo-600"
                >
                  ID{sortIndicator('id')}
                </button>
              </th>
              <th className="py-2 pr-4 font-medium text-gray-700">Issue Type</th>
              <th className="py-2 pr-4 font-medium text-gray-700">
                <button
                  type="button"
                  onClick={() => toggleSort('pageId')}
                  className="hover:text-indigo-600"
                >
                  Page{sortIndicator('pageId')}
                </button>
              </th>
              <th className="py-2 pr-4 font-medium text-gray-700">Description</th>
              <th className="py-2 pr-4 font-medium text-gray-700">Solution</th>
              <th className="py-2 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedInstances.map((instance) => {
              const definition = definitions.find((def) => def.id === instance.issueId);
              return (
                <tr key={instance.id} className="border-b border-gray-100 align-top">
                  {editingId === instance.id ? (
                    <td colSpan={6} className="py-2">
                      <InstanceForm
                        instance={instance}
                        definitionOptions={definitionOptions}
                        onSave={handleSaveEdit}
                        onCancel={() => setEditingId(null)}
                      />
                    </td>
                  ) : (
                    <>
                      <td className="py-2 pr-4 font-mono text-xs">{instance.id}</td>
                      <td className="py-2 pr-4">
                        {definition?.title ?? instance.issueId}
                        <br />
                        <span className="text-xs text-gray-500 font-mono">{instance.issueId}</span>
                      </td>
                      <td className="py-2 pr-4 text-gray-500">{instance.pageId}</td>
                      <td className="py-2 pr-4 text-xs text-gray-600 max-w-xs whitespace-normal">
                        {instance.description}
                      </td>
                      <td className="py-2 pr-4 text-xs text-gray-600 max-w-xs whitespace-normal">
                        {instance.solutionDescription || (
                          <span className="text-gray-400 italic">None</span>
                        )}
                      </td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingId(instance.id)}
                            className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(instance)}
                            className="text-xs text-red-600 hover:text-red-800 underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
