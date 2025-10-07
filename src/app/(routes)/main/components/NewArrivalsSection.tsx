'use client';

import Image from 'next/image';
import Link from 'next/link';

export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  href: string;
  badge?: 'New' | 'Limited' | 'Drop';
  tags?: string[];
};

type Props = {
  className?: string;
  products?: Product[];
  onAddToCart?: (p: Product) => void;
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'verses-tee',
    title: 'Verses Tee',
    price: 38,
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    href: '/p/verses-tee',
    badge: 'New',
    tags: ['Poets', 'Unisex'],
  },
  {
    id: 'quip-hoodie',
    title: 'Quip Hoodie',
    price: 72,
    image:
   'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    href: '/p/quip-hoodie',
    badge: 'Drop',
    tags: ['Witty', 'Hoodie'],
  },
  {
    id: 'canvas-tee',
    title: 'Canvas Tee',
    price: 42,
    image:
      'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1200&q=80',
    href: '/p/canvas-tee',
  },
  {
    id: 'neon-alley-hoodie',
    title: 'Neon Alley Hoodie',
    price: 78,
    image:
      'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1200&q=80',
    href: '/p/neon-alley-hoodie',
    badge: 'Limited',
  },
  {
    id: 'forest-tee',
    title: 'Forest Tee',
    price: 40,
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    href: '/p/forest-tee',
  },
  {
    id: 'varsity-tee',
    title: 'Varsity Tee',
    price: 44,
    image:
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80',
    href: '/p/varsity-tee',
  },
  {
    id: 'palette-crew',
    title: 'Palette Crew',
    price: 66,
    image:
      'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1200&q=80',
    href: '/p/palette-crew',
  },
   {
    id: 'neon-alley-hoodie-2',
    title: 'Neon Alley Hoodie',
    price: 78,
    image:
      'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1200&q=80',
    href: '/p/neon-alley-hoodie',
    badge: 'Limited',
  },
  {
    id: 'forest-tee-2',
    title: 'Forest Tee',
    price: 40,
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    href: '/p/forest-tee',
  },
  {
    id: 'varsity-tee-2',
    title: 'Varsity Tee',
    price: 44,
    image:
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80',
    href: '/p/varsity-tee',
  },
  {
    id: 'palette-crew-2',
    title: 'Palette Crew',
    price: 66,
    image:
      'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1200&q=80',
    href: '/p/palette-crew',
  },
];

export default function NewArrivalsSection({
  className = '',
  products = DEFAULT_PRODUCTS,
  onAddToCart,
}: Props) {
  const handleAdd = (p: Product) => {
    if (onAddToCart) onAddToCart(p);
    else console.log('add to cart', p);
  };

  return (
    <section className={`px-6 md:px-10 lg:px-20 py-12 ${className}`}>
      <div className="mx-auto">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">
              Just Landed
            </p>
            <h2
              className="mt-2 text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              New Arrivals
            </h2>
            <p className="mt-2 text-stone-600">
              Fresh edits across tees, hoods, and long sleeves — modern, culture-forward.
            </p>
          </div>
          <Link
            href="/shop?sort=new"
            className="shrink-0 inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50 transition"
          >
            Shop new ↗
          </Link>
        </div>

        {/* First Row - Featured + 2 Products */}
        <div className="mt-6 grid gap-5 md:grid-cols-4">
          <ProductCard
            product={products[0]}
            onAdd={() => handleAdd(products[0])}
            large
            className="md:col-span-2"
          />
          <ProductCard
            product={products[1]}
            onAdd={() => handleAdd(products[1])}
          />
          <ProductCard
            product={products[2]}
            onAdd={() => handleAdd(products[2])}
          />
        </div>

         {/* Second Row - 4 Products */}
        <div className="mt-5 grid gap-5 grid-cols-1 md:grid-cols-4">
          {products.slice(3, 7).map((p) => (
            <ProductCard key={p.id} product={p} onAdd={() => handleAdd(p)} />
          ))}
        </div>

     
         <div className="mt-6 grid gap-5 md:grid-cols-4">
          <ProductCard
            product={products[8]}
            onAdd={() => handleAdd(products[0])}
           
          />
          <ProductCard
            product={products[9]}
            onAdd={() => handleAdd(products[1])}
          />
          <ProductCard
            product={products[10]}
            onAdd={() => handleAdd(products[2])}
             large
            className="md:col-span-2"
          />
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onAdd,
  large = false,
  className = '',
}: {
  product: Product;
  onAdd: () => void;
  large?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[
        'group relative overflow-hidden rounded-2xl ring-1 ring-stone-200/80 bg-white',
        large ? 'h-[500px] md:h-[400px]' : 'h-[400px]',
        className,
      ].join(' ')}
    >
      {/* Image */}
      <Link href={product.href} className="block h-full">
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes={large ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            priority={large}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70" />
          {product.badge && (
            <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-900">
              {product.badge}
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-white font-medium">{product.title}</h3>
            <p className="text-white/85 text-sm">${product.price}</p>
          </div>
          <button
            onClick={onAdd}
            className="opacity-0 group-hover:opacity-100 inline-flex items-center rounded-full bg-white text-stone-900 px-3 py-1.5 text-sm font-medium transition"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}