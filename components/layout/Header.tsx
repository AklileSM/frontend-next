'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  GitCompare,
  Home,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import {
  FALLBACK_PROJECT_NAV,
  mergeProjectNav,
  projectSlugForPathname,
  type NavProject,
} from '@/config/projectNav';
import { listProjects } from '@/services/apiClient';
import { cn } from '@/utils/cn';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { open, toggle } = useSidebar();
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<NavProject[]>(FALLBACK_PROJECT_NAV);

  useEffect(() => {
    listProjects()
      .then((api) => setProjects(mergeProjectNav(api)))
      .catch(() => setProjects(FALLBACK_PROJECT_NAV));
  }, []);

  const onCompare = pathname.startsWith('/app/compare');
  const activeProjectSlug = projectSlugForPathname(pathname);

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-base-800/80 bg-base-950/80 px-4 backdrop-blur-xl"
    >
      <button
        type="button"
        onClick={toggle}
        className="hidden h-9 w-9 place-items-center rounded-md text-[#8B949E] transition-colors hover:bg-base-800 hover:text-amber-500 md:grid"
        aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {open ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
      </button>
      <button
        type="button"
        onClick={toggle}
        className="grid h-9 w-9 place-items-center rounded-md text-[#8B949E] transition-colors hover:bg-base-800 hover:text-amber-500 md:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={16} />
      </button>

      <Breadcrumb pathname={pathname} projects={projects} />

      <div className="ml-auto flex items-center gap-2">
        <ProjectSwitcher
          projects={projects}
          activeSlug={activeProjectSlug}
          onPick={(slug) => {
            const target = projects.find((p) => p.slug === slug);
            if (target) router.push(target.path);
          }}
        />

        <Link
          href={onCompare ? '/app' : '/app/compare'}
          className={cn(
            'inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors',
            onCompare
              ? 'border-base-700 bg-base-900 text-[#E6EDF3] hover:border-amber-500 hover:text-amber-500'
              : 'border-amber-500/40 bg-amber-500/10 text-amber-500 hover:border-amber-500',
          )}
        >
          {onCompare ? <Home size={13} /> : <GitCompare size={13} />}
          {onCompare ? 'Home' : 'Compare'}
        </Link>

        <UserMenu username={user?.username ?? 'Guest'} role={user?.role} onLogout={logout} />
      </div>
    </header>
  );
}

function Breadcrumb({ pathname, projects }: { pathname: string; projects: NavProject[] }) {
  const crumbs = buildCrumbs(pathname, projects);
  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 sm:flex">
      <ol className="flex items-center gap-1.5 truncate">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5 truncate">
              {c.href && !isLast ? (
                <Link href={c.href} className="text-xs text-[#8B949E] transition-colors hover:text-amber-500">
                  {c.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    'truncate text-xs',
                    isLast ? 'font-medium text-[#E6EDF3]' : 'text-[#8B949E]',
                  )}
                >
                  {c.label}
                </span>
              )}
              {!isLast && <span className="text-[#484F58]">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function buildCrumbs(pathname: string, projects: NavProject[]) {
  const crumbs: { label: string; href?: string }[] = [{ label: 'App', href: '/app' }];
  if (pathname === '/app') return crumbs;

  if (pathname.startsWith('/app/projects/')) {
    const slug = pathname.split('/')[3];
    const project = projects.find((p) => p.slug === slug);
    crumbs.push({ label: project?.name ?? slug, href: `/app/projects/${slug}` });
    return crumbs;
  }
  if (pathname.startsWith('/app/room-explorer')) {
    crumbs.push({ label: 'A6 Stern', href: '/app/projects/a6-stern' });
    crumbs.push({ label: 'Room Explorer' });
    return crumbs;
  }
  if (pathname.startsWith('/app/compare')) {
    crumbs.push({ label: 'Compare' });
    return crumbs;
  }
  if (pathname.startsWith('/app/profile')) {
    crumbs.push({ label: 'Profile' });
    return crumbs;
  }
  if (pathname.startsWith('/app/viewer/static')) {
    crumbs.push({ label: 'Viewer · Static' });
    return crumbs;
  }
  if (pathname.startsWith('/app/viewer/panorama')) {
    crumbs.push({ label: 'Viewer · Panorama' });
    return crumbs;
  }
  if (pathname.startsWith('/app/viewer/point-cloud')) {
    crumbs.push({ label: 'Viewer · Point Cloud' });
    return crumbs;
  }
  if (pathname.startsWith('/app/viewer/potree')) {
    crumbs.push({ label: 'Viewer · Potree' });
    return crumbs;
  }
  if (pathname.startsWith('/app/pdf-viewer')) {
    crumbs.push({ label: 'PDF Viewer' });
    return crumbs;
  }
  return crumbs;
}

function ProjectSwitcher({
  projects,
  activeSlug,
  onPick,
}: {
  projects: NavProject[];
  activeSlug: string;
  onPick: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));
  const active = projects.find((p) => p.slug === activeSlug) ?? projects[0];

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-md border border-base-700 bg-base-900/60 px-3 py-2 text-xs font-medium transition-colors hover:border-amber-500"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        <span className="truncate">{active?.name ?? 'Select project'}</span>
        <ChevronDown size={12} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="glass absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg p-1 shadow-2xl"
          >
            {projects.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => {
                    onPick(p.slug);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-base-800/60',
                    p.slug === activeSlug ? 'text-amber-500' : 'text-[#C9D1D9]',
                  )}
                >
                  <span>{p.name}</span>
                  {p.slug === activeSlug && (
                    <span className="font-mono text-[9px] uppercase tracking-wider text-amber-500">Active</span>
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserMenu({
  username,
  role,
  onLogout,
}: {
  username: string;
  role?: string;
  onLogout: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border border-base-700 bg-base-900/60 px-2 py-1.5 transition-colors hover:border-amber-500"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-gradient font-display text-[11px] font-bold text-base-950">
          {username.charAt(0).toUpperCase()}
        </span>
        <span className="hidden text-xs font-medium text-[#E6EDF3] md:inline">{username}</span>
        <ChevronDown size={12} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="glass absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg shadow-2xl"
          >
            <div className="border-b border-base-800 px-4 py-3">
              <p className="truncate text-xs font-medium text-[#E6EDF3]">{username}</p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[#8B949E]">
                {role ?? '—'}
              </p>
            </div>
            <ul className="p-1">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push('/app/profile');
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-[#C9D1D9] transition-colors hover:bg-base-800/60 hover:text-amber-500"
                >
                  <User size={13} />
                  Profile &amp; Reports
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    router.replace('/login');
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-[#C9D1D9] transition-colors hover:bg-base-800/60 hover:text-red-400"
                >
                  <LogOut size={13} />
                  Sign out
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [ref, handler]);
}
