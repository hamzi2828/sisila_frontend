'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { ArrivalItem } from './types';
import NewArrivalsHero from './components/NewArrivalsHero';
import NewArrivalsValue from './components/NewArrivalsValue';
import NewArrivalsFeature from './components/NewArrivalsFeature';
import NewArrivalsRail from './components/NewArrivalsRail';
import { publicProductService } from '../main/services/publicProductService';
import { effectivePrice, isOnSale, productHref, productImage } from '@/lib/productMedia';

export default function NewArrivalsPage() {
  const [items, setItems] = useState<ArrivalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    publicProductService
      .getLatestProducts(12)
      .then((res) => {
        if (cancelled) return;
        setItems(
          (res.data || []).map((p) => ({
            id: p._id,
            title: p.name,
            price: effectivePrice(p),
            compareAt: isOnSale(p) ? p.price : undefined,
            image: productImage(p),
            detailImage: productImage(p, 1),
            href: productHref(p),
          }))
        );
      })
      .catch((err) => {
        console.error('Failed to load new arrivals:', err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto ">
          <NewArrivalsHero />
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-20 pb-6">
        <div className="mx-auto ">
          <NewArrivalsValue />
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-300 border-t-stone-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="px-6 py-24 text-center">
          <p className="text-stone-600">
            {error ? 'We couldn’t load new arrivals right now. Please try again shortly.' : 'New pieces are on their way — check back soon.'}
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <>
          <section className="px-6 md:px-10 lg:px-20">
            <div className="mx-auto ">
              <NewArrivalsFeature items={items} />
            </div>
          </section>

          <section className="px-6 md:px-10 lg:px-20 pb-16">
            <div className="mx-auto ">
              <NewArrivalsRail items={items} />
            </div>
          </section>
        </>
      )}
    </main>
  );
}
