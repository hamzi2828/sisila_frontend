'use client';

import React from 'react';
import Link from 'next/link';
import { Search as SearchIcon, Heart, User, ShoppingCart, Menu } from 'lucide-react';

type HeaderActionsProps = {
  cartCount: number;
  onSearchClick: () => void;
  onMobileMenuClick: () => void;
};

const HeaderActions: React.FC<HeaderActionsProps> = ({ cartCount, onSearchClick, onMobileMenuClick }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        aria-label="Search"
        className="rounded p-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group"
        onClick={onSearchClick}
      >
        <SearchIcon className="h-[20px] w-[20px] leading-none transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
      </button>

      <Link
        href="/wishlist"
        aria-label="Wishlist"
        className="hidden rounded p-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group sm:inline-flex"
      >
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

      <a
        href="/authentication"
        aria-label="Account"
        className="hidden rounded p-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group sm:inline-flex"
      >
        <User className="h-[20px] w-[20px] leading-none transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
      </a>

      {/* Mobile menu button */}
      <button
        aria-label="Open menu"
        className="inline-flex rounded p-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group lg:hidden"
        onClick={onMobileMenuClick}
      >
        <Menu className="h-[22px] w-[22px] transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
      </button>
    </div>
  );
};

export default HeaderActions;
