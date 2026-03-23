'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUserRole } from '@/components/providers/user-role-provider';
import { LearnerGuide } from './learner-guide';
import { TesterGuide } from './tester-guide';

const SEEN_COOKIE_KEY = 'a11y-road-seen-intro';

const markAsSeen = (role: string) => {
  // biome-ignore lint/suspicious/noDocumentCookie: simple client-side flag cookie for demo
  document.cookie = `${SEEN_COOKIE_KEY}-${role}=true; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
};

const GettingStartedPage = () => {
  const { role } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (role === 'learner' || role === 'tester') {
      markAsSeen(role);
    }
  }, [role]);

  if (role === 'content-editor') {
    router.replace('/maple-valley-health');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {role === 'tester' ? <TesterGuide /> : <LearnerGuide />}
    </div>
  );
};

export default GettingStartedPage;
