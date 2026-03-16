'use client';

import { use } from 'react';
import { useTeamData } from '@/components/providers/team-data-provider';
import { TeamForm } from '@/components/team/team-form';

const EditTeamMemberPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { getMemberById } = useTeamData();
  const member = getMemberById(id);

  if (!member) {
    return (
      <div className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Member Not Found</h1>
          <p className="mt-2 text-gray-600">The team member you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900">Edit Team Member</h1>
        <p className="mt-2 text-gray-600">Update {member.name}&apos;s profile information.</p>
        <div className="mt-8">
          <TeamForm existingMember={member} />
        </div>
      </div>
    </div>
  );
};
export default EditTeamMemberPage;
