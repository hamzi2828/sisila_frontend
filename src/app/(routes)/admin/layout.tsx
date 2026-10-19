// src/app/(routes)/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getRole, isAuthenticated } from '@/helper/helper';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mobile drawer state. On lg+ the sidebar is always visible via CSS.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  // Reset the drawer when switching to desktop; close it with Escape.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  // Close the drawer after navigation.
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Client-side guard: only allow authenticated admin
  useEffect(() => {
    const authed = isAuthenticated();
    const role = getRole();
    if (!authed) {
      router.replace('/authentication');
      return;
    }
    if (role !== 'admin') {
      router.replace('/');
      return;
    }
    setReady(true);
  }, [router]);

  // Avoid rendering admin UI until checks pass (prevents flicker on redirect)
  if (!ready) return null;

  return (
    <div className="admin-layout flex h-screen overflow-hidden bg-stone-50 text-stone-900 antialiased print:block print:h-auto print:overflow-visible print:bg-white">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden print:block print:overflow-visible">
        <AdminHeader isSidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />

        <main className="admin-page-scroll flex-1 overflow-y-auto bg-stone-50 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 print:overflow-visible print:bg-white print:p-0">
          {children}
        </main>
      </div>
    </div>
  );
}
