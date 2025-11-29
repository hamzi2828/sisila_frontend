'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { publicProductService, type PublicProduct } from '../../main/services/publicProductService';

type RelatedProduct = {
  id: string;
  title: string;
  price: number;
  image: string;
  href: string;
};

type ProductDetails = {
  description: string;
  shortDescription?: string;
  features?: string;
};

export default function ProductMore({
  product,
  money,
  collectionType,
  currentProductId,
}: {
  product: ProductDetails;
  money: (v: number) => string;
  collectionType?: 'theme' | 'series' | null;
  currentProductId: string;
}) {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!collectionType) return;

      try {
        setIsLoading(true);
        // Fetch all products and filter by collectionType
        const response = await publicProductService.getAllProducts(50, 1, 'createdAt', 'desc');

        if (response.success && response.data) {
          // Filter by collectionType and exclude current product
          const filtered = response.data.filter(
            (p: PublicProduct) =>
              p.collectionType === collectionType &&
              p._id !== currentProductId
          );
          const productsToShow = filtered.slice(0, 6);

          const mapped = productsToShow.map((p: PublicProduct) => {
            let image = '';

            // Handle variant products with colorMedia
            if (p.productType === 'variant' && p.colorMedia) {
              const firstColor = Object.keys(p.colorMedia)[0];
              if (firstColor && p.colorMedia[firstColor]?.thumbnailUrl) {
                const url = p.colorMedia[firstColor].thumbnailUrl;
                image = url.startsWith('http')
                  ? url
                  : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${url}`;
              }
            } else if (p.thumbnailUrl) {
              image = p.thumbnailUrl.startsWith('http')
                ? p.thumbnailUrl
                : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${p.thumbnailUrl}`;
            }

            return {
              id: p._id,
              title: p.name,
              price: p.discountedPrice || p.price,
              image: image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
              href: `/productdetail/${p._id}`,
            };
          });

          setRelatedProducts(mapped);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [collectionType, currentProductId]);

  return (
    <div className="mt-12">
      {/* Row 1: Short Description (50%) + Key Features & Benefits (50%) */}
      <div className="grid gap-6 md:grid-cols-2">
        <Accordion title="Short Description" defaultOpen>
          <p className="text-stone-700">{product.shortDescription || 'No short description available.'}</p>
        </Accordion>
        <Accordion title="Key Features & Benefits" defaultOpen>
          <p className="text-stone-700 whitespace-pre-line">{product.features || 'No features listed.'}</p>
        </Accordion>
      </div>
      {/* Row 2: Full Description (100% width) */}
      <div className="mt-6">
        <Accordion title="Full Description">
          <p className="text-stone-700 whitespace-pre-line">{product.description || 'No description available.'}</p>
        </Accordion>
      </div>

      {!isLoading && relatedProducts.length > 0 && collectionType && (
        <RelatedRail
          heading={`More from ${collectionType === 'series' ? 'Series' : 'Themes'}`}
          items={relatedProducts}
          money={money}
        />
      )}
    </div>
  );
}

function Accordion({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <button className="flex w-full items-center justify-between px-4 py-3 text-left" onClick={() => setOpen((v) => !v)}>
        <span className="font-medium">{title}</span>
        <i className={['fa-solid transition-transform', open ? 'fa-chevron-up' : 'fa-chevron-down'].join(' ')} aria-hidden="true" />
      </button>
      <div className={`grid transition-all ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden px-4 pb-4 text-sm">{children}</div>
      </div>
    </div>
  );
}

function RelatedRail({ heading, items = [], money }: { heading: string; items?: RelatedProduct[]; money: (v: number) => string }) {
  return (
    <section className="mt-12">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {heading}
          </h2>
          <p className="text-stone-600 text-sm">Handpicked pieces you might like.</p>
        </div>
        <Link href="/shop?sort=related" className="hidden md:inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50 transition">
          Shop all ↗
        </Link>
      </div>

      <div className="my-4 no-scrollbar flex gap-5 overflow-x-auto px-1 py-4">
        {items.map((p, idx: number) => (
          <Link
            href={p.href || '/productdetail'}
            key={p.id || `${p.title}-${idx}`}
            className="group relative h-[320px] w-[240px] shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition"
          >
            <Image src={p.image} alt={p.title} fill sizes="240px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="text-white text-sm font-medium line-clamp-1">{p.title}</p>
              <p className="text-white/85 text-xs">{money(p.price)}</p>
            </div>
          </Link>
        ))}
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