'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { themeService, type Theme } from '../main/services/themeService';
import ThemeHero from './components/ThemeHero';
import ThemeStickyNav from './components/ThemeStickyNav';
import ThemeFeatureStripe from './components/ThemeFeatureStripe';
import ThemeScroller from './components/ThemeScroller';

export default function ThemesPage() {
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

  if (themes.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 text-lg">No themes available at the moment.</p>
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
          <ThemeHero sections={themes} />
        </div>
      </section>

      {/* BODY */}
      <div className="px-6 md:px-10 lg:px-20 pb-28">
        <div className="mx-auto lg:grid lg:grid-cols-12 lg:gap-10">
          <aside className="hidden lg:block lg:col-span-3">
            <ThemeStickyNav sections={themes} />
          </aside>

          <section className="lg:col-span-9 space-y-16">
            {themes.map((section, idx) => (
              <ThemeFeatureStripe key={section._id} section={section} flipped={idx % 2 === 1} />
            ))}

            <div id="moodboards" className="scroll-mt-28">
              <h2
                className="text-2xl md:text-3xl font-semibold uppercase"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Moodboards
              </h2>
              <p className="mt-2 text-stone-600">
                Visual rails for each theme — textures, palettes, and compositions.
              </p>
            </div>

            {themes.map((section) => (
              <ThemeScroller key={`${section._id}-scroll`} section={section} />
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