'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useSelectedDate } from '@/context/SelectedDateContext';

export default function AppHomePlaceholder() {
  const { user } = useAuth();
  const { selectedDate } = useSelectedDate();

  return (
    <div className="px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-5xl"
      >
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-amber-500">
          App Shell · Phase 3
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">
          Welcome back, {user?.username}.
        </h1>
        <p className="mt-3 max-w-2xl text-[#8B949E]">
          The chrome is in. Sidebar collapses with a smooth width transition. Active routes show
          an amber border. Calendar highlights dates that have media. Project switcher in the
          header navigates between A6-Stern, Project X, and Project Y.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Card label="Role" value={user?.role ?? '—'} />
          <Card label="Selected Date" value={selectedDate ?? 'None'} />
          <Card label="Phase" value="3 / 10" />
        </div>

        <div className="mt-10 rounded-xl border border-base-800 bg-base-900/40 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-500">
            What&apos;s next
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold">
            Phase 4 — Interactive floorplan
          </h2>
          <p className="mt-2 text-sm text-[#8B949E]">
            The home page becomes a 2/3 floorplan with clickable room hotspots and a 1/3 charts
            panel showing capture activity over time.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-base-800 bg-base-900/40 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B949E]">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
