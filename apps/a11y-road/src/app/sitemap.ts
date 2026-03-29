import type { MetadataRoute } from 'next';

const BASE_URL = 'https://a11y-road.vercel.app';

const staticRoutes = [
  '/',
  '/about',
  '/tutorial',
  '/tutorial/search',
  '/tutorial/business-case',
  '/tutorial/legal-landscape',
  '/tutorial/what-is-accessibility',
  '/tutorial/people-and-devices',
  '/tutorial/people-and-devices/screen-readers',
  '/tutorial/people-and-devices/keyboard-only',
  '/tutorial/people-and-devices/low-vision',
  '/tutorial/people-and-devices/color-vision',
  '/tutorial/people-and-devices/deaf-and-hard-of-hearing',
  '/tutorial/people-and-devices/cognitive-and-neurological',
  '/tutorial/wcag-overview',
  '/tutorial/wcag-people-map',
  '/tutorial/wcag-in-practice',
  '/tutorial/user-research',
  '/tutorial/user-research/meet-the-team',
  '/tutorial/product-and-design',
  '/tutorial/product-and-design/meet-the-team',
  '/tutorial/development',
  '/tutorial/development/meet-the-team',
  '/tutorial/testing',
  '/tutorial/testing/screen-reader-testing',
  '/tutorial/testing/meet-the-team',
  '/tutorial/dev-tools',
  '/tutorial/dev-tools/meet-the-team',
  '/tutorial/dev-tools/browser-devtools',
  '/tutorial/dev-tools/eslint-jsx-a11y',
  '/tutorial/dev-tools/storybook-a11y',
  '/tutorial/dev-tools/vitest-axe',
  '/tutorial/dev-tools/playwright-axe',
  '/tutorial/monitoring-and-feedback',
  '/tutorial/monitoring-and-feedback/meet-the-team',
  '/tutorial/try-it-yourself',
  '/maple-valley-health',
  '/maple-valley-health/getting-started',
  '/maple-valley-health/team',
  '/maple-valley-health/contact',
  '/maple-valley-health/a11y-summary',
  '/maple-valley-health/evaluation',
];

const sitemap = (): MetadataRoute.Sitemap =>
  staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route.startsWith('/tutorial') ? 0.8 : 0.6,
  }));

export default sitemap;
