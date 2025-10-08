'use client';

import { useMemo, useState } from 'react';
import WishlistHero from './components/WishlistHero';
import WishlistFilters from './components/WishlistFilters';
import WishlistGrid from './components/WishlistGrid';
import WishlistRails from './components/WishlistRails';

type SavedItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  kind: 'Tee' | 'Hoodie' | 'Crew' | 'LS' | 'Cap' | 'Tote';
  tag?: string;
  compareAt?: number;
  stock?: 'in' | 'low' | 'out';
  savedAt?: string;
};

const money = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

// Main saved items
const SAVED_INITIAL: SavedItem[] = [
  {
    id: 'verses-tee',
    title: 'Verses Tee',
    price: 38,
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80',
    kind: 'Tee',
    tag: 'Poetry',
    stock: 'in',
    savedAt: '2w',
  },
  {
    id: 'block-hoodie',
    title: 'Block Hoodie',
    price: 74,
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1400&q=80',
    kind: 'Hoodie',
    tag: 'Street',
    stock: 'low',
    savedAt: '5d',
  },
  {
    id: 'palette-crew',
    title: 'Palette Crew',
    price: 66,
    image:
      'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80',
    kind: 'Crew',
    tag: 'Artistic',
    stock: 'in',
    savedAt: '1w',
  },
  {
    id: 'city-ls',
    title: 'City LS',
    price: 58,
    image:
      'https://images.unsplash.com/photo-1503342217505-b0a15cf704d9?auto=format&fit=crop&w=1400&q=80',
    kind: 'LS',
    tag: 'Street',
    stock: 'in',
    savedAt: '3d',
  },
  {
    id: 'grotesk-tee',
    title: 'Grotesk Tee',
    price: 40,
    image:
      'https://images.unsplash.com/photo-1548883354-94bcfe3213e7?auto=format&fit=crop&w=1400&q=80',
    kind: 'Tee',
    tag: 'Typography',
    stock: 'in',
    savedAt: '1d',
  },
  {
    id: 'neon-alley-hoodie',
    title: 'Neon Alley Hoodie',
    price: 78,
    image:
      'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1400&q=80',
    kind: 'Hoodie',
    tag: 'Anime',
    compareAt: 88,
    stock: 'out',
    savedAt: '3w',
  },
  {
    id: 'forest-tee',
    title: 'Forest Tee',
    price: 42,
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80',
    kind: 'Tee',
    tag: 'Nature',
    stock: 'in',
    savedAt: '4d',
  },
  {
    id: 'varsity-tee',
    title: 'Varsity Tee',
    price: 44,
    image:
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80',
    kind: 'Tee',
    tag: 'Retro',
    stock: 'in',
    savedAt: '5w',
  },
];

// Back in stock suggestions
const BACK_IN_STOCK: SavedItem[] = [
  {
    id: 'ink-verse-tee',
    title: 'Ink & Verse Tee',
    price: 40,
    image:
      'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1400&q=80',
    kind: 'Tee',
    tag: 'Poetry',
    stock: 'in',
  },
  {
    id: 'quiet-reader-ls',
    title: 'Quiet Reader LS',
    price: 58,
    image:
      'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1400&q=80',
    kind: 'LS',
    tag: 'Poetry',
    stock: 'in',
  },
  {
    id: 'margins-crew',
    title: 'Margins Crew',
    price: 66,
    image:
      'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1400&q=80',
    kind: 'Crew',
    tag: 'Poetry',
    stock: 'in',
  },
];

// Price drops
const PRICE_DROPS: SavedItem[] = [
  {
    id: 'palette-hoodie',
    title: 'Palette Hoodie',
    price: 61,
    compareAt: 76,
    image:
      'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80',
    kind: 'Hoodie',
    tag: 'Artistic',
    stock: 'in',
  },
  {
    id: 'varsity-tee-sale',
    title: 'Varsity Tee',
    price: 35,
    compareAt: 44,
    image:
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80',
    kind: 'Tee',
    tag: 'Retro',
    stock: 'in',
  },
  {
    id: 'grotesk-tee-sale',
    title: 'Grotesk Tee',
    price: 32,
    compareAt: 40,
    image:
      'https://images.unsplash.com/photo-1548883354-94bcfe3213e7?auto=format&fit=crop&w=1400&q=80',
    kind: 'Tee',
    tag: 'Typography',
    stock: 'in',
  },
];

// Lists (saved collections)
const LISTS = [
  {
    id: 'gift-ideas',
    title: 'Gift ideas',
    count: 7,
    cover:
      'https://images.unsplash.com/photo-1499013819532-e4ff41b00669?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'poets-series',
    title: 'Poets Series',
    count: 5,
    cover:
      'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'street-edit',
    title: 'Street edit',
    count: 6,
    cover:
      'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState<typeof SAVED_INITIAL>(SAVED_INITIAL);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<'All' | SavedItem['kind']>('All');
  const [sort, setSort] = useState<'Newest' | 'Price ↑' | 'Price ↓'>('Newest');

  const kinds: ('All' | SavedItem['kind'])[] = ['All', 'Tee', 'Hoodie', 'Crew', 'LS'];

  const filtered = useMemo(() => {
    let rows = [...items];
    if (filter !== 'All') rows = rows.filter((r) => r.kind === filter);
    switch (sort) {
      case 'Price ↑':
        rows.sort((a, b) => a.price - b.price);
        break;
      case 'Price ↓':
        rows.sort((a, b) => b.price - a.price);
        break;
      default:
        rows.sort((a, b) => ((b.savedAt || '') > (a.savedAt || '') ? 1 : -1));
    }
    return rows;
  }, [items, filter, sort]);

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const selectAll = () => setSelected(filtered.map((x) => x.id));
  const clearSelection = () => setSelected([]);

  const remove = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setSelected((s) => s.filter((x) => x !== id));
  };
  const removeSelected = () => {
    setItems((prev) => prev.filter((x) => !selected.includes(x.id)));
    setSelected([]);
  };
  const addToCart = (id: string) => {
    console.log('Add to cart:', id);
  };
  const addSelectedToCart = () => {
    console.log('Add selected to cart:', selected);
    setSelected([]);
  };
  const shareWishlist = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (_) {}
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto">
          <WishlistHero count={items.length} onShare={shareWishlist} />
        </div>
      </section>

      {/* FILTERS + BULK BAR */}
      <section className="px-6 md:px-10 lg:px-20 pb-4">
        <WishlistFilters
          kinds={kinds}
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
          selectedCount={selected.length}
          onAddSelectedToCart={addSelectedToCart}
          onRemoveSelected={removeSelected}
          onClearSelection={clearSelection}
          onSelectAll={selectAll}
        />
      </section>

      {/* SAVED GRID */}
      <section className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto">
          <WishlistGrid
            items={filtered}
            selected={selected}
            toggleSelect={toggleSelect}
            remove={remove}
            addToCart={addToCart}
            money={money}
          />
        </div>
      </section>

      {/* RAILS + LISTS + RECENT */}
      <WishlistRails
        backInStock={BACK_IN_STOCK}
        priceDrops={PRICE_DROPS}
        lists={LISTS}
        money={money}
      />
    </main>
  );
}