'use client';

import Link from 'next/link';
import { AdminDataProvider } from '@/components/admin/admin-data-provider';
import { AdminDefinitionsTable } from '@/components/admin/admin-definitions-table';

const DefinitionsPage = () => {
  return (
    <AdminDataProvider>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Link
            href="/maple-valley-health/editor"
            className="text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Issue Definitions</h1>
        </div>
        <AdminDefinitionsTable />
      </div>
    </AdminDataProvider>
  );
};

export default DefinitionsPage;
