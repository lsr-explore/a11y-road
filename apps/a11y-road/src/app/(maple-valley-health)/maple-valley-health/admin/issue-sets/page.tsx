'use client';

import Link from 'next/link';
import { AdminDataProvider } from '@/components/admin/admin-data-provider';
import { AdminIssueSetsTable } from '@/components/admin/admin-issue-sets-table';

const IssueSetsPage = () => {
  return (
    <AdminDataProvider>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Link
            href="/maple-valley-health/admin"
            className="text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            Back to Admin
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Issue Sets</h1>
        </div>
        <AdminIssueSetsTable />
      </div>
    </AdminDataProvider>
  );
};

export default IssueSetsPage;
