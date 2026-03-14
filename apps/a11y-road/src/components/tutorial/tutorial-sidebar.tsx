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
                  const isChildActive =
                    page.children?.some((child) => pathname === `${href}/${child.slug}`) ?? false;
                  const isExpanded = isCurrent || isChildActive;

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
