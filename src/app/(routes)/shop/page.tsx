'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { publicProductService, type PublicProduct } from '../main/services/publicProductService';
import popularCategoriesService, { type PopularCategory } from '../main/services/popularCategoriesService';
import { effectivePrice, isOnSale, resolveImage } from '@/lib/productMedia';
import ShopHero from './components/ShopHero';
import ShopValueBar from './components/ShopValueBar';
import ShopFilters, { matchesPriceRange, type PriceRange, type SortKey } from './components/ShopFilters';
import ShopGrid from './components/ShopGrid';

type Product = {
  id: string;
  title: string;
  price: number;
  compareAt?: number;
  image: string;
  href: string;
  tag?: string;
  featured?: boolean;
  createdAt?: string;
};

function ShopPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const collection = searchParams.get('collection') as 'theme' | 'series' | null;
  const collectionId = searchParams.get('collectionId');
  const categoryParam = (searchParams.get('category') || '').trim();
  const sortParam = searchParams.get('sort');

  const [allProducts, setAllProducts] = useState<PublicProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collectionTitle, setCollectionTitle] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [q, setQ] = useState('');
  const [price, setPrice] = useState<PriceRange>('All');
  const [sort, setSort] = useState<SortKey>(sortParam === 'new' ? 'Newest' : 'Featured');
  const [categories, setCategories] = useState<PopularCategory[]>([]);

  useEffect(() => {
    if (sortParam === 'new') setSort('Newest');
  }, [sortParam]);

  useEffect(() => {
    popularCategoriesService
      .getPopularCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // The active category lives in the URL so filtered views are shareable.
  const activeCategory = useMemo(() => {
    if (!categoryParam) return null;
    const match = categories.find((c) => c.name.toLowerCase() === categoryParam.toLowerCase());
    return { name: match?.name || categoryParam, description: match?.description };
  }, [categoryParam, categories]);

  const setCategory = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (name) params.set('category', name);
    else params.delete('category');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

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
          response = await publicProductService.getAllProducts(200, 1, 'createdAt', 'desc');
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
      let imageUrl = p.thumbnailUrl || (p.bannerUrls && p.bannerUrls[0]) || '';

      if (p.productType === 'variant' && p.variants && p.variants.length > 0) {
        const firstVariantColor = p.variants[0].color;
        if (firstVariantColor && p.colorMedia?.[firstVariantColor]?.thumbnailUrl) {
          imageUrl = p.colorMedia[firstVariantColor].thumbnailUrl;
        }
      }

      return {
        id: p._id,
        title: p.name,
        price: effectivePrice(p),
        compareAt: isOnSale(p) ? p.price : undefined,
        image: resolveImage(imageUrl),
        href: `/productdetail/${p._id}`,
        tag: p.category,
        featured: p.featured,
        createdAt: p.createdAt,
      };
    });

    if (categoryParam) {
      const wanted = categoryParam.toLowerCase();
      rows = rows.filter((p) => (p.tag || '').toLowerCase() === wanted);
    }

    const query = q.trim().toLowerCase();
    if (query) {
      rows = rows.filter(
        (p) => p.title.toLowerCase().includes(query)
      );
    }

    rows = rows.filter((p) => matchesPriceRange(price, p.price));

    // API order is newest first; 'Featured' floats featured pieces to the top.
    if (sort === 'Featured') rows.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    if (sort === 'Newest') rows.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    if (sort === 'Price ↑') rows.sort((a, b) => a.price - b.price);
    if (sort === 'Price ↓') rows.sort((a, b) => b.price - a.price);

    return rows;
  }, [allProducts, price, q, sort, categoryParam]);

  const clearAll = () => {
    setPrice('All');
    setQ('');
    setSort('Featured');
    if (categoryParam) setCategory('');
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
          {activeCategory && !collectionTitle ? (
            <ShopHero
              eyebrow="Category"
              title={activeCategory.name}
              description={activeCategory.description || `Explore Silsila's ${activeCategory.name} designs.`}
            />
          ) : (
            <ShopHero />
          )}
        </div>
      </section>

      <ShopValueBar />

      <section className="px-6 md:px-10 lg:px-20 pb-20">
        <div className="mx-auto ">
          {/* Category Breadcrumb */}
          {activeCategory && !collectionTitle && (
            <div className="mb-6">
              <nav className="flex items-center gap-2 text-sm text-stone-600">
                <Link href="/shop" className="hover:text-stone-900 underline underline-offset-4">
                  All Products
                </Link>
                <span>/</span>
                <Link href="/categories" className="hover:text-stone-900 underline underline-offset-4">
                  Categories
                </Link>
                <span>/</span>
                <span className="font-medium text-stone-900">{activeCategory.name}</span>
              </nav>
              <h1 className="mt-4 text-3xl md:text-4xl font-bold">{activeCategory.name}</h1>
              <p className="mt-2 text-stone-600">
                {products.length} {products.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
          )}

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
            categories={categories.map((c) => c.name)}
            category={activeCategory?.name || ''}
            setCategory={setCategory}
          />

          {products.length === 0 && (
            <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-10 text-center">
              <p className="text-stone-600">No products match these filters.</p>
              <button
                onClick={clearAll}
                className="mt-4 inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
              >
                Clear filters
              </button>
            </div>
          )}

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

export default function ShopPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-stone-300 border-t-stone-600"></div>
      </main>
    }>
      <ShopPageContent />
    </Suspense>
  );
}