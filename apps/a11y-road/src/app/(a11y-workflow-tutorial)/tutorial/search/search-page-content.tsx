'use client';

import { useSearchParams } from 'next/navigation';
import { SearchResultsList } from '@/components/tutorial/search-results';

export const SearchPageContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';

  if (!query) {
    return <p className="text-gray-500">Enter a search term above to find tutorial content.</p>;
  }

  return <SearchResultsList query={query} />;
};
