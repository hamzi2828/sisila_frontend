'use client';

import Link from 'next/link';

import ThemeHero from './components/ThemeHero';
import ThemeStickyNav from './components/ThemeStickyNav';
import ThemeFeatureStripe from './components/ThemeFeatureStripe';
import ThemeScroller from './components/ThemeScroller';

// Types
export type ThemeId =
  | 'southeastern-hymns'
  | 'artistic-passion'
  | 'echoes-of-the-winds'
  | 'uplifting-culture';

export type ThemeSection = {
  id: ThemeId;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  accent?: string;
  gallery: { title: string; image: string; href?: string }[];
};

// Data
const THEME_SECTIONS: ThemeSection[] = [
  {
    id: 'southeastern-hymns',
    title: 'Southeastern Hymns',
    tagline: 'Regional heritage, harmony, and timeless song.',
    description:
      'A warm tribute to Southern roots — stringed textures, woodgrain warmth, and chorus-like graphic rhythm. Serif typography, lyric motifs, and intimate color palettes.',
    cover:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80',
    accent: 'from-amber-900/90 to-amber-500/10',
    gallery: [
      { title: 'Acoustic Heritage', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Studio Warmth', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Country Road', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Sunday Harmony', image: 'https://images.unsplash.com/photo-1520975922284-c0d7a98f3f6b?auto=format&fit=crop&w=1400&q=80' },
         { title: 'Ocean Breath', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Forest Mist', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Dune Lines', image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Wind Textures', image: 'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1400&q=80' },
    ],
  },
  {
    id: 'artistic-passion',
    title: 'Artistic Passion',
    tagline: 'Color-forward, expressive, and unapologetically creative.',
    description:
      'Celebrating self-expression with bold compositions, painterly motion, and gallery-inspired details. Gradients, pigments, and gestural rhythm shape the visual language.',
    cover:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
    accent: 'from-rose-900/90 to-rose-500/10',
    gallery: [
      { title: 'Pigments', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Brush Strokes', image: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Canvas Motion', image: 'https://images.unsplash.com/photo-1494319827402-c4b9b83f5741?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Studio Light', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80' },
         { title: 'Ocean Breath', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Forest Mist', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Dune Lines', image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Wind Textures', image: 'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1400&q=80' },
    ],
  },
  {
    id: 'echoes-of-the-winds',
    title: 'Echoes of the Winds',
    tagline: 'Freedom, movement, and the poetry of nature.',
    description:
      'Air, dunes, and flowing fabric — a sense of motion that drifts across compositions and silhouettes. Cool palettes, horizon fades, and wind-carved textures.',
    cover:
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1600&q=80',
    accent: 'from-sky-900/90 to-sky-500/10',
    gallery: [
      { title: 'Ocean Breath', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Forest Mist', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Dune Lines', image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Wind Textures', image: 'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1400&q=80' },
         { title: 'Ocean Breath', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Forest Mist', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Dune Lines', image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Wind Textures', image: 'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1400&q=80' },
    ],
  },
  {
    id: 'uplifting-culture',
    title: 'Uplifting Culture',
    tagline: 'Joy, community, and positive narratives.',
    description:
      'Vivid tones and welcoming forms — celebrating connection, optimism, and shared stories. Playful type, friendly shapes, and feel-good energy.',
    cover:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=80',
    accent: 'from-violet-900/90 to-violet-500/10',
    gallery: [
      { title: 'Smiles', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Festival Energy', image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Neighborhood Light', image: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68a?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Togetherness', image: 'https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?auto=format&fit=crop&w=1400&q=80' },
       { title: 'Smiles', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Festival Energy', image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Neighborhood Light', image: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68a?auto=format&fit=crop&w=1400&q=80' },
      { title: 'Togetherness', image: 'https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?auto=format&fit=crop&w=1400&q=80' },
    ],
  },
];

export default function ThemesPage() {
  return (
    <main id="top" className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-12">
        <div className="mx-auto">
          <ThemeHero sections={THEME_SECTIONS} />
        </div>
      </section>

      {/* BODY */}
      <div className="px-6 md:px-10 lg:px-20 pb-28">
        <div className="mx-auto  lg:grid lg:grid-cols-12 lg:gap-10">
          <aside className="hidden lg:block lg:col-span-3">
            <ThemeStickyNav sections={THEME_SECTIONS} />
          </aside>

          <section className="lg:col-span-9 space-y-16">
            {THEME_SECTIONS.map((section, idx) => (
              <ThemeFeatureStripe key={section.id} section={section} flipped={idx % 2 === 1} />
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

            {THEME_SECTIONS.map((section) => (
              <ThemeScroller key={`${section.id}-scroll`} section={section} />
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