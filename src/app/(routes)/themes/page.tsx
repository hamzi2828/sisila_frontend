'use client';

import Link from 'next/link';
import Image from 'next/image';

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
  accent?: string; // tailwind gradient classes
  gallery: { title: string; image: string; href?: string }[];
};

// Inlined Themes content (own data)
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
    ],
  },
];

export default function ThemesPage() {
  return (
    <main id="top" className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-stone-200/60 bg-gradient-to-br from-black via-stone-900 to-stone-800 text-white">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '14px 14px' }}
            />
            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-white/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Creative Direction
              </p>
              <h1 className="mt-3 text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Themes
              </h1>
              <p className="mt-3 max-w-2xl text-white/80">
                Four core anchors define the brand: Southeastern Hymns, Artistic Passion, Echoes of the Winds, and Uplifting Culture.
              </p>

              {/* Quick chips */}
              <div className="mt-6 flex flex-wrap gap-3">
                {THEME_SECTIONS.map((t) => (
                  <Link key={t.id} href={`#${t.id}`} className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition">
                    {t.title}
                  </Link>
                ))}
                <Link href="#moodboards" className="inline-flex items-center rounded-full bg-white text-stone-900 px-4 py-2 text-sm font-medium hover:bg-stone-100 transition">
                  View Moodboards
                </Link>
              </div>
            </div>

            {/* Floating collage */}
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden md:block">
              <div className="relative h-full w-[48vw] max-w-[640px]">
                {THEME_SECTIONS.slice(0, 3).map((t, i) => (
                  <div
                    key={t.id}
                    className={`absolute rounded-2xl ring-1 ring-white/20 overflow-hidden ${
                      i === 0
                        ? 'right-12 top-10 h-48 w-40'
                        : i === 1
                        ? 'right-24 top-40 h-60 w-48 rotate-3'
                        : 'right-8 bottom-10 h-52 w-44 -rotate-2'
                    }`}
                  >
                    <Image src={t.cover} alt={t.title} fill sizes="(max-width: 768px) 200px, 320px" className="object-cover" priority={i === 0} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY: sticky nav + content */}
      <div className="px-6 md:px-10 lg:px-20 pb-28">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-10">
          {/* Sticky side nav (desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-8">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-500">Themes</p>
                <nav className="grid gap-2">
                  {THEME_SECTIONS.map((t) => (
                    <Link key={t.id} href={`#${t.id}`} className="group inline-flex items-center justify-between rounded-xl border border-stone-200/70 bg-white px-3 py-2 text-sm hover:bg-stone-50 transition">
                      <span>{t.title}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition">↗</span>
                    </Link>
                  ))}
                </nav>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-500">Moodboards</p>
                <nav className="grid gap-2">
                  <Link href="#moodboards" className="inline-flex items-center justify-between rounded-xl border border-stone-200/70 bg-white px-3 py-2 text-sm hover:bg-stone-50 transition">
                    <span>All Moodboards</span>
                    <span>↓</span>
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          {/* Content */}
          <section className="lg:col-span-9 space-y-16">
            {THEME_SECTIONS.map((section, idx) => (
              <FeatureStripe key={section.id} section={section} flipped={idx % 2 === 1} />
            ))}

            {/* Moodboards header */}
            <div id="moodboards" className="scroll-mt-28">
              <h2 className="text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Moodboards
              </h2>
              <p className="mt-2 text-stone-600">Visual rails for each theme — textures, palettes, and compositions.</p>
            </div>

            {/* Moodboard scrollers */}
            {THEME_SECTIONS.map((section) => (
              <ThemeScroller key={`${section.id}-scroll`} section={section} />
            ))}

            {/* Back to top */}
            <div className="pt-8">
              <Link href="#top" className="text-sm text-stone-500 hover:text-stone-800 underline underline-offset-4">
                Back to top
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Scoped scrollbar hide */}
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

function FeatureStripe({
  section,
  flipped = false,
}: {
  section: {
    id: string;
    title: string;
    description: string;
    cover: string;
    accent?: string;
    gallery: { title: string; image: string; href?: string }[];
  };
  flipped?: boolean;
}) {
  const { title, description, accent = 'from-black/90 to-black/5', gallery } = section;

  const big = gallery[0]?.image || section.cover;
  const rightTop = gallery[1]?.image || section.cover;
  const rightBottom = gallery[2]?.image || section.cover;

  return (
    <article id={section.id} className="scroll-mt-28">
      <div className={['relative overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 ring-1 ring-black/5', 'supports-[backdrop-filter]:bg-white/40 backdrop-blur'].join(' ')}>
        {/* Gradient header bar */}
        <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${accent}`} />

        <div className={`grid gap-0 lg:grid-cols-12 ${flipped ? 'lg:[&>.media]:order-1' : ''}`}>
          {/* Media */}
          <div className="media relative lg:col-span-7">
            <div className="p-4 md:p-6 lg:p-8">
              {/* Mobile layout: stacked (responsive aspect-ratios) */}
              <div className="space-y-2 md:hidden">
                <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-stone-200/70 pt-[62%]">
                  <Image src={big} alt={`${title} — primary`} fill sizes="100vw" className="object-cover" priority />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-stone-200/70 pt-[62%]">
                    <Image src={rightTop} alt={`${title} — detail A`} fill sizes="50vw" className="object-cover" />
                  </div>
                  <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-stone-200/70 pt-[62%]">
                    <Image src={rightBottom} alt={`${title} — detail B`} fill sizes="50vw" className="object-cover" />
                  </div>
                </div>
              </div>

              {/* Desktop layout: original mosaic */}
              <div className="hidden md:grid grid-cols-12 grid-rows-6 gap-3 h-[480px] lg:h-[520px]">
                <div className="col-span-12 md:col-span-7 row-span-6 overflow-hidden rounded-2xl ring-1 ring-stone-200/70 relative">
                  <Image src={big} alt={`${title} — primary`} fill sizes="(max-width: 1024px) 60vw, 50vw" className="object-cover" priority />
                </div>
                <div className="col-span-12 md:col-span-5 row-span-3 overflow-hidden rounded-2xl ring-1 ring-stone-200/70 relative">
                  <Image src={rightTop} alt={`${title} — detail A`} fill sizes="(max-width: 1024px) 40vw, 30vw" className="object-cover" />
                </div>
                <div className="col-span-12 md:col-span-5 row-span-3 overflow-hidden rounded-2xl ring-1 ring-stone-200/70 relative">
                  <Image src={rightBottom} alt={`${title} — detail B`} fill sizes="(max-width: 1024px) 40vw, 30vw" className="object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* Text & CTA */}
          <div className="relative flex items-center lg:col-span-5">
            <div className="relative z-10 p-6 md:p-8 lg:p-10">
              <span className="inline-flex items-center rounded-full border border-stone-300/70 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.18em]">
                Theme
              </span>
              <h3 className="mt-3 text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {title}
              </h3>
              <p className="mt-2 text-stone-600">{description}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/productdetail" className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition">
                  Shop {title}
                </Link>
               
              </div>
            </div>

            {/* Subtle corner artwork */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-tr from-black/5 to-transparent blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ThemeScroller({ section }: { section: ThemeSection }) {
  const { id, title, tagline, gallery } = section;

  return (
    <section id={`${id}-mood`} className="scroll-mt-28">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h4 className="text-xl md:text-2xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {title} — Moodboard
          </h4>
          <p className="text-stone-600">{tagline}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/productdetail" className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50 transition">
            Explore {title}
          </Link>
        </div>
      </div>

      {/* Responsive scroller cards (mobile-friendly widths + aspect) */}
      <div className="mt-4 no-scrollbar flex gap-4 overflow-x-auto px-1 py-2 scroll-ps-1">
        {gallery.map((item, idx) => (
          <Link
            href="/productdetail"
            key={`${id}-${idx}`}
            className="group relative shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition
                       w-[76vw] sm:w-[58vw] md:w-[210px] aspect-[3/4] md:aspect-auto md:h-[280px]"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 76vw, (max-width: 768px) 58vw, 210px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="text-xs text-white/80">View</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}