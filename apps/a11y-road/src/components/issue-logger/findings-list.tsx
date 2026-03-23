'use client';

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

interface FindingsListProps {
  findings: Finding[];
}

export const FindingsList = ({ findings }: FindingsListProps) => {
  if (findings.length === 0) {
    return (
      <p className="mt-4 text-xs text-gray-500 text-center">
        No findings yet. Submit your first finding above.
      </p>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-xs font-semibold text-gray-700 mb-2">Findings ({findings.length})</h3>
      <ul className="space-y-2">
        {[...findings].reverse().map((finding) => {
          const definition = issueDefinitions.find((def) => def.id === finding.issueTypeId);
          return (
            <li key={finding.id} className="rounded-md border border-gray-200 bg-white p-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-gray-900 truncate">{finding.elementId}</span>
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${matchColors[finding.matchResult]}`}
                >
                  {matchLabels[finding.matchResult]}
                </span>
              </div>
              <p className="text-gray-600 mt-0.5">{definition?.title ?? finding.issueTypeId}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
