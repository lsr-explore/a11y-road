import type { UserProfile, UserRole } from '@a11y-road/a11y-kit';
import { cookies } from 'next/headers';
import usersData from '../data/users.json';

const AUTH_COOKIE = 'site-auth';

interface SessionUser {
  username: string;
  role: UserRole;
  displayName: string;
}

const users = usersData as UserProfile[];

export const getUserByUsername = (username: string): UserProfile | undefined => {
  return users.find((user) => user.username === username);
};

export const verifyPassword = (plain: string, stored: string): boolean => {
  return plain === stored;
};

/**
 * Demo-only: base64-encodes user info into a cookie value.
 * Not suitable for production — no signing or encryption.
 */
export const createSessionCookie = async (user: SessionUser): Promise<void> => {
  const payload = JSON.stringify({
    username: user.username,
    role: user.role,
    displayName: user.displayName,
  });
  const encoded = Buffer.from(payload).toString('base64');
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const getSessionUser = async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(AUTH_COOKIE);
  if (!cookie?.value) return null;

  try {
    const decoded = Buffer.from(cookie.value, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded) as SessionUser;
    if (parsed.username && parsed.role && parsed.displayName) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Demo-only: simple base64 encoding for transport.
 * Not cryptographic — purely for demo credential display.
 */
export const hashPassword = (plain: string): string => {
  return Buffer.from(plain).toString('base64');
};

const SITE_AUTH_GATE_COOKIE = 'site-auth-gate';

/**
 * Sets the site-wide auth gate cookie after verifying
 * credentials against SITE_AUTH_USERNAME / SITE_AUTH_PASSWORD env vars.
 */
export const verifySiteAuthGate = (username: string, password: string): boolean => {
  const expectedUsername = process.env.SITE_AUTH_USERNAME;
  const expectedPassword = process.env.SITE_AUTH_PASSWORD;
  if (!expectedUsername || !expectedPassword) return false;
  return username === expectedUsername && password === expectedPassword;
};

export const createSiteAuthGateCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(SITE_AUTH_GATE_COOKIE, 'authorized', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });
};

export type { SessionUser };
export { AUTH_COOKIE, SITE_AUTH_GATE_COOKIE };
