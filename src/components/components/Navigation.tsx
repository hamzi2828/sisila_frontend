'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { NavItem, megaMenuData } from './headerData';
import MegaMenu from './MegaMenu';

type NavigationProps = {
  items: NavItem[];
  desktopOpen: number | null;
  setDesktopOpen: (index: number | null) => void;
};

const Navigation: React.FC<NavigationProps> = ({ items, desktopOpen, setDesktopOpen }) => {
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <nav onKeyDown={(e) => e.key === 'Escape' && setDesktopOpen(null)}>
      <ul className="flex items-center gap-8">
        {items.map((item, idx) => {
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

              {item.hasDropdown && megaMenuData[item.label] && (
                <MegaMenu data={megaMenuData[item.label]} isOpen={isOpen} />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
