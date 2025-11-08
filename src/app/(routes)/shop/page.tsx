'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { publicProductService, type PublicProduct } from '../main/services/publicProductService';
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

type PriceRange = 'All' | 'Under $40' | '$40–$60' | '$60–$80' | '$80+';
type SortKey = 'Featured' | 'Price ↑' | 'Price ↓';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const collection = searchParams.get('collection') as 'theme' | 'series' | null;
  const collectionId = searchParams.get('collectionId');

  const [allProducts, setAllProducts] = useState<PublicProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collectionTitle, setCollectionTitle] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [q, setQ] = useState('');
  const [price, setPrice] = useState<PriceRange>('All');
  const [sort, setSort] = useState<SortKey>('Featured');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let response;

        // If collection params exist, fetch products for that collection
        if (collection && collectionId && (collection === 'theme' || collection === 'series')) {
          response = await publicProductService.getProductsByCollection(collection, collectionId, 100, 1);
          // Set collection title for display
          const formattedTitle = collectionId
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          setCollectionTitle(formattedTitle);
        } else {
          // Otherwise fetch all products
          response = await publicProductService.getAllProducts(100, 1, 'createdAt', 'desc');
          setCollectionTitle('');
        }

        setAllProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [collection, collectionId]);

  const products = useMemo(() => {
    // Map PublicProduct to Product type for ShopGrid
    let rows: Product[] = allProducts.map((p) => {
      // Handle image for variant products
      let imageUrl = p.thumbnailUrl || (p.bannerUrls && p.bannerUrls[0]) || '/images/placeholder.png';

      if (p.productType === 'variant' && p.variants && p.variants.length > 0) {
        const firstVariantColor = p.variants[0].color;
        if (firstVariantColor && p.colorMedia?.[firstVariantColor]?.thumbnailUrl) {
          imageUrl = p.colorMedia[firstVariantColor].thumbnailUrl;
        }
      }

      // Add backend URL prefix if not already present
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/images/')) {
        imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${imageUrl}`;
      }

      return {
        id: p._id,
        title: p.name,
        price: p.discountedPrice || p.price,
        image: imageUrl,
        href: `/productdetail/${p._id}`,
        tag: p.category
      };
    });

    const query = q.trim().toLowerCase();
    if (query) {
      rows = rows.filter(
        (p) => p.title.toLowerCase().includes(query)
      );
    }

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
  }, [allProducts, price, q, sort]);

  const clearAll = () => {
    setPrice('All');
    setQ('');
    setSort('Featured');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-stone-300 border-t-stone-600"></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <Link href="/" className="mt-4 inline-block text-stone-600 hover:text-stone-900 underline">
            Return to homepage
          </Link>
        </div>
      </main>
    );
  }

  if (allProducts.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 text-lg">No products available at the moment.</p>
          <Link href="/" className="mt-4 inline-block text-stone-600 hover:text-stone-900 underline">
            Return to homepage
          </Link>
        </div>
      </main>
    );
  }

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
          {/* Collection Breadcrumb */}
          {collectionTitle && (
            <div className="mb-6">
              <nav className="flex items-center gap-2 text-sm text-stone-600">
                <Link href="/shop" className="hover:text-stone-900 underline underline-offset-4">
                  All Products
                </Link>
                <span>/</span>
                <Link
                  href={collection === 'theme' ? '/themes' : '/series'}
                  className="hover:text-stone-900 underline underline-offset-4"
                >
                  {collection === 'theme' ? 'Themes' : 'Series'}
                </Link>
                <span>/</span>
                <span className="font-medium text-stone-900">{collectionTitle}</span>
              </nav>
              <h1 className="mt-4 text-3xl md:text-4xl font-bold">
                {collectionTitle} Collection
              </h1>
              <p className="mt-2 text-stone-600">
                {products.length} {products.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
          )}

          <ShopFilters
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

          <ShopGrid
            products={products}
            collectionType={collection}
            collectionTitle={collectionTitle}
          />
        </div>
      </section>
    </main>
  );
}