'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useRef } from 'react';
import { StatsBar } from './StatsBar';

const HEADLINE = ['Every', 'Corner.', 'Every', 'Day.', 'Every', 'Project.'];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const mockY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const mockOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      {/* Animated mesh gradient layers */}
      <div className="pointer-events-none absolute inset-0 bg-mesh-dark" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-10 h-[420px] w-[420px] rounded-full bg-steel-400/10 blur-[120px]"
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-base-700 bg-base-900/60 px-4 py-1.5 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9D1D9]">
              Construction documentation, reimagined
            </span>
          </motion.div>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            {HEADLINE.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                className="mr-3 inline-block"
              >
                {i === 5 ? <span className="text-amber-500">{word}</span> : word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-6 max-w-xl text-lg text-[#8B949E] md:text-xl"
          >
            Capture, analyze, and report on indoor construction progress with{' '}
            <span className="text-[#E6EDF3]">360° panoramas</span>,{' '}
            <span className="text-[#E6EDF3]">3D point clouds</span>, and{' '}
            <span className="text-[#E6EDF3]">AI-powered insights</span> — all in one platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-md bg-amber-gradient px-6 py-3 text-sm font-semibold text-base-950 shadow-xl shadow-amber-600/30 transition-transform hover:scale-[1.02]"
            >
              Get Started Free
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-md border border-base-700 bg-base-900/60 px-6 py-3 text-sm font-medium text-[#E6EDF3] backdrop-blur transition-colors hover:border-amber-500 hover:text-amber-500"
            >
              <PlayCircle size={16} />
              See How It Works
            </a>
          </motion.div>
        </div>

        <motion.div
          style={{ y: mockY, opacity: mockOpacity }}
          className="relative hidden lg:block"
        >
          <DashboardMockup />
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10">
        <StatsBar />
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative aspect-[4/3] w-full"
    >
      {/* Glow */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-amber-500/20 blur-3xl" />

      <div className="relative h-full overflow-hidden rounded-2xl border border-base-700 bg-base-900/90 shadow-2xl backdrop-blur-xl">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-base-800 bg-base-900 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-base-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-base-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-base-700" />
          <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-[#8B949E]">
            sitescope · room 4 · 2026-04-26
          </span>
        </div>

        {/* Body */}
        <div className="grid h-[calc(100%-2.75rem)] grid-cols-[150px_1fr]">
          {/* Sidebar */}
          <div className="border-r border-base-800 bg-base-950/60 p-3">
            {['A6-Stern', 'Project X', 'Project Y'].map((p, i) => (
              <div
                key={p}
                className={`mb-1 rounded-md px-2 py-2 font-mono text-[10px] uppercase tracking-wider ${
                  i === 0 ? 'border-l-2 border-amber-500 bg-base-800/60 text-[#E6EDF3]' : 'text-[#8B949E]'
                }`}
              >
                {p}
              </div>
            ))}
            <div className="mt-4 space-y-1">
              {['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5'].map((r, i) => (
                <div
                  key={r}
                  className={`flex items-center justify-between rounded px-2 py-1 text-[10px] ${
                    i === 3 ? 'bg-amber-500/10 text-amber-500' : 'text-[#8B949E]'
                  }`}
                >
                  <span>{r}</span>
                  <span className="font-mono">{[12, 8, 14, 23, 5][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main canvas */}
          <div className="relative bg-base-950 p-3">
            <div className="grid h-full grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="relative overflow-hidden rounded-md border border-base-800 bg-base-900"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-steel-400/20" />
                  <div className="absolute bottom-1 left-1 rounded bg-base-950/80 px-1.5 py-0.5 font-mono text-[8px] text-[#C9D1D9]">
                    IMG-{1247 + i}
                  </div>
                  {i === 1 && (
                    <div className="absolute right-1 top-1 rounded bg-amber-500 px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase text-base-950">
                      AI
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
