'use client';

import { motion } from 'framer-motion';
import {
  Bot,
  Camera,
  CalendarRange,
  FileText,
  ScanLine,
  Shield,
  type LucideIcon,
} from 'lucide-react';

interface Feature {
  Icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    Icon: Camera,
    title: '360° Panoramic Capture',
    description:
      'Immersive room walkthroughs that put your team inside every space without leaving their desk.',
  },
  {
    Icon: ScanLine,
    title: '3D Point Cloud Scanning',
    description:
      'Millimeter-precision spatial data rendered in-browser via Potree — no plugins, no installs.',
  },
  {
    Icon: Bot,
    title: 'AI-Powered Analysis',
    description:
      'Automated defect detection, progress assessment, and natural-language summaries on every image.',
  },
  {
    Icon: CalendarRange,
    title: 'Timeline Tracking',
    description:
      'Compare any two dates side-by-side. Watch projects evolve frame by frame.',
  },
  {
    Icon: FileText,
    title: 'Instant PDF Reports',
    description:
      'Publish professional, timestamped field reports to your team in seconds, not hours.',
  },
  {
    Icon: Shield,
    title: 'Role-Based Access',
    description:
      'Granular admin, manager, and viewer permissions. Audit trails on every upload and edit.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Features"
          title="Everything you need to document a project."
          description="A complete toolkit for capturing, analyzing, and sharing construction progress."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const { Icon, title, description } = feature;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-xl border border-base-800 bg-base-900/60 p-6 backdrop-blur-sm transition-colors hover:border-amber-500/60"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-amber-500/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-5 inline-grid h-11 w-11 place-items-center rounded-lg border border-base-700 bg-base-800/80 text-amber-500 transition-colors group-hover:border-amber-500/60 group-hover:bg-amber-500/10">
          <Icon size={20} strokeWidth={1.75} />
        </div>
        <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#8B949E]">{description}</p>
      </div>
    </motion.div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="font-mono text-xs uppercase tracking-[0.4em] text-amber-500"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-lg text-[#8B949E]"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
