'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { getAuthToken } from '@/helper/helper';
import CartItems from './components/CartItems';
import CartSummary from './components/CartSummary';
import EmptyState from './components/EmptyState';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
  color?: string;
  itemId?: string;
};

// API Response Types
type ColorMedia = {
  thumbnailUrl: string;
  bannerUrls: string[];
};

type ProductVariant = {
  variantId: string;
  color?: string;
  size?: string;
  price: number;
  stock: number;
  sku: string;
  _id: string;
};

type ProductData = {
  _id: string;
  name: string;
  category: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  status: string;
  featured: boolean;
  bannerUrls: string[];
  thumbnailUrl?: string;
  productType: string;
  variants: ProductVariant[];
  colorMedia?: { [color: string]: ColorMedia };
};

type CartAPIVariant = {
  variantId: string;
  variantSku: string;
  color?: string;
  size?: string;
  price?: number;
};

type CartAPIItem = {
  _id: string;
  productId: ProductData | string;
  variant?: CartAPIVariant;
  quantity: number;
  addedAt: string;
};

type CartAPIResponse = {
  success: boolean;
  data: {
    _id: string;
    userId: string;
    items: CartAPIItem[];
    updatedAt: string;
    createdAt: string;
  };
};

// LocalStorage Cart Item Type
type LocalStorageCartItem = {
  productId: string;
  productName: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  thumbnailUrl: string;
  variant?: {
    variantId?: string;
    color?: string;
    size?: string;
    price?: number;
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart from API
  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        // User not logged in, load from localStorage
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          const parsed: LocalStorageCartItem[] = JSON.parse(localCart);
          // Transform to match CartItem format
          const transformed: CartItem[] = parsed.map((item) => {
            let imageUrl = item.thumbnailUrl || '';
            // Add backend URL prefix if needed
            if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
              imageUrl = `${API_BASE_URL}${imageUrl}`;
            }
            return {
              id: item.productId,
              title: item.productName,
              price: item.variant?.price || item.discountedPrice || item.price,
              image: imageUrl,
              qty: item.quantity,
              size: item.variant?.size,
              color: item.variant?.color,
            };
          });
          setItems(transformed);
        } else {
          setItems([]);
        }
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data: CartAPIResponse = await response.json();
      console.log('Cart API response:', data);

      // Helper function to get the correct image for variant products
      const getProductImage = (item: CartAPIItem): string => {
        // Type guard to check if productId is ProductData
        if (typeof item.productId === 'string') {
          return '';
        }

        const product: ProductData = item.productId;

        // For variant products with colorMedia
        if (product.productType === 'variant' && product.colorMedia) {
          // Try to get color from variant object
          let variantColor = item.variant?.color;

          // If no color in variant, try to extract from variantSku (e.g., "FGS-PW-GRE-X-02" -> Green)
          if (!variantColor && item.variant?.variantSku) {
            const sku = item.variant.variantSku;
            const colorMap: { [key: string]: string } = {
              'GRE': 'Green',
              'BLA': 'Black',
              'ORA': 'Orange',
              'RED': 'Red',
              'BLU': 'Blue',
              'WHI': 'White',
              'YEL': 'Yellow',
            };

            // Try to find color code in SKU
            for (const [code, colorName] of Object.entries(colorMap)) {
              if (sku.toUpperCase().includes(code)) {
                variantColor = colorName;
                break;
              }
            }
          }

          // If we found a color and it exists in colorMedia, use it
          if (variantColor && product.colorMedia[variantColor]?.thumbnailUrl) {
            const thumbUrl = product.colorMedia[variantColor].thumbnailUrl;
            return thumbUrl.startsWith('http') ? thumbUrl : `${API_BASE_URL}${thumbUrl}`;
          }

          // Fall back to first available color
          const firstColor = Object.keys(product.colorMedia)[0];
          if (firstColor && product.colorMedia[firstColor]?.thumbnailUrl) {
            const thumbUrl = product.colorMedia[firstColor].thumbnailUrl;
            return thumbUrl.startsWith('http') ? thumbUrl : `${API_BASE_URL}${thumbUrl}`;
          }
        }

        // Fall back to regular thumbnailUrl or bannerUrls
        if (product.thumbnailUrl) {
          return product.thumbnailUrl.startsWith('http')
            ? product.thumbnailUrl
            : `${API_BASE_URL}${product.thumbnailUrl}`;
        }

        if (product.bannerUrls && product.bannerUrls.length > 0) {
          const banner = product.bannerUrls[0];
          return banner.startsWith('http') ? banner : `${API_BASE_URL}${banner}`;
        }

        return '';
      };

      // Transform API response to CartItem format
      if (data.success && data.data && data.data.items) {
        const transformedItems: CartItem[] = data.data.items.map((item) => {
          // Type guard to handle productId being string or ProductData
          const product = typeof item.productId === 'string' ? null : item.productId;

          // Extract color from variant or SKU
          let variantColor = item.variant?.color;
          if (!variantColor && item.variant?.variantSku) {
            const sku = item.variant.variantSku;
            const colorMap: { [key: string]: string } = {
              'GRE': 'Green',
              'BLA': 'Black',
              'ORA': 'Orange',
              'RED': 'Red',
              'BLU': 'Blue',
              'WHI': 'White',
              'YEL': 'Yellow',
            };
            for (const [code, colorName] of Object.entries(colorMap)) {
              if (sku.toUpperCase().includes(code)) {
                variantColor = colorName;
                break;
              }
            }
          }

          return {
            id: product?._id || (typeof item.productId === 'string' ? item.productId : ''),
            title: product?.name || 'Unknown Product',
            price: item.variant?.price || product?.discountedPrice || product?.price || 0,
            image: getProductImage(item),
            qty: item.quantity,
            size: item.variant?.size,
            color: variantColor,
            itemId: item._id, // Store the cart item ID for updates/deletes
          };
        });
        setItems(transformedItems);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart. Showing local cart.');

      // Fallback to localStorage
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        const parsed: LocalStorageCartItem[] = JSON.parse(localCart);
        const transformed: CartItem[] = parsed.map((item) => {
          let imageUrl = item.thumbnailUrl || '';
          // Add backend URL prefix if needed
          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
            imageUrl = `${API_BASE_URL}${imageUrl}`;
          }
          return {
            id: item.productId,
            title: item.productName,
            price: item.variant?.price || item.discountedPrice || item.price,
            image: imageUrl,
            qty: item.quantity,
            size: item.variant?.size,
            color: item.variant?.color,
          };
        });
        setItems(transformed);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCart();
    };

    const handleCartCleared = () => {
      setItems([]);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('cartCleared', handleCartCleared);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('cartCleared', handleCartCleared);
    };
  }, [fetchCart]);

  const inc = useCallback(
    async (id: string) => {
      const item = items.find(i => i.id === id);
      if (!item) return;

      const newQty = item.qty + 1;

      // Optimistic update
      setItems(items.map((i) => (i.id === id ? { ...i, qty: newQty } : i)));

      try {
        const token = getAuthToken();
        if (!token) {
          // Update localStorage
          const localCart: LocalStorageCartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
          const updated = localCart.map((cartItem) =>
            cartItem.productId === id ? { ...cartItem, quantity: newQty } : cartItem
          );
          localStorage.setItem('cart', JSON.stringify(updated));
          return;
        }

        const itemId = item.itemId;
        if (!itemId) {
          toast.error('Cannot update item');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/cart/item/${itemId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: newQty }),
        });

        if (!response.ok) {
          throw new Error('Failed to update quantity');
        }

        toast.success('Quantity updated');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } catch (err) {
        console.error('Error updating quantity:', err);
        toast.error('Failed to update quantity');
        // Revert optimistic update
        fetchCart();
      }
    },
    [items, fetchCart]
  );

  const dec = useCallback(
    async (id: string) => {
      const item = items.find(i => i.id === id);
      if (!item) return;

      const newQty = Math.max(1, item.qty - 1);

      // Optimistic update
      setItems(items.map((i) => (i.id === id ? { ...i, qty: newQty } : i)));

      try {
        const token = getAuthToken();
        if (!token) {
          // Update localStorage
          const localCart: LocalStorageCartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
          const updated = localCart.map((cartItem) =>
            cartItem.productId === id ? { ...cartItem, quantity: newQty } : cartItem
          );
          localStorage.setItem('cart', JSON.stringify(updated));
          return;
        }

        const itemId = item.itemId;
        if (!itemId) {
          toast.error('Cannot update item');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/cart/item/${itemId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: newQty }),
        });

        if (!response.ok) {
          throw new Error('Failed to update quantity');
        }

        toast.success('Quantity updated');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } catch (err) {
        console.error('Error updating quantity:', err);
        toast.error('Failed to update quantity');
        // Revert optimistic update
        fetchCart();
      }
    },
    [items, fetchCart]
  );

  const removeItem = useCallback(
    async (id: string) => {
      const item = items.find(i => i.id === id);
      if (!item) return;

      // Optimistic update
      setItems(items.filter((i) => i.id !== id));

      try {
        const token = getAuthToken();
        if (!token) {
          // Update localStorage
          const localCart: LocalStorageCartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
          const updated = localCart.filter((cartItem) => cartItem.productId !== id);
          localStorage.setItem('cart', JSON.stringify(updated));
          toast.success('Item removed from cart');
          window.dispatchEvent(new CustomEvent('cartUpdated'));
          return;
        }

        const itemId = item.itemId;
        if (!itemId) {
          toast.error('Cannot remove item');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/cart/item/${itemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to remove item');
        }

        toast.success('Item removed from cart');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } catch (err) {
        console.error('Error removing item:', err);
        toast.error('Failed to remove item');
        // Revert optimistic update
        fetchCart();
      }
    },
    [items, fetchCart]
  );

  const clear = useCallback(async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;

    // Optimistic update
    setItems([]);

    try {
      const token = getAuthToken();
      if (!token) {
        localStorage.removeItem('cart');
        toast.success('Cart cleared');
        window.dispatchEvent(new CustomEvent('cartCleared'));
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      toast.success('Cart cleared');
      window.dispatchEvent(new CustomEvent('cartCleared'));
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Failed to clear cart');
      // Revert optimistic update
      fetchCart();
    }
  }, [fetchCart]);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  );
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 6.95;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
        <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
          <div className="mx-auto max-w-7xl">
            <h1
              className="text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Your Bag
            </h1>
            <div className="mt-10 flex justify-center items-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
                <p className="mt-4 text-stone-600">Loading your cart...</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
        <div className="mx-auto max-w-7xl">
          <h1
            className="text-2xl md:text-3xl font-semibold uppercase"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Your Bag
          </h1>
          <p className="mt-2 text-stone-600">Free shipping on orders $75+.</p>

          {error && (
            <div className="mt-4 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          )}

          {items.length === 0 ? (
            <EmptyState
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              canCheckout={items.length > 0}
            />
          ) : (
            <div className="mt-6 grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <CartItems
                  items={items}
                  onInc={inc}
                  onDec={dec}
                  onRemove={removeItem}
                  onClear={clear}
                />
              </div>

              <aside className="lg:col-span-4">
                <CartSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  total={total}
                  canCheckout={items.length > 0}
                />
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}