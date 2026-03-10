export interface PageMeta {
  id: string;
  name: string;
  route: string;
}

export const pages: PageMeta[] = [
  { id: 'landing', name: 'Landing Page', route: '/' },
  { id: 'contact', name: 'Contact Page', route: '/contact' },
];

export function getPageById(id: string): PageMeta | undefined {
  return pages.find((p) => p.id === id);
}

export function getPageByRoute(route: string): PageMeta | undefined {
  return pages.find((p) => p.route === route);
}
