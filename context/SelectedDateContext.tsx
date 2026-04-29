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

export const EXPLORER_DATE_SCOPE_A6 = 'a6-stern';
const DATE_STORAGE_PREFIX = 'a6.explorerDate.';

function readStoredDates(): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  if (typeof window === 'undefined') return result;
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(DATE_STORAGE_PREFIX)) {
        const scope = key.slice(DATE_STORAGE_PREFIX.length);
        const val = window.localStorage.getItem(key);
        if (val) result[scope] = val;
      }
    }
  } catch {
    /* ignore */
  }
  return result;
}

interface SelectedDateContextValue {
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  getDateForScope: (scope: string) => string | null;
  setDateForScope: (scope: string, date: string | null) => void;
}

const SelectedDateContext = createContext<SelectedDateContextValue | undefined>(undefined);

export function SelectedDateProvider({ children }: { children: ReactNode }) {
  const [datesByScope, setDatesByScope] = useState<Record<string, string | null>>({});

  useEffect(() => {
    setDatesByScope(readStoredDates());
  }, []);

  const getDateForScope = useCallback(
    (scope: string) => datesByScope[scope] ?? null,
    [datesByScope],
  );

  const setDateForScope = useCallback((scope: string, date: string | null) => {
    setDatesByScope((prev) => ({ ...prev, [scope]: date }));
    if (typeof window === 'undefined') return;
    try {
      if (date) window.localStorage.setItem(`${DATE_STORAGE_PREFIX}${scope}`, date);
      else window.localStorage.removeItem(`${DATE_STORAGE_PREFIX}${scope}`);
    } catch {
      /* ignore */
    }
  }, []);

  const selectedDate = datesByScope[EXPLORER_DATE_SCOPE_A6] ?? null;
  const setSelectedDate = useCallback(
    (date: string | null) => setDateForScope(EXPLORER_DATE_SCOPE_A6, date),
    [setDateForScope],
  );

  const value = useMemo(
    () => ({ selectedDate, setSelectedDate, getDateForScope, setDateForScope }),
    [selectedDate, setSelectedDate, getDateForScope, setDateForScope],
  );

  return <SelectedDateContext.Provider value={value}>{children}</SelectedDateContext.Provider>;
}

export function useSelectedDate(): SelectedDateContextValue {
  const ctx = useContext(SelectedDateContext);
  if (!ctx) throw new Error('useSelectedDate must be used within SelectedDateProvider');
  return ctx;
}
