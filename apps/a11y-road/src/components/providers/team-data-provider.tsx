'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { TeamMember } from '@/data/team-members';
import { initialTeamMembers } from '@/data/team-members';

type NotificationType = 'add' | 'edit' | 'delete';

interface TeamNotification {
  type: NotificationType;
  memberName: string;
}

interface TeamDataContextValue {
  teamMembers: TeamMember[];
  notification: TeamNotification | null;
  addMember: (member: Omit<TeamMember, 'id'>) => void;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteMember: (id: string) => void;
  clearNotification: () => void;
  getMemberById: (id: string) => TeamMember | undefined;
}

const TeamDataContext = createContext<TeamDataContextValue | null>(null);

export const useTeamData = (): TeamDataContextValue => {
  const context = useContext(TeamDataContext);
  if (!context) {
    throw new Error('useTeamData must be used within a TeamDataProvider');
  }
  return context;
};

export const TeamDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [notification, setNotification] = useState<TeamNotification | null>(null);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const addMember = useCallback((member: Omit<TeamMember, 'id'>) => {
    const id = `member-${Date.now()}`;
    const newMember: TeamMember = { ...member, id };
    setTeamMembers((prev) => [...prev, newMember]);
    setNotification({ type: 'add', memberName: member.name });
  }, []);

  const updateMember = useCallback((id: string, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) =>
      prev.map((member) => {
        if (member.id !== id) return member;
        const updated = { ...member, ...updates };
        setNotification({ type: 'edit', memberName: updated.name });
        return updated;
      }),
    );
  }, []);

  const deleteMember = useCallback((id: string) => {
    setTeamMembers((prev) => {
      const member = prev.find((item) => item.id === id);
      if (member) {
        setNotification({ type: 'delete', memberName: member.name });
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const getMemberById = useCallback(
    (id: string) => teamMembers.find((member) => member.id === id),
    [teamMembers],
  );

  return (
    <TeamDataContext.Provider
      value={{
        teamMembers,
        notification,
        addMember,
        updateMember,
        deleteMember,
        clearNotification,
        getMemberById,
      }}
    >
      {children}
    </TeamDataContext.Provider>
  );
};
