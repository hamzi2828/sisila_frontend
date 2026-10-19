'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import {
  BookOpen,
  GalleryHorizontalEnd,
  Images,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Package,
  PenSquare,
  Settings,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react';
import { getCurrentUser } from '@/helper/helper';

export interface AdminNavItem {
  name: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
}

export interface AdminNavSection {
  title: string | null;
  items: AdminNavItem[];
}

/** Silsilla's admin sections only. Grouped the way Inked Wear groups its sidebar. */
export const ADMIN_NAV: AdminNavSection[] = [
  { title: null, items: [{ name: 'Dashboard', path: '/admin', icon: LayoutDashboard }] },
  {
    title: 'Sales',
    items: [{ name: 'Orders', path: '/admin/orders', icon: ShoppingBag }],
  },
  {
    title: 'Catalog',
    items: [
      { name: 'Products', path: '/admin/products', icon: Package },
      { name: 'Themes', path: '/admin/themes', icon: Layers },
      { name: 'Series', path: '/admin/series', icon: GalleryHorizontalEnd },
    ],
  },
  {
    title: 'Content',
    items: [
      { name: 'Hero Slides', path: '/admin/hero-slides', icon: Images },
      { name: 'Blogs', path: '/admin/blogs', icon: BookOpen },
      { name: 'Blog Settings', path: '/admin/blog-settings', icon: PenSquare },
    ],
  },
  {
    title: 'Customers',
    items: [
      { name: 'Users', path: '/admin/users', icon: Users },
      { name: 'Contact Queries', path: '/admin/contact-queries', icon: MessageSquare },
    ],
  },
  {
    title: 'System',
    items: [{ name: 'Settings', path: '/admin/settings', icon: Settings }],
  },
];

const ALL_ITEMS = ADMIN_NAV.flatMap((s) => s.items);

/**
 * Returns the nav item that owns `pathname`: exact match, otherwise the longest
 * item path that is a segment prefix (so /admin/products/edit/123 -> Products,
 * and /admin/blog-settings is not mistaken for /admin/blogs).
 */
export function getActiveNavItem(pathname: string | null | undefined): AdminNavItem | undefined {
  if (!pathname) return undefined;
  const path = pathname.replace(/\/+$/, '') || '/';
  let best: AdminNavItem | undefined;
  for (const item of ALL_ITEMS) {
    const matches =
      path === item.path || (item.path !== '/admin' && path.startsWith(`${item.path}/`));
    if (matches && (!best || item.path.length > best.path.length)) best = item;
  }
  return best;
}

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Namespaced so other apps served from the same origin (e.g. localhost:3000 in dev) can't leak their name in.
const SITE_NAME_KEY = 'silsila_admin_siteName';

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const active = getActiveNavItem(pathname);
  const [siteName, setSiteName] = useState('Silsila');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    try {
      const cached = localStorage.getItem(SITE_NAME_KEY);
      if (cached) setSiteName(cached);
    } catch {}

    const u = getCurrentUser();
    if (u) {
      const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
      setUser({ name: name || 'Admin', email: u.email });
    }

    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token || !process.env.NEXT_PUBLIC_BACKEND_URL) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const json = await res.json();
        const settings = json?.data ?? json;
        if (!cancelled && settings?.siteName) {
          setSiteName(settings.siteName);
          localStorage.setItem(SITE_NAME_KEY, settings.siteName);
        }
      } catch {
        // Non-critical: keep the cached / default name.
      }
    };
    fetchSettings();

    const onStorage = (e: StorageEvent) => {
      if (e.key === SITE_NAME_KEY && e.newValue) setSiteName(e.newValue);
      if (e.key === 'settingsUpdated') fetchSettings();
    };
    const onSettingsUpdated = () => fetchSettings();
    window.addEventListener('storage', onStorage);
    window.addEventListener('settingsUpdated', onSettingsUpdated);
    return () => {
      cancelled = true;
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('settingsUpdated', onSettingsUpdated);
    };
  }, []);

  const initials =
    (user?.name || 'Admin')
      .split(/\s+/)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'A';

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-stone-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden print:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden
      />

      <aside
        id="admin-sidebar"
        aria-label="Admin navigation"
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 overflow-hidden border-r border-stone-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 print:hidden ${
          isOpen ? 'translate-x-0 shadow-xl lg:shadow-none' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex h-16 items-center justify-between border-b border-stone-200 px-4">
            <Link href="/admin" onClick={onClose} className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
                <Image
                  src="/images/silsila-logo.png"
                  alt={`${siteName} logo`}
                  width={40}
                  height={40}
                  className="h-9 w-9 object-contain"
                  priority
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-base font-semibold text-stone-900">{siteName}</span>
                <span className="block text-xs text-stone-500">Admin Panel</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="admin-scrollbar flex-1 overflow-y-auto px-3 py-4">
            {ADMIN_NAV.map((section, i) => (
              <div key={section.title ?? `section-${i}`} className={i === 0 ? 'space-y-1' : 'mt-5 space-y-1'}>
                {section.title && (
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
                    {section.title}
                  </p>
                )}
                {section.items.map((item) => {
                  const isActive = active?.path === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={onClose}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/30 ${
                        isActive
                          ? 'bg-stone-900 font-semibold text-white shadow-sm'
                          : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 ${
                          isActive ? 'text-white' : 'text-stone-400 group-hover:text-stone-700'
                        }`}
                      />
                      <span className="flex-1 truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Signed-in admin */}
          <div className="border-t border-stone-200 p-4">
            <div className="flex items-center gap-3 rounded-lg bg-stone-50 px-3 py-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">
                {initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-stone-900">{user?.name || 'Admin'}</p>
                <p className="truncate text-xs text-stone-500">{user?.email || 'Administrator'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
