'use client';

import Link from 'next/link';
import Image from 'next/image';

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
  accent?: string; // tailwind gradient classes
  gallery: { title: string; image: string; href?: string }[];
};

// Shared data (exported so the /themes page can reuse it)
export const THEME_SECTIONS: ThemeSection[] = [
  {
    id: 'southeastern-hymns',
    title: 'Southeastern Hymns',
    tagline: 'Regional heritage, harmony, and timeless song.',
    description:
      'A warm tribute to Southern roots — stringed textures, woodgrain warmth, and chorus-like graphic rhythm.',
    cover:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80',
    accent: 'from-amber-900/90 to-amber-500/10',
    gallery: [
      {
        title: 'Acoustic Heritage',
        image:
          'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Studio Warmth',
        image:
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Country Road',
        image:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Sunday Harmony',
        image:
          'https://images.unsplash.com/photo-1520975922284-c0d7a98f3f6b?auto=format&fit=crop&w=1200&q=80',
      },
       {
        title: 'Acoustic Heritage',
        image:
          'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Studio Warmth',
        image:
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Country Road',
        image:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Sunday Harmony',
        image:
          'https://images.unsplash.com/photo-1520975922284-c0d7a98f3f6b?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    id: 'artistic-passion',
    title: 'Artistic Passion',
    tagline: 'Color-forward, expressive, and unapologetically creative.',
    description:
      'Celebrating self-expression with bold compositions, painterly motion, and gallery-inspired detail.',
    cover:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
    accent: 'from-rose-900/90 to-rose-500/10',
    gallery: [
      {
        title: 'Pigments',
        image:
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Brush Strokes',
        image:
          'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Canvas Motion',
        image:
          'https://images.unsplash.com/photo-1494319827402-c4b9b83f5741?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Studio Light',
        image:
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Pigments',
        image:
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Brush Strokes',
        image:
          'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Canvas Motion',
        image:
          'https://images.unsplash.com/photo-1494319827402-c4b9b83f5741?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Studio Light',
        image:
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    id: 'echoes-of-the-winds',
    title: 'Echoes of the Winds',
    tagline: 'Freedom, movement, and the poetry of nature.',
    description:
      'Air, dunes, and flowing fabric — a sense of motion that drifts across compositions and silhouettes.',
    cover:
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1600&q=80',
    accent: 'from-sky-900/90 to-sky-500/10',
    gallery: [
      {
        title: 'Ocean Breath',
        image:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Forest Mist',
        image:
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Dune Lines',
        image:
          'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Wind Textures',
        image:
          'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1200&q=80',
      },
       {
        title: 'Ocean Breath',
        image:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Forest Mist',
        image:
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Dune Lines',
        image:
          'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Wind Textures',
        image:
          'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    id: 'uplifting-culture',
    title: 'Uplifting Culture',
    tagline: 'Joy, community, and positive narratives.',
    description:
      'Vivid tones and welcoming forms — celebrating connection, optimism, and shared stories.',
    cover:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=80',
    accent: 'from-violet-900/90 to-violet-500/10',
    gallery: [
      {
        title: 'Smiles',
        image:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Festival Energy',
        image:
          'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Neighborhood Light',
        image:
          'https://images.unsplash.com/photo-1542206395-9feb3edaa68a?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Togetherness',
        image:
          'https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?auto=format&fit=crop&w=1200&q=80',
      },
       {
        title: 'Smiles',
        image:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Festival Energy',
        image:
          'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Neighborhood Light',
        image:
          'https://images.unsplash.com/photo-1542206395-9feb3edaa68a?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Togetherness',
        image:
          'https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
];

type ThemesSectionProps = {
  className?: string;
};

// Compact section for the homepage
export default function ThemesSection({ className = '' }: ThemesSectionProps) {
  return (
    <section className={`px-6 md:px-10 lg:px-20 py-12 ${className}`}>
      <div className="mx-auto ">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">
              Creative Pillars
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Themes
            </h2>
            <p className="mt-2 text-stone-600">
              Four anchors that shape the brand POV and aesthetic direction.
            </p>
          </div>
          <Link
            href="/themes"
            className="shrink-0 inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50 transition"
          >
            Explore all themes ↗
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {THEME_SECTIONS.map((t) => (
            <Link
              key={t.id}
              href={`/themes#${t.id}`}
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
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent`} />
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
      </div>
    </section>
  );
}