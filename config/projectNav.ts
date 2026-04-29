import type { ApiProject } from '@/types/api';

export interface NavProject {
  slug: string;
  name: string;
  /** Route in frontend-next: /app/projects/{slug} */
  path: string;
}

export const PROJECT_SLUGS = ['a6-stern', 'projectx', 'projecty'] as const;

/** Sidebar order: A6 first (has data), then X, Y. */
export const FALLBACK_PROJECT_NAV: NavProject[] = [
  { slug: 'a6-stern', name: 'A6 Stern', path: '/app/projects/a6-stern' },
  { slug: 'projectx', name: 'Project X', path: '/app/projects/projectx' },
  { slug: 'projecty', name: 'Project Y', path: '/app/projects/projecty' },
];

export function mergeProjectNav(api: ApiProject[]): NavProject[] {
  const nameBySlug = new Map(api.map((p) => [p.slug, p.name]));
  return FALLBACK_PROJECT_NAV.map((p) => ({
    ...p,
    name: nameBySlug.get(p.slug) ?? p.name,
  }));
}

/** Resolve which project owns the current pathname (for header switcher value). */
export function projectSlugForPathname(pathname: string): string {
  if (pathname.startsWith('/app/projects/projectx')) return 'projectx';
  if (pathname.startsWith('/app/projects/projecty')) return 'projecty';
  if (pathname.startsWith('/app/projects/a6-stern')) return 'a6-stern';
  if (pathname.startsWith('/app/room-explorer')) return 'a6-stern';
  return 'a6-stern';
}
