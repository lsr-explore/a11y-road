'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSidePanel } from '../providers/side-panel-provider';
import { registry } from '../../data/issues-registry';
import { getPageByRoute } from '../../data/page-metadata';
import { IssueCard } from './issue-card';

export function SidePanel() {
  const { isOpen, close } = useSidePanel();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const page = getPageByRoute(pathname);
  const resolved = page ? registry.getResolvedByPage(page.id) : [];

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }

      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  return (
    <aside
      ref={panelRef}
      role="complementary"
      aria-label="Accessibility issues panel"
      className={`shrink-0 w-96 max-w-[90vw] border-l border-gray-200 bg-white transition-all duration-300 ${
        isOpen ? 'ml-0' : '-mr-96'
      }`}
    >
      <div className="sticky top-0 h-screen flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {page ? `${page.name} Issues` : 'Accessibility Issues'}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={close}
            type="button"
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {resolved.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No tracked accessibility issues for this page.
            </p>
          ) : (
            resolved.map((r) => <IssueCard key={r.instance.id} resolved={r} />)
          )}
        </div>
      </div>
    </aside>
  );
}
