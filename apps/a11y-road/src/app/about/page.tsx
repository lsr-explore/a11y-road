import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — A11y Road',
  description: 'About the A11y Road project and the people behind it.',
};

const AboutPage = () => {
  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 py-16">
      <Link
        href="/"
        className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-900"
      >
        &larr; Back to home
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-gray-900">About A11y Road</h1>

      <p className="mt-4 text-gray-700 leading-relaxed">
        A11y Road is an open learning project that teaches web accessibility through hands-on
        examples. It pairs a step-by-step tutorial with an interactive demo site (Maple Valley
        Health) where you can see — and fix — real accessibility issues.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Who built this</h2>

      <div className="mt-4 space-y-6 text-gray-700 leading-relaxed">
        <div>
          <h3 className="font-semibold text-gray-900">Laurie — Creator &amp; architect</h3>
          <p className="mt-1">
            Laurie conceived, designed, and directs the project. She sets the vision, makes
            architectural decisions, reviews all output, and provides the accessibility domain
            expertise that shapes every page.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            Claude by Anthropic — Coding &amp; writing collaborator
          </h3>
          <p className="mt-1">
            Claude is an AI assistant that helped build this project. Its contributions include
            drafting tutorial content, writing application code, configuring tooling, and
            pair-programming on features. All of Claude&rsquo;s work is reviewed and directed by
            Laurie.
          </p>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">How AI was used</h2>

      <p className="mt-4 text-gray-700 leading-relaxed">
        This project was built through a human–AI collaboration. Laurie provides the direction,
        expertise, and quality review. Claude contributes code, content drafts, and technical
        implementation. Every commit reflects work that Laurie has reviewed, refined, and approved.
      </p>

      <p className="mt-4 text-gray-700 leading-relaxed">
        We believe in transparency about AI-assisted work. If you have questions about how this
        project was built, feel free to explore the{' '}
        <a
          href="https://github.com"
          className="text-indigo-700 underline underline-offset-2 hover:text-indigo-900"
          target="_blank"
          rel="noopener noreferrer"
        >
          source code on GitHub
        </a>
        .
      </p>
    </main>
  );
};
export default AboutPage;
