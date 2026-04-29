'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  ChevronDown,
  GitCompare,
  Home,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/landing/Logo';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import { FALLBACK_PROJECT_NAV, mergeProjectNav, type NavProject } from '@/config/projectNav';
import { listProjects } from '@/services/apiClient';
import { cn } from '@/utils/cn';
import { FileTree } from './FileTree';
import { SidebarCalendar } from './SidebarCalendar';

interface NavItem {
  label: string;
  href: string;
  Icon: LucideIcon;
}

const TOP_NAV: NavItem[] = [
  { label: 'Home', href: '/app', Icon: Home },
  { label: 'Compare', href: '/app/compare', Icon: GitCompare },
];

export function Sidebar() {
  const { open } = useSidebar();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<NavProject[]>(FALLBACK_PROJECT_NAV);
  const [openProject, setOpenProject] = useState<string | null>('a6-stern');

  useEffect(() => {
    listProjects()
      .then((api) => setProjects(mergeProjectNav(api)))
      .catch(() => setProjects(FALLBACK_PROJECT_NAV));
  }, []);

  return (
    <motion.aside
      animate={{ width: open ? 260 : 64 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-r border-base-800/80 bg-base-900"
    >
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center border-b border-base-800/80 px-3">
        <Link href="/app" className="flex items-center overflow-hidden">
          {open ? (
            <Logo />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-md bg-amber-gradient text-base-950">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21V8l9-5 9 5v13" />
                <path d="M9 21V12h6v9" />
              </svg>
            </span>
          )}
        </Link>
      </div>

      {/* Nav body */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3">
        <SectionLabel open={open}>Navigation</SectionLabel>
        <ul className="space-y-0.5">
          {TOP_NAV.map((item) => (
            <li key={item.href}>
              <NavLink item={item} pathname={pathname} open={open} />
            </li>
          ))}
        </ul>

        <SectionLabel open={open}>Projects</SectionLabel>
        <ul className="space-y-0.5">
          {projects.map((p) => (
            <li key={p.slug}>
              <ProjectAccordion
                project={p}
                isOpen={openProject === p.slug}
                onToggle={() =>
                  setOpenProject((cur) => (cur === p.slug ? null : p.slug))
                }
                pathname={pathname}
                sidebarOpen={open}
              />
            </li>
          ))}
        </ul>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.15 }}
            >
              <SectionLabel open>Calendar</SectionLabel>
              <div className="px-1">
                <SidebarCalendar />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* User footer */}
      <div className="shrink-0 border-t border-base-800/80 p-2">
        {open ? (
          <div className="flex items-center gap-2 rounded-md px-2 py-2">
            <UserBubble name={user?.username ?? '?'} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-[#E6EDF3]">
                {user?.username ?? 'Guest'}
              </p>
              <p className="truncate font-mono text-[9px] uppercase tracking-wider text-[#8B949E]">
                {user?.role ?? '—'}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="grid h-7 w-7 place-items-center rounded text-[#8B949E] transition-colors hover:bg-base-800 hover:text-red-400"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <div className="grid place-items-center">
            <UserBubble name={user?.username ?? '?'} />
          </div>
        )}
      </div>
    </motion.aside>
  );
}

function NavLink({ item, pathname, open }: { item: NavItem; pathname: string; open: boolean }) {
  const isActive =
    item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href);
  return (
    <Link
      href={item.href}
      title={!open ? item.label : undefined}
      className={cn(
        'group relative flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors',
        isActive
          ? 'bg-amber-500/10 text-amber-500'
          : 'text-[#C9D1D9] hover:bg-base-800/60 hover:text-amber-500',
      )}
    >
      {isActive && (
        <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-amber-500" />
      )}
      <item.Icon size={16} className="shrink-0" strokeWidth={1.75} />
      <AnimatePresence initial={false}>
        {open && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="truncate"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

function ProjectAccordion({
  project,
  isOpen,
  onToggle,
  pathname,
  sidebarOpen,
}: {
  project: NavProject;
  isOpen: boolean;
  onToggle: () => void;
  pathname: string;
  sidebarOpen: boolean;
}) {
  const isActive = pathname.startsWith(project.path);

  if (!sidebarOpen) {
    return (
      <Link
        href={project.path}
        title={project.name}
        className={cn(
          'relative flex items-center justify-center rounded-md px-2 py-2 text-sm transition-colors',
          isActive
            ? 'bg-amber-500/10 text-amber-500'
            : 'text-[#C9D1D9] hover:bg-base-800/60 hover:text-amber-500',
        )}
      >
        {isActive && (
          <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-amber-500" />
        )}
        <Building2 size={16} strokeWidth={1.75} />
      </Link>
    );
  }

  return (
    <div>
      <div
        className={cn(
          'relative flex items-center rounded-md text-sm transition-colors',
          isActive ? 'text-amber-500' : 'text-[#C9D1D9]',
        )}
      >
        {isActive && (
          <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-amber-500" />
        )}
        <Link
          href={project.path}
          className="flex flex-1 items-center gap-2.5 rounded-l-md px-2 py-2 transition-colors hover:bg-base-800/60 hover:text-amber-500"
        >
          <Building2 size={16} strokeWidth={1.75} />
          <span className="truncate">{project.name}</span>
        </Link>
        <button
          type="button"
          onClick={onToggle}
          className="grid h-9 w-9 place-items-center rounded-r-md text-[#8B949E] transition-colors hover:bg-base-800/60 hover:text-amber-500"
          aria-label={isOpen ? 'Collapse project' : 'Expand project'}
        >
          <ChevronDown
            size={14}
            className={cn('transition-transform', isOpen && 'rotate-180 text-amber-500')}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="ml-2 mt-1 border-l border-base-800/80 pl-2">
              {project.slug === 'a6-stern' ? (
                <FileTree />
              ) : (
                <p className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#484F58]">
                  No data yet
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionLabel({ children, open }: { children: React.ReactNode; open: boolean }) {
  if (!open) return <div className="my-3 h-px bg-base-800/80" />;
  return (
    <p className="mb-1 mt-4 px-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[#484F58]">
      {children}
    </p>
  );
}

function UserBubble({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-gradient font-display text-sm font-bold text-base-950">
      {initial}
    </span>
  );
}
