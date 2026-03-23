'use client';

import type { UserRole } from '@a11y-road/a11y-kit';
import { createContext, useContext, useMemo } from 'react';

interface UserRoleContextValue {
  role: UserRole | null;
  displayName: string | null;
  isRole: (...roles: UserRole[]) => boolean;
}

const UserRoleContext = createContext<UserRoleContextValue>({
  role: null,
  displayName: null,
  isRole: () => false,
});

interface UserRoleProviderProps {
  role: UserRole | null;
  displayName: string | null;
  children: React.ReactNode;
}

export const UserRoleProvider = ({ role, displayName, children }: UserRoleProviderProps) => {
  const value = useMemo<UserRoleContextValue>(
    () => ({
      role,
      displayName,
      isRole: (...roles) => role !== null && roles.includes(role),
    }),
    [role, displayName],
  );

  return <UserRoleContext.Provider value={value}>{children}</UserRoleContext.Provider>;
};

export const useUserRole = () => useContext(UserRoleContext);
