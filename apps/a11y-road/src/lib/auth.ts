import crypto from 'node:crypto';
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

/* ------------------------------------------------------------------ */
/*  HMAC cookie signing                                               */
/* ------------------------------------------------------------------ */

const getCookieSecret = (): string => {
  const secret = process.env.COOKIE_SECRET;
  if (!secret) {
    throw new Error('COOKIE_SECRET environment variable is required');
  }
  return secret;
};

/** Returns `value.hex-signature` */
const signValue = (value: string): string => {
  const signature = crypto.createHmac('sha256', getCookieSecret()).update(value).digest('hex');
  return `${value}.${signature}`;
};

/** Verifies signature and returns the original value, or null if invalid. */
const verifySignedValue = (signed: string): string | null => {
  const lastDot = signed.lastIndexOf('.');
  if (lastDot === -1) return null;

  const value = signed.substring(0, lastDot);
  const signature = signed.substring(lastDot + 1);

  const expected = crypto.createHmac('sha256', getCookieSecret()).update(value).digest('hex');

  const sigBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  return value;
};

/* ------------------------------------------------------------------ */
/*  Timing-safe string comparison                                     */
/* ------------------------------------------------------------------ */

const constantTimeEqual = (input: string, expected: string): boolean => {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);
  if (inputBuffer.length !== expectedBuffer.length) {
    // Still perform a comparison to avoid leaking length info via timing
    crypto.timingSafeEqual(expectedBuffer, expectedBuffer);
    return false;
  }
  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
};

/* ------------------------------------------------------------------ */
/*  User lookup & password verification                               */
/* ------------------------------------------------------------------ */

export const getUserByUsername = (username: string): UserProfile | undefined => {
  return users.find((user) => user.username === username);
};

export const verifyPassword = (plain: string, stored: string): boolean => {
  return constantTimeEqual(plain, stored);
};

/* ------------------------------------------------------------------ */
/*  Session cookie (role-based login)                                 */
/* ------------------------------------------------------------------ */

export const createSessionCookie = async (user: SessionUser): Promise<void> => {
  const payload = JSON.stringify({
    username: user.username,
    role: user.role,
    displayName: user.displayName,
  });
  const encoded = Buffer.from(payload).toString('base64');
  const signed = signValue(encoded);
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, signed, {
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
    const encoded = verifySignedValue(cookie.value);
    if (!encoded) return null;

    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
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

/* ------------------------------------------------------------------ */
/*  Site-wide auth gate                                               */
/* ------------------------------------------------------------------ */

const SITE_AUTH_GATE_COOKIE = 'site-auth-gate';

/**
 * Verifies credentials against SITE_AUTH_USERNAME / SITE_AUTH_PASSWORD env vars
 * using timing-safe comparison.
 */
export const verifySiteAuthGate = (username: string, password: string): boolean => {
  const expectedUsername = process.env.SITE_AUTH_USERNAME;
  const expectedPassword = process.env.SITE_AUTH_PASSWORD;
  if (!expectedUsername || !expectedPassword) return false;

  const usernameMatch = constantTimeEqual(username, expectedUsername);
  const passwordMatch = constantTimeEqual(password, expectedPassword);
  return usernameMatch && passwordMatch;
};

export const createSiteAuthGateCookie = async (): Promise<void> => {
  const timestamp = Date.now().toString();
  const signed = signValue(timestamp);
  const cookieStore = await cookies();
  cookieStore.set(SITE_AUTH_GATE_COOKIE, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });
};

export type { SessionUser };
export { AUTH_COOKIE, SITE_AUTH_GATE_COOKIE, verifySignedValue };
