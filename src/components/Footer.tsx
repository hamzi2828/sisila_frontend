'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Youtube, Twitter, ArrowUp, ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { fetchNavbarData, type Category, type Theme, type Series } from './components/navbarService';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-neutral-950 text-neutral-200">
      {/* subtle rule */}
      <div aria-hidden className="h-px w-full bg-neutral-800" />

      <Newsletter />
      <LinksAndBrand />
      <BottomBar year={year} />
    </footer>
  );
}

/* Newsletter (B/W) */
function Newsletter() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 800));
    setBusy(false);
    setDone(true);
    setEmail('');
  };

  return (
    <section className="px-6 md:px-10 lg:px-20 py-14">
      <div className="mx-auto">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-7 md:p-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-neutral-400">Stay in the loop</p>
              <h2 className="mt-2 text-2xl md:text-3xl font-semibold uppercase text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Join the Silsila community
              </h2>
              <p className="mt-2 text-neutral-300">Drops, stories, and early access to culturally‑inspired design. Get 10% off your first order.</p>

              <form onSubmit={submit} className="mt-5 flex w-full flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-full border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-neutral-500"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className={['rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-950 transition', busy ? 'opacity-70' : 'hover:bg-neutral-200'].join(' ')}
                >
                  {busy ? 'Subscribing…' : 'Subscribe'}
                </button>
              </form>

              <p className="mt-2 text-xs text-neutral-500">
                By subscribing, you agree to our{' '}
                <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-neutral-300">
                  Privacy Policy
                </Link>
                .
              </p>

              {done && <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-neutral-800 px-3 py-1.5 text-sm text-white ring-1 ring-neutral-700">Thanks for subscribing — check your inbox.</p>}
            </div>

            <div className="flex items-center justify-center">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
                <div className="flex items-center gap-4">
                  <Image 
  src="/images/silsila-logo.png" 
  alt="Silsila" 
  width={64} 
  height={64} 
  className="h-12 w-12 object-contain brightness-0 invert opacity-90" 
/>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">Silsila</p>
                    <p className="text-neutral-200 text-sm">Culture in Motion — Since 2024</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-neutral-200">
                  <Badge>30‑day returns</Badge>
                  <Badge>Secure checkout</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </section>
  );
}

/* Links + brand */
function LinksAndBrand() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [series, setSeries] = useState<Series[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchNavbarData();
        setCategories(data.categories.slice(0, 4));
        setThemes(data.themes.slice(0, 4));
        setSeries(data.series.slice(0, 4));
      } catch (error) {
        console.error('Error loading footer data:', error);
      }
    };
    loadData();
  }, []);

  const cols = [
    { title: 'Shop', links: [
      { label: 'All Products', href: '/shop' },
      { label: 'New Arrivals', href: '/new-arrivals' },
      { label: 'Trending', href: '/trending' },
      { label: 'Cart', href: '/cart' },
      { label: 'Wishlist', href: '/wishlist' },
    ]},
    { title: 'Categories', links: [
      ...categories.map((cat) => ({
        label: cat.name,
        href: `/shop?category=${encodeURIComponent(cat.name)}`,
      })),
      { label: 'All Categories →', href: '/shop', subtle: true },
    ]},
    { title: 'Themes', links: [
      ...themes.map((theme) => ({
        label: theme.title,
        href: `/themes#${theme.id}`,
      })),
      { label: 'All Themes →', href: '/themes', subtle: true },
    ]},
    { title: 'Series', links: [
      ...series.map((s) => ({
        label: s.title,
        href: `/series#${s.id}`,
      })),
      { label: 'All Series →', href: '/series', subtle: true },
    ]},
    { title: 'Company', links: [
      { label: 'About Silsila', href: '/about' },
      { label: 'Lookbook', href: '/lookbook' },
      { label: 'Blog', href: '/blogs' },
      { label: 'Contact', href: '/contact' },
    ]},
  ];

  return (
    <section className="px-6 md:px-10 lg:px-20 pb-12">
      <div className="mx-auto ">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
           <Link href="/" className="flex items-center gap-3">
  <Image 
    src="/images/silsila-logo.png" 
    alt="Silsila" 
    width={80} 
    height={80} 
    className="h-14 w-auto brightness-0 invert" 
  />
  <span className="text-lg font-semibold tracking-tight text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
    Silsila
  </span>
</Link>
            <p className="mt-3 max-w-sm text-sm text-neutral-300">Culturally‑inspired apparel blending heritage with contemporary fashion — designed for modern expression.</p>

            <div className="mt-4 flex items-center gap-2">
              <Social href="https://instagram.com/" label="Instagram"><Instagram className="h-4 w-4" /></Social>
              <Social href="https://twitter.com/" label="Twitter / X"><Twitter className="h-4 w-4" /></Social>
              <Social href="https://youtube.com/" label="YouTube"><Youtube className="h-4 w-4" /></Social>
            </div>

            <div className="mt-5 grid gap-2 text-sm text-neutral-300">
              <p className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-neutral-500" /> support@silsila.co</p>
              <p className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-neutral-500" /> +92 300 0000000</p>
              <p className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-neutral-500" /> Karachi, PK</p>
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-neutral-400">{c.title}</p>
                <ul className="space-y-2 text-sm">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className={['group inline-flex items-center gap-1 hover:underline underline-offset-4', l.subtle ? 'text-neutral-400 hover:text-neutral-100' : ''].join(' ')}>
                        <span>{l.label}</span>
                        
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Pill>30‑day returns & exchanges</Pill>
          <Pill>Secure payments (Visa • MasterCard • PayPal)</Pill>
        </div>
      </div>
    </section>
  );
}

/* Bottom bar */
function BottomBar({ year }: { year: number }) {
  return (
    <section className="px-6 md:px-10 lg:px-20 pb-12">
      <div className="mx-auto ">
        <div className="border-top border-neutral-800">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center border-t border-neutral-800 pt-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <Link href="/privacy-policy" className="text-neutral-300 hover:text-white hover:underline underline-offset-4">Privacy Policy</Link>
              <span className="hidden text-neutral-600 md:inline">•</span>
              <Link href="/terms" className="text-neutral-300 hover:text-white hover:underline underline-offset-4">Terms</Link>
              <span className="hidden text-neutral-600 md:inline">•</span>
              <Link href="/faqs" className="text-neutral-300 hover:text-white hover:underline underline-offset-4">FAQs</Link>
            </div>

            <div className="flex w-full items-center justify-between gap-3 md:w-auto">
              <p className="text-sm text-neutral-400">© {year} Silsila — All rights reserved</p>
              <a href="#top" className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800" aria-label="Back to top" title="Back to top">
                <ArrowUp className="h-4 w-4" />
                Top
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Small pieces */
function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link href={href} target="_blank" aria-label={label} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-200 transition hover:bg-neutral-800 hover:shadow-sm" title={label}>
      {children}
    </Link>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-center text-xs text-neutral-200">{children}</div>;
}

function Pill({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-center text-sm text-neutral-200">{children}</div>;
}