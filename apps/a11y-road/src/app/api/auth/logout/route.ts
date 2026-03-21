import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_COOKIE = 'site-auth';

export const POST = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  redirect('/');
};
