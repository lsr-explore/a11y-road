'use client';

import { useMemo, useState } from 'react';
import type { ResolvedInstance } from '@maple-valley-health/a11y-kit';
import { pages } from '../../data/page-metadata';

type SortField = 'page' | 'issue' | 'level' | 'testingMethod';
type SortDir = 'asc' | 'desc';

export function SummaryTable({ resolved }: { resolved: ResolvedInstance[] }) {
  const [filterPage, setFilterPage] = useState('all');
  const [filterCriterion, setFilterCriterion] = useState('all');
  const [sortField, setSortField] = useState<SortField>('page');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const allCriteria = useMemo(() => {
    const set = new Map<string, string>();
    resolved.forEach((r) =>
      r.definition.wcagCriteria.forEach((c) => set.set(c.id, `${c.id} ${c.title}`))
    );
    return Array.from(set.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [resolved]);

  const filtered = useMemo(() => {
    let result = resolved;
    if (filterPage !== 'all') {
      result = result.filter((r) => r.instance.pageId === filterPage);
    }
    if (filterCriterion !== 'all') {
      result = result.filter((r) =>
        r.definition.wcagCriteria.some((c) => c.id === filterCriterion)
      );
    }
    return result;
  }, [resolved, filterPage, filterCriterion]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'page':
          cmp = a.instance.pageId.localeCompare(b.instance.pageId);
          break;
        case 'issue':
          cmp = a.definition.title.localeCompare(b.definition.title);
          break;
        case 'level': {
          const levelOrder = { A: 1, AA: 2, AAA: 3 };
          const aLevel = a.definition.wcagCriteria[0]?.level || 'A';
          const bLevel = b.definition.wcagCriteria[0]?.level || 'A';
          cmp = (levelOrder[aLevel] || 0) - (levelOrder[bLevel] || 0);
          break;
        }
        case 'testingMethod':
          cmp = a.definition.testingMethod.localeCompare(b.definition.testingMethod);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
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

  const pageNameMap = Object.fromEntries(pages.map((p) => [p.id, p.name]));

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
            onChange={(e) => setFilterPage(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Pages</option>
            {pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-criterion" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by WCAG Criterion
          </label>
          <select
            id="filter-criterion"
            value={filterCriterion}
            onChange={(e) => setFilterCriterion(e.target.value)}
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
            {sorted.map((r) => (
              <tr key={r.instance.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {pageNameMap[r.instance.pageId] || r.instance.pageId}
                </td>
                <td className="px-4 py-3 text-gray-700">{r.definition.title}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{r.instance.description}</td>
                <td className="px-4 py-3">
                  {r.definition.wcagCriteria.map((c) => (
                    <span
                      key={c.id}
                      className="inline-block mr-1 mb-1 px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-800"
                    >
                      {c.id} {c.title}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3">
                  {r.definition.wcagCriteria.map((c) => c.level).join(', ')}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {r.definition.impactedUsers.join(', ')}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-teal-50 text-teal-800 capitalize">
                    {r.definition.testingMethod}
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
}
