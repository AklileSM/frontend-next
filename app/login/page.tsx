'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Suspense, useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { AuthShell } from '@/components/auth/AuthShell';
import { TextField } from '@/components/auth/TextField';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const next = searchParams.get('next') || '/app';

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace(next);
  }, [isLoading, isAuthenticated, next, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!username || !password) {
      setFormError('Please fill in both fields.');
      return;
    }
    setSubmitting(true);
    try {
      await login(username.trim(), password, remember);
      toast.success(`Welcome back, ${username.trim()}.`);
      router.replace(next);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed.';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Sign In"
      title="Welcome back."
      subtitle="Sign in to access your projects."
      footer={
        <>
          New here?{' '}
          <Link href="/register" className="font-medium text-amber-500 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <TextField
          id="username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          autoFocus
          placeholder="your.username"
        />
        <TextField
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          passwordToggle
          placeholder="••••••••"
        />

        <label className="flex select-none items-center gap-2 text-sm text-[#C9D1D9]">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-base-700 bg-base-950 text-amber-500 accent-amber-500"
          />
          Keep me signed in on this device
        </label>

        {formError && (
          <div className="flex items-start gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
            <ShieldCheck size={14} className="mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-amber-gradient px-6 py-3 text-sm font-semibold text-base-950 shadow-xl shadow-amber-600/30 transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-base-950/40 border-t-base-950" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <LoginPageInner />
      </Suspense>
    </AuthProvider>
  );
}
