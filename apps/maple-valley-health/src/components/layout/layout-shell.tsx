'use client';

import { A11yDemo } from '../a11y-demo';
import { A11yModeProvider, useA11yMode } from '../providers/a11y-mode-provider';
import { SidePanelProvider } from '../providers/side-panel-provider';
import { SidePanel } from '../side-panel/side-panel';
import { DemoBanner } from './demo-banner';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

const showDemoTools = process.env.NEXT_PUBLIC_SHOW_A11Y_TOOLS !== 'false';

const HtmlWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAccessible } = useA11yMode();

  return (
    <A11yDemo instanceId="landing-page-language">
      <html lang={isAccessible ? 'en' : undefined} suppressHydrationWarning>
        <body className="min-h-screen flex flex-col">
          <div className="sticky top-0 z-30">
            {showDemoTools && <DemoBanner />}
            <SiteHeader />
          </div>
          <div className="flex-1 flex">
            <main className="flex-1 min-w-0">{children}</main>
            {showDemoTools && <SidePanel />}
          </div>
          <SiteFooter />
        </body>
      </html>
    </A11yDemo>
  );
};

export const LayoutShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <A11yModeProvider>
      <SidePanelProvider>
        <HtmlWrapper>{children}</HtmlWrapper>
      </SidePanelProvider>
    </A11yModeProvider>
  );
};
