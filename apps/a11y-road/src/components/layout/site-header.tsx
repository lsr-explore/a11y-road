'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useIsMobile,
} from '@a11y-road/a11y-ui';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { registry } from '../../data/issues-registry';
import { getPageByRoute } from '../../data/page-metadata';
import { useIssueLoggerPanel } from '../issue-logger/issue-logger-panel-provider';
import { useSidePanel } from '../providers/side-panel-provider';
import { useUserRole } from '../providers/user-role-provider';

const showDemoTools = process.env.NEXT_PUBLIC_SHOW_A11Y_TOOLS !== 'false';

const isNavLinkActive = (pathname: string, href: string): boolean => {
  if (href === '/maple-valley-health') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
};

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

const IssueLoggerToggle = () => {
  const { isOpen, toggle } = useIssueLoggerPanel();

  return (
    <button
      onClick={toggle}
      type="button"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
        isOpen ? 'bg-indigo-700 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
      }`}
      aria-label={isOpen ? 'Close issue logger' : 'Open issue logger'}
      aria-expanded={isOpen}
    >
      <span>Log an Issue</span>
    </button>
  );
};

interface NavLinkItem {
  href: string;
  label: string;
}

const NavLink = ({
  link,
  pathname,
  className,
}: {
  link: NavLinkItem;
  pathname: string;
  className?: string;
}) => {
  const isActive = isNavLinkActive(pathname, link.href);
  return (
    <Link
      href={link.href}
      className={
        className ??
        `text-sm font-medium transition-colors hover:text-teal-600 ${
          isActive ? 'text-teal-700 underline underline-offset-4' : 'text-gray-600'
        }`
      }
      aria-current={isActive ? 'page' : undefined}
    >
      {link.label}
    </Link>
  );
};

const MobileNavLink = ({
  link,
  pathname,
  onClick,
}: {
  link: NavLinkItem;
  pathname: string;
  onClick: () => void;
}) => {
  const isActive = isNavLinkActive(pathname, link.href);
  return (
    <Link
      href={link.href}
      onClick={onClick}
      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-teal-50 text-teal-700 font-semibold'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {link.label}
    </Link>
  );
};

export const SiteHeader = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { role, displayName, isRole } = useUserRole();
  const isTester = isRole('tester');
  const isContentEditor = isRole('content-editor');
  const isGuidePage = pathname.startsWith('/maple-valley-health/getting-started');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Maple Valley Health site nav links
  const siteLinks: NavLinkItem[] = [
    { href: '/maple-valley-health', label: 'Home' },
    { href: '/maple-valley-health/team', label: 'Team' },
    { href: '/maple-valley-health/contact', label: 'Contact' },
  ];

  // A11y Road platform links (role-based)
  const platformLinks: NavLinkItem[] = [
    ...(showDemoTools && !isTester
      ? [{ href: '/maple-valley-health/a11y-summary', label: 'A11y Summary' }]
      : []),
    ...(!isContentEditor && role
      ? [{ href: '/maple-valley-health/getting-started', label: 'Guide' }]
      : []),
    ...(isTester ? [{ href: '/maple-valley-health/evaluation', label: 'Evaluation' }] : []),
    ...(isContentEditor ? [{ href: '/maple-valley-health/editor', label: 'Editor' }] : []),
    { href: '/tutorial', label: 'Tutorial' },
  ];

  const showIssuesToggle = showDemoTools && !isTester && !isGuidePage;
  const showLoggerToggle = isTester && !isGuidePage;

  if (isMobile) {
    return (
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-700">
            A11y Road
          </Link>
          <div className="flex items-center gap-2">
            {showIssuesToggle && <SidePanelToggle />}
            {showLoggerToggle && <IssueLoggerToggle />}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                </SheetHeader>
                <nav aria-label="Mobile navigation" className="mt-4 flex flex-col gap-6">
                  <div>
                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Maple Valley Health
                    </p>
                    <div className="flex flex-col gap-1">
                      {siteLinks.map((link) => (
                        <MobileNavLink
                          key={link.href}
                          link={link}
                          pathname={pathname}
                          onClick={closeMobileMenu}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      A11y Road
                    </p>
                    <div className="flex flex-col gap-1">
                      {platformLinks.map((link) => (
                        <MobileNavLink
                          key={link.href}
                          link={link}
                          pathname={pathname}
                          onClick={closeMobileMenu}
                        />
                      ))}
                    </div>
                  </div>
                  {role && (
                    <div className="border-t border-gray-200 pt-4">
                      <p className="px-3 text-sm text-gray-600 mb-2">{displayName}</p>
                      <form action="/api/auth/logout" method="POST">
                        <button
                          type="submit"
                          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                          Sign out
                        </button>
                      </form>
                    </div>
                  )}
                  {!role && (
                    <div className="border-t border-gray-200 pt-4">
                      <MobileNavLink
                        link={{ href: '/login', label: 'Log in' }}
                        pathname={pathname}
                        onClick={closeMobileMenu}
                      />
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top bar: A11y Road platform nav */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            A11y Road
          </Link>
          <div className="flex items-center gap-4">
            <nav aria-label="Platform navigation">
              <ul className="flex items-center gap-4">
                {platformLinks.map((link) => (
                  <li key={link.href}>
                    <NavLink
                      link={link}
                      pathname={pathname}
                      className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                        isNavLinkActive(pathname, link.href)
                          ? 'text-teal-700 underline underline-offset-4'
                          : 'text-gray-500'
                      }`}
                    />
                  </li>
                ))}
              </ul>
            </nav>
            {showIssuesToggle && <SidePanelToggle />}
            {showLoggerToggle && <IssueLoggerToggle />}
            {role ? (
              <div className="flex items-center gap-3 text-sm border-l border-gray-300 pl-4">
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
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors border-l border-gray-300 pl-4"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Bottom bar: Maple Valley Health site nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/maple-valley-health" className="text-xl font-bold text-teal-700">
          Maple Valley Health
        </Link>
        <nav aria-label="Site navigation">
          <ul className="flex items-center gap-6">
            {siteLinks.map((link) => (
              <li key={link.href}>
                <NavLink link={link} pathname={pathname} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};
