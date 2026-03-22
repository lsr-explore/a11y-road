'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { registry } from '../../data/issues-registry';
import { getPageByRoute } from '../../data/page-metadata';
import { useSidePanel } from '../providers/side-panel-provider';
import { useUserRole } from '../providers/user-role-provider';

const showDemoTools = process.env.NEXT_PUBLIC_SHOW_A11Y_TOOLS !== 'false';

const SidePanelToggle = () => {
  const { isOpen, toggle } = useSidePanel();
  const pathname = usePathname();
  const page = getPageByRoute(pathname);
  const resolved = page ? registry.getResolvedByPage(page.id) : [];

  return (
    <button
      onClick={toggle}
      type="button"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
        isOpen ? 'bg-teal-700 text-white' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
      }`}
      aria-label={isOpen ? 'Close accessibility issues panel' : 'Open accessibility issues panel'}
      aria-expanded={isOpen}
    >
      <span>Issues</span>
      {resolved.length > 0 && (
        <span
          className={`inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full text-xs font-semibold ${
            isOpen ? 'bg-teal-600 text-white' : 'bg-teal-200 text-teal-800'
          }`}
        >
          {resolved.length}
        </span>
      )}
    </button>
  );
};

const isNavLinkActive = (pathname: string, href: string): boolean => {
  if (href === '/maple-valley-health') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
};

export const SiteHeader = () => {
  const pathname = usePathname();
  const { role, displayName, isRole } = useUserRole();
  const isTester = isRole('tester');
  const isContentEditor = isRole('content-editor');

  const navLinks = [
    { href: '/maple-valley-health', label: 'Home' },
    { href: '/maple-valley-health/team', label: 'Team' },
    { href: '/maple-valley-health/contact', label: 'Contact' },
    ...(showDemoTools && !isTester
      ? [{ href: '/maple-valley-health/a11y-summary', label: 'A11y Summary' }]
      : []),
    ...(isTester ? [{ href: '/maple-valley-health/evaluation', label: 'Evaluation' }] : []),
    ...(isContentEditor ? [{ href: '/maple-valley-health/editor', label: 'Editor' }] : []),
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
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
          <Link href="/maple-valley-health" className="text-xl font-bold text-teal-700">
            Maple Valley Health
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <nav aria-label="Main navigation">
            <ul className="flex gap-6">
              {navLinks.map((link) => {
                const isActive = isNavLinkActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                        isActive ? 'text-teal-700 underline underline-offset-4' : 'text-gray-600'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          {showDemoTools && !isTester && <SidePanelToggle />}
          {role && (
            <div className="flex items-center gap-3 text-sm border-l border-gray-200 pl-4">
              <span className="text-gray-600">{displayName}</span>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-gray-500 hover:text-gray-700 underline text-xs"
                >
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
