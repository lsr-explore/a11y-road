import { Suspense } from 'react';
import { SearchPageContent } from './search-page-content';

export const metadata = {
  title: 'Search Tutorial | A11y Road',
  description: 'Search the A11y Road tutorial content.',
};

const SearchPage = () => {
  return (
    <div>
      <h1>Search Tutorial</h1>
      <Suspense fallback={<p>Loading search...</p>}>
        <SearchPageContent />
      </Suspense>
    </div>
  );
};

export default SearchPage;
