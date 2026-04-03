'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const AppFooter = () => {
  const pathname = usePathname();
  const isDemoSite = pathname.startsWith('/maple-valley-health');

  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-3 text-sm text-gray-500">
        {isDemoSite && (
          <div className="text-center pb-2 border-b border-gray-200 w-full max-w-md">
            <p className="font-medium text-gray-600">
              Maple Valley Health &mdash; Demo Site for Accessibility Learning
            </p>
            <p className="mt-1 text-xs">
              This is not a real medical practice. All content is fictional.
            </p>
          </div>
        )}
        <p>&copy; {new Date().getFullYear()} Laurie. All rights reserved.</p>
        <p>
          Built by Laurie with{' '}
          <a
            href="https://www.anthropic.com/claude"
            className="text-gray-600 underline underline-offset-2 hover:text-gray-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            Claude
          </a>{' '}
          by Anthropic
        </p>
        <Link
          href="/about"
          className="text-gray-600 underline underline-offset-2 hover:text-gray-900"
        >
          About this project
        </Link>
      </div>
    </footer>
  );
};
