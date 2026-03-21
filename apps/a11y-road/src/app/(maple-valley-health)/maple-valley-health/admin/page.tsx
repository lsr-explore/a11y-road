'use client';

import Link from 'next/link';
import { AdminDataProvider, useAdminData } from '@/components/admin/admin-data-provider';

const AdminDashboardContent = () => {
  const { definitions, instances, issueSets, isDirty, resetToDefaults } = useAdminData();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage issue definitions, instances, and evaluation sets.
          </p>
        </div>
        {isDirty && (
          <button
            type="button"
            onClick={resetToDefaults}
            className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-300"
          >
            Reset to Defaults
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Link
          href="/maple-valley-health/admin/definitions"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <p className="text-3xl font-bold text-indigo-700">{definitions.length}</p>
          <p className="text-sm text-gray-600 mt-1">Issue Definitions</p>
        </Link>
        <Link
          href="/maple-valley-health/admin/instances"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <p className="text-3xl font-bold text-teal-700">{instances.length}</p>
          <p className="text-sm text-gray-600 mt-1">Issue Instances</p>
        </Link>
        <Link
          href="/maple-valley-health/admin/issue-sets"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <p className="text-3xl font-bold text-amber-700">{issueSets.length}</p>
          <p className="text-sm text-gray-600 mt-1">Issue Sets</p>
        </Link>
      </div>
    </div>
  );
};

const AdminPage = () => {
  return (
    <AdminDataProvider>
      <AdminDashboardContent />
    </AdminDataProvider>
  );
};

export default AdminPage;
