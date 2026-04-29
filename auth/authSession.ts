import type { AuthSession, AuthUser, UserRole } from '@/types/api';

const STORAGE_KEY = 'a6_auth_v2';
const LEGACY_KEY = 'a6_auth_v1';

let ephemeralAccessToken: string | null = null;

function isRole(s: string): s is UserRole {
  return s === 'admin' || s === 'manager' || s === 'viewer';
}

export function normalizeUser(raw: {
  id: string;
  username: string;
  email?: string | null;
  role: string;
}): AuthUser {
  const role = isRole(raw.role) ? raw.role : 'viewer';
  return {
    id: raw.id,
    username: raw.username,
    email: raw.email ?? null,
    role,
  };
}

export function readSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (!parsed?.accessToken || !parsed?.user?.id) return null;
    return {
      accessToken: parsed.accessToken,
      user: normalizeUser(parsed.user as AuthUser & { role: string }),
    };
  } catch {
    return null;
  }
}

export function storeSession(session: AuthSession, persist: boolean): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  ephemeralAccessToken = null;
  if (persist) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    ephemeralAccessToken = session.accessToken;
  }
}

export function clearSession(): void {
  ephemeralAccessToken = null;
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_KEY);
}

export function getAccessToken(): string | null {
  if (ephemeralAccessToken) return ephemeralAccessToken;
  return readSession()?.accessToken ?? null;
}
