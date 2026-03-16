'use client';

import { useEffect } from 'react';
import { useA11yMode } from '../providers/a11y-mode-provider';
import { useTeamData } from '../providers/team-data-provider';

export const TeamNotification = () => {
  const { notification, clearNotification } = useTeamData();
  const { isAccessible } = useA11yMode();

  useEffect(() => {
    if (!notification || isAccessible) return undefined;

    if (notification.type === 'add') {
      window.alert(`${notification.memberName} has been added to the team.`);
      clearNotification();
      return undefined;
    }

    if (notification.type === 'edit') {
      const timer = setTimeout(() => {
        clearNotification();
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (notification.type === 'delete') {
      clearNotification();
    }

    return undefined;
  }, [notification, isAccessible, clearNotification]);

  if (!notification) return null;

  if (isAccessible) {
    const messages: Record<string, string> = {
      add: `${notification.memberName} has been added to the team.`,
      edit: `${notification.memberName}'s profile has been updated.`,
      delete: `${notification.memberName} has been removed from the team.`,
    };

    return (
      <div
        role="alert"
        className="mb-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3"
      >
        <p className="text-sm font-medium text-green-800">{messages[notification.type]}</p>
        <button
          type="button"
          onClick={clearNotification}
          className="ml-4 text-green-600 hover:text-green-800 transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal-600"
          aria-label="Dismiss notification"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>
    );
  }

  if (notification.type === 'edit') {
    return (
      <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-gray-800 px-4 py-3 text-sm text-white shadow-lg">
        <p>{notification.memberName}&apos;s profile has been updated.</p>
      </div>
    );
  }

  return null;
};
