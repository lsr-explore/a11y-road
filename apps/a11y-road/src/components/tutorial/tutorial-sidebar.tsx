'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { tutorialPages, tutorialSections } from '@/data/tutorial-navigation';

export const TutorialSidebar = () => {
  const pathname = usePathname();

  return (
    <nav aria-label="Tutorial navigation" className="w-64 shrink-0">
      <div className="sticky top-4 space-y-6">
        {tutorialSections.map((section) => (
          <div key={section.id}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              {section.title}
            </h2>
            <ul className="space-y-1">
              {tutorialPages
                .filter((page) => page.section === section.id)
                .map((page) => {
                  const href = `/tutorial/${page.slug}`;
                  const isCurrent = pathname === href;

                  return (
                    <li key={page.slug}>
                      <Link
                        href={href}
                        className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                          isCurrent
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        aria-current={isCurrent ? 'page' : undefined}
                      >
                        {page.title}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
};
