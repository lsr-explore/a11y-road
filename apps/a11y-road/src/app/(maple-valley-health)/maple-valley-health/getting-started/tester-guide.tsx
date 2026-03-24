export const TesterGuide = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900">Tester Guide</h1>
      <p className="mt-3 text-gray-600">
        Welcome! As a tester, your job is to find and log accessibility issues on the Maple Valley
        Health demo site. This guide explains the workflow.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
        <p className="mt-2 text-sm text-gray-600">
          You will test the site in its <strong>broken</strong> state — the version with intentional
          accessibility issues. Your task is to identify as many issues as you can, log them using
          the <strong>Issue Logger</strong> panel, and submit your evaluation when you&apos;re done.
        </p>
        {/* TODO: add screenshot — show the issue logger panel open alongside the demo site in broken mode */}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Starting an evaluation</h2>
        <ol className="mt-2 space-y-3 text-sm text-gray-600 list-decimal list-inside">
          <li>
            The <strong>Issue Logger</strong> panel appears on the right side of the screen when
            you&apos;re browsing the demo site.
          </li>
          <li>
            If you don&apos;t have an active evaluation, click <strong>Start Evaluation</strong> to
            begin.
            {/* TODO: add screenshot — show the "Start Evaluation" button in the issue logger panel */}
          </li>
          <li>Once started, the panel will show the logging form and your findings.</li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Logging an issue</h2>
        <ol className="mt-2 space-y-3 text-sm text-gray-600 list-decimal list-inside">
          <li>
            <strong>Element</strong> — Select the element where you found the issue from the
            dropdown. The list shows elements on the current page. If the element isn&apos;t listed,
            choose &quot;Other&quot; and describe it.
            {/* TODO: add screenshot — show the element dropdown with a few options visible */}
          </li>
          <li>
            <strong>Issue Type</strong> — Describe the type of accessibility issue (e.g.,
            &quot;Missing alt text&quot;, &quot;Insufficient color contrast&quot;).
          </li>
          <li>
            <strong>WCAG Criteria</strong> — Select the WCAG success criteria that apply. Use the
            search to find criteria by ID or title.
            {/* TODO: add screenshot — show the WCAG criteria selector with the search field and a few checkboxes */}
          </li>
          <li>
            <strong>Description</strong> — Explain what the issue is and how it impacts users.
          </li>
          <li>
            <strong>Proposed Solution</strong> — Suggest how the issue could be fixed.
          </li>
          <li>
            Click <strong>Submit Finding</strong>. You&apos;ll see feedback indicating whether your
            finding matched a known issue.
          </li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Testing tips</h2>
        <ul className="mt-2 space-y-2 text-sm text-gray-600 list-disc list-inside">
          <li>
            Navigate each page using only your <strong>keyboard</strong> — look for focus traps,
            missing focus indicators, or unreachable elements.
          </li>
          <li>
            Use a <strong>screen reader</strong> to check that content is announced correctly and in
            a logical order.
          </li>
          <li>
            <strong>Zoom to 200%</strong> and check for layout issues, clipped text, or horizontal
            scrolling.
          </li>
          <li>
            Check <strong>color contrast</strong> using browser developer tools or a contrast
            checker.
          </li>
          <li>Test all three pages — Home, Team, and Contact — issues are spread across them.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Reviewing and submitting</h2>
        <p className="mt-2 text-sm text-gray-600">
          Visit the <strong>Evaluation</strong> page from the navigation menu to see all your
          findings, review match results, and submit your evaluation when you&apos;re satisfied.
        </p>
        {/* TODO: add screenshot — show the evaluation detail page with findings table and stats */}
      </section>

      <div className="mt-10">
        <a
          href="/maple-valley-health"
          className="inline-block rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Get Started
        </a>
      </div>
    </>
  );
};
