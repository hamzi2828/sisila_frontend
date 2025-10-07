'use client';

import Image from 'next/image';
import Link from 'next/link';

export type TrendingItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  href: string;
  rating?: number; // 0–5
  tag?: string;
};

type Props = {
  className?: string;
  items?: TrendingItem[];
  onAddToCart?: (id: string) => void;
  title?: string;
  subtitle?: string;
};

const DEFAULT_ITEMS: TrendingItem[] = [
  {
    id: 'block-hoodie',
    title: 'Block Hoodie',
    price: 74,
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
    href: '/p/block-hoodie',
    rating: 4.7,
    tag: 'Street',
  },
  {
    id: 'grotesk-tee',
    title: 'Grotesk Tee',
    price: 40,
    image:
      'https://images.unsplash.com/photo-1548883354-94bcfe3213e7?auto=format&fit=crop&w=1200&q=80',
    href: '/p/grotesk-tee',
    rating: 4.5,
    tag: 'Typography',
  },
  {
    id: 'smile-tee',
    title: 'Smile Tee',
    price: 36,
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    href: '/p/smile-tee',
    rating: 4.3,
    tag: 'Fun',
  },
  {
    id: 'palette-hoodie',
    title: 'Palette Hoodie',
    price: 76,
    image:
      'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1200&q=80',
    href: '/p/palette-hoodie',
    rating: 4.6,
    tag: 'Artistic',
  },
  {
    id: 'forest-tee-2',
    title: 'Forest Tee',
    price: 42,
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    href: '/p/forest-tee-2',
    rating: 4.4,
    tag: 'Nature',
  },
  {
    id: 'city-ls-2',
    title: 'City LS',
    price: 58,
    image:
      'https://images.unsplash.com/photo-1503342217505-b0a15cf704d9?auto=format&fit=crop&w=1200&q=80',
    href: '/p/city-ls-2',
    rating: 4.2,
    tag: 'Street',
  },
];

export default function TrendingRailSection({
  className = '',
  items = DEFAULT_ITEMS,
  onAddToCart,
  title = 'Trending Now',
  subtitle = 'Most-loved styles from the last 7 days.',
}: Props) {
  const add = (id: string) => (onAddToCart ? onAddToCart(id) : console.log('add', id));

  return (
    <section className={`px-6 md:px-10 lg:px-20 py-12 ${className}`}>
      <div className="mx-auto">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">Popular</p>
            <h2
              className="mt-2 text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {title}
            </h2>
            <p className="mt-2 text-stone-600">{subtitle}</p>
          </div>
          <Link
            href="/shop?sort=trending"
            className="shrink-0 inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50 transition"
          >
            Shop all ↗
          </Link>
        </div>

        <div className="mt-6 no-scrollbar flex gap-5 overflow-x-auto px-1 py-2">
          {items.map((it) => (
            <div
              key={it.id}
              className="group relative h-[320px] w-[240px] shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition"
            >
              <Link href={it.href} className="absolute inset-0">
                <Image
                  src={it.image}
                  alt={it.title}
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  priority
                />
              </Link>
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-white text-sm font-medium">{it.title}</p>
                    <p className="text-white/85 text-xs">
                      {it.tag ? `${it.tag} • ` : ''}${it.price}
                    </p>
                  </div>
                  <button
                    onClick={() => add(it.id)}
                    className="inline-flex items-center rounded-full bg-white text-stone-900 px-3 py-1.5 text-sm font-medium"
                  >
                    + Bag
                  </button>
                </div>
                {typeof it.rating === 'number' ? (
                  <p className="mt-1 text-[11px] text-white/85">★ {it.rating.toFixed(1)}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}