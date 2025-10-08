'use client';

import Link from 'next/link';
import Image from 'next/image';

export type SeriesId = 'poets' | 'alphabets' | 'cinema' | 'anime';

export type SeriesSection = {
  id: SeriesId;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  accent?: string; // tailwind gradient classes
  subitems?: { title: string; href?: string }[];
  gallery: { title: string; image: string; href?: string }[];
};

// Inlined data (reusable across pages)
export const SERIES_SECTIONS: SeriesSection[] = [
  {
    id: 'poets',
    title: 'Poets Series',
    tagline: 'Verses, voices, and enduring resonance.',
    description:
      'Featuring inspirations and visual homages to the greats — typography, ink, and rhythm.',
    cover:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
    accent: 'from-stone-900/90 to-stone-600/10',
    subitems: [
      { title: 'Ghalib' },
      { title: 'Faiz Ahmed Faiz' },
      { title: 'John Elia' },
      { title: 'Habib Jalib' },
      { title: 'Muneer Niazi' },
    ],
    gallery: [
      {
        title: 'Ink & Verse',
        image:
          'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Margins & Notes',
        image:
          'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Quiet Reading',
        image:
          'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Type & Texture',
        image:
          'https://images.unsplash.com/photo-1520975922284-c0d7a98f3f6b?auto=format&fit=crop&w=1200&q=80',
      },
        {
        title: 'Neon Alley',
        image:
          'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'City Lights',
        image:
          'https://images.unsplash.com/photo-1536335550880-118d3d624d07?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Arcade Glow',
        image:
          'https://images.unsplash.com/photo-1544551763-5df28357f0a1?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Night Run',
        image:
          'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    id: 'alphabets',
    title: 'Alphabets Series',
    tagline: 'Scripts, strokes, and calligraphic form.',
    description:
      'A celebration of letterforms — Alif, Bay, Pay, and beyond. Composition, motion, and balance.',
    cover:
      'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1600&q=80',
    accent: 'from-fuchsia-900/90 to-fuchsia-500/10',
    subitems: [
      { title: 'Alif' },
      { title: 'Bay' },
      { title: 'Pay' },
      { title: 'Tay' },
      { title: 'Jeem' },
    ],
    gallery: [
      {
        title: 'Script Study',
        image:
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Ink Flow',
        image:
          'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Letter Rhythm',
        image:
          'https://images.unsplash.com/photo-1494319827402-c4b9b83f5741?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Grid & Form',
        image:
          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
      },
        {
        title: 'Neon Alley',
        image:
          'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'City Lights',
        image:
          'https://images.unsplash.com/photo-1536335550880-118d3d624d07?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Arcade Glow',
        image:
          'https://images.unsplash.com/photo-1544551763-5df28357f0a1?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Night Run',
        image:
          'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    id: 'cinema',
    title: 'Cinema Series',
    tagline: 'Frames, light, and iconic moments.',
    description:
      'From poster composition to reel textures — an ode to film language across eras.',
    cover:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    accent: 'from-rose-900/90 to-rose-500/10',
    gallery: [
      {
        title: 'Projection Glow',
        image:
          'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963f?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Reel Grain',
        image:
          'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Poster Walls',
        image:
          'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Velvet Seats',
        image:
          'https://images.unsplash.com/photo-1499013819532-e4ff41b00669?auto=format&fit=crop&w=1200&q=80',
      },
        {
        title: 'Neon Alley',
        image:
          'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'City Lights',
        image:
          'https://images.unsplash.com/photo-1536335550880-118d3d624d07?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Arcade Glow',
        image:
          'https://images.unsplash.com/photo-1544551763-5df28357f0a1?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Night Run',
        image:
          'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    id: 'anime',
    title: 'Anime Series',
    tagline: 'Neon, motion, and character-driven worlds.',
    description:
      'A visual salute to anime aesthetics — speed lines, glow, and emotional silhouettes.',
    cover:
      'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1600&q=80',
    accent: 'from-violet-900/90 to-violet-500/10',
    gallery: [
      {
        title: 'Neon Alley',
        image:
          'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'City Lights',
        image:
          'https://images.unsplash.com/photo-1536335550880-118d3d624d07?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Arcade Glow',
        image:
          'https://images.unsplash.com/photo-1544551763-5df28357f0a1?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Night Run',
        image:
          'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=1200&q=80',
      },
        {
        title: 'Neon Alley',
        image:
          'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'City Lights',
        image:
          'https://images.unsplash.com/photo-1536335550880-118d3d624d07?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Arcade Glow',
        image:
          'https://images.unsplash.com/photo-1544551763-5df28357f0a1?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Night Run',
        image:
          'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
];

type SeriesSectionProps = {
  className?: string;
};

// Compact, modern rail for the homepage
export default function SeriesSection({ className = '' }: SeriesSectionProps) {
  return (
    <section className={`px-6 md:px-10 lg:px-20 py-12 ${className}`}>
      <div className="mx-auto ">
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

        {/* Updated UI: asymmetric grid + mini chips */}
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {SERIES_SECTIONS.map((s) => (
            <Link
              key={s.id}
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
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent`} />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/90">
                  Series
                </span>
                <h3 className="mt-2 text-white text-lg font-semibold">{s.title}</h3>
                <p className="text-white/85 text-sm">{s.tagline}</p>

                {s.subitems?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {s.subitems.slice(0, 3).map((it) => (
                      <span
                        key={it.title}
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
      </div>
    </section>
  );
}