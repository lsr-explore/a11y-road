'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EditFindingDialog } from '@/components/issue-logger/edit-finding-dialog';
import { useIssueLogger } from '@/components/issue-logger/issue-logger-provider';
import type { Finding } from '@/data/evaluation-types';
import { issueDefinitions, registry } from '@/data/issues-registry';

const DeleteConfirmDialog = ({
  elementName,
  onConfirm,
  onCancel,
}: {
  elementName: string;
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
          Are you sure you want to delete the finding for <strong>{elementName}</strong>?
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

const matchBadge = (result: string) => {
  const styles =
    result === 'correct'
      ? 'bg-green-100 text-green-800'
      : result === 'partial'
        ? 'bg-amber-100 text-amber-800'
        : 'bg-red-100 text-red-800';
  const label = result === 'correct' ? 'Correct' : result === 'partial' ? 'Partial' : 'Not Found';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
};

const EvaluationDetailPage = () => {
  const params = useParams();
  const evaluationId = params.id as string;
  const { getEvaluationById, issueSets, endEvaluation, updateFinding, deleteFinding } =
    useIssueLogger();
  const [editingFinding, setEditingFinding] = useState<Finding | null>(null);
  const [deletingFinding, setDeletingFinding] = useState<Finding | null>(null);
  const [deletedMessage, setDeletedMessage] = useState<string | null>(null);
  const evaluation = getEvaluationById(evaluationId);

  const handleDeleteConfirm = useCallback(() => {
    if (deletingFinding) {
      deleteFinding(deletingFinding.id);
      setDeletedMessage(`Deleted finding for "${deletingFinding.elementId}".`);
      setDeletingFinding(null);
    }
  }, [deletingFinding, deleteFinding]);

  useEffect(() => {
    if (!deletedMessage) return undefined;
    const timer = setTimeout(() => setDeletedMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [deletedMessage]);

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

  const isSubmitted = evaluation.status === 'submitted';
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
  const notFoundCount = evaluation.findings.filter(
    (finding) => finding.matchResult === 'not-found',
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
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Evaluation</h1>
            <p className="font-mono text-sm text-gray-500">{evaluation.id}</p>
          </div>
          {!isSubmitted && (
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
          )}
        </div>
        <div className="mt-2 text-sm text-gray-500 space-y-0.5">
          <p>Started: {new Date(evaluation.startedAt).toLocaleString()}</p>
          {evaluation.submittedAt && (
            <p>Submitted: {new Date(evaluation.submittedAt).toLocaleString()}</p>
          )}
          <p>
            Status:{' '}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isSubmitted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
            >
              {isSubmitted ? 'Submitted' : 'Active'}
            </span>
          </p>
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
      {evaluation.findings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Findings ({evaluation.findings.length})
          </h2>
          {notFoundCount > 0 && (
            <p className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              {notFoundCount} finding{notFoundCount > 1 ? 's' : ''} did not match known issues and{' '}
              {notFoundCount > 1 ? 'have' : 'has'} been flagged for manual review.
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 pr-4 font-medium text-gray-700">Page</th>
                  <th className="py-2 pr-4 font-medium text-gray-700">Element</th>
                  <th className="py-2 pr-4 font-medium text-gray-700">Tester&apos;s Answer</th>
                  {isSubmitted && <th className="py-2 pr-4 font-medium text-gray-700">Expected</th>}
                  {!isSubmitted && <th className="py-2 pr-4 font-medium text-gray-700">WCAG</th>}
                  <th className="py-2 pr-4 font-medium text-gray-700">Status</th>
                  {!isSubmitted && <th className="py-2 pr-4 font-medium text-gray-700">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {evaluation.findings.map((finding) => {
                  const matchedInstance = finding.matchedInstanceId
                    ? allInstances.find((inst) => inst.id === finding.matchedInstanceId)
                    : undefined;
                  const expectedDef = matchedInstance
                    ? issueDefinitions.find((def) => def.id === matchedInstance.issueId)
                    : undefined;
                  return (
                    <tr key={finding.id} className="border-b border-gray-100 align-top">
                      <td className="py-2 pr-4 text-xs text-gray-500">{finding.pageId}</td>
                      <td className="py-2 pr-4 font-mono text-xs">{finding.elementId}</td>
                      <td className="py-2 pr-4">
                        <span className="text-sm">{finding.issueTypeId}</span>
                        {isSubmitted && finding.wcagCriteria && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            WCAG: {finding.wcagCriteria}
                          </p>
                        )}
                        {finding.proposedSolution && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Solution: {finding.proposedSolution}
                          </p>
                        )}
                      </td>
                      {isSubmitted && (
                        <td className="py-2 pr-4 text-xs text-gray-600">
                          {expectedDef ? (
                            <>
                              <span className="font-medium">{expectedDef.title}</span>
                              <br />
                              <span className="text-gray-400">
                                WCAG: {expectedDef.wcagCriteria.map((wc) => wc.id).join(', ')}
                              </span>
                              {matchedInstance?.solutionDescription && (
                                <>
                                  <br />
                                  <span className="text-gray-400">
                                    Solution: {matchedInstance.solutionDescription}
                                  </span>
                                </>
                              )}
                            </>
                          ) : (
                            <span className="italic text-gray-400">No match</span>
                          )}
                        </td>
                      )}
                      {!isSubmitted && (
                        <td className="py-2 pr-4 text-gray-500">{finding.wcagCriteria}</td>
                      )}
                      <td className="py-2 pr-4">
                        {matchBadge(finding.matchResult)}
                        {finding.matchDetails?.reason && (
                          <span className="block text-xs text-gray-500 mt-0.5">
                            {finding.matchDetails.reason}
                          </span>
                        )}
                      </td>
                      {!isSubmitted && (
                        <td className="py-2 pr-4">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingFinding(finding)}
                              className="text-indigo-600 hover:text-indigo-800 text-xs underline"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingFinding(finding)}
                              className="text-red-600 hover:text-red-800 text-xs underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Missed issues - only show after submission */}
      {isSubmitted && missedInstances.length > 0 && (
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
                  <th className="py-2 pr-4 font-medium text-gray-700">Solution</th>
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
                      <td className="py-2 pr-4 text-xs text-gray-500">
                        {inst.solutionDescription || '--'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deletedMessage && (
        <div
          role="status"
          className="mb-4 rounded-md p-3 text-sm bg-green-50 text-green-800 border border-green-200 flex items-center justify-between gap-2"
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

      {editingFinding && (
        <EditFindingDialog
          finding={editingFinding}
          onSave={updateFinding}
          onClose={() => setEditingFinding(null)}
        />
      )}

      {deletingFinding && (
        <DeleteConfirmDialog
          elementName={deletingFinding.elementId}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingFinding(null)}
        />
      )}
    </div>
  );
};

export default EvaluationDetailPage;
