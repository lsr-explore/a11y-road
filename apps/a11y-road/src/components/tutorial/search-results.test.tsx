import { describe, expect, it } from 'vitest';
import { mockSearchResults } from './tutorial-search.mock';

describe('SearchResultsList', () => {
  it('mock data has expected shape', () => {
    expect(mockSearchResults).toHaveLength(3);
    expect(mockSearchResults[0]).toMatchObject({
      id: expect.any(String),
      url: expect.any(String),
      title: expect.any(String),
      excerpt: expect.any(String),
    });
  });

  it('normalises URLs by stripping .html suffix', () => {
    const urlWithHtml = '/tutorial/development/meet-the-team.html';
    const expected = '/tutorial/development/meet-the-team';
    expect(urlWithHtml.replace(/\.html$/, '')).toBe(expected);
  });

  it('preserves URLs without .html suffix', () => {
    const url = '/tutorial/getting-started';
    expect(url.replace(/\.html$/, '')).toBe(url);
  });
});
