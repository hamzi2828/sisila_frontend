'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Youtube, Twitter, ArrowUp } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-stone-200 bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* Newsletter */}
      <section className="px-6 md:px-10 lg:px-20 py-10">
        <div className="mx-auto ">
          <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white/70 supports-[backdrop-filter]:bg-white/50 backdrop-blur">
            <div className="grid gap-6 p-6 md:grid-cols-2 md:p-10">
              <div>
                <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">Stay in the loop</p>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Join the Silsila community
                </h2>
                <p className="mt-2 text-stone-600">Drops, stories, and early access to culturally-inspired design.</p>

                <form
                  className="mt-5 flex w-full flex-col gap-3 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.currentTarget as HTMLFormElement);
                    console.log('subscribe:', data.get('email'));
                  }}
                >
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    aria-label="Email address"
                    className="w-full rounded-full border border-stone-300/80 bg-white px-4 py-3 text-sm outline-none ring-0 placeholder:text-stone-400 focus:border-stone-400"
                  />
                  <button type="submit" className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-stone-800" aria-label="Subscribe to newsletter">
                    Subscribe
                  </button>
                </form>

                <p className="mt-2 text-xs text-stone-500">
                  By subscribing, you agree to our{' '}
                  <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-stone-800">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <div className="relative hidden min-h-[180px] md:block">
                <div className="absolute inset-0">
                  <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gradient-to-tr from-black/5 to-transparent blur-2xl" />
                  <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-gradient-to-tr from-black/5 to-transparent blur-2xl" />
                </div>
                <div className="relative flex h-full items-center justify-center">
                  <Image src="/images/silsila-logo.png" alt="Silsila" width={200} height={200} className="opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="px-6 md:px-10 lg:px-20 pb-10">
        <div className="mx-auto ">
          <div className="grid gap-10 md:grid-cols-12">
            {/* Brand */}
            <div className="md:col-span-4">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/images/silsila-logo.png" alt="Silsila" width={80} height={80} className="h-14 w-auto" />
                <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Silsila
                </span>
              </Link>
              <p className="mt-3 max-w-sm text-sm text-stone-600">
                Culturally-inspired apparel blending heritage with contemporary fashion — designed for modern expression.
              </p>

              <div className="mt-4 flex items-center gap-2">
                <Link href="https://instagram.com/" target="_blank" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300/80 bg-white hover:bg-stone-50" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link href="https://twitter.com/" target="_blank" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300/80 bg-white hover:bg-stone-50" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link href="https://youtube.com/" target="_blank" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300/80 bg-white hover:bg-stone-50" aria-label="YouTube">
                  <Youtube className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Columns */}
            <div className="md:col-span-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
              {/* Shop */}
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-500">Shop</p>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/shop" className="hover:underline underline-offset-4">All Products</Link></li>
                  <li><Link href="/new-arrivals" className="hover:underline underline-offset-4">New Arrivals</Link></li>
                  <li><Link href="/trending" className="hover:underline underline-offset-4">Trending</Link></li>
                  <li><Link href="/cart" className="hover:underline underline-offset-4">Cart</Link></li>
                  <li><Link href="/wishlist" className="hover:underline underline-offset-4">Wishlist</Link></li>
                </ul>
              </div>

              {/* Categories */}
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-500">Categories</p>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/categories#poetry" className="hover:underline underline-offset-4">Poetry</Link></li>
                  <li><Link href="/categories#witty" className="hover:underline underline-offset-4">Witty</Link></li>
                  <li><Link href="/categories#artistic" className="hover:underline underline-offset-4">Artistic</Link></li>
                  <li><Link href="/categories#street" className="hover:underline underline-offset-4">Street</Link></li>
                  <li className="pt-1"><Link href="/categories" className="text-stone-600 hover:text-stone-900 hover:underline underline-offset-4">All Categories →</Link></li>
                </ul>
              </div>

              {/* Themes */}
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-500">Themes</p>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/themes#southeastern-hymns" className="hover:underline underline-offset-4">Southeastern Hymns</Link></li>
                  <li><Link href="/themes#artistic-passion" className="hover:underline underline-offset-4">Artistic Passion</Link></li>
                  <li><Link href="/themes#echoes-of-the-winds" className="hover:underline underline-offset-4">Echoes of the Winds</Link></li>
                  <li><Link href="/themes#uplifting-culture" className="hover:underline underline-offset-4">Uplifting Culture</Link></li>
                  <li className="pt-1"><Link href="/themes" className="text-stone-600 hover:text-stone-900 hover:underline underline-offset-4">All Themes →</Link></li>
                </ul>
              </div>

              {/* Series */}
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-500">Series</p>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/series#poets" className="hover:underline underline-offset-4">Poets</Link></li>
                  <li><Link href="/series#alphabets" className="hover:underline underline-offset-4">Alphabets</Link></li>
                  <li><Link href="/series#cinema" className="hover:underline underline-offset-4">Cinema</Link></li>
                  <li><Link href="/series#anime" className="hover:underline underline-offset-4">Anime</Link></li>
                  <li className="pt-1"><Link href="/series" className="text-stone-600 hover:text-stone-900 hover:underline underline-offset-4">All Series →</Link></li>
                </ul>
              </div>

              {/* Stories / Help */}
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-500">Stories</p>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/blogs" className="hover:underline underline-offset-4">Blog</Link></li>
                  <li><Link href="/lookbook" className="hover:underline underline-offset-4">Lookbook</Link></li>
                </ul>

                <p className="mb-3 mt-5 text-xs uppercase tracking-[0.18em] text-stone-500">Help</p>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/faqs" className="hover:underline underline-offset-4">FAQs</Link></li>
                  <li><Link href="/track" className="hover:underline underline-offset-4">Track order</Link></li>
                  <li><Link href="/contact" className="hover:underline underline-offset-4">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-10 border-t border-stone-200 pt-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              {/* Legal */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <Link href="/about" className="text-stone-700 hover:text-stone-900 hover:underline underline-offset-4">About Silsila</Link>
                <span className="hidden text-stone-300 md:inline">•</span>
                <Link href="/privacy-policy" className="text-stone-700 hover:text-stone-900 hover:underline underline-offset-4">Privacy Policy</Link>
                <span className="hidden text-stone-300 md:inline">•</span>
                <Link href="/terms" className="text-stone-700 hover:text-stone-900 hover:underline underline-offset-4">Terms</Link>
              </div>

              {/* Copyright + Top */}
              <div className="flex w-full items-center justify-between gap-3 md:w-auto">
                <p className="text-sm text-stone-600">© {year} Silsila — All rights reserved</p>
                <a href="#top" className="inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-sm text-stone-800 hover:bg-stone-50">
                  <ArrowUp className="h-4 w-4" />
                  Top
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-[15%] -bottom-[15%] hidden rounded-full bg-gradient-to-tr from-indigo-700/20 via-purple-700/10 to-transparent blur-4xl md:block" />
        <div className="absolute -left-[15%] -top-[15%] hidden rounded-full bg-gradient-to-tr from-rose-600/20 via-orange-500/10 to-transparent blur-4xl md:block" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-900/40 via-neutral-800/20 to-transparent" />
      </div>
    </footer>
  );
}