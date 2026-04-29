import { cn } from '@/utils/cn';

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-display text-lg font-bold', className)}>
      <span className="grid h-7 w-7 place-items-center rounded-md bg-amber-gradient text-base-950">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21V8l9-5 9 5v13" />
          <path d="M9 21V12h6v9" />
        </svg>
      </span>
      <span className="tracking-tight">
        Site<span className="text-amber-500">Scope</span>
      </span>
    </span>
  );
}
