'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/formatPrice';

type Product = {
  id: string;
  title: string;
  price: number;
  compareAt?: number;
  image: string;
  href: string;
  tag?: string;
};

type ShopGridProps = {
  products: Product[];
  collectionType?: 'theme' | 'series' | null;
  collectionTitle?: string;
};

export default function ShopGrid({ products = [], collectionType, collectionTitle }: ShopGridProps) {
  // Filter out any invalid products
  const validProducts = products.filter(p => p && p.id && p.href && p.title);

  return (
    <>
      <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {validProducts.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 4} />
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {collectionType && collectionTitle ? (
          <>
            <PromoCard
              title={`More ${collectionType === 'theme' ? 'Themes' : 'Series'}`}
              href={collectionType === 'theme' ? '/themes' : '/series'}
              image="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1400&q=80"
              badge={`Back to ${collectionType === 'theme' ? 'Themes' : 'Series'}`}
            />
            <PromoCard
              title="Shop All Products"
              href="/shop"
              image="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1400&q=80"
              badge="All Collections"
            />
          </>
        ) : (
          <>
            <PromoCard
              title="Explore Themes"
              href="/themes"
              image="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1400&q=80"
              badge="Themes Collection"
            />
            <PromoCard
              title="Explore Series"
              href="/series"
              image="https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1400&q=80"
              badge="Series Collection"
            />
          </>
        )}
      </div>

      <div className="mt-12 overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-r from-stone-100 to-white p-6 sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Lookbook</p>
            <h3 className="text-xl font-semibold">Editorial — Culture in Motion</h3>
            <p className="text-stone-600">Visual stories across our themes and series.</p>
          </div>
          <Link href="/lookbook" className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800">
            See the lookbook ↗
          </Link>
        </div>
      </div>
    </>
  );
}

function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  // Safety check - if product is undefined or missing required fields, return null
  if (!product || !product.href || !product.title) {
    return null;
  }

  return (
    <Link href={product.href} className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition">
      <div className="relative w-full pt-[125%]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width:1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={priority}
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{product.title}</p>
          <p className="shrink-0 text-sm text-stone-700">
            {product.compareAt ? (
              <span className="mr-1.5 text-xs text-stone-400 line-through">{formatPrice(product.compareAt)}</span>
            ) : null}
            {formatPrice(product.price)}
          </p>
        </div>
        {product.tag ? <p className="mt-1 text-xs text-stone-500">{product.tag}</p> : null}
      </div>
    </Link>
  );
}

function PromoCard({ title, href, image, badge }: { title: string; href: string; image: string; badge?: string }) {
  return (
    <Link href={href} className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition">
      <div className="relative w-full pt-[52%]">
        <Image src={image} alt={title} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="absolute inset-0 flex flex-col items-start justify-between p-5">
        {badge && (
          <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-stone-600 uppercase tracking-wider">
            {badge}
          </span>
        )}
        <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-sm font-medium">{title} ↗</span>
      </div>
    </Link>
  );
}