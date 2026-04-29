'use client';

import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

interface PhaseStubProps {
  phase: number;
  feature: string;
  description: string;
}

export function PhaseStub({ phase, feature, description }: PhaseStubProps) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md text-center"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-500">
          <Construction size={26} strokeWidth={1.75} />
        </div>
        <p className="mt-5 font-mono text-xs uppercase tracking-[0.4em] text-amber-500">
          Phase {phase} · Coming up
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">{feature}</h1>
        <p className="mt-3 text-[#8B949E]">{description}</p>
      </motion.div>
    </div>
  );
}
