import { registry } from '../../data/issues-registry';
import { SummaryTable } from './summary-table';

export const metadata = {
  title: 'Accessibility Summary | Maple Valley Health',
  description: 'Overview of all intentional accessibility issues on this demo site.',
};

export default function A11ySummaryPage() {
  const resolved = registry.getAllResolved();
  const instanceCounts = registry.getInstanceCountByDefinition();
  const definitions = registry.getDefinitions();

  return (
    <main className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Accessibility Issues Summary
        </h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          This page lists all intentional accessibility issues present on the
          demo site. Use the filters and sorting to explore issues by page,
          WCAG criterion, or testing method.
        </p>

        <div className="mt-8 mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Issue Types ({definitions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {definitions.map((def) => (
              <div
                key={def.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{def.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                    {instanceCounts.get(def.id) || 0} {(instanceCounts.get(def.id) || 0) === 1 ? 'instance' : 'instances'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {def.wcagCriteria.map((c) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-800"
                    >
                      {c.id} ({c.level})
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All Instances ({resolved.length})
          </h2>
          <SummaryTable resolved={resolved} />
        </div>
      </div>
    </main>
  );
}
