import Link from 'next/link';
import { tutorialPages, tutorialSections } from '@/data/tutorial-navigation';

export const metadata = {
  title: 'Tutorial | A11y Road',
  description:
    'Learn accessibility foundations and a step-by-step workflow for building inclusive products.',
};

const TutorialIndexPage = () => {
  return (
    <div>
      <h1>A11y Workflow Tutorial</h1>
      <p className="lead">
        A practical guide to building accessibility into every stage of your product development
        workflow.
      </p>

      {tutorialSections.map((section) => (
        <section key={section.id} className="mt-8">
          <h2>{section.title}</h2>
          <ul>
            {tutorialPages
              .filter((page) => page.section === section.id)
              .map((page) => (
                <li key={page.slug}>
                  <Link href={`/tutorial/${page.slug}`}>{page.title}</Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
};
export default TutorialIndexPage;
