'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Logo } from '@/components/landing/Logo';

interface AuthShellProps {
  title: string;
  subtitle: string;
  eyebrow: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, subtitle, eyebrow, children, footer }: AuthShellProps) {
  return (
    <div className="grain relative min-h-screen overflow-hidden bg-base-950">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-mesh-dark" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-20 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-steel-400/10 blur-[120px]"
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
        {/* Marketing panel */}
        <aside className="hidden flex-col justify-between border-r border-base-800/60 bg-base-900/40 p-10 backdrop-blur-sm lg:flex">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#8B949E] transition-colors hover:text-amber-500">
            <ArrowLeft size={14} />
            Back to home
          </Link>

          <div>
            <Logo className="text-2xl" />
            <h2 className="mt-10 max-w-md font-display text-4xl font-bold leading-tight tracking-tight">
              Document every corner. <span className="text-amber-500">Every day.</span>
            </h2>
            <p className="mt-5 max-w-md text-[#8B949E]">
              The premium platform for tracking indoor construction progress with 360° panoramas,
              3D point clouds, and AI-powered insights.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: '10k+', label: 'Scans' },
              { value: '360°', label: 'Coverage' },
              { value: '99%', label: 'Accuracy' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-base-800 bg-base-950/60 px-3 py-4">
                <div className="font-display text-2xl font-bold text-amber-500">{stat.value}</div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#8B949E]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Form panel */}
        <main className="flex min-h-screen items-center justify-center px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden">
              <Link
                href="/"
                className="mb-6 inline-flex items-center gap-2 text-sm text-[#8B949E] transition-colors hover:text-amber-500"
              >
                <ArrowLeft size={14} />
                Back to home
              </Link>
            </div>

            <p className="font-mono text-xs uppercase tracking-[0.4em] text-amber-500">{eyebrow}</p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
            <p className="mt-2 text-[#8B949E]">{subtitle}</p>

            <div className="mt-8">{children}</div>

            <div className="mt-6 text-sm text-[#8B949E]">{footer}</div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
