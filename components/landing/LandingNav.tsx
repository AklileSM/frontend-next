'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { Logo } from './Logo';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How It Works' },
  { href: '#contact', label: 'Contact' },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-base-800/80 bg-base-950/70 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-[#C9D1D9] transition-colors hover:text-amber-500"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-md border border-base-700 bg-transparent px-4 py-2 text-sm font-medium text-[#E6EDF3] transition-colors hover:border-amber-500 hover:text-amber-500"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-amber-gradient px-4 py-2 text-sm font-semibold text-base-950 shadow-lg shadow-amber-600/20 transition-transform hover:scale-[1.02]"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-md border border-base-700 text-[#E6EDF3] transition-colors hover:border-amber-500 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-t border-base-800 bg-base-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-sm text-[#C9D1D9] transition-colors hover:bg-base-900 hover:text-amber-500"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex gap-2 border-t border-base-800 pt-3">
                <Link
                  href="/login"
                  className="flex-1 rounded-md border border-base-700 px-4 py-2 text-center text-sm font-medium transition-colors hover:border-amber-500 hover:text-amber-500"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex-1 rounded-md bg-amber-gradient px-4 py-2 text-center text-sm font-semibold text-base-950"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
