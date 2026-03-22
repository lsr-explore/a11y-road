'use client';

import Link from 'next/link';
import { useIssueLogger } from '@/components/issue-logger/issue-logger-provider';

const statusColors = {
  active: 'bg-blue-100 text-blue-800',
  submitted: 'bg-green-100 text-green-800',
};

const EvaluationPage = () => {
  const { evaluations } = useIssueLogger();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900">Evaluations</h1>
      <p className="mt-2 text-sm text-gray-600">
        Start a new evaluation from the issue logger panel, or view past results below.
      </p>

      {evaluations.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">
          No evaluations yet. Start one from the issue logger panel.
        </p>
      ) : (
        <ul className="mt-8 space-y-2">
          {[...evaluations].reverse().map((ev) => (
            <li key={ev.id}>
              <Link
                href={`/maple-valley-health/evaluation/${ev.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-gray-700">{ev.id}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[ev.status ?? 'active']}`}
                    >
                      {ev.status === 'submitted' ? 'Submitted' : 'Active'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(ev.startedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                  <span>{ev.findings.length} findings</span>
                  {ev.status === 'active' && (
                    <span className="text-blue-600 font-medium">Resume</span>
                  )}
                  {ev.status === 'submitted' && <span className="text-gray-500">View Results</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EvaluationPage;
