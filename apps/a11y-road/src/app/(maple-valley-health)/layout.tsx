import type { UserRole } from '@a11y-road/a11y-kit';
import { getSessionUser } from '../../lib/auth';
import { MapleValleyHealthClientLayout } from './client-layout';

const MapleValleyHealthLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getSessionUser();

  return (
    <MapleValleyHealthClientLayout
      userRole={(user?.role as UserRole) ?? null}
      displayName={user?.displayName ?? null}
    >
      {children}
    </MapleValleyHealthClientLayout>
  );
};

export default MapleValleyHealthLayout;
