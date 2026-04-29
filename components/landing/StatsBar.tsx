'use client';

import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 10000, suffix: '+', label: 'Scans Processed' },
  { value: 360, suffix: '°', label: 'Panoramic Views' },
  { value: 99, suffix: '%', label: 'AI Analysis Accuracy' },
  { value: 60, suffix: 's', label: 'Avg. Report Time' },
];

export function StatsBar() {
  return (
    <div className="border-t border-base-800/80 bg-base-900/40 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-base-800 px-6 py-6 md:grid-cols-4 md:divide-x">
        {STATS.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
}

function StatItem({ value, suffix, label }: Stat) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest).toLocaleString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 1.6, ease: 'easeOut' });
    return () => controls.stop();
  }, [inView, value, count]);

  return (
    <div ref={ref} className="flex flex-col items-center px-4 py-2 text-center md:items-start md:text-left">
      <div className="flex items-baseline font-display text-3xl font-bold tracking-tight md:text-4xl">
        <motion.span>{rounded}</motion.span>
        {suffix && <span className="text-amber-500">{suffix}</span>}
      </div>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8B949E]">
        {label}
      </p>
    </div>
  );
}
