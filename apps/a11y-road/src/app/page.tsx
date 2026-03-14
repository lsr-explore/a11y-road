import Link from 'next/link';

const HubPage = () => {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900">A11y Road</h1>
        <p className="mt-4 text-lg text-gray-600">
          Learn accessibility by doing. Explore the tutorial or dive into the interactive demo.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/tutorial"
            className="group block rounded-xl border border-gray-200 bg-white p-8 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-indigo-700 group-hover:text-indigo-800">
              A11y Workflow Tutorial
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Foundations of accessibility and a step-by-step workflow for building inclusive
              products.
            </p>
          </Link>

          <Link
            href="/maple-valley-health"
            className="group block rounded-xl border border-gray-200 bg-white p-8 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-teal-700 group-hover:text-teal-800">
              Maple Valley Health Demo
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              An interactive demo site with intentional accessibility issues you can toggle and
              explore.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
};
export default HubPage;
