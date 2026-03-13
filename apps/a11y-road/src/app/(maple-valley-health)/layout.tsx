'use client';

import { DemoBanner } from '@/components/layout/demo-banner';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { A11yModeProvider } from '@/components/providers/a11y-mode-provider';
import { SidePanelProvider } from '@/components/providers/side-panel-provider';
import { SidePanel } from '@/components/side-panel/side-panel';

const showDemoTools = process.env.NEXT_PUBLIC_SHOW_A11Y_TOOLS !== 'false';

const MapleValleyHealthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <A11yModeProvider>
      <SidePanelProvider>
        <div className="sticky top-0 z-30">
          {showDemoTools && <DemoBanner />}
          <SiteHeader />
        </div>
        <div className="flex-1 flex">
          <main className="flex-1 min-w-0">{children}</main>
          {showDemoTools && <SidePanel />}
        </div>
        <SiteFooter />
      </SidePanelProvider>
    </A11yModeProvider>
  );
};
export default MapleValleyHealthLayout;
