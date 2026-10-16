'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { seriesService, type Series } from '../services/seriesService';

type SeriesSectionProps = {
  className?: string;
};

// Compact, modern rail for the homepage
export default function SeriesSection({ className = '' }: SeriesSectionProps) {
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

  return (
    <section className={`px-6 md:px-10 lg:px-20 py-12 ${className}`}>
      <div className="mx-auto">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">
              Editorial Collections
            </p>
            <h2
              className="mt-2 text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Series
            </h2>
            <p className="mt-2 text-stone-600">
              Cultural, literary, and visual concepts distilled into design capsules.
            </p>
          </div>
          <Link
            href="/series"
            className="shrink-0 inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50 transition"
          >
            View all series ↗
          </Link>
        </div>

        {isLoading && (
          <div className="mt-6 flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-stone-300 border-t-stone-600"></div>
          </div>
        )}

        {error && (
          <div className="mt-6 text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!isLoading && !error && series.length === 0 && (
          <div className="mt-6 text-center py-12">
            <p className="text-stone-500">No series available at the moment.</p>
          </div>
        )}

        {!isLoading && !error && series.length > 0 && (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {series.map((s) => (
              <Link
                key={s._id}
                href={`/series#${s.id}`}
                className="group relative overflow-hidden rounded-2xl ring-1 ring-stone-200/80 bg-white"
              >
                <div className="relative h-56">
                  <Image
                    src={s.cover}
                    alt={s.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/90">
                    Series
                  </span>
                  <h3 className="mt-2 text-white text-lg font-semibold">{s.title}</h3>
                  <p className="text-white/85 text-sm">{s.tagline}</p>

                  {s.subitems && s.subitems.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {s.subitems.slice(0, 3).map((it, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-full bg-white/80 text-stone-900 px-2.5 py-1 text-[11px]"
                        >
                          {it.title}
                        </span>
                      ))}
                      {s.subitems.length > 3 ? (
                        <span className="inline-flex items-center rounded-full bg-white/70 text-stone-900/80 px-2.5 py-1 text-[11px]">
                          +{s.subitems.length - 3} more
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}