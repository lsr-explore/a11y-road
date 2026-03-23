'use client';

import { useState } from 'react';
import type { IssueSet } from '../../data/evaluation-types';
import { useAdminData } from './admin-data-provider';

const emptyIssueSet: IssueSet = {
  id: '',
  name: '',
  description: '',
  instanceIds: [],
};

interface IssueSetFormProps {
  issueSet: IssueSet;
  onSave: (issueSet: IssueSet) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const IssueSetForm = ({ issueSet, onSave, onCancel, isNew = false }: IssueSetFormProps) => {
  const { instances } = useAdminData();
  const [form, setForm] = useState(issueSet);

  const isAllInstances = form.instanceIds.includes('all');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(form);
  };

  const toggleInstance = (instId: string) => {
    setForm((prev) => {
      if (instId === 'all') {
        return { ...prev, instanceIds: prev.instanceIds.includes('all') ? [] : ['all'] };
      }
      const filtered = prev.instanceIds.filter((id) => id !== 'all');
      return {
        ...prev,
        instanceIds: filtered.includes(instId)
          ? filtered.filter((id) => id !== instId)
          : [...filtered, instId],
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 rounded-md">
      {isNew && (
        <div>
          <label htmlFor="set-id" className="block text-xs font-medium text-gray-700">
            ID
          </label>
          <input
            id="set-id"
            type="text"
            value={form.id}
            onChange={(ev) => setForm((prev) => ({ ...prev, id: ev.target.value }))}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
      )}
      <div>
        <label htmlFor="set-name" className="block text-xs font-medium text-gray-700">
          Name
        </label>
        <input
          id="set-name"
          type="text"
          value={form.name}
          onChange={(ev) => setForm((prev) => ({ ...prev, name: ev.target.value }))}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label htmlFor="set-desc" className="block text-xs font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="set-desc"
          value={form.description}
          onChange={(ev) => setForm((prev) => ({ ...prev, description: ev.target.value }))}
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
      </div>

      <fieldset>
        <legend className="text-xs font-medium text-gray-700 mb-1">Instances</legend>
        <div className="max-h-40 overflow-y-auto space-y-1 border border-gray-200 rounded-md p-2 bg-white">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isAllInstances}
              onChange={() => toggleInstance('all')}
            />
            <span className="font-medium">All instances</span>
          </label>
          {!isAllInstances &&
            instances.map((inst) => (
              <label key={inst.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.instanceIds.includes(inst.id)}
                  onChange={() => toggleInstance(inst.id)}
                />
                {inst.id} ({inst.pageId})
              </label>
            ))}
        </div>
      </fieldset>

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

export const AdminIssueSetsTable = () => {
  const { issueSets, addIssueSet, updateIssueSet, deleteIssueSet } = useAdminData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSaveNew = (issueSet: IssueSet) => {
    addIssueSet(issueSet);
    setIsAdding(false);
  };

  const handleSaveEdit = (issueSet: IssueSet) => {
    updateIssueSet(issueSet.id, issueSet);
    setEditingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Issue Sets</h2>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Add Issue Set
        </button>
      </div>

      {isAdding && (
        <div className="mb-4">
          <IssueSetForm
            issueSet={emptyIssueSet}
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
              <th className="py-2 pr-4 font-medium text-gray-700">Name</th>
              <th className="py-2 pr-4 font-medium text-gray-700">Description</th>
              <th className="py-2 pr-4 font-medium text-gray-700">Instances</th>
              <th className="py-2 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {issueSets.map((issueSet) => (
              <tr key={issueSet.id} className="border-b border-gray-100">
                {editingId === issueSet.id ? (
                  <td colSpan={4} className="py-2">
                    <IssueSetForm
                      issueSet={issueSet}
                      onSave={handleSaveEdit}
                      onCancel={() => setEditingId(null)}
                    />
                  </td>
                ) : (
                  <>
                    <td className="py-2 pr-4 font-medium">{issueSet.name}</td>
                    <td className="py-2 pr-4 text-xs text-gray-600 max-w-xs truncate">
                      {issueSet.description}
                    </td>
                    <td className="py-2 pr-4 text-xs">
                      {issueSet.instanceIds.includes('all') ? 'All' : issueSet.instanceIds.length}
                    </td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(issueSet.id)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteIssueSet(issueSet.id)}
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
