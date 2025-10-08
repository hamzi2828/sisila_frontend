'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
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
};

const CART_KEY = 'silsila_cart';

const STARTER: CartItem[] = [
  {
    id: 'verses-tee',
    title: 'Verses Tee',
    price: 38,
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    qty: 1,
    size: 'M',
    color: 'Black',
  },
  {
    id: 'palette-crew',
    title: 'Palette Crew',
    price: 66,
    image:
      'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1200&q=80',
    qty: 1,
    size: 'L',
    color: 'Grey',
  },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage or seed with STARTER
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      } else {
        setItems(STARTER);
        localStorage.setItem(CART_KEY, JSON.stringify(STARTER));
      }
    } catch {
      setItems(STARTER);
    }
  }, []);

  const setAndSave = useCallback((next: CartItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const inc = useCallback(
    (id: string) =>
      setAndSave(items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))),
    [items, setAndSave]
  );

  const dec = useCallback(
    (id: string) =>
      setAndSave(items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))),
    [items, setAndSave]
  );

  const removeItem = useCallback(
    (id: string) => setAndSave(items.filter((i) => i.id !== id)),
    [items, setAndSave]
  );

  const clear = useCallback(() => setAndSave([]), [setAndSave]);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  );
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 6.95;
  const total = subtotal + shipping;

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