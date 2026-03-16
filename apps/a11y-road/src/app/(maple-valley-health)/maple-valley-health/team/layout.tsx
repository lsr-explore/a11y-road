'use client';

import { TeamDataProvider } from '@/components/providers/team-data-provider';

const TeamLayout = ({ children }: { children: React.ReactNode }) => {
  return <TeamDataProvider>{children}</TeamDataProvider>;
};
export default TeamLayout;
