'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, Heart, User, ShoppingCart, X, ChevronDown, ArrowRight } from 'lucide-react';
import { NavItem, MegaMenu } from './headerData';

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  logoSrc: string;
  navItems: NavItem[];
  mega: Record<string, MegaMenu>;
  cartCount: number;
  onSubmitSearch: (q: string) => void;
};

const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose, logoSrc, navItems, mega, cartCount, onSubmitSearch }) => {
  const [openMobile, setOpenMobile] = useState<number[]>([]);
  const [q, setQ] = useState('');

  const toggleMobileDropdown = (idx: number) => {
    setOpenMobile((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  return (
    <div className={`fixed inset-0 z-[55] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      {/* Backdrop */}
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />

      {/* Drawer */}
      <aside
        className={[
          'absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl transition-transform',
          open ? 'translate-x-0' : '-translate-x-full',
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
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
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

          {/* Nav (put padding-bottom so last item isn't hidden behind footer) */}
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
                                    <Link href={link.href || '#'} className="block rounded px-3 py-2 text-sm text-gray-800 hover:bg-gray-50" onClick={onClose}>
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
};

export default MobileDrawer;
