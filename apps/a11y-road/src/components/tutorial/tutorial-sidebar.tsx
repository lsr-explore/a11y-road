'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { tutorialPages, tutorialSections } from '@/data/tutorial-navigation';

export const TutorialSidebar = () => {
  const pathname = usePathname();
  const [expandedSlugs, setExpandedSlugs] = useState<Set<string>>(new Set());

  // Auto-expand when navigating to a child page
  useEffect(() => {
    for (const page of tutorialPages) {
      if (!page.children) continue;
      const href = `/tutorial/${page.slug}`;
      const isOnParentOrChild =
        pathname === href || page.children.some((child) => pathname === `${href}/${child.slug}`);
      if (isOnParentOrChild) {
        setExpandedSlugs((prev) => {
          if (prev.has(page.slug)) return prev;
          const next = new Set(prev);
          next.add(page.slug);
          return next;
        });
      }
    }
  }, [pathname]);

  const toggleExpanded = (slug: string) => {
    setExpandedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  return (
    <nav aria-label="Tutorial navigation" className="w-64 shrink-0">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto space-y-6 pb-4">
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
                  const isChildActive =
                    page.children?.some((child) => pathname === `${href}/${child.slug}`) ?? false;
                  const isExpanded = expandedSlugs.has(page.slug);

                  return (
                    <li key={page.slug}>
                      <div className="flex items-center">
                        <Link
                          href={href}
                          className={`flex-1 rounded-md px-3 py-2 text-sm transition-colors ${
                            isCurrent || isChildActive
                              ? 'bg-indigo-50 text-indigo-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                          aria-current={isCurrent ? 'page' : undefined}
                        >
                          {page.title}
                        </Link>
                        {page.children && (
                          <button
                            onClick={() => toggleExpanded(page.slug)}
                            className="flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            aria-expanded={isExpanded}
                            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${page.title} sub-pages`}
                          >
                            <svg
                              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      {page.children && isExpanded && (
                        <ul className="ml-3 mt-1 space-y-1 border-l border-gray-200 pl-3">
                          {page.children.map((child) => {
                            const childHref = `${href}/${child.slug}`;
                            const isChildCurrent = pathname === childHref;

                            return (
                              <li key={child.slug}>
                                <Link
                                  href={childHref}
                                  className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                                    isChildCurrent
                                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                  }`}
                                  aria-current={isChildCurrent ? 'page' : undefined}
                                >
                                  {child.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
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
