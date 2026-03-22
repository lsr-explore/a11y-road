'use client';

import type { A11yIssueInstance } from '@a11y-road/a11y-kit';
import { useState } from 'react';
import { pages } from '../../data/page-metadata';
import { useAdminData } from './admin-data-provider';

const emptyInstance: A11yIssueInstance = {
  id: '',
  issueId: '',
  pageId: '',
  description: '',
};

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
      {isNew && (
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
          <option value="">Select issue type…</option>
          {definitionOptions.map((def) => (
            <option key={def.id} value={def.id}>
              {def.title}
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
          <option value="">Select page…</option>
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.name}
            </option>
          ))}
        </select>
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

  const definitionOptions = definitions.map((def) => ({ id: def.id, title: def.title }));

  const handleSaveNew = (instance: A11yIssueInstance) => {
    addInstance(instance);
    setIsAdding(false);
  };

  const handleSaveEdit = (instance: A11yIssueInstance) => {
    updateInstance(instance.id, instance);
    setEditingId(null);
  };

  return (
    <div>
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
              <th className="py-2 pr-4 font-medium text-gray-700">ID</th>
              <th className="py-2 pr-4 font-medium text-gray-700">Issue Type</th>
              <th className="py-2 pr-4 font-medium text-gray-700">Page</th>
              <th className="py-2 pr-4 font-medium text-gray-700">Description</th>
              <th className="py-2 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instances.map((instance) => {
              const definition = definitions.find((def) => def.id === instance.issueId);
              return (
                <tr key={instance.id} className="border-b border-gray-100">
                  {editingId === instance.id ? (
                    <td colSpan={5} className="py-2">
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
                      <td className="py-2 pr-4">{definition?.title ?? instance.issueId}</td>
                      <td className="py-2 pr-4 text-gray-500">{instance.pageId}</td>
                      <td className="py-2 pr-4 text-xs text-gray-600 max-w-xs truncate">
                        {instance.description}
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
                            onClick={() => deleteInstance(instance.id)}
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
