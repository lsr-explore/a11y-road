export const LearnerGuide = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900">Welcome to A11y Road</h1>
      <p className="mt-3 text-gray-600">
        This guide will help you get started exploring accessibility issues on the Maple Valley
        Health demo site.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">What you&apos;ll be doing</h2>
        <p className="mt-2 text-sm text-gray-600">
          As a learner, you can browse the demo site and use the <strong>Issues side panel</strong>{' '}
          to see known accessibility issues on each page. Your goal is to understand common
          accessibility barriers and how they can be identified.
        </p>
        {/* TODO: add screenshot — show the Issues side panel open on the landing page with a few issue cards visible */}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">How to navigate</h2>
        <ol className="mt-2 space-y-3 text-sm text-gray-600 list-decimal list-inside">
          <li>
            Use the <strong>navigation menu</strong> at the top to visit different pages of the demo
            site — Home, Team, and Contact.
            {/* TODO: add screenshot — show the navigation bar with the page links highlighted */}
          </li>
          <li>
            Click the <strong>Issues</strong> button in the header to toggle the side panel. It
            shows the known accessibility issues for the page you&apos;re currently viewing.
            {/* TODO: add screenshot — show the Issues toggle button in the header */}
          </li>
          <li>
            Each issue card in the panel shows the element name, issue type, and WCAG criteria. Try
            to locate the element on the page and understand the barrier.
          </li>
          <li>
            Visit the <strong>A11y Summary</strong> page for an overview of all issues across the
            site.
          </li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Toggling accessible mode</h2>
        <p className="mt-2 text-sm text-gray-600">
          The banner at the top of the page lets you switch between the <strong>broken</strong>{' '}
          version (with intentional issues) and the <strong>accessible</strong> version (with fixes
          applied). Compare the two to see how small changes can make a big difference.
        </p>
        {/* TODO: add screenshot — show the demo banner with the toggle switch between broken and accessible modes */}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Tips</h2>
        <ul className="mt-2 space-y-2 text-sm text-gray-600 list-disc list-inside">
          <li>
            Try navigating the demo site with only your keyboard — use <kbd>Tab</kbd>,{' '}
            <kbd>Enter</kbd>, and arrow keys.
          </li>
          <li>Zoom to 200% and see if any content becomes unusable.</li>
          <li>Check color contrast by toggling between broken and accessible modes.</li>
        </ul>
      </section>

      <div className="mt-10">
        <a
          href="/maple-valley-health"
          className="inline-block rounded-md bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Get Started
        </a>
      </div>
    </>
  );
};
