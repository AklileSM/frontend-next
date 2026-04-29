import Link from 'next/link';
import { Logo } from './Logo';

const linkColumns = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how' },
      { label: 'Login', href: '/login' },
      { label: 'Get Started', href: '/register' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Contact', href: '#contact' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-base-800 bg-base-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-[#8B949E]">
            A construction site progress monitoring platform for indoor projects. Capture, analyze,
            and report — all in one workspace.
          </p>
        </div>

        {linkColumns.map((col) => (
          <div key={col.heading}>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B949E]">
              {col.heading}
            </p>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('#') ? (
                    <a
                      href={link.href}
                      className="text-sm text-[#C9D1D9] transition-colors hover:text-amber-500"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-[#C9D1D9] transition-colors hover:text-amber-500"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-base-800">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-5 md:flex-row md:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#484F58]">
            © {new Date().getFullYear()} SiteScope · All rights reserved
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#484F58]">
            Built for the field
          </p>
        </div>
      </div>
    </footer>
  );
}
