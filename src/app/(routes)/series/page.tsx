'use client';

import Link from 'next/link';

import type { SeriesSection } from '../main/components/SeriesSection';
import { SERIES_SECTIONS } from '../main/components/SeriesSection';

import SeriesHero from './components/SeriesHero';
import SeriesStickyNav from './components/SeriesStickyNav';
import SeriesFeature from './components/SeriesFeature';
import SeriesRail from './components/SeriesRail';

export default function SeriesPage() {
  return (
    <main id="top" className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-12">
        <div className="mx-auto ">
          <SeriesHero sections={SERIES_SECTIONS} />
        </div>
      </section>

      {/* BODY */}
      <div className="px-6 md:px-10 lg:px-20 pb-28">
        <div className="mx-auto  lg:grid lg:grid-cols-12 lg:gap-10">
          <aside className="hidden lg:block lg:col-span-3">
            <SeriesStickyNav sections={SERIES_SECTIONS} />
          </aside>

          <section className="lg:col-span-9 space-y-16">
            {SERIES_SECTIONS.map((section, idx) => (
              <SeriesFeature key={section.id} section={section} flipped={idx % 2 === 1} />
            ))}

            <div id="rails" className="scroll-mt-28">
              <h2
                className="text-2xl md:text-3xl font-semibold uppercase"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Mood Rails
              </h2>
              <p className="mt-2 text-stone-600">
                Horizontal scrollers capturing each series' vibe — poster frames, textures, and compositions.
              </p>
            </div>

            {SERIES_SECTIONS.map((section) => (
              <SeriesRail key={`${section.id}-rail`} section={section} />
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