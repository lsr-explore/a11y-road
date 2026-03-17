import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_COOKIE = 'site-auth';

const loginAction = async (formData: FormData) => {
  'use server';

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const validUsername = process.env.SITE_AUTH_USERNAME;
  const validPassword = process.env.SITE_AUTH_PASSWORD;

  if (username === validUsername && password === validPassword) {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    redirect('/');
  }

  redirect('/login?error=invalid');
};

const LoginPage = async ({ searchParams }: { searchParams: Promise<{ error?: string }> }) => {
  const params = await searchParams;
  const hasError = params.error === 'invalid';

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 text-center">A11y Road</h1>
        <p className="mt-2 text-sm text-gray-600 text-center">
          This site is currently in preview. Please sign in to continue.
        </p>

        <form action={loginAction} className="mt-8 space-y-4">
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
      </div>
    </main>
  );
};

export default LoginPage;
