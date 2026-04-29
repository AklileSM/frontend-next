'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { SelectedDateProvider } from '@/context/SelectedDateContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SelectedDateProvider>{children}</SelectedDateProvider>
    </AuthProvider>
  );
}
