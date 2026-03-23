'use client';

import type { ResolvedInstance } from '@a11y-road/a11y-kit';
import {
  highlightElementByRef,
  testingMethodLabels,
  useElementRegistry,
} from '@a11y-road/a11y-kit';
import { useState } from 'react';

const levelColors: Record<string, string> = {
  A: 'bg-blue-100 text-blue-800',
  AA: 'bg-purple-100 text-purple-800',
  AAA: 'bg-orange-100 text-orange-800',
};

export const IssueCard = ({ resolved }: { resolved: ResolvedInstance }) => {
  const [expanded, setExpanded] = useState(false);
  const { instance, definition } = resolved;
  const { getElement } = useElementRegistry();

  const handleHighlight = () => {
    const registered = getElement(instance.id);
    if (registered) {
      highlightElementByRef(registered.ref);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        type="button"
        className="w-full px-4 py-3 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={expanded}
      >
        <span className="font-medium text-sm text-gray-900">{definition.title}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 space-y-3">
          <p className="text-sm text-gray-700">{instance.description}</p>
          <p className="text-xs text-gray-500 italic">{definition.description}</p>

          <div className="flex flex-wrap gap-1">
            {definition.wcagCriteria.map((criterion) => (
              <span
                key={criterion.id}
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${levelColors[criterion.level] || ''}`}
              >
                {criterion.id} ({criterion.level})
              </span>
            ))}
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Impacted Users</p>
            <div className="flex flex-wrap gap-1">
              {definition.impactedUsers.map((user) => (
                <span
                  key={user}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-50 text-red-700"
                >
                  {user}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {definition.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-200 text-gray-700"
                >
                  {tag}
                </span>
              ))}
              {definition.testingMethods.map((method) => (
                <span
                  key={method}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-teal-100 text-teal-800"
                >
                  {testingMethodLabels[method].label}
                </span>
              ))}
            </div>

            <button
              onClick={handleHighlight}
              type="button"
              className="text-xs font-medium text-teal-700 hover:text-teal-900 underline"
            >
              Highlight
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
