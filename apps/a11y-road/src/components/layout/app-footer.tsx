import Link from 'next/link';

export const AppFooter = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Laurie. All rights reserved.</p>
        <p>
          Built by Laurie with{' '}
          <a
            href="https://www.anthropic.com/claude"
            className="text-gray-600 underline underline-offset-2 hover:text-gray-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            Claude
          </a>{' '}
          by Anthropic
        </p>
        <Link
          href="/about"
          className="text-gray-600 underline underline-offset-2 hover:text-gray-900"
        >
          About this project
        </Link>
      </div>
    </footer>
  );
};
