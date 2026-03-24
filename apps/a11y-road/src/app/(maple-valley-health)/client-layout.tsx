'use client';

import type { UserRole } from '@a11y-road/a11y-kit';
import { usePathname } from 'next/navigation';
import { IssueLoggerPanel } from '@/components/issue-logger/issue-logger-panel';
import { IssueLoggerPanelProvider } from '@/components/issue-logger/issue-logger-panel-provider';
import { IssueLoggerProvider } from '@/components/issue-logger/issue-logger-provider';
import { DemoBanner } from '@/components/layout/demo-banner';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { A11yModeProvider } from '@/components/providers/a11y-mode-provider';
import { ElementRegistryProvider } from '@/components/providers/element-registry-provider';
import { SidePanelProvider } from '@/components/providers/side-panel-provider';
import { UserRoleProvider } from '@/components/providers/user-role-provider';
import { SidePanel } from '@/components/side-panel/side-panel';

const showDemoTools = process.env.NEXT_PUBLIC_SHOW_A11Y_TOOLS !== 'false';

interface ClientLayoutProps {
  userRole: UserRole | null;
  displayName: string | null;
  children: React.ReactNode;
}

export const MapleValleyHealthClientLayout = ({
  userRole,
  displayName,
  children,
}: ClientLayoutProps) => {
  const pathname = usePathname();
  const isTester = userRole === 'tester';
  const isEvaluationPage = pathname.startsWith('/maple-valley-health/evaluation');
  const isGuidePage = pathname.startsWith('/maple-valley-health/getting-started');
  const showBanner = showDemoTools && !isTester && !isGuidePage;
  const showSidePanel = showDemoTools && !isTester && !isGuidePage;
  const showIssueLogger = isTester && !isEvaluationPage && !isGuidePage;

  const content = (
    <UserRoleProvider role={userRole} displayName={displayName}>
      <A11yModeProvider forceBroken={isTester}>
        <ElementRegistryProvider>
          <SidePanelProvider>
            <div className="sticky top-0 z-30">
              {showBanner && <DemoBanner />}
              <SiteHeader />
            </div>
            <div className="flex-1 flex">
              <main className="flex-1 min-w-0">{children}</main>
              {showSidePanel && <SidePanel />}
              {showIssueLogger && <IssueLoggerPanel />}
            </div>
            <SiteFooter />
          </SidePanelProvider>
        </ElementRegistryProvider>
      </A11yModeProvider>
    </UserRoleProvider>
  );

  if (isTester) {
    return (
      <IssueLoggerProvider>
        <IssueLoggerPanelProvider>{content}</IssueLoggerPanelProvider>
      </IssueLoggerProvider>
    );
  }

  return content;
};
