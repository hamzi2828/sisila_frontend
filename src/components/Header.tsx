'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Search as SearchIcon,
  Heart,
  User,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type NavItem = {
  label: string;
  href?: string;
  hasDropdown?: boolean;
  active?: boolean;
};

type MenuSection = { heading: string; links: { label: string; href?: string }[] };

type MegaMenu = {
  sections: MenuSection[];
  image?: { src: string; alt: string; href?: string; caption?: string };
};

const navItems: NavItem[] = [
  { label: 'Shop', hasDropdown: true },
  { label: 'Categories', hasDropdown: true },
  { label: 'Themes', hasDropdown: true },
  { label: 'Series', hasDropdown: true },
  { label: 'About Silsila', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const mega: Record<string, MegaMenu> = {
  Shop: {
    sections: [
      {
        heading: 'New & Popular',
        links: [
          { label: 'Latest Arrivals', href: '/new-arrivals' },
          { label: 'Trending Now', href: '/trending' },
        ],
      },
      {
        heading: 'Explore by',
        links: [
          { label: 'Categories', href: '/categories' },
          { label: 'Themes', href: '/themes' },
          { label: 'Series', href: '/series' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1519744346363-66f0d6f9e6a6?auto=format&fit=crop&w=1200&q=80',
      alt: 'Shop',
      href: '/shop',
      caption: 'Shop all products',
    },
  },
  Categories: {
    sections: [
      {
        heading: 'Core',
        links: [
          { label: 'Poetry', href: '/categories#poetry' },
          { label: 'Witty', href: '/categories#witty' },
          { label: 'Fun', href: '/categories#fun' },
          { label: 'Artistic', href: '/categories#artistic' },
          { label: 'Creative', href: '/categories#creative' },
        ],
      },
      {
        heading: 'Curations',
        links: [
          { label: 'Minimal', href: '/categories#minimal' },
          { label: 'Street', href: '/categories#street' },
          { label: 'Retro', href: '/categories#retro' },
          { label: 'Nature', href: '/categories#nature' },
          { label: 'Typography', href: '/categories#typography' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      alt: 'Categories',
      href: '/categories',
      caption: 'Explore categories',
    },
  },
  Themes: {
    sections: [
      {
        heading: 'Creative Pillars',
        links: [
          { label: 'Southeastern Hymns', href: '/themes#southeastern-hymns' },
          { label: 'Artistic Passion', href: '/themes#artistic-passion' },
          { label: 'Echoes of the Winds', href: '/themes#echoes-of-the-winds' },
          { label: 'Uplifting Culture', href: '/themes#uplifting-culture' },
        ],
      },
      {
        heading: 'Quick Links',
        links: [
          { label: 'Explore Themes', href: '/themes' },
          { label: 'Lookbook', href: '/lookbook' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
      alt: 'Themes',
      href: '/themes',
      caption: 'See all themes',
    },
  },
  Series: {
    sections: [
      {
        heading: 'By Series',
        links: [
          { label: 'Poets', href: '/series#poets' },
          { label: 'Alphabets', href: '/series#alphabets' },
          { label: 'Cinema', href: '/series#cinema' },
          { label: 'Anime', href: '/series#anime' },
        ],
      },
      {
        heading: 'Poets — Featured',
        links: [
          { label: 'Ghalib', href: '/series#poets' },
          { label: 'Faiz Ahmed Faiz', href: '/series#poets' },
          { label: 'John Elia', href: '/series#poets' },
          { label: 'Habib Jalib', href: '/series#poets' },
          { label: 'Muneer Niazi', href: '/series#poets' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80',
      alt: 'Series',
      href: '/series',
      caption: 'Explore series',
    },
  },
};

const trendingSearches = ['Poets tee', 'Ghalib', 'Anime hoodie', 'Typography graphic', 'Street hoodie'];

function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      const el = ref.current;
      if (!el || el.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

function useKey(key: string, handler: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === key.toLowerCase()) handler();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [key, handler]);
}

function useLockBody(locked: boolean) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (locked) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

type HeaderProps = {
  cartCount?: number;
  logoSrc?: string;
};

const Header: React.FC<HeaderProps> = ({ cartCount = 2, logoSrc = '/images/silsila-logo.png' }) => {
  const router = useRouter();

  const [announceOpen, setAnnounceOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [desktopOpen, setDesktopOpen] = useState<number | null>(null);
  const [openMobile, setOpenMobile] = useState<number[]>([]);
  const [hasScrolled, setHasScrolled] = useState(false);

  const navWrapRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  useOnClickOutside(navWrapRef, () => setDesktopOpen(null));
  useKey('Escape', () => {
    setSearchOpen(false);
    setMobileOpen(false);
    setDesktopOpen(null);
  });
  useLockBody(mobileOpen || searchOpen);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const toggleMobileDropdown = (idx: number) => {
    setOpenMobile((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  // SEARCH: push to /search?q=...
  const handleSearchSubmit = (val?: string) => {
    const q = (val ?? query).trim();
    if (!q) return;
    setSearchOpen(false);
    setMobileOpen(false);
    setDesktopOpen(null);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      {announceOpen && (
        <div className="relative bg-gradient-to-r from-amber-100 via-rose-100 to-teal-100 text-gray-800">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-sm">
            <span className="inline-flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-600" aria-hidden="true" />
              Mid-season sale up to 40% off
            </span>
            <Link href="/shop" className="rounded-full bg-black px-3 py-1 text-white hover:bg-gray-900">
              Shop now
            </Link>
          </div>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-gray-600 hover:bg-white/60 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group"
            aria-label="Dismiss announcement"
            onClick={() => setAnnounceOpen(false)}
          >
            <X className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Main header */}
      <div className={['w-full border-b border-gray-200 bg-white/70 backdrop-blur', hasScrolled ? 'shadow-[0_8px_20px_-12px_rgba(0,0,0,0.2)]' : ''].join(' ')}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4  py-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <img src={logoSrc} alt="Silsila logo" className="h-16 w-auto" />
            </Link>
          </div>

          {/* Center: Desktop nav */}
          <div className="hidden lg:block" ref={navWrapRef} onKeyDown={(e) => e.key === 'Escape' && setDesktopOpen(null)}>
            <ul className="flex items-center gap-8">
              {navItems.map((item, idx) => {
                const isActive = !!item.active;
                const isOpen = desktopOpen === idx;
                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => {
                      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
                      setDesktopOpen(idx);
                    }}
                    onMouseLeave={() => {
                      closeTimerRef.current = window.setTimeout(() => setDesktopOpen(null), 120);
                    }}
                  >
                    {item.href && !item.hasDropdown ? (
                      <Link
                        href={item.href}
                        className={[
                          'group relative inline-flex items-center gap-2 text-sm transition-colors',
                          isActive ? 'text-black font-semibold' : 'text-[#5A5B60] font-medium hover:text-black',
                          'after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform group-hover:after:scale-x-100',
                        ].join(' ')}
                        style={{ fontFamily: isActive ? 'Poppins, sans-serif' : 'Manrope, sans-serif', lineHeight: isActive ? '20px' : '22px' }}
                      >
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={[
                          'group relative inline-flex items-center gap-2 text-sm transition-colors',
                          isActive ? 'text-black font-semibold' : 'text-[#5A5B60] font-medium hover:text-black',
                          'after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform group-hover:after:scale-x-100',
                        ].join(' ')}
                        style={{ fontFamily: isActive ? 'Poppins, sans-serif' : 'Manrope, sans-serif', lineHeight: isActive ? '20px' : '22px' }}
                        aria-expanded={item.hasDropdown ? isOpen : undefined}
                        onFocus={() => setDesktopOpen(idx)}
                      >
                        <span>{item.label}</span>
                        {item.hasDropdown && (
                          <ChevronDown className={['h-4 w-4 text-[#5A5B60] transition-transform', isOpen ? 'rotate-180' : ''].join(' ')} aria-hidden="true" />
                        )}
                      </button>
                    )}

                    {/* Mega menu */}
                    {item.hasDropdown && (
                      <div
                        className={[
                          'absolute left-1/2 top-full z-40 mt-4 w-[720px] -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-2xl',
                          isOpen ? 'visible opacity-100' : 'invisible opacity-0',
                          'transition-opacity',
                          "before:content-[''] before:absolute before:-top-4 before:left-0 before:h-4 before:w-full",
                        ].join(' ')}
                        role="menu"
                      >
                        <div className="grid grid-cols-3 gap-6">
                          <div className="col-span-2 grid grid-cols-2 gap-6">
                            {(mega[item.label]?.sections || []).map((section) => (
                              <div key={section.heading}>
                                <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">{section.heading}</p>
                                <ul className="space-y-1.5">
                                  {section.links.map((link) => (
                                    <li key={link.label}>
                                      <Link href={link.href || '#'} className="group/link flex items-center justify-between rounded px-2 py-1.5 text-[14px] text-gray-800 hover:bg-gray-50">
                                        <span>{link.label}</span>
                                        <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover/link:opacity-100 group-hover/link:translate-x-0.5" aria-hidden="true" />
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          <Link href={mega[item.label]?.image?.href || '#'} className="group relative overflow-hidden rounded-lg">
                            <img
                              src={mega[item.label]?.image?.src || 'https://placehold.co/320x180?text=Featured'}
                              alt={mega[item.label]?.image?.alt || 'Featured'}
                              className="h-40 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-900 backdrop-blur">
                              {mega[item.label]?.image?.caption || 'Explore'}
                            </span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              aria-label="Search"
              className="rounded p-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon className="h-[20px] w-[20px] leading-none transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
            </button>

            <Link href="/wishlist" aria-label="Wishlist" className="hidden rounded p-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group sm:inline-flex">
              <Heart className="h-[20px] w-[20px] leading-none transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative rounded p-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group"
            >
              <ShoppingCart className="h-[20px] w-[20px] leading-none transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-black px-1 text-[11px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <a href="#" aria-label="Account" className="hidden rounded p-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group sm:inline-flex">
              <User className="h-[20px] w-[20px] leading-none transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
            </a>

            {/* Mobile menu button */}
            <button
              aria-label="Open menu"
              className="inline-flex rounded p-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-[22px] w-[22px] transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-start bg-black/40 p-4 backdrop-blur-sm sm:place-items-center">
          <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <SearchIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                type="text"
                placeholder="Search products, stories, collections..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
              <button
                className="rounded p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
              </button>
            </div>
            <div className="px-4 py-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Trending</p>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleSearchSubmit(t)}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-100"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        logoSrc={logoSrc}
        navItems={navItems}
        mega={mega}
        cartCount={cartCount}
        onSubmitSearch={(q) => handleSearchSubmit(q)}
      />
    </header>
  );
};

function MobileDrawer({
  open,
  onClose,
  logoSrc,
  navItems,
  mega,
  cartCount,
  onSubmitSearch,
}: {
  open: boolean;
  onClose: () => void;
  logoSrc: string;
  navItems: NavItem[];
  mega: Record<string, MegaMenu>;
  cartCount: number;
  onSubmitSearch: (q: string) => void;
}) {
  const [openMobile, setOpenMobile] = useState<number[]>([]);
  const [q, setQ] = useState('');
  const toggleMobileDropdown = (idx: number) => {
    setOpenMobile((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  return (
    <div className={`fixed inset-0 z-[55] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={[
          'absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl transition-transform',
          open ? 'translate-x-0' : '-translate-x-full',
          // Key: make the drawer a column container
          'flex flex-col',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
      >
        {/* Header (fixed height) */}
        <div className="flex items-center justify-between border-b p-4 shrink-0">
          <img src={logoSrc} alt="Silsila" className="h-10 w-auto" />
          <button
            aria-label="Close menu"
            className="rounded p-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group"
            onClick={onClose}
          >
            <X className="h-[22px] w-[22px] transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable content */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* In-drawer search */}
          <div className="m-4 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
            <SearchIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSubmitSearch(q);
              }}
            />
          </div>

          {/* Nav (put padding-bottom so last item isn’t hidden behind footer) */}
          <nav className="px-2 pb-24">
            <ul className="space-y-1">
              {navItems.map((item, idx) => {
                const isOpen = openMobile.includes(idx);
                const isActive = !!item.active;
                return (
                  <li key={item.label}>
                    {item.href && !item.hasDropdown ? (
                      <Link
                        href={item.href}
                        className={[
                          'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm',
                          isActive ? 'text-black font-semibold' : 'text-[#5A5B60] font-medium',
                          'hover:bg-gray-50',
                        ].join(' ')}
                        style={{ fontFamily: isActive ? 'Poppins, sans-serif' : 'Manrope, sans-serif' }}
                        onClick={onClose}
                      >
                        <span>{item.label}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                      </Link>
                    ) : (
                      <>
                        <button
                          className={[
                            'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm',
                            isActive ? 'text-black font-semibold' : 'text-[#5A5B60] font-medium',
                            'hover:bg-gray-50',
                          ].join(' ')}
                          style={{ fontFamily: isActive ? 'Poppins, sans-serif' : 'Manrope, sans-serif' }}
                          onClick={() => (item.hasDropdown ? toggleMobileDropdown(idx) : onClose())}
                          aria-expanded={item.hasDropdown ? isOpen : undefined}
                          aria-controls={item.hasDropdown ? `sect-${idx}` : undefined}
                        >
                          <span>{item.label}</span>
                          {item.hasDropdown ? (
                            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                          ) : (
                            <ArrowRight className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                          )}
                        </button>

                        {item.hasDropdown && (
                          <div id={`sect-${idx}`} className={`${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} grid transition-all`}>
                            <ul className="overflow-hidden border-l pl-4">
                              {(mega[item.label]?.sections || [])
                                .flatMap((section) => section.links)
                                .map((link) => (
                                  <li key={link.label}>
                                    <Link
                                      href={link.href || '#'}
                                      className="block rounded px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
                                      onClick={onClose}
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Footer actions (always visible) */}
        <div className="border-t p-4 bg-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="rounded p-2 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group"
                onClick={onClose}
              >
                <Heart className="h-[20px] w-[20px] transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
              </Link>
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative rounded p-2 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group"
                onClick={onClose}
              >
                <ShoppingCart className="h-[20px] w-[20px] transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-black px-1 text-[11px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                href="/authentication"
                aria-label="Account"
                className="rounded p-2 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group"
                onClick={onClose}
              >
                <User className="h-[20px] w-[20px] transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
export default Header;