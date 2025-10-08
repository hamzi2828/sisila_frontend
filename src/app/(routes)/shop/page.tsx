'use client';

import { useMemo, useState } from 'react';
import ShopHero from './components/ShopHero';
import ShopValueBar from './components/ShopValueBar';
import ShopFilters from './components/ShopFilters';
import ShopGrid from './components/ShopGrid';

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  href: string;
  tag?: string;
};

const ALL_PRODUCTS: Product[] = [
  { id: 'verses-tee', title: 'Verses Tee', price: 38, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Poetry' },
  { id: 'quip-hoodie', title: 'Quip Hoodie', price: 72, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Witty' },
  { id: 'canvas-tee', title: 'Canvas Tee', price: 42, image: 'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Artistic' },
  { id: 'neon-alley-hoodie', title: 'Neon Alley Hoodie', price: 78, image: 'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Street' },
  { id: 'forest-tee', title: 'Forest Tee', price: 40, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Nature' },
  { id: 'varsity-tee', title: 'Varsity Tee', price: 44, image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Retro' },
  { id: 'palette-crew', title: 'Palette Crew', price: 66, image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Artistic' },
  { id: 'city-ls', title: 'City LS', price: 58, image: 'https://images.unsplash.com/photo-1503342217505-b0a15cf704d9?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Street' },
  { id: 'grotesk-tee', title: 'Grotesk Tee', price: 40, image: 'https://images.unsplash.com/photo-1548883354-94bcfe3213e7?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Typography' },
  { id: 'block-hoodie', title: 'Block Hoodie', price: 74, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Street' },
  { id: 'palette-hoodie', title: 'Palette Hoodie', price: 76, image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Artistic' },
  { id: 'city-ls-2', title: 'City LS', price: 58, image: 'https://images.unsplash.com/photo-1503342217505-b0a15cf704d9?auto=format&fit=crop&w=1400&q=80', href: '/productdetail', tag: 'Street' },
];

const PRICE_RANGES = ['All', 'Under $40', '$40–$60', '$60–$80', '$80+'] as const;
type PriceRange = (typeof PRICE_RANGES)[number];

const SORTS = ['Featured', 'Price ↑', 'Price ↓'] as const;
type SortKey = (typeof SORTS)[number];

export default function ShopPage() {
  const [activeTag, setActiveTag] = useState<string>('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [q, setQ] = useState('');
  const [price, setPrice] = useState<PriceRange>('All');
  const [sort, setSort] = useState<SortKey>('Featured');

  const tags = useMemo(
    () => ['All', ...Array.from(new Set(ALL_PRODUCTS.map((p) => p.tag).filter(Boolean))) as string[]],
    []
  );

  const products = useMemo(() => {
    let rows = [...ALL_PRODUCTS];

    const query = q.trim().toLowerCase();
    if (query) {
      rows = rows.filter(
        (p) => p.title.toLowerCase().includes(query) || (p.tag || '').toLowerCase().includes(query)
      );
    }
    if (activeTag !== 'All') rows = rows.filter((p) => p.tag === activeTag);

    rows = rows.filter((p) => {
      switch (price) {
        case 'Under $40':
          return p.price < 40;
        case '$40–$60':
          return p.price >= 40 && p.price <= 60;
        case '$60–$80':
          return p.price > 60 && p.price <= 80;
        case '$80+':
          return p.price > 80;
        default:
          return true;
      }
    });

    if (sort === 'Price ↑') rows.sort((a, b) => a.price - b.price);
    if (sort === 'Price ↓') rows.sort((a, b) => b.price - a.price);

    return rows;
  }, [activeTag, price, q, sort]);

  const clearAll = () => {
    setActiveTag('All');
    setPrice('All');
    setQ('');
    setSort('Featured');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
        <div className="mx-auto ">
          <ShopHero />
        </div>
      </section>

      <ShopValueBar />

      <section className="px-6 md:px-10 lg:px-20 pb-20">
        <div className="mx-auto ">
          <ShopFilters
            tags={tags}
            activeTag={activeTag}
            setActiveTag={setActiveTag}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            q={q}
            setQ={setQ}
            price={price}
            setPrice={setPrice}
            sort={sort}
            setSort={setSort}
            count={products.length}
            clearAll={clearAll}
          />

          <ShopGrid products={products} />
        </div>
      </section>
    </main>
  );
}