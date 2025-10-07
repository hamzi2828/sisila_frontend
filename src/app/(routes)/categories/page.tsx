'use client';

import Link from 'next/link';
import Image from 'next/image';

// Types
export type CategoryId =
  | 'poetry'
  | 'witty'
  | 'fun'
  | 'artistic'
  | 'creative'
  | 'minimal'
  | 'street'
  | 'retro'
  | 'nature'
  | 'typography';

export type CategoryKind = 'core' | 'curation';

export type CategorySection = {
  id: CategoryId;
  kind: CategoryKind; // 'core' will be the top 5; 'curation' are additional rows
  title: string;
  description: string;
  cover: string;
  accent?: string; // tailwind gradient classes
  gallery: { title: string; image: string; href?: string }[];
};

// Data (inlined — not in a separate file)
const CATEGORY_SECTIONS: CategorySection[] = [
  // Core — 5 sections
  {
    id: 'poetry',
    kind: 'core',
    title: 'Poetry',
    description:
      'Inspired by literary works and emotional expression. Intimate textures, serif type, and quiet palettes.',
    cover: '/images/image.png',
    accent: 'from-stone-900/90 to-stone-600/10',
    gallery: [
      { title: 'Verses Tee', image: '/images/image.png' },
      { title: 'Sonnet Crew', image: '/images/image.png' },
      { title: 'Inkwell Hoodie', image: '/images/image.png' },
      { title: 'Prose Cap', image: '/images/image.png' },
      { title: 'Haiku Tote', image: '/images/image.png' },
      { title: 'Lyric LS Tee', image: '/images/image.png' },
    ],
  },
  {
    id: 'witty',
    kind: 'core',
    title: 'Witty',
    description:
      'Playful, humorous, and thought‑provoking. Sharp one‑liners, bold type, and clever visuals.',
    cover:
      'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-amber-900/90 to-amber-500/10',
    gallery: [
      { title: 'Punchline Tee', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Quip Hoodie', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Sarcasm Crew', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Wordplay LS', image: 'https://images.unsplash.com/photo-1548883354-94bcfe3213e7?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Wink Cap', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Meme Tote', image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  {
    id: 'fun',
    kind: 'core',
    title: 'Fun',
    description:
      'Lighthearted, casual, and trend‑driven. Pop colors, friendly shapes, and carefree vibes.',
    cover:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
    accent: 'from-pink-900/90 to-pink-500/10',
    gallery: [
      { title: 'Smile Tee', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Bubble Hoodie', image: '/images/image.png' },
      { title: 'Color Pop Crew', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Happy Cap', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Joy Tote', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Vibes LS', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  {
    id: 'artistic',
    kind: 'core',
    title: 'Artistic',
    description:
      'Experimental and creative designs showcasing visual aesthetics. Textures, gradients, and expressive layouts.',
    cover:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-indigo-900/90 to-indigo-500/10',
    gallery: [
      { title: 'Canvas Tee', image: '/images/image.png' },
      { title: 'Palette Hoodie', image: '/images/image.png' },
      { title: 'Stroke Crew', image: '/images/image.png' },
      { title: 'Muse Cap', image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Gallery Tote', image: 'https://images.unsplash.com/photo-1548883354-94bcfe3213e7?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Gradient LS', image: 'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  {
    id: 'creative',
    kind: 'core',
    title: 'Creative',
    description:
      'Innovative approaches combining cultural references and modern fashion — a forward brand POV.',
    cover:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-emerald-900/90 to-emerald-500/10',
    gallery: [
      { title: 'Concept Tee', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Collage Hoodie', image: '/images/image.png' },
      { title: 'Fusion Crew', image: '/images/image.png' },
      { title: 'Culture Cap', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1000&q=80' },
      { title: 'New Wave Tote', image: 'https://images.unsplash.com/photo-1503342217505-b0a15cf704d9?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Modern LS', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80' },
    ],
  },

  // Curations — 5 more sections
  {
    id: 'minimal',
    kind: 'curation',
    title: 'Minimal',
    description: 'Stripped-back silhouettes in monochrome and stone palettes.',
    cover:
      'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-slate-900/90 to-slate-500/10',
    gallery: [
      { title: 'Mono Tee', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Grey Crew', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Core Hoodie', image: '/images/image.png' },
      { title: 'Essential Cap', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Slate Tote', image: '/images/image.png' },
      { title: 'Neutral LS', image: '/images/image.png' },
    ],
  },
  {
    id: 'street',
    kind: 'curation',
    title: 'Street',
    description: 'Loose fits, graphic hits, attitude-forward shapes.',
    cover:
      'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-zinc-900/90 to-zinc-600/10',
    gallery: [
      { title: 'Block Hoodie', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Tag Tee', image: '/images/image.png' },
      { title: 'Skate Crew', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Snapback', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Daily Tote', image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1000&q=80' },
      { title: 'City LS', image: '/images/image.png' },
    ],
  },
  {
    id: 'retro',
    kind: 'curation',
    title: 'Retro',
    description: 'Nostalgic palettes and classic graphic proportions.',
    cover:
      'https://images.unsplash.com/photo-1542206395-9feb3edaa68a?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-orange-900/90 to-orange-500/10',
    gallery: [
      { title: 'Block Hoodie', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Tag Tee', image: '/images/image.png' },
      { title: 'Skate Crew', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Snapback', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Daily Tote', image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1000&q=80' },
      { title: 'City LS', image: '/images/image.png' },
    ],
  },
  {
    id: 'nature',
    kind: 'curation',
    title: 'Nature',
    description: 'Earth tones, organic shapes, grounded textures.',
    cover:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-green-900/90 to-green-500/10',
    gallery: [
      { title: 'Block Hoodie', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Tag Tee', image: '/images/image.png' },
      { title: 'Skate Crew', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Snapback', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Daily Tote', image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1000&q=80' },
      { title: 'City LS', image: '/images/image.png' },
    ],
  },
  {
    id: 'typography',
    kind: 'curation',
    title: 'Typography',
    description: 'Type-led pieces, bold compositions, clear hierarchy.',
    cover:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-fuchsia-900/90 to-fuchsia-500/10',
    gallery: [
      { title: 'Block Hoodie', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Tag Tee', image: '/images/image.png' },
      { title: 'Skate Crew', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Snapback', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1000&q=80' },
      { title: 'Daily Tote', image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1000&q=80' },
      { title: 'City LS', image: '/images/image.png' },
    ],
  },
];

const CORE_CATEGORY_SECTIONS = CATEGORY_SECTIONS.filter((c) => c.kind === 'core');

export default function CategoriesPage() {
  const CURATIONS = CATEGORY_SECTIONS.filter((c) => c.kind === 'curation');

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
                Brand Aesthetic
              </p>
              <h1 className="mt-3 text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Categories, Curated
              </h1>
              <p className="mt-3 max-w-2xl text-white/80">
                Five core moods, five fresh curations — discover designs through a modern, editorial lens.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {CORE_CATEGORY_SECTIONS.map((c) => (
                  <Link key={c.id} href={`#${c.id}`} className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition">
                    {c.title}
                  </Link>
                ))}
                <Link href="#curations" className="inline-flex items-center rounded-full bg-white text-stone-900 px-4 py-2 text-sm font-medium hover:bg-stone-100 transition">
                  View Curations
                </Link>
              </div>
            </div>

            {/* Floating image cluster */}
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden md:block">
              <div className="relative h-full w-[48vw] max-w-[640px]">
                <div className="absolute right-12 top-10 h-48 w-40 rounded-2xl ring-1 ring-white/20 overflow-hidden">
                  <Image src={CORE_CATEGORY_SECTIONS[0]?.cover || ''} alt={CORE_CATEGORY_SECTIONS[0]?.title || 'Category cover'} fill sizes="(max-width: 768px) 160px, 240px" className="object-cover" priority />
                </div>
                <div className="absolute right-24 top-40 h-60 w-48 rotate-3 rounded-2xl ring-1 ring-white/20 overflow-hidden">
                  <Image src={CORE_CATEGORY_SECTIONS[1]?.cover || ''} alt={CORE_CATEGORY_SECTIONS[1]?.title || 'Category cover'} fill sizes="(max-width: 768px) 200px, 320px" className="object-cover" />
                </div>
                <div className="absolute right-8 bottom-10 h-52 w-44 -rotate-2 rounded-2xl ring-1 ring-white/20 overflow-hidden">
                  <Image src={CORE_CATEGORY_SECTIONS[2]?.cover || ''} alt={CORE_CATEGORY_SECTIONS[2]?.title || 'Category cover'} fill sizes="(max-width: 768px) 180px, 280px" className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY: sticky nav + content */}
      <div className="px-6 md:px-10 lg:px-20 pb-28">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-10">
          {/* Sticky side nav */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-8">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-500">Core</p>
                <nav className="grid gap-2">
                  {CORE_CATEGORY_SECTIONS.map((c) => (
                    <Link key={c.id} href={`#${c.id}`} className="group inline-flex items-center justify-between rounded-xl border border-stone-200/70 bg-white px-3 py-2 text-sm hover:bg-stone-50 transition">
                      <span>{c.title}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition">↗</span>
                    </Link>
                  ))}
                </nav>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-500">Curations</p>
                <nav className="grid gap-2">
                  <Link href="#curations" className="inline-flex items-center justify-between rounded-xl border border-stone-200/70 bg-white px-3 py-2 text-sm hover:bg-stone-50 transition">
                    <span>All Curations</span>
                    <span>↓</span>
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          {/* Content */}
          <section className="lg:col-span-9 space-y-16">
            {/* Core: feature stripes */}
            {CORE_CATEGORY_SECTIONS.map((section, idx) => (
              <FeatureStripe key={section.id} section={section} flipped={idx % 2 === 1} />
            ))}

            {/* Curations header */}
            <div id="curations" className="scroll-mt-28">
              <h2 className="text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Curations
              </h2>
              <p className="mt-2 text-stone-600">More ways to explore the brand aesthetic — modern, versatile, and culture-forward.</p>
            </div>

            {/* Curation rows: sleek horizontal scrollers */}
            {CURATIONS.map((section) => (
              <ScrollerRow key={section.id} section={section} />
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
  const { id, title, description, accent = 'from-black/90 to-black/5', gallery } = section;

  const big = gallery[0]?.image || section.cover;
  const rightTop = gallery[1]?.image || section.cover;
  const rightBottom = gallery[2]?.image || section.cover;

  return (
    <article id={id} className="scroll-mt-28">
      <div className={['relative overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 ring-1 ring-black/5', 'supports-[backdrop-filter]:bg-white/40 backdrop-blur'].join(' ')}>
        {/* Gradient header bar */}
        <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${accent}`} />

        <div className={`grid gap-0 lg:grid-cols-12 ${flipped ? 'lg:[&>.media]:order-1' : ''}`}>
          {/* Media */}
          <div className="media relative lg:col-span-7">
            <div className="p-4 md:p-6 lg:p-8">
              {/* Mobile layout: stacked (1 big + 2 small) */}
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

              {/* Desktop layout: mosaic */}
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

          {/* Text & CTA panel */}
          <div className="relative flex items-center lg:col-span-5">
            <div className="relative z-10 p-6 md:p-8 lg:p-10">
              <span className="inline-flex items-center rounded-full border border-stone-300/70 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.18em]">
                {title}
              </span>
              <h3 className="mt-3 text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {title}
              </h3>
              <p className="mt-2 text-stone-600">{description}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/productdetail?category=${id}`} className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition">
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

function ScrollerRow({
  section,
}: {
  section: {
    id: string;
    title: string;
    description: string;
    cover: string;
    gallery: { title: string; image: string; href?: string }[];
  };
}) {
  const { id, title, description, gallery } = section;

  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {title}
          </h3>
          <p className="text-stone-600">{description}</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/productdetail?category=${id}`} className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50 transition">
            Explore {title}
          </Link>
        </div>
      </div>

      {/* Mobile-friendly scroller cards */}
      <div className="mt-4 no-scrollbar flex gap-4 overflow-x-auto px-1 py-2 scroll-ps-1">
        {gallery.map((item, idx) => (
          <Link
            href={item.href || `/productdetail?category=${id}`}
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