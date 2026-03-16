import Link from 'next/link';
import { Suspense } from 'react';
import { TutorialSearch } from './tutorial-search';

export const TutorialHeader = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            A11y Road
          </Link>
          <span className="text-gray-300" aria-hidden="true">
            /
          </span>
          <Link href="/tutorial" className="text-xl font-bold text-indigo-700">
            Tutorial
          </Link>
        </div>
        <Suspense>
          <TutorialSearch />
        </Suspense>
        <nav aria-label="Section navigation">
          <ul className="flex gap-6">
            <li>
              <Link
                href="/tutorial"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Tutorial
              </Link>
            </li>
            <li>
              <Link
                href="/maple-valley-health"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Demo
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
