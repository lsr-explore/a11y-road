'use client';

import { useState } from 'react';

const roleDescriptions: Record<string, string> = {
  learner:
    'Explore the demo site, toggle between broken and accessible views, and review the issues panel.',
  tester: 'Evaluate the demo site by logging accessibility issues you find during testing.',
  'content-editor':
    'Manage the issues registry, create issue sets, and view everything a learner sees plus admin tools.',
};

const credentials = [
  { username: 'learner', password: 'learn123', role: 'learner', displayName: 'Alex Learner' },
  { username: 'tester', password: 'test123', role: 'tester', displayName: 'Sam Tester' },
  { username: 'editor', password: 'edit123', role: 'content-editor', displayName: 'Morgan Editor' },
];

export const DemoCredentials = () => {
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const togglePassword = (username: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [username]: !prev[username] }));
  };

  return (
    <section aria-labelledby="demo-credentials-heading" className="mt-10">
      <h2 id="demo-credentials-heading" className="text-lg font-semibold text-gray-800 text-center">
        Demo Credentials
      </h2>
      <p className="mt-1 text-sm text-gray-500 text-center">
        Use any of these accounts to explore different roles.
      </p>

      <div className="mt-4 grid gap-3">
        {credentials.map((cred) => (
          <div
            key={cred.username}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-900">{cred.displayName}</p>
                <p className="text-xs text-gray-500 capitalize">{cred.role.replace('-', ' ')}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">{roleDescriptions[cred.role]}</p>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="text-gray-500">
                Username: <code className="font-mono text-gray-800">{cred.username}</code>
              </span>
              <span className="text-gray-500 flex items-center gap-1">
                Password:{' '}
                <code className="font-mono text-gray-800">
                  {visiblePasswords[cred.username] ? cred.password : '••••••••'}
                </code>
                <button
                  type="button"
                  onClick={() => togglePassword(cred.username)}
                  aria-pressed={visiblePasswords[cred.username] ?? false}
                  aria-label={`${visiblePasswords[cred.username] ? 'Hide' : 'Show'} password for ${cred.username}`}
                  className="ml-1 text-xs text-indigo-600 hover:text-indigo-800 underline"
                >
                  {visiblePasswords[cred.username] ? 'Hide' : 'Show'}
                </button>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
