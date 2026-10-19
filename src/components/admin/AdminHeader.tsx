'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { getCurrentUser } from '@/helper/helper';
import { getActiveNavItem } from './AdminSidebar';

interface AdminHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function AdminHeader({ isSidebarOpen, onToggleSidebar }: AdminHeaderProps) {
  const pathname = usePathname();
  const section = getActiveNavItem(pathname);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const u = getCurrentUser();
    if (u) {
      const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
      setUser({ name: name || 'Admin', email: u.email });
    }
  }, []);

  const initials =
    (user?.name || 'Admin')
      .split(/\s+/)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'A';

  return (
    <header className="relative z-10 flex h-16 shrink-0 items-center gap-3 border-b border-stone-200 bg-white px-4 lg:px-6 print:hidden">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/30 lg:hidden"
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-controls="admin-sidebar"
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {section && (
        <p className="truncate text-sm font-medium text-stone-500">
          <span className="hidden sm:inline">Admin</span>
          <span className="hidden sm:inline px-1.5 text-stone-300">/</span>
          <span className="text-stone-900">{section.name}</span>
        </p>
      )}

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-[200px] truncate text-sm font-medium text-stone-900">{user?.name || 'Admin'}</p>
          <p className="max-w-[200px] truncate text-xs text-stone-500">{user?.email || 'Administrator'}</p>
        </div>
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white ring-2 ring-white"
          title={user?.email || 'Admin'}
        >
          {initials}
        </span>
      </div>
    </header>
  );
}
