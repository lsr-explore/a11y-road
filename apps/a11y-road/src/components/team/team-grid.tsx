'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTeamData } from '../providers/team-data-provider';
import { DeleteDialog } from './delete-dialog';
import { TeamCard } from './team-card';
import { TeamNotification } from './team-notification';

export const TeamGrid = () => {
  const { teamMembers, deleteMember } = useTeamData();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMember(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  return (
    <div>
      <TeamNotification />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 data-a11y-name="Team heading" className="text-3xl font-bold text-gray-900">
            Meet the Team
          </h1>
          <p data-a11y-name="Team description" className="mt-2 text-gray-600">
            Get to know the healthcare professionals dedicated to your well-being.
          </p>
        </div>
        <Link
          href="/maple-valley-health/team/add"
          data-a11y-name="Add team member button"
          className="px-4 py-2 bg-teal-700 text-white text-sm font-semibold rounded-lg hover:bg-teal-800 transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal-600"
        >
          Add Team Member
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <TeamCard
            key={member.id}
            id={member.id}
            name={member.name}
            role={member.role}
            specialty={member.specialty}
            location={member.location}
            education={member.education}
            clinicalInterests={member.clinicalInterests}
            personalInterests={member.personalInterests}
            photoUrl={member.photoUrl}
            onDelete={() => handleDeleteClick(member.id, member.name)}
          />
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No team members yet.</p>
          <Link
            href="/maple-valley-health/team/add"
            className="mt-2 inline-block text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors"
          >
            Add your first team member
          </Link>
        </div>
      )}

      <DeleteDialog
        memberName={deleteTarget?.name ?? ''}
        isOpen={deleteTarget !== null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};
