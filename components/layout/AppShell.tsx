'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useSidebar } from '@/context/SidebarContext';

export function AppShell({ children }: { children: ReactNode }) {
  const { open } = useSidebar();
  return (
    <div className="min-h-screen bg-base-950 text-[#E6EDF3]">
      <Sidebar />
      <motion.div
        animate={{ marginLeft: open ? 260 : 64 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-screen flex-col"
      >
        <Header />
        <main className="flex-1">{children}</main>
      </motion.div>
    </div>
  );
}
