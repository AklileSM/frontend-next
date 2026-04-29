'use client';

import { useEffect, useState } from 'react';
import { getExplorerDatesSummary } from '@/services/apiClient';
import type { DateMediaCounts } from '@/types/api';

interface CaptureDates {
  dates: Set<string>;
  countsByDate: Record<string, DateMediaCounts>;
  isLoading: boolean;
  error: string | null;
}

export function useCaptureDates(): CaptureDates {
  const [dates, setDates] = useState<Set<string>>(new Set());
  const [countsByDate, setCountsByDate] = useState<Record<string, DateMediaCounts>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getExplorerDatesSummary()
      .then((res) => {
        if (cancelled) return;
        setCountsByDate(res.dates ?? {});
        setDates(new Set(Object.keys(res.dates ?? {})));
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Could not load capture dates.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { dates, countsByDate, isLoading, error };
}
