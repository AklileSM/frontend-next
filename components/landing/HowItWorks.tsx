'use client';

import { motion } from 'framer-motion';
import { Brain, FileCheck, Upload, type LucideIcon } from 'lucide-react';
import { SectionHeader } from './Features';

interface Step {
  number: string;
  Icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    Icon: Upload,
    title: 'Upload',
    description:
      'Drag and drop photos, 360° panoramas, point cloud scans, and PDFs. Auto-organized by room and capture date.',
  },
  {
    number: '02',
    Icon: Brain,
    title: 'Analyze',
    description:
      'AI reviews your media and surfaces defects, progress markers, and notable observations automatically.',
  },
  {
    number: '03',
    Icon: FileCheck,
    title: 'Report',
    description:
      'Annotate, flag, and publish timestamped PDF field reports to your team in a single click.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative overflow-hidden border-y border-base-800/60 bg-base-900/30 px-6 py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-50" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="How It Works"
          title="From the field to the boardroom in minutes."
        />

        <div className="relative mt-20 grid gap-10 md:grid-cols-3">
          {/* Connecting line behind cards */}
          <div className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent md:block" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              <div className="relative z-10 mb-6 inline-grid h-24 w-24 place-items-center rounded-2xl border border-amber-500/30 bg-base-950 shadow-xl shadow-amber-600/10">
                <step.Icon size={32} strokeWidth={1.5} className="text-amber-500" />
                <span className="absolute -right-2 -top-2 rounded-md bg-amber-gradient px-2 py-0.5 font-mono text-[10px] font-bold text-base-950">
                  {step.number}
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold tracking-tight">{step.title}</h3>
              <p className="mt-3 text-[#8B949E] leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
