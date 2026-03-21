'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useIssueLogger } from '@/components/issue-logger/issue-logger-provider';
import { issueDefinitions, registry } from '@/data/issues-registry';

const EvaluationDetailPage = () => {
  const params = useParams();
  const evaluationId = params.id as string;
  const { getEvaluationById, issueSets } = useIssueLogger();
  const evaluation = getEvaluationById(evaluationId);

  if (!evaluation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900">Evaluation Not Found</h1>
        <p className="mt-4 text-gray-600">
          No evaluation found with ID: <code className="font-mono">{evaluationId}</code>
        </p>
        <Link
          href="/maple-valley-health/evaluation"
          className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 underline text-sm"
        >
          Back to evaluations
        </Link>
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
      <div className="mb-8 print:mb-4">
        <Link
          href="/maple-valley-health/evaluation"
          className="text-sm text-indigo-600 hover:text-indigo-800 underline print:hidden"
        >
          Back to evaluations
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Evaluation</h1>
        <p className="font-mono text-sm text-gray-500">{evaluation.id}</p>
        <p className="text-sm text-gray-500 mt-1">
          Started: {new Date(evaluation.startedAt).toLocaleString()}
        </p>
      </div>

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

      {evaluation.findings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Findings</h2>
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
        </div>
      )}

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

export default EvaluationDetailPage;
