'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useIsMobile,
} from '@a11y-road/a11y-ui';
import { Menu, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useState } from 'react';
import { TutorialSearch } from './tutorial-search';

const isLinkActive = (pathname: string, href: string): boolean => {
  if (href === '/tutorial') return pathname === '/tutorial';
  return pathname.startsWith(href);
};

export const TutorialHeader = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { href: '/tutorial', label: 'Tutorial' },
    { href: '/maple-valley-health', label: 'Demo' },
  ];

  if (isMobile) {
    return (
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="px-4 py-3 flex items-center justify-between">
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
            <Link href="/tutorial" className="text-lg font-bold text-indigo-700">
              Tutorial
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowMobileSearch((prev) => !prev)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label={showMobileSearch ? 'Close search' : 'Open search'}
              aria-expanded={showMobileSearch}
            >
              <Search className="h-5 w-5" />
            </button>
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
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                </SheetHeader>
                <nav aria-label="Mobile navigation" className="mt-4 flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const isActive = isLinkActive(pathname, link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMobileMenu}
                        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {showMobileSearch && (
          <div className="px-4 pb-3 border-t border-gray-100 pt-2">
            <Suspense>
              <TutorialSearch />
            </Suspense>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
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
