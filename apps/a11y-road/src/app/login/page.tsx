import { redirect } from 'next/navigation';
import { createSessionCookie, getUserByUsername, verifyPassword } from '../../lib/auth';
import { DemoCredentials } from './demo-credentials';

const loginAction = async (formData: FormData) => {
  'use server';

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const user = getUserByUsername(username);

  if (user && verifyPassword(password, user.password)) {
    await createSessionCookie({
      username: user.username,
      role: user.role,
      displayName: user.displayName,
    });
    redirect('/maple-valley-health');
  }

  redirect('/login?error=invalid');
};

const LoginPage = async ({ searchParams }: { searchParams: Promise<{ error?: string }> }) => {
  const params = await searchParams;
  const hasError = params.error === 'invalid';

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 text-center">A11y Road</h1>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Sign in to access the Maple Valley Health demo site.
        </p>

        <form action={loginAction} className="mt-8 space-y-4 max-w-sm mx-auto">
          {hasError && (
            <p className="text-sm text-red-600" role="alert">
              Invalid username or password.
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
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign in
          </button>
        </form>

        <DemoCredentials />
      </div>
    </main>
  );
};

export default LoginPage;
