'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { getAuthToken } from '@/helper/helper';
import { addToCart } from '@/helper/cartHelper';
import WishlistHero from './components/WishlistHero';
import WishlistFilters from './components/WishlistFilters';
import WishlistGrid from './components/WishlistGrid';

type SavedItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  tag?: string;
  compareAt?: number;
  stock?: 'in' | 'low' | 'out';
  savedAt?: string;
};

// API Response Types
type ColorMedia = {
  thumbnailUrl: string;
  bannerUrls: string[];
};

type ProductVariant = {
  variantId: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  sku: string;
  _id: string;
};

type WishlistProductData = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  featured: boolean;
  bannerUrls: string[];
  thumbnailUrl?: string;
  productType: string;
  variants: ProductVariant[];
  colorMedia?: { [color: string]: ColorMedia };
};

type WishlistAPIItem = {
  productId: WishlistProductData;
  addedAt: string;
  _id: string;
};

type WishlistAPIResponse = {
  success: boolean;
  message: string;
  data: {
    products: WishlistAPIItem[];
  };
};

const money = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function WishlistPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch wishlist from API
  const fetchWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        // User not logged in
        setItems([]);
        setIsLoading(false);
        toast.error('Please login to view your wishlist');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data: WishlistAPIResponse = await response.json();
      console.log('Wishlist API response:', data);

      // Helper function to get product image
      const getProductImage = (product: WishlistProductData): string => {
        // For variant products with colorMedia, use the first available color
        if (product.productType === 'variant' && product.colorMedia) {
          const colors = Object.keys(product.colorMedia);
          if (colors.length > 0) {
            const firstColor = colors[0];
            const thumbUrl = product.colorMedia[firstColor]?.thumbnailUrl;
            if (thumbUrl) {
              return thumbUrl.startsWith('http') ? thumbUrl : `${API_BASE_URL}${thumbUrl}`;
            }
          }
        }

        // Fall back to regular thumbnailUrl
        if (product.thumbnailUrl) {
          return product.thumbnailUrl.startsWith('http')
            ? product.thumbnailUrl
            : `${API_BASE_URL}${product.thumbnailUrl}`;
        }

        // Fall back to bannerUrls
        if (product.bannerUrls && product.bannerUrls.length > 0) {
          const banner = product.bannerUrls[0];
          return banner.startsWith('http') ? banner : `${API_BASE_URL}${banner}`;
        }

        return '';
      };

      // Transform API response to SavedItem format
      // API returns data.products, not data.data
      if (data.success && data.data?.products && Array.isArray(data.data.products)) {
        const transformedItems: SavedItem[] = data.data.products.map((item) => {
          const product = item.productId;

          return {
            id: product._id,
            title: product.name,
            price: product.price,
            compareAt: undefined, // Price comparison not available in wishlist
            image: getProductImage(product),
            tag: product.category || '',
            stock: product.stock > 10 ? 'in' : product.stock > 0 ? 'low' : 'out',
            savedAt: new Date(item.addedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          };
        });
        setItems(transformedItems);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      fetchWishlist();
    };

    const handleWishlistCleared = () => {
      setItems([]);
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('wishlistCleared', handleWishlistCleared);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('wishlistCleared', handleWishlistCleared);
    };
  }, [fetchWishlist]);

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const selectAll = () => setSelected(items.map((x) => x.id));
  const clearSelection = () => setSelected([]);

  const remove = useCallback(
    async (id: string) => {
      // Optimistic update
      const itemToRemove = items.find(i => i.id === id);
      setItems((prev) => prev.filter((x) => x.id !== id));
      setSelected((s) => s.filter((x) => x !== id));

      try {
        const token = getAuthToken();
        if (!token) {
          toast.error('Please login to manage wishlist');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/wishlist/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to remove item from wishlist');
        }

        toast.success('Item removed from wishlist');
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      } catch (err) {
        console.error('Error removing from wishlist:', err);
        toast.error('Failed to remove item');
        // Revert optimistic update
        if (itemToRemove) {
          setItems((prev) => [...prev, itemToRemove]);
        }
      }
    },
    [items]
  );

  const removeSelected = useCallback(async () => {
    if (selected.length === 0) return;

    const itemsToRemove = items.filter(x => selected.includes(x.id));

    // Optimistic update
    setItems((prev) => prev.filter((x) => !selected.includes(x.id)));
    const selectedIds = [...selected];
    setSelected([]);

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Please login to manage wishlist');
        return;
      }

      // Remove each selected item
      await Promise.all(
        selectedIds.map(id =>
          fetch(`${API_BASE_URL}/api/wishlist/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
        )
      );

      toast.success(`Removed ${selectedIds.length} items from wishlist`);
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch (err) {
      console.error('Error removing selected items:', err);
      toast.error('Failed to remove some items');
      // Revert optimistic update
      setItems((prev) => [...prev, ...itemsToRemove]);
    }
  }, [items, selected]);

  const handleAddToCart = useCallback(
    async (id: string) => {
      const item = items.find(i => i.id === id);
      if (!item) return;

      try {
        await addToCart({
          productId: id,
          productName: item.title,
          price: item.price,
          quantity: 1,
          thumbnailUrl: item.image,
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    },
    [items]
  );

  const addSelectedToCart = useCallback(async () => {
    if (selected.length === 0) return;

    const selectedItems = items.filter(x => selected.includes(x.id));

    try {
      // Add each selected item to cart
      await Promise.all(
        selectedItems.map(item =>
          addToCart({
            productId: item.id,
            productName: item.title,
            price: item.price,
            quantity: 1,
            thumbnailUrl: item.image,
          })
        )
      );

      setSelected([]);
      toast.success(`Added ${selectedItems.length} items to cart`);
    } catch (error) {
      console.error('Error adding selected to cart:', error);
      toast.error('Failed to add some items to cart');
    }
  }, [items, selected]);
  const shareWishlist = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Wishlist link copied to clipboard');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
        <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
          <div className="mx-auto max-w-7xl">
            <h1
              className="text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Your Wishlist
            </h1>
            <div className="mt-10 flex justify-center items-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
                <p className="mt-4 text-stone-600">Loading your wishlist...</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto">
          <WishlistHero count={items.length} onShare={shareWishlist} />
        </div>
      </section>

      {error && (
        <section className="px-6 md:px-10 lg:px-20 pb-4">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          </div>
        </section>
      )}

      {/* FILTERS + BULK BAR */}
      <section className="px-6 md:px-10 lg:px-20 pb-4">
        <WishlistFilters
          selectedCount={selected.length}
          onAddSelectedToCart={addSelectedToCart}
          onRemoveSelected={removeSelected}
          onClearSelection={clearSelection}
          onSelectAll={selectAll}
        />
      </section>

      {/* SAVED GRID */}
      <section className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-stone-600">Your wishlist is empty</p>
              <p className="mt-2 text-sm text-stone-500">Save items you love to view them later</p>
            </div>
          ) : (
            <WishlistGrid
              items={items}
              selected={selected}
              toggleSelect={toggleSelect}
              remove={remove}
              addToCart={handleAddToCart}
              money={money}
            />
          )}
        </div>
      </section>
    </main>
  );
}