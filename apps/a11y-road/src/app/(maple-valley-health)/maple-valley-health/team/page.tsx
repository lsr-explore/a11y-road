import { TeamGrid } from '@/components/team/team-grid';

export const metadata = {
  title: 'Meet the Team | Maple Valley Health',
  description: 'Meet the dedicated healthcare professionals at Maple Valley Health.',
};

const TeamPage = () => {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <TeamGrid />
      </div>
    </div>
  );
};
export default TeamPage;
