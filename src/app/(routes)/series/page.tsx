'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { seriesService, type Series } from '../main/services/seriesService';
import SeriesHero from './components/SeriesHero';
import SeriesStickyNav from './components/SeriesStickyNav';
import SeriesProducts from './components/SeriesProducts';

export default function SeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await seriesService.getActiveSeries();
        setSeries(data);
      } catch (err) {
        console.error('Error fetching series:', err);
        setError('Failed to load series');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeries();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-stone-300 border-t-stone-600"></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <Link href="/" className="mt-4 inline-block text-stone-600 hover:text-stone-900 underline">
            Return to homepage
          </Link>
        </div>
      </main>
    );
  }

  if (series.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 text-lg">No series available at the moment.</p>
          <Link href="/" className="mt-4 inline-block text-stone-600 hover:text-stone-900 underline">
            Return to homepage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="top" className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-12">
        <div className="mx-auto">
          <SeriesHero sections={series} />
        </div>
      </section>

      {/* BODY */}
      <div className="px-6 md:px-10 lg:px-20 pb-28">
        <div className="mx-auto lg:grid lg:grid-cols-12 lg:gap-10">
          <aside className="hidden lg:block lg:col-span-3">
            <SeriesStickyNav sections={series} />
          </aside>

          <section className="lg:col-span-9 space-y-16">
            {series.map((section) => (
              <SeriesProducts key={section._id} section={section} />
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
      </div>
    </main>
  );
}