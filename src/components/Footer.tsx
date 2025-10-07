"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => (
  <footer className="footer-main">
    <div className="footer-container">
      {/* Newsletter Section */}
      <section className="footer-newsletter-section">
        <div className="footer-newsletter-content">
          <div className="footer-newsletter-text">
            <h2 className="footer-main-heading">BECOME A PART OF THE PACK</h2>
            <form className="footer-email-form" onSubmit={(e) => e.preventDefault()}>
              <div className="footer-input-wrapper">
                <input
                  type="email"
                  className="footer-email-input"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  required
                />
              </div>
              <button type="submit" className="footer-subscribe-button" aria-label="Subscribe to newsletter">
                <span className="footer-subscribe-text">Subscribe</span>
              </button>
            </form>
          </div>
        </div>
        <div className="footer-newsletter-image">
          <Image
            width={100}
            height={100}
            src="/images/hero.svg"
            alt="Newsletter Image"
            className="footer-image"
          />
        </div>
      </section>

      {/* Main Footer Links */}
      <section className="footer-links-section">
        <div className="footer-links-container">
          {/* Logo */}
          <div className="footer-logo-section">
            <div className="footer-logo-wrapper">
              <Link href="/" className="footer-logo-link" aria-label="Go to homepage">
                <Image
                  width={100}
                  height={100}
                  src="/images/logo.png"
                  alt="Company Logo"
                  className="footer-logo-image"
                />
              </Link>
            </div>
          </div>

          {/* Columns */}
          <div className="footer-links-content">
            {/* Shop */}
            <div className="footer-links-column">
              <h4 className="footer-column-heading">Shop</h4>
              <nav className="footer-nav-links">
                <Link href="/mens-wear" className="footer-nav-link">Men</Link>
                <Link href="/women-wear" className="footer-nav-link">Women</Link>
                <Link href="/main" className="footer-nav-link">Shop All</Link>
              </nav>
            </div>

            {/* Support */}
            <div className="footer-links-column">
              <h4 className="footer-column-heading">Support</h4>
              <nav className="footer-nav-links">
                <Link href="/contact-us" className="footer-nav-link">Help Center</Link>
                <Link href="/order-detail" className="footer-nav-link">Track My Order</Link>
                <Link href="/faqs" className="footer-nav-link">FAQs</Link>
                <Link href="/blogs" className="footer-nav-link">Blogs</Link>
              </nav>
            </div>

            {/* Account */}
            <div className="footer-links-column">
              <h4 className="footer-column-heading">Account</h4>
              <nav className="footer-nav-links">
                <Link href="/authentication" className="footer-nav-link">Sign In / Register</Link>
                <Link href="/user-detail" className="footer-nav-link">My Account</Link>
                <Link href="/wishlist" className="footer-nav-link">Wishlist</Link>
                <Link href="/cart" className="footer-nav-link">Cart</Link>
                <Link href="/checkout" className="footer-nav-link">Checkout</Link>
              </nav>
            </div>

            {/* Social */}
            <div className="footer-links-column footer-social-column">
              <h4 className="footer-column-heading">Follow Us</h4>
              <nav className="footer-nav-links">
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                  <span>Instagram</span>
                </a>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Facebook">
                  <i className="fab fa-facebook"></i>
                  <span>Facebook</span>
                </a>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="YouTube">
                  <i className="fab fa-youtube"></i>
                  <span>YouTube</span>
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom-section">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              <span className="footer-copyright-symbol">©</span>
              <span className="footer-copyright-year">2025</span>
              <span className="footer-copyright-text">
                SunLink INC — All rights reserved
              </span>
            </p>
            <nav className="footer-legal-links">
              <Link href="/privacy-policy" className="footer-legal-link">Privacy Policy</Link>
              <Link href="/faqs" className="footer-legal-link">FAQs</Link>
              <Link href="/contact-us" className="footer-legal-link">Help Center</Link>
            </nav>
          </div>
        </div>
      </section>

      {/* Background Logo */}
      <div className="footer-background-logo" aria-hidden="true">
        <Image
          src="/images/logo.png"
          alt="Background Logo"
          className="footer-bg-logo-image"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{
            objectFit: 'contain',
            objectPosition: 'center'
          }}
        />
      </div>
    </div>
  </footer>
);

export default Footer;