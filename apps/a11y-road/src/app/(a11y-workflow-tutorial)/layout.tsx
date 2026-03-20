import { TutorialHeader } from '@/components/tutorial/tutorial-header';
import { TutorialLayoutShell } from '@/components/tutorial/tutorial-layout-shell';
import { TutorialSidebar } from '@/components/tutorial/tutorial-sidebar';

const TutorialLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <TutorialLayoutShell sidebar={<TutorialSidebar />} header={<TutorialHeader />}>
      {children}
    </TutorialLayoutShell>
  );
};
export default TutorialLayout;
