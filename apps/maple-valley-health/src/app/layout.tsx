import './global.css';
import { LayoutShell } from '../components/layout/layout-shell';

export const metadata = {
  title: 'Maple Valley Health',
  description: 'A demo medical practice site for accessibility learning.',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <LayoutShell>{children}</LayoutShell>;
};
export default RootLayout;
