import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { SidebarProvider } from '@/context/SidebarContext';
import { Providers } from '../Providers';

// Auth state is read from localStorage on the client; do not prerender these routes.
export const dynamic = 'force-dynamic';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <ProtectedRoute>
        <SidebarProvider>
          <AppShell>{children}</AppShell>
        </SidebarProvider>
      </ProtectedRoute>
    </Providers>
  );
}
