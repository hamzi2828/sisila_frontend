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
  products: Product[];
};

export default function NewArrivalsSection({
  className = '',
  products,
}: Props) {

  // If no products, don't render the section
  if (!products || products.length === 0) {
    return null;
  }

  // Take only the first 6 products
  const displayProducts = products.slice(0, 6);

  return (
    <section className={`px-6 md:px-10 lg:px-20 py-12 ${className}`}>
      <div className="mx-auto ">
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

        {/* Grid - 6 Products */}
        <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {displayProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
}: {
  product: Product;
}) {
  // Safety check - if product is undefined or missing required fields, return null
  if (!product || !product.href || !product.title || !product.image) {
    return null;
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl ring-1 ring-stone-200/80 bg-white h-[400px]">
      {/* Image */}
      <Link href={product.href} className="block h-full">
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
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
          {/* <button
            onClick={onAdd}
            className="opacity-0 group-hover:opacity-100 inline-flex items-center rounded-full bg-white text-stone-900 px-3 py-1.5 text-sm font-medium transition"
          >
            Add to Bag
          </button> */}
        </div>
      </div>
    </div>
  );
}