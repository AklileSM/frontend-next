'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  apiFetchCurrentUser,
  apiLogin,
  apiRegister,
} from '@/services/apiClient';
import {
  clearSession,
  normalizeUser,
  readSession,
  storeSession,
} from '@/auth/authSession';
import type { AuthUser } from '@/types/api';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, persist?: boolean) => Promise<void>;
  register: (username: string, password: string, email?: string, persist?: boolean) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const session = readSession();
    if (!session) {
      setUser(null);
      return;
    }
    try {
      const fresh = await apiFetchCurrentUser();
      const normalized = normalizeUser(fresh);
      setUser(normalized);
      storeSession({ accessToken: session.accessToken, user: normalized }, true);
    } catch {
      clearSession();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = readSession();
      if (!session) {
        if (!cancelled) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }
      setUser(session.user);
      try {
        const fresh = await apiFetchCurrentUser();
        if (cancelled) return;
        const normalized = normalizeUser(fresh);
        setUser(normalized);
        storeSession({ accessToken: session.accessToken, user: normalized }, true);
      } catch {
        if (cancelled) return;
        clearSession();
        setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (username: string, password: string, persist = true) => {
    const res = await apiLogin(username, password);
    const normalized = normalizeUser(res.user);
    storeSession({ accessToken: res.access_token, user: normalized }, persist);
    setUser(normalized);
  }, []);

  const register = useCallback(
    async (username: string, password: string, email?: string, persist = true) => {
      const res = await apiRegister(username, password, email);
      const normalized = normalizeUser(res.user);
      storeSession({ accessToken: res.access_token, user: normalized }, persist);
      setUser(normalized);
    },
    [],
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
