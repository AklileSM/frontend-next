'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { AuthShell } from '@/components/auth/AuthShell';
import { TextField } from '@/components/auth/TextField';
import { AuthProvider, useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterPageInner />
    </AuthProvider>
  );
}

function RegisterPageInner() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<{ password?: string; confirm?: string }>({});

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/app');
  }, [isLoading, isAuthenticated, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldError({});

    if (!username || !password) {
      setFormError('Username and password are required.');
      return;
    }
    if (password.length < 6) {
      setFieldError({ password: 'Use at least 6 characters.' });
      return;
    }
    if (password !== confirm) {
      setFieldError({ confirm: 'Passwords do not match.' });
      return;
    }

    setSubmitting(true);
    try {
      await register(username.trim(), password, email.trim() || undefined, true);
      toast.success(`Account created. Welcome, ${username.trim()}.`);
      router.replace('/app');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not create account.';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Sign Up"
      title="Create your account."
      subtitle="Start documenting your projects in minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-amber-500 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <TextField
          id="reg-username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          autoFocus
          placeholder="your.username"
        />
        <TextField
          id="reg-email"
          label="Email"
          hint="Optional"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@company.com"
        />
        <TextField
          id="reg-password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          passwordToggle
          placeholder="At least 6 characters"
          error={fieldError.password}
        />
        <TextField
          id="reg-confirm"
          label="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          required
          passwordToggle
          placeholder="Re-enter password"
          error={fieldError.confirm}
        />

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
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        <p className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#484F58]">
          By signing up, you agree to our terms &amp; privacy policy
        </p>
      </form>
    </AuthShell>
  );
}
