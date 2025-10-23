// src/app/(routes)/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getRole, isAuthenticated } from '@/helper/helper';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
