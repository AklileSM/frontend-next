'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types/api';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  roles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }
    if (roles && user && !roles.includes(user.role)) {
      router.replace('/unauthorized');
    }
  }, [isLoading, isAuthenticated, user, roles, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-base-700 border-t-amber-500" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#8B949E]">
            Authenticating
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (roles && user && !roles.includes(user.role)) return null;

  return <>{children}</>;
}
