'use client';

import { useState, SetStateAction } from 'react';
import Link from 'next/link';
import ProductHeader from './components/ProductHeader';
import ProductGallery from './components/ProductGallery';
import ProductBuyBox from './components/ProductBuyBox';
import ProductMore from './components/ProductMore';

type CategoryId =
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

type ThemeId =
  | 'southeastern-hymns'
  | 'artistic-passion'
  | 'echoes-of-the-winds'
  | 'uplifting-culture';

type SeriesId = 'poets' | 'alphabets' | 'cinema' | 'anime';

type Product = {
  title: string;
  price: number;
  rating?: number;
  reviews?: number;
  images: string[];
  badges?: ('New' | 'Limited' | 'Drop')[];
  colors?: string[];
  sizes?: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  stock?: 'in' | 'low' | 'out';
  categoryId: CategoryId;
  themeId: ThemeId;
  seriesId?: SeriesId;
  description: string;
  materials?: string;
  care?: string;
};

const money = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

const PRODUCT: Product = {
  title: 'Verses Tee',
  price: 38,
  rating: 4.6,
  reviews: 128,
  images: [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1400&q=80',
  ],
  badges: ['New'],
  colors: ['#111111', '#6b7280', '#f5f5f5'],
  sizes: ['S', 'M', 'L', 'XL'],
  stock: 'in',
  categoryId: 'poetry',
  themeId: 'southeastern-hymns',
  seriesId: 'poets',
  description:
    'An homage to timeless verses — soft handfeel, relaxed fit, and serif typographic front hit.',
  materials: '100% Combed Cotton, 6.5 oz jersey',
  care: 'Machine wash cold with like colors. Tumble dry low. Do not iron print.',
};

const RELATED_SERIES = [
  { title: 'Ink & Verse Tee', price: 40, image: 'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1400&q=80' },
  { title: 'Margins Crew', price: 66, image: 'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1400&q=80' },
  { title: 'Quiet Reader LS', price: 58, image: 'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1400&q=80' },
   { title: 'Ink & Verse Tee', price: 40, image: 'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1400&q=80' },
  { title: 'Margins Crew', price: 66, image: 'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1400&q=80' },
  { title: 'Quiet Reader LS', price: 58, image: 'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1400&q=80' },
   { title: 'Ink & Verse Tee', price: 40, image: 'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1400&q=80' },
  { title: 'Margins Crew', price: 66, image: 'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1400&q=80' },
  { title: 'Quiet Reader LS', price: 58, image: 'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1400&q=80' },
];

const RELATED_CATEGORY = [
  { title: 'Sonnet Crew', price: 62, image: 'https://images.unsplash.com/photo-1520975922284-c0d7a98f3f6b?auto=format&fit=crop&w=1400&q=80' },
  { title: 'Prose Cap', price: 28, image: 'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1400&q=80' },
  { title: 'Haiku Tote', price: 32, image: 'https://images.unsplash.com/photo-1494869042583-f6c911f04b4e?auto=format&fit=crop&w=1400&q=80' },
   { title: 'Ink & Verse Tee', price: 40, image: 'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1400&q=80' },
  { title: 'Margins Crew', price: 66, image: 'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1400&q=80' },
  { title: 'Quiet Reader LS', price: 58, image: 'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1400&q=80' },
   { title: 'Ink & Verse Tee', price: 40, image: 'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1400&q=80' },
  { title: 'Margins Crew', price: 66, image: 'https://images.unsplash.com/photo-1514846326710-096e4a8035e1?auto=format&fit=crop&w=1400&q=80' },
  { title: 'Quiet Reader LS', price: 58, image: 'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1400&q=80' },
];

export default function ProductDetailPage() {
  const product = PRODUCT;

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(product.colors?.[0]);
  const [size, setSize] = useState(product.sizes?.[1] || product.sizes?.[0]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <div className="px-6 md:px-10 lg:px-20 pt-6">
        <div className="mx-auto max-w-7xl">
          <ProductHeader product={product} />

          <div className="mt-6 grid gap-8 lg:grid-cols-12">
            <section className="lg:col-span-7">
              <ProductGallery
                title={product.title}
                images={product.images}
                badges={product.badges}
                activeImage={activeImage}
                setActiveImage={setActiveImage}
              />
            </section>

            <aside className="lg:col-span-5">
              <ProductBuyBox
                product={product}
                money={money}
                color={color}
                setColor={setColor}
                size={size}
                setSize={(v: string) => setSize(v as SetStateAction<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | undefined>)}
              />
            </aside>
          </div>

          <ProductMore
            product={product}
            money={money}
            relatedSeries={RELATED_SERIES}
            relatedCategory={RELATED_CATEGORY}
          />
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/85 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{product.title}</p>
            <p className="text-xs text-stone-600">{money(product.price)}</p>
          </div>
          <Link href="/cart">
            <button className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
              Add to bag
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}