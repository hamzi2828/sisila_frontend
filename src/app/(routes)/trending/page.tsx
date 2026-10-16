'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TrendingHero from './components/TrendingHero';
import TrendingHighlightRail from './components/TrendingHighlightRail';
import TrendingGrid from './components/TrendingGrid';
import TrendingCreators from './components/TrendingCreators';
import type { TrendingItem, TrendingTag } from './types';
import { publicProductService, type PublicProduct } from '../main/services/publicProductService';
import popularCategoriesService from '../main/services/popularCategoriesService';
import seriesService from '../main/services/seriesService';
import { effectivePrice, isOnSale, productHref, productImage } from '@/lib/productMedia';

function toItem(p: PublicProduct): TrendingItem {
  return {
    id: p._id,
    title: p.name,
    price: effectivePrice(p),
    compareAt: isOnSale(p) ? p.price : undefined,
    image: productImage(p),
    detailImage: productImage(p, 1),
    href: productHref(p),
    tag: p.category,
  };
}

export default function TrendingPage() {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [tags, setTags] = useState<TrendingTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [productsRes, categories, series] = await Promise.all([
        publicProductService.getAllProducts(60, 1, 'createdAt', 'desc').catch(() => null),
        popularCategoriesService.getPopularCategories().catch(() => []),
        seriesService.getActiveSeries().catch(() => []),
      ]);

      let products: PublicProduct[] = productsRes?.data || [];
      if (products.length) {
        // Featured pieces lead, then the rest by recency.
        products = [...products.filter((p) => p.featured), ...products.filter((p) => !p.featured)];
      } else {
        products = (await publicProductService.getRandomProducts(12).catch(() => null))?.data || [];
      }

      if (cancelled) return;
      setItems(products.slice(0, 12).map(toItem));
      setTags([
        ...categories.map((c) => ({ label: c.name, href: `/shop?category=${encodeURIComponent(c.name)}` })),
        ...series.map((s) => ({ label: s.title, href: `/series#${s.id}` })),
      ]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* Hero */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <TrendingHero tags={tags} />
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-300 border-t-stone-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="px-6 py-24 text-center">
          <p className="text-stone-600">Nothing trending just yet — check back soon.</p>
          <Link
            href="/shop"
            className="mt-4 inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <>
          {/* Highlight rail */}
          <section className="px-6 md:px-10 lg:px-20">
            <TrendingHighlightRail items={items.slice(0, 6)} />
          </section>

          {/* Grid */}
          <section className="px-6 md:px-10 lg:px-20 pt-8">
            <TrendingGrid items={items.slice(0, 9)} />
          </section>

          {/* Creators grid */}
          <section className="px-6 md:px-10 lg:px-20 py-12">
            <TrendingCreators items={items} />
          </section>
        </>
      )}
    </main>
  );
}
