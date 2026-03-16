import type { SearchResult } from './search-results';

export const mockSearchResults: SearchResult[] = [
  {
    id: 'result-1',
    url: '/tutorial/getting-started',
    title: 'Getting Started',
    excerpt: 'Learn how to <mark>set up</mark> your accessibility workflow.',
  },
  {
    id: 'result-2',
    url: '/tutorial/semantic-html',
    title: 'Semantic HTML',
    excerpt: 'Understanding <mark>semantic</mark> elements for better accessibility.',
  },
  {
    id: 'result-3',
    url: '/tutorial/aria-labels',
    title: 'ARIA Labels',
    excerpt: 'How to use <mark>ARIA</mark> attributes effectively.',
  },
];
