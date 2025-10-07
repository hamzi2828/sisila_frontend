"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaShoppingCart, FaHeart, FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import "@fortawesome/fontawesome-free/css/all.css";
import { getCurrentUser, removeToken } from "@/helper/helper";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMobileMenu = () => setIsMobileMenuOpen((s) => !s);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    try {
      removeToken();
    } finally {
      closeMobileMenu();
      router.replace("/");
    }
  };

  // Only routes that exist
  const routes = {
    shop: "/main",
    men: "/mens-wear",
    women: "/women-wear",
    blogs: "/blogs",
    contact: "/contact-us",
    about: "/about-us",
    wishlist: "/wishlist",
    cart: "/cart",
    auth: "/authentication",
    home: "/",
    userDetails: "/user-detail",
  };

  const navItems = [
    { key: "shop", label: "Shop", href: routes.shop },
    { key: "men", label: "Men", href: routes.men },
    { key: "women", label: "Women", href: routes.women },
    { key: "blogs", label: "Blog", href: routes.blogs },
    { key: "contact", label: "Contact", href: routes.contact },
    { key: "about", label: "About", href: routes.about },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="fixed w-full top-0 z-50">
      <nav className="nav-bar">
        {/* Brand Logo */}
        <div className="flex-shrink-0">
          <Link
            href={routes.home}
            className="logo no-underline hover:opacity-80 transition-opacity duration-300"
            onClick={closeMobileMenu}
            aria-label="Go to homepage"
          >
            <Image src="/images/logo.png" alt="Logo" width={100} height={100} style={{ verticalAlign: "middle" }} />
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="menu" role="menubar">
          {navItems.map((item) => (
            <li key={item.key} className="nav-item" role="none">
              <Link
                href={item.href}
                className={`nav-link ${isActive(item.href) ? "active" : ""}`}
                role="menuitem"
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Section */}
        <div className="right-section">
          <Link
            href={routes.wishlist}
            className="icon-button relative"
            aria-label="Wishlist"
            title="View Wishlist"
            onClick={closeMobileMenu}
          >
            <FaHeart size={20} aria-hidden="true" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
              0
            </span>
          </Link>

          <Link
            href={routes.cart}
            className="icon-button relative"
            aria-label="Shopping Cart"
            title="View Cart"
            onClick={closeMobileMenu}
          >
            <FaShoppingCart size={20} aria-hidden="true" />
            <span className="absolute -top-2 -right-2 bg-green-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
              2
            </span>
          </Link>

          {getCurrentUser() ? (
            <>
              <Link
                href={routes.userDetails}
                className="cta-button for-mobile hidden md:flex"
                aria-label="View your account"
                onClick={closeMobileMenu}
              >
                <span className="cta-text">My Account</span>
                <FaArrowRight size={15} aria-hidden="true" className="text-black" />
              </Link>
              <button
                type="button"
                className="cta-button for-mobile hidden md:flex ml-2"
                aria-label="Logout"
                onClick={handleLogout}
              >
                <span className="cta-text">Logout</span>
                <i className="fas fa-sign-out-alt ml-2" aria-hidden="true" />
              </button>
            </>
          ) : (
            <Link
              href={routes.auth}
              className="cta-button for-mobile hidden md:flex"
              aria-label="Sign In or Sign Up"
              onClick={closeMobileMenu}
            >
              <span className="cta-text">Sign In / Sign Up</span>
              <FaArrowRight size={15} aria-hidden="true" className="text-black" />
            </Link>
          )}

          <button
            className="mobile-menu-button lg:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`} role="menu">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.key} className="mobile-nav-item" role="none">
                <Link
                  href={item.href}
                  className={`mobile-nav-link ${isActive(item.href) ? "active" : ""}`}
                  role="menuitem"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {/* Quick links */}
            <li className="mobile-nav-item mt-3" role="none">
              <Link href={routes.wishlist} className="mobile-nav-link" role="menuitem" onClick={closeMobileMenu}>
                <i className="far fa-heart mr-2" />
                Wishlist
              </Link>
            </li>
            <li className="mobile-nav-item" role="none">
              <Link href={routes.cart} className="mobile-nav-link" role="menuitem" onClick={closeMobileMenu}>
                <i className="fas fa-shopping-cart mr-2" />
                Cart
              </Link>
            </li>
          </ul>

          <div className="mt-6 pt-6 border-t border-gray-700">
            {getCurrentUser() ? (
              <>
                <Link
                  href={routes.userDetails}
                  className="cta-button w-full justify-center mb-3"
                  aria-label="View your account"
                  onClick={closeMobileMenu}
                >
                  <span className="cta-text">My Account</span>
                  <FaArrowRight size={15} aria-hidden="true" className="text-black" />
                </Link>
                <button
                  type="button"
                  className="cta-button w-full justify-center"
                  aria-label="Logout"
                  onClick={handleLogout}
                >
                  <span className="cta-text">Logout</span>
                  <i className="fas fa-sign-out-alt ml-2" aria-hidden="true" />
                </button>
              </>
            ) : (
              <Link
                href={routes.auth}
                className="cta-button w-full justify-center"
                aria-label="Sign In or Sign Up"
                onClick={closeMobileMenu}
              >
                <span className="cta-text">Sign In / Sign Up</span>
                <FaArrowRight size={15} aria-hidden="true" className="text-black" />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;