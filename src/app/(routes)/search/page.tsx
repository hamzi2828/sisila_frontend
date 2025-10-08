'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchHero from './components/SearchHero';
import SearchResults from './components/SearchResults';
import SearchEmpty from './components/SearchEmpty';
import SearchChips from './components/SearchChips';

type Item = { id: string; title: string; price: number; tag?: string; image: string; href: string };

const CATALOG: Item[] = [
  { id: 'verses-tee', title: 'Verses Tee', price: 38, tag: 'Poetry', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
  { id: 'palette-crew', title: 'Palette Crew', price: 66, tag: 'Artistic', image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
  { id: 'neon-alley-hoodie', title: 'Neon Alley Hoodie', price: 78, tag: 'Street', image: 'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
  { id: 'forest-tee', title: 'Forest Tee', price: 40, tag: 'Nature', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
  { id: 'grotesk-tee', title: 'Grotesk Tee', price: 40, tag: 'Typography', image: 'https://images.unsplash.com/photo-1548883354-94bcfe3213e7?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
  { id: 'block-hoodie', title: 'Block Hoodie', price: 74, tag: 'Street', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
  { id: 'city-ls', title: 'City LS', price: 58, tag: 'Street', image: 'https://images.unsplash.com/photo-1503342217505-b0a15cf704d9?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
  { id: 'varsity-tee', title: 'Varsity Tee', price: 44, tag: 'Retro', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80', href: '/productdetail' },
];

export default function SearchPage() {
  const params = useSearchParams();
  const q = (params.get('q') || '').trim();

  const results = useMemo(() => {
    if (!q) return CATALOG;
    const term = q.toLowerCase();
    return CATALOG.filter(
      (i) => i.title.toLowerCase().includes(term) || (i.tag || '').toLowerCase().includes(term)
    );
  }, [q]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* Hero */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto max-w-7xl">
          <SearchHero query={q} count={results.length} />
        </div>
      </section>

      {/* Body */}
      <section className="px-6 md:px-10 lg:px-20 pb-20">
        <div className="mx-auto max-w-7xl">
          {results.length === 0 ? (
            <SearchEmpty query={q}>
              <SearchChips chips={['tee', 'hoodie', 'Poetry', 'Street']} />
            </SearchEmpty>
          ) : (
            <SearchResults items={results} />
          )}
        </div>
      </section>
    </main>
  );
}