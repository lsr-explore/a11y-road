import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_COOKIE = 'site-auth';
const SITE_AUTH_GATE_COOKIE = 'site-auth-gate';

const PUBLIC_ROUTES = new Set(['/', '/login', '/about']);

const isPublicRoute = (pathname: string): boolean => {
  if (PUBLIC_ROUTES.has(pathname)) return true;
  if (pathname.startsWith('/tutorial')) return true;
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/pagefind')) return true;
  if (pathname === '/favicon.ico') return true;
  return false;
};

const isStaticAsset = (pathname: string): boolean => {
  return (
    pathname.startsWith('/_next') || pathname === '/favicon.ico' || pathname.startsWith('/pagefind')
  );
};

const parseSession = (
  cookieValue: string,
): { username: string; role: string; displayName: string } | null => {
  try {
    const decoded = Buffer.from(cookieValue, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);
    if (parsed.username && parsed.role && parsed.displayName) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Site-wide auth gate: when enabled, require gate cookie before anything else
  if (process.env.SITE_AUTH_ENABLED === 'true' && !isStaticAsset(pathname)) {
    const gateCookie = request.cookies.get(SITE_AUTH_GATE_COOKIE);
    if (!gateCookie?.value) {
      if (pathname !== '/site-auth') {
        return NextResponse.redirect(new URL('/site-auth', request.url));
      }
      return NextResponse.next();
    }
  }

  if (isPublicRoute(pathname)) {
    // Redirect authenticated users away from login
    if (pathname === '/login') {
      const cookie = request.cookies.get(AUTH_COOKIE);
      if (cookie?.value && parseSession(cookie.value)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
    return NextResponse.next();
  }

  const cookie = request.cookies.get(AUTH_COOKIE);
  const session = cookie?.value ? parseSession(cookie.value) : null;

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based route protection
  if (pathname.startsWith('/maple-valley-health/editor')) {
    if (session.role !== 'content-editor') {
      return NextResponse.redirect(new URL('/maple-valley-health', request.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|pagefind).*)'],
};
