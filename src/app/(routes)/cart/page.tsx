'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';

type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
  color?: string;
};

const CART_KEY = 'silsila_cart';
const money = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

const STARTER: CartItem[] = [
  {
    id: 'verses-tee',
    title: 'Verses Tee',
    price: 38,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    qty: 1,
    size: 'M',
    color: 'Black',
  },
  {
    id: 'palette-crew',
    title: 'Palette Crew',
    price: 66,
    image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1200&q=80',
    qty: 1,
    size: 'L',
    color: 'Grey',
  },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) setItems(JSON.parse(raw));
    else {
      setItems(STARTER);
      localStorage.setItem(CART_KEY, JSON.stringify(STARTER));
    }
  }, []);

  const setAndSave = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  };

  const inc = (id: string) => setAndSave(items.map(i => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const dec = (id: string) =>
    setAndSave(items.map(i => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)));
  const removeItem = (id: string) => setAndSave(items.filter(i => i.id !== id));
  const clear = () => setAndSave([]);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 6.95;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Your Bag
          </h1>
          <p className="mt-2 text-stone-600">Free shipping on orders $75+.</p>

          {items.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="mt-6 grid gap-8 lg:grid-cols-12">
              {/* Items */}
              <div className="lg:col-span-8 space-y-4">
                {items.map((it) => (
                  <div key={it.id} className="grid grid-cols-12 gap-4 rounded-2xl border border-stone-200 bg-white p-3">
                    <div className="relative col-span-4 sm:col-span-3 aspect-[4/5] overflow-hidden rounded-xl">
                      <Image src={it.image} alt={it.title} fill sizes="(max-width:1024px) 40vw, 20vw" className="object-cover" />
                    </div>
                    <div className="col-span-8 sm:col-span-9 flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-stone-500">Silsila</p>
                        <h3 className="text-base font-semibold">{it.title}</h3>
                        <p className="mt-1 text-sm text-stone-600">
                          {it.color ? `Color: ${it.color}` : ''} {it.size ? `• Size: ${it.size}` : ''}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white px-2 py-1">
                          <button onClick={() => dec(it.id)} className="rounded p-1 hover:bg-stone-100" aria-label="Decrease">
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[2ch] text-center text-sm">{it.qty}</span>
                          <button onClick={() => inc(it.id)} className="rounded p-1 hover:bg-stone-100" aria-label="Increase">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="font-medium">{money(it.price * it.qty)}</p>
                          <button onClick={() => removeItem(it.id)} className="rounded p-2 hover:bg-stone-100" aria-label="Remove">
                            <Trash2 className="h-4 w-4 text-stone-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between">
                  <Link href="/shop" className="text-sm underline underline-offset-4 text-stone-700 hover:text-stone-900">
                    Continue shopping
                  </Link>
                  <button onClick={clear} className="text-sm text-stone-500 hover:text-stone-800">
                    Clear cart
                  </button>
                </div>
              </div>

              {/* Summary */}
              <aside className="lg:col-span-4">
                <div className="rounded-2xl border border-stone-200 bg-white p-5">
                  <h4 className="text-base font-semibold">Summary</h4>
                  <div className="mt-3 space-y-2 text-sm">
                    <Row label="Subtotal" value={money(subtotal)} />
                    <Row label="Shipping" value={shipping === 0 ? 'Free' : money(shipping)} />
                    <div className="border-t pt-2">
                      <Row label="Total" value={money(total)} bold />
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    className={[
                      'mt-4 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white',
                      items.length ? 'bg-black hover:bg-stone-800' : 'bg-stone-400 pointer-events-none',
                    ].join(' ')}
                  >
                    Checkout
                  </Link>
                  <p className="mt-2 text-xs text-stone-500">Taxes are calculated at payment.</p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-stone-600">{label}</span>
      <span className={bold ? 'font-semibold' : ''}>{value}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 text-center">
      <p className="text-stone-700">Your bag is empty.</p>
      <div className="mt-3">
        <Link href="/shop" className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800">
          Browse the shop
        </Link>
      </div>
    </div>
  );
}