'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { themeService, type Theme } from '../services/themeService';

type ThemesSectionProps = {
  className?: string;
};

// Compact section for the homepage
export default function ThemesSection({ className = '' }: ThemesSectionProps) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await themeService.getActiveThemes();
        setThemes(data);
      } catch (err) {
        console.error('Error fetching themes:', err);
        setError('Failed to load themes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemes();
  }, []);

  return (
    <section className={`px-6 md:px-10 lg:px-20 py-12 ${className}`}>
      <div className="mx-auto">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">
              Creative Pillars
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Themes
            </h2>
            <p className="mt-2 text-stone-600">
              {themes.length > 0 ? `${themes.length} anchors` : 'Anchors'} that shape the brand POV and aesthetic direction.
            </p>
          </div>
          <Link
            href="/themes"
            className="shrink-0 inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50 transition"
          >
            Explore all themes ↗
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

        {!isLoading && !error && themes.length === 0 && (
          <div className="mt-6 text-center py-12">
            <p className="text-stone-500">No themes available at the moment.</p>
          </div>
        )}

        {!isLoading && !error && themes.length > 0 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {themes.map((t) => (
              <Link
                key={t._id}
                href={`/themes`}
                className="group relative overflow-hidden rounded-2xl ring-1 ring-stone-200/80 bg-white"
              >
                <div className="relative h-56">
                  <Image
                    src={t.cover}
                    alt={t.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/90">
                    Theme
                  </span>
                  <h3 className="mt-2 text-white text-lg font-semibold">{t.title}</h3>
                  <p className="text-white/85 text-sm">{t.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}