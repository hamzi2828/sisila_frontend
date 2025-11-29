'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { publicProductService, type PublicProduct } from '../../main/services/publicProductService';

type Section = {
  id: string;
  title: string;
  description: string;
  cover: string;
  accent?: string;
};

export default function ThemeProducts({
  section,
}: {
  section: Section;
}) {
  const { id, title, description, accent = 'from-black/90 to-black/5' } = section;
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await publicProductService.getProductsByCollection('theme', id, 8);
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching theme products:', err);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  return (
    <article id={id} className="scroll-mt-28">
      <div
        className={[
          'relative overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 ring-1 ring-black/5',
          'supports-[backdrop-filter]:bg-white/40 backdrop-blur',
        ].join(' ')}
      >
        <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${accent}`} />

        <div className="relative z-10 p-6 md:p-8 lg:p-10">
          {/* Header */}
          <div className="mb-8">
            <h3
              className="mt-3 text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {title}
            </h3>
            <p className="mt-2 text-stone-600">{description}</p>
          </div>

          {/* Products */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-stone-300 border-t-stone-600"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-500">No products available for this theme yet.</p>
            </div>
          )}

          {!isLoading && !error && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => {
                  // For variant products, get the first variant's color thumbnail
                  let imageUrl = product.thumbnailUrl || product.bannerUrls?.[0] || '/images/placeholder.png';

                  if (product.productType === 'variant' && product.variants && product.variants.length > 0) {
                    const firstVariantColor = product.variants[0].color;
                    if (firstVariantColor && product.colorMedia?.[firstVariantColor]?.thumbnailUrl) {
                      imageUrl = product.colorMedia[firstVariantColor].thumbnailUrl;
                    }
                  }

                  // Add backend URL prefix if not already present
                  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/images/')) {
                    imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${imageUrl}`;
                  }

                  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;

                  return (
                    <Link
                      key={product._id}
                      href={`/productdetail/${product._id}`}
                      className="group relative overflow-hidden rounded-xl ring-1 ring-stone-200/70 bg-white hover:ring-stone-300 transition-all duration-300"
                    >
                      {/* Product Image */}
                      <div className="relative w-full pt-[125%] overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {hasDiscount && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {Math.round(((product.price - product.discountedPrice!) / product.price) * 100)}% OFF
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-3">
                        <h4 className="text-sm font-medium text-stone-900 line-clamp-2 group-hover:text-stone-700 transition-colors">
                          {product.name}
                        </h4>
                        <div className="mt-2 flex items-center gap-2">
                          {hasDiscount ? (
                            <>
                              <span className="text-sm font-bold text-red-600">
                                £{product.discountedPrice!.toFixed(2)}
                              </span>
                              <span className="text-xs text-stone-500 line-through">
                                £{product.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-stone-900">
                              £{product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* View All Button */}
              <div className="mt-8 text-center">
                <Link
                  href={`/shop?collection=theme&collectionId=${id}`}
                  className="inline-flex items-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-stone-800 transition"
                >
                  View All {title} Products →
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
