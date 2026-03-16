export interface PageMeta {
  id: string;
  name: string;
  route: string;
}

export const pages: PageMeta[] = [
  { id: 'landing', name: 'Landing Page', route: '/maple-valley-health' },
  { id: 'team', name: 'Team Page', route: '/maple-valley-health/team' },
  { id: 'contact', name: 'Contact Page', route: '/maple-valley-health/contact' },
];

export const getPageById = (id: string): PageMeta | undefined => {
  return pages.find((page) => page.id === id);
};

export const getPageByRoute = (route: string): PageMeta | undefined => {
  return pages.find((page) => page.route === route);
};
