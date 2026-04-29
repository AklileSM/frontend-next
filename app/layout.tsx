import type { Metadata } from 'next';
import { DM_Sans, IBM_Plex_Mono, Syne } from 'next/font/google';
import { Toaster } from 'sonner';
import { ErrorLogger } from '@/components/debug/ErrorLogger';
import { EARLY_ERROR_SCRIPT } from '@/components/debug/earlyErrorScript';
import './globals.css';

const BUILD_ID = `${new Date().toISOString()} pid=${process.pid}`;

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SiteScope — Construction site documentation, reimagined',
  description:
    'A premium platform for tracking indoor construction progress with 360° panoramas, 3D point clouds, AI analysis, and instant PDF reports.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${plexMono.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-base-950 text-[#E6EDF3] antialiased">
        <script dangerouslySetInnerHTML={{ __html: EARLY_ERROR_SCRIPT }} />
        <div
          id="__sitescope_build_marker"
          style={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            zIndex: 2147483646,
            background: '#f59e0b',
            color: '#0d1117',
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 11,
            padding: '4px 8px',
            borderTopLeftRadius: 4,
            pointerEvents: 'none',
          }}
        >
          DEBUG BUILD {BUILD_ID}
        </div>
        <ErrorLogger />
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#161B22',
              color: '#E6EDF3',
              border: '1px solid #30363D',
            },
          }}
        />
      </body>
    </html>
  );
}
