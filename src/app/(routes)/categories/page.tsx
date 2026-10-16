'use client';

import Link from 'next/link';

import CategoryHero from './components/CategoryHero';
import CategoryStickyNav from './components/CategoryStickyNav';
import CategoryFeatureStripe from './components/CategoryFeatureStripe';
import CategoryScrollerRow from './components/CategoryScrollerRow';

import { useEffect, useState } from 'react';
import popularCategoriesService from '../main/services/popularCategoriesService';
import { publicProductService, type PublicProduct } from '../main/services/publicProductService';
import { productHref, productImage, resolveImage, FALLBACK_IMAGE } from '@/lib/productMedia';

// Types
export type CategorySection = {
  id: string; // category slug, used as the #anchor
  title: string;
  description: string;
  cover: string;
  accent?: string;
  href: string; // "view all" destination
  gallery: { title: string; image: string; href?: string }[];
};

const ACCENTS = [
  'from-stone-900/90 to-stone-600/10',
  'from-amber-900/90 to-amber-500/10',
  'from-pink-900/90 to-pink-500/10',
  'from-indigo-900/90 to-indigo-500/10',
  'from-emerald-900/90 to-emerald-500/10',
];

function scrollToHash() {
  const hash = typeof window !== 'undefined' ? decodeURIComponent(window.location.hash.slice(1)) : '';
  if (!hash) return;
  document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function CategoriesPage() {
  const [sections, setSections] = useState<CategorySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [categories, productsRes] = await Promise.all([
          popularCategoriesService.getPopularCategories(),
          publicProductService.getAllProducts(200, 1, 'createdAt', 'desc').catch(() => ({ data: [] as PublicProduct[] })),
        ]);
        const products = productsRes.data || [];
        const built: CategorySection[] = categories.map((cat, idx) => {
          const items = products.filter((p) => (p.category || '').toLowerCase() === cat.name.toLowerCase());
          const cover = resolveImage(cat.bannerUrl || cat.thumbnailUrl, items[0] ? productImage(items[0]) : FALLBACK_IMAGE);
          return {
            id: cat.slug,
            title: cat.name,
            description: cat.description || `Explore the ${cat.name} collection.`,
            cover,
            accent: ACCENTS[idx % ACCENTS.length],
            href: `/shop?category=${encodeURIComponent(cat.name)}`,
            gallery: items.map((p) => ({ title: p.name, image: productImage(p), href: productHref(p) })),
          };
        });
        if (!cancelled) setSections(built);
      } catch (err) {
        console.error('Failed to load categories:', err);
        if (!cancelled) setError('We couldn’t load categories right now. Please try again shortly.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sections render after the fetch, so honour /categories#slug once they exist.
  useEffect(() => {
    if (!loading && sections.length) requestAnimationFrame(scrollToHash);
  }, [loading, sections.length]);

  return (
    <main id="top" className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-12">
        <div className="mx-auto ">
          <CategoryHero core={sections} />
        </div>
      </section>

      {/* BODY: sticky nav + content */}
      <div className="px-6 md:px-10 lg:px-20 pb-28">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-300 border-t-stone-600" />
          </div>
        ) : error || sections.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-stone-600">{error || 'No categories available at the moment.'}</p>
            <Link
              href="/shop"
              className="mt-4 inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <div className="mx-auto lg:grid lg:grid-cols-12 lg:gap-10">
            {/* Sticky side nav */}
            <aside className="hidden lg:block lg:col-span-3">
              <CategoryStickyNav core={sections} />
            </aside>

            {/* Content */}
            <section className="lg:col-span-9 space-y-16">
              {sections.map((section, idx) => (
                <CategoryFeatureStripe
                  key={section.id}
                  section={{
                    ...section,
                    // Banner leads; the category's own pieces fill the detail tiles.
                    gallery: [{ title: section.title, image: section.cover }, ...section.gallery],
                  }}
                  flipped={idx % 2 === 1}
                />
              ))}

              <div id="curations" className="scroll-mt-28">
                <h2
                  className="text-2xl md:text-3xl font-semibold uppercase"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Pieces by Category
                </h2>
                <p className="mt-2 text-stone-600">
                  The latest designs from every category — tap a piece to see it up close.
                </p>
              </div>

              {sections
                .filter((section) => section.gallery.length > 0)
                .map((section) => (
                  <CategoryScrollerRow
                    key={`${section.id}-pieces`}
                    section={{ ...section, id: `${section.id}-pieces`, gallery: section.gallery.slice(0, 12) }}
                  />
                ))}

              <div className="pt-8">
                <Link
                  href="#top"
                  className="text-sm text-stone-500 hover:text-stone-800 underline underline-offset-4"
                >
                  Back to top
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Scoped scrollbar hide */}
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}
