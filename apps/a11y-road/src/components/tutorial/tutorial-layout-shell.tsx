'use client';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@a11y-road/a11y-ui';

interface TutorialLayoutShellProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
}

export const TutorialLayoutShell = ({ sidebar, header, children }: TutorialLayoutShellProps) => {
  return (
    <>
      {header}
      <SidebarProvider>
        {sidebar}
        <SidebarInset>
          <div className="md:hidden px-4 pt-2">
            <SidebarTrigger />
          </div>
          <div className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
            <article className="prose prose-gray max-w-none" data-pagefind-body>
              {children}
            </article>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};
