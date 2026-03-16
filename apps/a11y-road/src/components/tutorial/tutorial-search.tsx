'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const TutorialSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      router.push(`/tutorial/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      role="search"
      aria-label="Tutorial search"
      onSubmit={handleSubmit}
      className="flex-1 max-w-sm"
    >
      <div className="flex">
        <label htmlFor="tutorial-search-input" className="sr-only">
          Search tutorial
        </label>
        <input
          id="tutorial-search-input"
          type="search"
          name="q"
          placeholder="Search tutorial..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};
