import { AppFooter } from '@/components/layout/app-footer';
import './global.css';

export const metadata = {
  title: 'A11y Road',
  description: 'Accessibility workflow tutorial and demo site for learning WCAG compliance.',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {children}
        <AppFooter />
      </body>
    </html>
  );
};
export default RootLayout;
