'use client';

import type { ResolvedInstance } from '@a11y-road/a11y-kit';
import { useMemo, useState } from 'react';
import { pages } from '@/data/page-metadata';

type SortField = 'page' | 'issue' | 'level' | 'testingMethod';
type SortDir = 'asc' | 'desc';

export const SummaryTable = ({ resolved }: { resolved: ResolvedInstance[] }) => {
  const [filterPage, setFilterPage] = useState('all');
  const [filterCriterion, setFilterCriterion] = useState('all');
  const [sortField, setSortField] = useState<SortField>('page');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const allCriteria = useMemo(() => {
    const set = new Map<string, string>();
    resolved.forEach((item) => {
      item.definition.wcagCriteria.forEach((criterion) => {
        set.set(criterion.id, `${criterion.id} ${criterion.title}`);
      });
    });
    return Array.from(set.entries()).sort((left, right) => left[0].localeCompare(right[0]));
  }, [resolved]);

  const filtered = useMemo(() => {
    let result = resolved;
    if (filterPage !== 'all') {
      result = result.filter((item) => item.instance.pageId === filterPage);
    }
    if (filterCriterion !== 'all') {
      result = result.filter((item) =>
        item.definition.wcagCriteria.some((criterion) => criterion.id === filterCriterion),
      );
    }
    return result;
  }, [resolved, filterPage, filterCriterion]);

  const sorted = useMemo(() => {
    return [...filtered].sort((left, right) => {
      let cmp = 0;
      switch (sortField) {
        case 'page':
          cmp = left.instance.pageId.localeCompare(right.instance.pageId);
          break;
        case 'issue':
          cmp = left.definition.title.localeCompare(right.definition.title);
          break;
        case 'level': {
          const levelOrder = { A: 1, AA: 2, AAA: 3 };
          const leftLevel = left.definition.wcagCriteria[0]?.level || 'A';
          const rightLevel = right.definition.wcagCriteria[0]?.level || 'A';
          cmp = (levelOrder[leftLevel] || 0) - (levelOrder[rightLevel] || 0);
          break;
        }
        case 'testingMethod':
          cmp = left.definition.testingMethod.localeCompare(right.definition.testingMethod);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 font-semibold text-left hover:text-teal-700 transition-colors"
    >
      {children}
      {sortField === field && (
        <span className="text-teal-600">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>
      )}
    </button>
  );

  const pageNameMap = Object.fromEntries(pages.map((page) => [page.id, page.name]));

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label htmlFor="filter-page" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Page
          </label>
          <select
            id="filter-page"
            value={filterPage}
            onChange={(event) => setFilterPage(event.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Pages</option>
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-criterion"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by WCAG Criterion
          </label>
          <select
            id="filter-criterion"
            value={filterCriterion}
            onChange={(event) => setFilterCriterion(event.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Criteria</option>
            {allCriteria.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">
                <SortButton field="page">Page</SortButton>
              </th>
              <th className="px-4 py-3">
                <SortButton field="issue">Issue Type</SortButton>
              </th>
              <th className="px-4 py-3">Instance</th>
              <th className="px-4 py-3">WCAG Criteria</th>
              <th className="px-4 py-3">
                <SortButton field="level">Level</SortButton>
              </th>
              <th className="px-4 py-3">Impacted Users</th>
              <th className="px-4 py-3">
                <SortButton field="testingMethod">Testing</SortButton>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((item) => (
              <tr key={item.instance.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {pageNameMap[item.instance.pageId] || item.instance.pageId}
                </td>
                <td className="px-4 py-3 text-gray-700">{item.definition.title}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{item.instance.description}</td>
                <td className="px-4 py-3">
                  {item.definition.wcagCriteria.map((criterion) => (
                    <span
                      key={criterion.id}
                      className="inline-block mr-1 mb-1 px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-800"
                    >
                      {criterion.id} {criterion.title}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3">
                  {item.definition.wcagCriteria.map((criterion) => criterion.level).join(', ')}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {item.definition.impactedUsers.join(', ')}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-teal-50 text-teal-800 capitalize">
                    {item.definition.testingMethod}
                  </span>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No issues match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
