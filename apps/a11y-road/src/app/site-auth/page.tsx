import { redirect } from 'next/navigation';
import { createSiteAuthGateCookie, verifySiteAuthGate } from '../../lib/auth';
import { PasswordInput } from '../login/password-input';

const siteAuthAction = async (formData: FormData) => {
  'use server';

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (verifySiteAuthGate(username, password)) {
    await createSiteAuthGateCookie();
    redirect('/');
  }

  redirect('/site-auth?error=invalid');
};

const SiteAuthPage = async ({ searchParams }: { searchParams: Promise<{ error?: string }> }) => {
  const params = await searchParams;
  const hasError = params.error === 'invalid';

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Site Access</h1>
        <p className="mt-2 text-sm text-gray-600 text-center">
          This site is currently under review. Enter credentials to continue.
        </p>

        <form action={siteAuthAction} className="mt-8 space-y-4">
          {hasError && (
            <p className="text-sm text-red-600" role="alert">
              Invalid credentials.
            </p>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <PasswordInput />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Continue
          </button>
        </form>
      </div>
    </main>
  );
};

export default SiteAuthPage;
