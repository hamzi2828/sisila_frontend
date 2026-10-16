'use client';

import { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/formatPrice';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type TrackedOrder = {
  orderNumber: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: string;
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  city?: string;
  total: number;
  items: { name: string; thumbnailUrl?: string; quantity: number; size?: string; color?: string }[];
};

const STEPS: { key: TrackedOrder['orderStatus']; label: string }[] = [
  { key: 'pending', label: 'Order placed' },
  { key: 'processing', label: 'Being prepared' },
  { key: 'shipped', label: 'On its way' },
  { key: 'delivered', label: 'Delivered' },
];

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

function TrackForm() {
  const params = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get('order') || '');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || 'We could not find an order with those details');
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const stopped = order && (order.orderStatus === 'cancelled' || order.orderStatus === 'refunded');
  const reached = order ? STEPS.findIndex((s) => s.key === order.orderStatus) : -1;

  return (
    <>
      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Order number (e.g., ORD-123456-0001)"
          aria-label="Order number"
          className="w-full rounded-xl border border-stone-300/80 px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email used at checkout"
          aria-label="Email address"
          className="w-full rounded-xl border border-stone-300/80 px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
          required
        />
        <button
          disabled={loading}
          className="w-full rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {loading ? 'Looking up…' : 'Track order'}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {order && (
        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-5" aria-live="polite">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold">{order.orderNumber}</p>
            <p className="text-xs text-stone-500">Placed {formatDate(order.createdAt)}</p>
          </div>

          {stopped ? (
            <p className="mt-4 text-sm font-medium capitalize text-red-700">This order was {order.orderStatus}.</p>
          ) : (
            <ol className="mt-5 grid grid-cols-4 gap-2">
              {STEPS.map((s, i) => (
                <li key={s.key} className="flex flex-col items-center text-center">
                  <span
                    className={`h-2 w-full rounded-full ${i <= reached ? 'bg-black' : 'bg-stone-200'}`}
                    aria-hidden="true"
                  />
                  <span className={`mt-2 text-[11px] ${i <= reached ? 'text-stone-900 font-medium' : 'text-stone-400'}`}>
                    {s.label}
                  </span>
                </li>
              ))}
            </ol>
          )}

          <dl className="mt-5 grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-stone-500">Payment</dt>
            <dd className="text-right">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}</dd>
            {order.city && (
              <>
                <dt className="text-stone-500">Delivering to</dt>
                <dd className="text-right">{order.city}</dd>
              </>
            )}
            {order.trackingNumber && (
              <>
                <dt className="text-stone-500">Courier tracking</dt>
                <dd className="text-right">{order.trackingNumber}</dd>
              </>
            )}
            <dt className="text-stone-500">Total</dt>
            <dd className="text-right font-medium">{formatPrice(order.total)}</dd>
          </dl>

          <ul className="mt-5 space-y-3 border-t border-stone-200 pt-4">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="relative h-14 w-12 overflow-hidden rounded-lg bg-stone-100 ring-1 ring-stone-200">
                  <Image src={item.thumbnailUrl || '/images/image.png'} alt={item.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-stone-500">
                    Qty {item.quantity}
                    {item.size && item.size !== 'One Size' ? ` · ${item.size}` : ''}
                    {item.color && item.color !== 'Default' ? ` · ${item.color}` : ''}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default function TrackPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
        <div className="mx-auto max-w-lg">
          <h1 className="text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Track your order
          </h1>
          <p className="mt-2 text-stone-600">Enter your order number and the email you used at checkout.</p>

          <Suspense fallback={null}>
            <TrackForm />
          </Suspense>

          <div className="mt-6">
            <Link href="/shop" className="text-sm underline underline-offset-4 text-stone-700 hover:text-stone-900">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
