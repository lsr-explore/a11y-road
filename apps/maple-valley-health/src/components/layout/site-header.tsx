'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidePanel } from '../providers/side-panel-provider';
import { registry } from '../../data/issues-registry';
import { getPageByRoute } from '../../data/page-metadata';

const showDemoTools = process.env.NEXT_PUBLIC_SHOW_A11Y_TOOLS !== 'false';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/contact', label: 'Contact' },
  ...(showDemoTools ? [{ href: '/a11y-summary', label: 'A11y Summary' }] : []),
];

function SidePanelToggle() {
  const { isOpen, toggle } = useSidePanel();
  const pathname = usePathname();
  const page = getPageByRoute(pathname);
  const resolved = page ? registry.getResolvedByPage(page.id) : [];

  return (
    <button
      onClick={toggle}
      type="button"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
        isOpen
          ? 'bg-teal-700 text-white'
          : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
      }`}
      aria-label={isOpen ? 'Close accessibility issues panel' : 'Open accessibility issues panel'}
      aria-expanded={isOpen}
    >
      <span>Issues</span>
      {resolved.length > 0 && (
        <span className={`inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full text-xs font-semibold ${
          isOpen ? 'bg-teal-600 text-white' : 'bg-teal-200 text-teal-800'
        }`}>
          {resolved.length}
        </span>
      )}
    </button>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-teal-700">
          Maple Valley Health
        </Link>
        <div className="flex items-center gap-6">
          <nav aria-label="Main navigation">
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                      pathname === link.href
                        ? 'text-teal-700 underline underline-offset-4'
                        : 'text-gray-600'
                    }`}
                    aria-current={pathname === link.href ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {showDemoTools && <SidePanelToggle />}
        </div>
      </div>
    </header>
  );
}
