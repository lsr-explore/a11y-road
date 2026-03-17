import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_COOKIE = 'site-auth';

export const proxy = (request: NextRequest) => {
  const authEnabled = process.env.SITE_AUTH_ENABLED === 'true';

  if (!authEnabled) {
    return NextResponse.next();
  }

  const isLoginPage = request.nextUrl.pathname === '/login';
  const hasAuth = request.cookies.get(AUTH_COOKIE)?.value === 'authenticated';

  if (isLoginPage) {
    return hasAuth ? NextResponse.redirect(new URL('/', request.url)) : NextResponse.next();
  }

  if (!hasAuth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|pagefind).*)'],
};
