'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface SearchResult {
  id: string;
  url: string;
  title: string;
  excerpt: string;
}

/** Strip `.html` suffix that Pagefind adds from pre-rendered Next.js output. */
const normaliseUrl = (raw: string): string => raw.replace(/\.html$/, '');

interface SearchResultsProps {
  query: string;
}

export const SearchResultsList = ({ query }: SearchResultsProps) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const pagefindRef = useRef<{
    search: (query: string) => Promise<{
      results: Array<{
        id: string;
        data: () => Promise<{ url: string; meta: { title?: string }; excerpt: string }>;
      }>;
    }>;
  } | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setStatus('idle');
      return;
    }

    setStatus('loading');

    try {
      if (!pagefindRef.current) {
        const pagefindPath = '/pagefind/pagefind.js';
        const module = await import(/* webpackIgnore: true */ pagefindPath);
        pagefindRef.current = module.default ?? module;
      }

      const pagefind = pagefindRef.current;
      if (!pagefind) return;

      const response = await pagefind.search(searchQuery);
      const resolved = await Promise.all(
        response.results.map(async (result) => {
          const data = await result.data();
          return {
            id: result.id,
            url: normaliseUrl(data.url),
            title: data.meta.title ?? 'Untitled',
            excerpt: data.excerpt,
          };
        }),
      );

      setResults(resolved);
      setStatus('done');
    } catch {
      setResults([]);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    search(query);
  }, [query, search]);

  if (status === 'idle') {
    return null;
  }

  if (status === 'loading') {
    return <p>Searching...</p>;
  }

  if (status === 'error') {
    return (
      <p className="text-gray-500">
        Search is not available. Run <code>pnpm build</code> to generate the search index.
      </p>
    );
  }

  if (results.length === 0) {
    return (
      <p aria-live="polite">
        No results found for <strong>{query}</strong>.
      </p>
    );
  }

  return (
    <div aria-live="polite">
      <p className="text-sm text-gray-500 mb-4">
        {results.length} result{results.length === 1 ? '' : 's'} for <strong>{query}</strong>
      </p>
      <ul className="space-y-4 list-none pl-0">
        {results.map((result) => (
          <li key={result.id} className="border-b border-gray-100 pb-4 last:border-b-0">
            <Link href={result.url} className="text-indigo-700 font-medium hover:underline">
              {result.title}
            </Link>
            <p
              className="text-sm text-gray-600 mt-1"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Pagefind returns pre-sanitised excerpt HTML with <mark> highlights
              dangerouslySetInnerHTML={{ __html: result.excerpt }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
