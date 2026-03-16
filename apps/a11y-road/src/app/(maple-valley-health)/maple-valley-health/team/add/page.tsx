import { TeamForm } from '@/components/team/team-form';

export const metadata = {
  title: 'Add Team Member | Maple Valley Health',
  description: 'Add a new team member to Maple Valley Health.',
};

const AddTeamMemberPage = () => {
  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900">Add Team Member</h1>
        <p className="mt-2 text-gray-600">Fill out the form below to add a new team member.</p>
        <div className="mt-8">
          <TeamForm />
        </div>
      </div>
    </div>
  );
};
export default AddTeamMemberPage;
