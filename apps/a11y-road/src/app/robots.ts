import type { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: ['/api/', '/login/', '/site-auth/', '/maple-valley-health/editor/'],
  },
  sitemap: 'https://a11y-road.vercel.app/sitemap.xml',
});

export default robots;
