'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/AuthContext';

export default function UnauthorizedPage() {
  return (
    <AuthProvider>
      <UnauthorizedPageInner />
    </AuthProvider>
  );
}

function UnauthorizedPageInner() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <main className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-base-950 px-6">
      <div className="pointer-events-none absolute inset-0 bg-mesh-dark" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 m-auto h-[400px] w-[400px] rounded-full bg-red-500/10 blur-[120px]"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-md text-center"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-red-500/40 bg-red-500/10 text-red-400">
          <Lock size={28} strokeWidth={1.75} />
        </div>

        <p className="mt-6 font-mono text-xs uppercase tracking-[0.4em] text-red-400">
          Access Denied
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">
          You don&apos;t have permission for this page.
        </h1>
        <p className="mt-3 text-[#8B949E]">
          {user
            ? `Signed in as ${user.username} (${user.role}). Ask an admin to grant the needed role.`
            : 'You may need to sign in with a different account.'}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-md border border-base-700 bg-base-900/60 px-5 py-2.5 text-sm font-medium text-[#E6EDF3] backdrop-blur transition-colors hover:border-amber-500 hover:text-amber-500"
          >
            <ArrowLeft size={14} />
            Go back
          </button>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-md bg-amber-gradient px-5 py-2.5 text-sm font-semibold text-base-950 shadow-lg shadow-amber-600/20 transition-transform hover:scale-[1.02]"
          >
            Return to dashboard
          </Link>
          {user && (
            <button
              type="button"
              onClick={() => {
                logout();
                router.replace('/login');
              }}
              className="text-sm text-[#8B949E] underline-offset-4 hover:text-amber-500 hover:underline"
            >
              Sign out
            </button>
          )}
        </div>
      </motion.div>
    </main>
  );
}
