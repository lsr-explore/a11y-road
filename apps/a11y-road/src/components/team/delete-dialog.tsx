'use client';

import { useCallback, useEffect, useRef } from 'react';
import { A11yDemo } from '../a11y-demo';
import { useA11yMode } from '../providers/a11y-mode-provider';

interface DeleteDialogProps {
  memberName: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteDialog = ({ memberName, isOpen, onConfirm, onCancel }: DeleteDialogProps) => {
  const { isAccessible } = useA11yMode();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isAccessible) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen, isAccessible]);

  const handleDialogClose = useCallback(() => {
    onCancel();
  }, [onCancel]);

  if (!isOpen) return null;

  if (isAccessible) {
    return (
      <A11yDemo instanceId="team-delete-dialog" label="Delete confirmation dialog">
        <dialog
          ref={dialogRef}
          onClose={handleDialogClose}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-xl backdrop:bg-black/50 max-w-md"
        >
          <h2 id="delete-dialog-title" className="text-lg font-semibold text-gray-900">
            Remove team member
          </h2>
          <p id="delete-dialog-description" className="mt-2 text-sm text-gray-600">
            Are you sure you want to remove {memberName} from the team? This action cannot be
            undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-red-600"
            >
              Remove
            </button>
          </div>
        </dialog>
      </A11yDemo>
    );
  }

  return (
    <A11yDemo instanceId="team-delete-dialog" label="Delete confirmation dialog">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="rounded-lg bg-white p-6 shadow-xl max-w-md">
          <div className="text-lg font-semibold text-gray-900">Remove team member</div>
          <div className="mt-2 text-sm text-gray-600">
            Are you sure you want to remove {memberName} from the team? This action cannot be
            undone.
          </div>
          <div className="mt-6 flex justify-end gap-3">
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- intentionally inaccessible for a11y demo */}
            <div
              onClick={onCancel}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </div>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- intentionally inaccessible for a11y demo */}
            <div
              onClick={onConfirm}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Remove
            </div>
          </div>
        </div>
      </div>
    </A11yDemo>
  );
};
