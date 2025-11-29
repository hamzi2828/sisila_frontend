'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AnnouncementBar from './components/AnnouncementBar';
import SearchOverlay from './components/SearchOverlay';
import Navigation from './components/Navigation';
import HeaderActions from './components/HeaderActions';
import MobileDrawer from './components/MobileDrawer';
import { navItems, megaMenuData, MegaMenu } from './components/headerData';
import { useOnClickOutside, useKey, useLockBody } from './components/useHeaderHooks';
import { cartHelper } from '@/helper/cartHelper';
import { wishlistHelper } from '@/helper/wishlistHelper';
import { fetchNavbarData, buildDynamicMegaMenus } from './components/navbarService';

type HeaderProps = {
  logoSrc?: string;
};

const Header: React.FC<HeaderProps> = ({ logoSrc = '/images/silsila-logo.png' }) => {
  const router = useRouter();

  const [announceOpen, setAnnounceOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<number | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [dynamicMega, setDynamicMega] = useState<Record<string, MegaMenu>>(megaMenuData);

  const navWrapRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(navWrapRef, () => setDesktopOpen(null));
  useKey('Escape', () => {
    setSearchOpen(false);
    setMobileOpen(false);
    setDesktopOpen(null);
  });
  useLockBody(mobileOpen || searchOpen);

  // Initialize cart count on mount
  useEffect(() => {
    const updateCartCount = () => {
      const count = cartHelper.getCartItemsCount();
      setCartCount(count);
    };

    // Initial load
    updateCartCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount();
    };

    const handleCartCleared = () => {
      setCartCount(0);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('cartCleared', handleCartCleared);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('cartCleared', handleCartCleared);
    };
  }, []);

  // Initialize wishlist count on mount
  useEffect(() => {
    const updateWishlistCount = () => {
      const count = wishlistHelper.getWishlistItemsCount();
      setWishlistCount(count);
    };

    // Sync wishlist from database first, then update count
    const initWishlist = async () => {
      await wishlistHelper.syncWishlistFromDatabase();
      updateWishlistCount();
    };

    initWishlist();

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      updateWishlistCount();
    };

    const handleWishlistCleared = () => {
      setWishlistCount(0);
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('wishlistCleared', handleWishlistCleared);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('wishlistCleared', handleWishlistCleared);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch dynamic navbar data (Categories, Themes, Series)
  useEffect(() => {
    const loadNavbarData = async () => {
      try {
        const data = await fetchNavbarData();
        const dynamicMenus = buildDynamicMegaMenus(data);

        // Merge static Shop menu with dynamic Categories, Themes, Series
        setDynamicMega({
          ...megaMenuData, // Keep static Shop menu
          ...dynamicMenus, // Override with dynamic data
        });
      } catch (error) {
        console.error('Error loading navbar data:', error);
        // Keep using static data on error
      }
    };

    loadNavbarData();
  }, []);

  const handleSearchSubmit = (query: string) => {
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setMobileOpen(false);
    setDesktopOpen(null);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      <AnnouncementBar isOpen={announceOpen} onClose={() => setAnnounceOpen(false)} />

      {/* Main header */}
      <div className={['w-full border-b border-gray-200 bg-white/70 backdrop-blur', hasScrolled ? 'shadow-[0_8px_20px_-12px_rgba(0,0,0,0.2)]' : ''].join(' ')}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 py-2 px-6 lg:py-3 lg:px-0">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <Image src={logoSrc} alt="Silsila logo" width={200} height={64} className="h-16 w-auto" priority />
            </Link>
          </div>

          {/* Center: Desktop nav */}
          <div className="hidden lg:block" ref={navWrapRef}>
            <Navigation items={navItems} mega={dynamicMega} desktopOpen={desktopOpen} setDesktopOpen={setDesktopOpen} />
          </div>

          {/* Right: actions */}
          <HeaderActions cartCount={cartCount} wishlistCount={wishlistCount} onSearchClick={() => setSearchOpen(true)} onMobileMenuClick={() => setMobileOpen(true)} />
        </div>
      </div>

      {/* Search overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} onSubmit={handleSearchSubmit} />

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} logoSrc={logoSrc} navItems={navItems} mega={dynamicMega} cartCount={cartCount} wishlistCount={wishlistCount} onSubmitSearch={handleSearchSubmit} />
    </header>
  );
};

export default Header;
