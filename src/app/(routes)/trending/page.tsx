'use client';

import TrendingHero from './components/TrendingHero';
import TrendingHighlightRail from './components/TrendingHighlightRail';
import TrendingGrid from './components/TrendingGrid';
import TrendingCreators from './components/TrendingCreators';

const ITEMS = [
  { id: 'block-hoodie', title: 'Block Hoodie', price: 74, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1400&q=80', tag: 'Street' },
  { id: 'grotesk-tee', title: 'Grotesk Tee', price: 40, image: 'https://images.unsplash.com/photo-1548883354-94bcfe3213e7?auto=format&fit=crop&w=1400&q=80', tag: 'Typography' },
  { id: 'smile-tee', title: 'Smile Tee', price: 36, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80', tag: 'Fun' },
  { id: 'palette-hoodie', title: 'Palette Hoodie', price: 76, image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80', tag: 'Artistic' },
  { id: 'forest-tee-2', title: 'Forest Tee', price: 42, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80', tag: 'Nature' },
  { id: 'city-ls-2', title: 'City LS', price: 58, image: 'https://images.unsplash.com/photo-1503342217505-b0a15cf704d9?auto=format&fit=crop&w=1400&q=80', tag: 'Street' },
];

const TAGS = ['Street', 'Typography', 'Artistic', 'Nature', 'Fun'];

export default function TrendingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* Hero */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <TrendingHero tags={TAGS} />
      </section>

      {/* Highlight rail */}
      <section className="px-6 md:px-10 lg:px-20">
        <TrendingHighlightRail items={ITEMS} />
      </section>

      {/* Grid */}
      <section className="px-6 md:px-10 lg:px-20 pt-8">
        <TrendingGrid items={ITEMS} />
      </section>

      {/* Creators grid */}
      <section className="px-6 md:px-10 lg:px-20 py-12">
        <TrendingCreators items={ITEMS} />
      </section>
    </main>
  );
}