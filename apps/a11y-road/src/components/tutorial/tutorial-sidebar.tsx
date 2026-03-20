'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@a11y-road/a11y-ui/components/ui/sidebar';
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
    <Sidebar aria-label="Tutorial navigation">
      <SidebarContent>
        {tutorialSections.map((section) => (
          <SidebarGroup key={section.id}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tutorialPages
                  .filter((page) => page.section === section.id)
                  .map((page) => {
                    const href = `/tutorial/${page.slug}`;
                    const isCurrent = pathname === href;
                    const isChildActive =
                      page.children?.some((child) => pathname === `${href}/${child.slug}`) ?? false;
                    const isExpanded = expandedSlugs.has(page.slug);

                    return (
                      <SidebarMenuItem key={page.slug}>
                        <SidebarMenuButton
                          asChild
                          isActive={isCurrent || isChildActive}
                          onClick={
                            page.children
                              ? (event) => {
                                  event.preventDefault();
                                  toggleExpanded(page.slug);
                                }
                              : undefined
                          }
                        >
                          {page.children ? (
                            <button
                              type="button"
                              aria-expanded={isExpanded}
                              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${page.title} sub-pages`}
                            >
                              <ChevronIcon isExpanded={isExpanded} />
                              <span>{page.title}</span>
                            </button>
                          ) : (
                            <Link href={href} aria-current={isCurrent ? 'page' : undefined}>
                              {page.title}
                            </Link>
                          )}
                        </SidebarMenuButton>

                        {page.children && isExpanded && (
                          <SidebarMenuSub>
                            <SidebarMenuSubItem key={`${page.slug}-parent`}>
                              <SidebarMenuSubButton asChild isActive={isCurrent}>
                                <Link href={href} aria-current={isCurrent ? 'page' : undefined}>
                                  Overview
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            {page.children.map((child) => {
                              const childHref = `${href}/${child.slug}`;
                              const isChildCurrent = pathname === childHref;

                              return (
                                <SidebarMenuSubItem key={child.slug}>
                                  <SidebarMenuSubButton asChild isActive={isChildCurrent}>
                                    <Link
                                      href={childHref}
                                      aria-current={isChildCurrent ? 'page' : undefined}
                                    >
                                      {child.title}
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <svg
    className={`h-4 w-4 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
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
);
