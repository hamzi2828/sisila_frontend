'use client';

import Link from 'next/link';
import Image from 'next/image';

import CategoryHero from './components/CategoryHero';
import CategoryStickyNav from './components/CategoryStickyNav';
import CategoryFeatureStripe from './components/CategoryFeatureStripe';
import CategoryScrollerRow from './components/CategoryScrollerRow';

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
  kind: CategoryKind;
  title: string;
  description: string;
  cover: string;
  accent?: string;
  gallery: { title: string; image: string; href?: string }[];
};

// Data (inlined)
const CATEGORY_SECTIONS: CategorySection[] = [
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
  // Curations
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
        <div className="mx-auto ">
          <CategoryHero core={CORE_CATEGORY_SECTIONS} />
        </div>
      </section>

      {/* BODY: sticky nav + content */}
      <div className="px-6 md:px-10 lg:px-20 pb-28">
        <div className="mx-auto lg:grid lg:grid-cols-12 lg:gap-10">
          {/* Sticky side nav */}
          <aside className="hidden lg:block lg:col-span-3">
            <CategoryStickyNav core={CORE_CATEGORY_SECTIONS} />
          </aside>

          {/* Content */}
          <section className="lg:col-span-9 space-y-16">
            {CORE_CATEGORY_SECTIONS.map((section, idx) => (
              <CategoryFeatureStripe key={section.id} section={section} flipped={idx % 2 === 1} />
            ))}

            <div id="curations" className="scroll-mt-28">
              <h2
                className="text-2xl md:text-3xl font-semibold uppercase"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Curations
              </h2>
              <p className="mt-2 text-stone-600">
                More ways to explore the brand aesthetic — modern, versatile, and culture-forward.
              </p>
            </div>

            {CURATIONS.map((section) => (
              <CategoryScrollerRow key={section.id} section={section} />
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

      {/* Scoped scrollbar himax-w-7xl de */}
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