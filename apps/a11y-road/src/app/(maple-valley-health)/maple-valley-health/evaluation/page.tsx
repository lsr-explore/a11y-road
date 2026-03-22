'use client';

import Link from 'next/link';
import { useIssueLogger } from '@/components/issue-logger/issue-logger-provider';
import { issueDefinitions, registry } from '@/data/issues-registry';

const EvaluationPage = () => {
  const { currentEvaluation, evaluations, issueSets, endEvaluation } = useIssueLogger();
  const evaluation = currentEvaluation;

  if (!evaluation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900">Evaluation Results</h1>
        <p className="mt-4 text-gray-600">
          No active evaluation. Start one from the issue logger panel.
        </p>

        {evaluations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Past Evaluations</h2>
            <ul className="space-y-2">
              {evaluations.map((ev) => (
                <li key={ev.id}>
                  <Link
                    href={`/maple-valley-health/evaluation/${ev.id}`}
                    className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-gray-700">{ev.id}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(ev.startedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{ev.findings.length} findings</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const issueSet = issueSets.find((set) => set.id === evaluation.issueSetId);
  const allInstances = registry.getInstances();
  const setInstances = issueSet?.instanceIds.includes('all')
    ? allInstances
    : allInstances.filter((inst) => issueSet?.instanceIds.includes(inst.id));

  const correctCount = evaluation.findings.filter(
    (finding) => finding.matchResult === 'correct',
  ).length;
  const partialCount = evaluation.findings.filter(
    (finding) => finding.matchResult === 'partial',
  ).length;
  const totalInSet = setInstances.length;

  const foundInstanceIds = new Set(
    evaluation.findings
      .filter((finding) => finding.matchedInstanceId)
      .map((finding) => finding.matchedInstanceId),
  );
  const missedInstances = setInstances.filter((inst) => !foundInstanceIds.has(inst.id));
  const coveragePercent =
    totalInSet > 0 ? Math.round((foundInstanceIds.size / totalInSet) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 print:py-4">
      <div className="flex items-center justify-between mb-8 print:mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Evaluation Results</h1>
          <p className="mt-1 font-mono text-sm text-gray-500">{evaluation.id}</p>
        </div>
        <div className="flex gap-3 print:hidden">
          <Link
            href="/maple-valley-health"
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500"
          >
            Continue Testing
          </Link>
          <button
            type="button"
            onClick={endEvaluation}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300"
          >
            Submit Evaluation
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{evaluation.findings.length}</p>
          <p className="text-xs text-gray-500">Total Findings</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{correctCount}</p>
          <p className="text-xs text-green-600">Correct</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{partialCount}</p>
          <p className="text-xs text-amber-600">Partial</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-indigo-700">{coveragePercent}%</p>
          <p className="text-xs text-gray-500">Coverage</p>
        </div>
      </div>

      {/* Findings table */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Findings</h2>
        {evaluation.findings.length === 0 ? (
          <p className="text-sm text-gray-500">No findings submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 pr-4 font-medium text-gray-700">Element</th>
                  <th className="py-2 pr-4 font-medium text-gray-700">Issue Type</th>
                  <th className="py-2 pr-4 font-medium text-gray-700">WCAG</th>
                  <th className="py-2 pr-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {evaluation.findings.map((finding) => {
                  const definition = issueDefinitions.find((def) => def.id === finding.issueTypeId);
                  return (
                    <tr key={finding.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-mono text-xs">{finding.elementId}</td>
                      <td className="py-2 pr-4">{definition?.title ?? finding.issueTypeId}</td>
                      <td className="py-2 pr-4 text-gray-500">{finding.wcagCriteria}</td>
                      <td className="py-2 pr-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            finding.matchResult === 'correct'
                              ? 'bg-green-100 text-green-800'
                              : finding.matchResult === 'partial'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {finding.matchResult === 'correct'
                            ? 'Correct'
                            : finding.matchResult === 'partial'
                              ? 'Partial'
                              : 'Not Found'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Missed issues */}
      {missedInstances.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Missed Issues ({missedInstances.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 pr-4 font-medium text-gray-700">Instance</th>
                  <th className="py-2 pr-4 font-medium text-gray-700">Issue Type</th>
                  <th className="py-2 pr-4 font-medium text-gray-700">Page</th>
                </tr>
              </thead>
              <tbody>
                {missedInstances.map((inst) => {
                  const definition = issueDefinitions.find((def) => def.id === inst.issueId);
                  return (
                    <tr key={inst.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-mono text-xs">{inst.id}</td>
                      <td className="py-2 pr-4">{definition?.title ?? inst.issueId}</td>
                      <td className="py-2 pr-4 text-gray-500">{inst.pageId}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationPage;
