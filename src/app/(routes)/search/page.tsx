'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchHero from './components/SearchHero';
import SearchResults from './components/SearchResults';
import SearchEmpty from './components/SearchEmpty';
import SearchChips from './components/SearchChips';
import { publicProductService, type PublicProduct } from '../main/services/publicProductService';

type Item = { id: string; title: string; price: number; tag?: string; image: string; href: string };

export default function SearchPage() {
  const params = useSearchParams();
  const q = (params.get('q') || '').trim();

  const [results, setResults] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let response;
        if (q) {
          // Search with query
          response = await publicProductService.searchProducts(q, 50);
        } else {
          // No query - show all products
          response = await publicProductService.getAllProducts(50);
        }

        // Transform API products to Item format
        const transformedResults: Item[] = response.data.map((product: PublicProduct) => {
          // Handle image for variant products
          let imageUrl = product.thumbnailUrl || (product.bannerUrls && product.bannerUrls[0]) || '/images/placeholder.png';

          if (product.productType === 'variant' && product.variants && product.variants.length > 0) {
            const firstVariantColor = product.variants[0].color;
            if (firstVariantColor && product.colorMedia?.[firstVariantColor]?.thumbnailUrl) {
              imageUrl = product.colorMedia[firstVariantColor].thumbnailUrl;
            }
          }

          // Add backend URL prefix if not already present
          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/images/')) {
            imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}`;
          }

          return {
            id: product._id,
            title: product.name,
            price: product.discountedPrice || product.price,
            tag: product.category,
            image: imageUrl,
            href: `/productdetail/${product._id}`,
          };
        });

        setResults(transformedResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [q]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* Hero */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto max-w-7xl">
          <SearchHero query={q} count={isLoading ? 0 : results.length} />
        </div>
      </section>

      {/* Body */}
      <section className="px-6 md:px-10 lg:px-20 pb-20">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
                <p className="mt-4 text-stone-600">Searching products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-stone-900 hover:bg-stone-800"
              >
                Try Again
              </button>
            </div>
          ) : results.length === 0 ? (
            <SearchEmpty query={q}>
              <SearchChips chips={['tee', 'hoodie', 'shirt', 'pants']} />
            </SearchEmpty>
          ) : (
            <SearchResults items={results} />
          )}
        </div>
      </section>
    </main>
  );
}