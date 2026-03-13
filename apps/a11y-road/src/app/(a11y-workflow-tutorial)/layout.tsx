import { TutorialHeader } from '@/components/tutorial/tutorial-header';
import { TutorialSidebar } from '@/components/tutorial/tutorial-sidebar';

const TutorialLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TutorialHeader />
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 py-8 gap-8">
        <TutorialSidebar />
        <main className="flex-1 min-w-0">
          <article className="prose prose-gray max-w-none">{children}</article>
        </main>
      </div>
    </>
  );
};
export default TutorialLayout;
