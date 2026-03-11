export interface PageMeta {
  id: string;
  name: string;
  route: string;
}

export const pages: PageMeta[] = [
  { id: 'landing', name: 'Landing Page', route: '/' },
  { id: 'contact', name: 'Contact Page', route: '/contact' },
];

export const getPageById = (id: string): PageMeta | undefined => {
  return pages.find((page) => page.id === id);
};

export const getPageByRoute = (route: string): PageMeta | undefined => {
  return pages.find((page) => page.route === route);
};
