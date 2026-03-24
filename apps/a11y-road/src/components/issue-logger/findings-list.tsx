'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Finding } from '../../data/evaluation-types';
import { issueDefinitions } from '../../data/issues-registry';

const matchColors: Record<Finding['matchResult'], string> = {
  correct: 'bg-green-100 text-green-800',
  partial: 'bg-amber-100 text-amber-800',
  'not-found': 'bg-red-100 text-red-800',
};

const matchLabels: Record<Finding['matchResult'], string> = {
  correct: 'Correct',
  partial: 'Partial',
  'not-found': 'Not Found',
};

const DeleteConfirmDialog = ({
  finding,
  onConfirm,
  onCancel,
}: {
  finding: Finding;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="w-full max-w-sm rounded-lg border border-gray-200 shadow-xl p-0 backdrop:bg-black/50"
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Delete Finding</h2>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to delete the finding for <strong>{finding.elementId}</strong>?
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
    </dialog>
  );
};

interface FindingsListProps {
  findings: Finding[];
  onEdit?: (finding: Finding) => void;
  onDelete?: (findingId: string) => void;
}

export const FindingsList = ({ findings, onEdit, onDelete }: FindingsListProps) => {
  const [deletingFinding, setDeletingFinding] = useState<Finding | null>(null);
  const [deletedMessage, setDeletedMessage] = useState<string | null>(null);

  const handleDeleteConfirm = useCallback(() => {
    if (deletingFinding && onDelete) {
      onDelete(deletingFinding.id);
      setDeletedMessage(`Deleted finding for "${deletingFinding.elementId}".`);
      setDeletingFinding(null);
    }
  }, [deletingFinding, onDelete]);

  // Auto-dismiss the deleted banner after 4 seconds
  useEffect(() => {
    if (!deletedMessage) return undefined;
    const timer = setTimeout(() => setDeletedMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [deletedMessage]);

  if (findings.length === 0 && !deletedMessage) {
    return (
      <p className="mt-4 text-xs text-gray-500 text-center">
        No findings yet. Submit your first finding above.
      </p>
    );
  }

  return (
    <div className="mt-4">
      {deletedMessage && (
        <div
          role="status"
          className="mb-2 rounded-md p-2 text-xs bg-green-50 text-green-800 border border-green-200 flex items-center justify-between gap-2"
        >
          <span>{deletedMessage}</span>
          <button
            type="button"
            onClick={() => setDeletedMessage(null)}
            className="shrink-0 opacity-60 hover:opacity-100"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      )}
      {findings.length > 0 && (
        <>
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Findings ({findings.length})</h3>
          <ul className="space-y-2">
            {[...findings].reverse().map((finding) => {
              const definition = issueDefinitions.find((def) => def.id === finding.issueTypeId);
              return (
                <li
                  key={finding.id}
                  className="rounded-md border border-gray-200 bg-white p-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-gray-900 truncate">{finding.elementId}</span>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${matchColors[finding.matchResult]}`}
                    >
                      {matchLabels[finding.matchResult]}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-0.5">{definition?.title ?? finding.issueTypeId}</p>
                  {(onEdit || onDelete) && (
                    <div className="flex items-center justify-between mt-1.5">
                      <div>
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(finding)}
                            className="text-indigo-600 hover:text-indigo-800 text-xs underline"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                      <div>
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => setDeletingFinding(finding)}
                            className="text-red-600 hover:text-red-800 text-xs underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {deletingFinding && (
        <DeleteConfirmDialog
          finding={deletingFinding}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingFinding(null)}
        />
      )}
    </div>
  );
};
