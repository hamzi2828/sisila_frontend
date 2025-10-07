'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Printer, Truck } from 'lucide-react';

const CART_ITEMS = [
  {
    id: 'verses-tee',
    title: 'Verses Tee',
    price: 38,
    qty: 1,
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'palette-crew',
    title: 'Palette Crew',
    price: 66,
    qty: 1,
    image:
      'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1200&q=80',
  },
];

const money = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

export default function SuccessPage() {
  const params = useSearchParams();
  const orderId = params.get('order') || `SO-${new Date().getFullYear()}-0001`;

  const subtotal = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 75 ? 0 : 6.5;
  const tax = Math.round((subtotal * 0.08) * 100) / 100;
  const total = subtotal + shipping + tax;

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Order placed
          </h1>
          <p className="mt-2 text-stone-600">
            Thank you! We’ve emailed your receipt. Your order number is{' '}
            <span className="font-medium text-stone-900">{orderId}</span>.
          </p>

          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
            <Link
              href="/shop"
              className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="px-6 md:px-10 lg:px-20 pb-20">
        <div className="mx-auto max-w-5xl grid gap-6 lg:grid-cols-12">
          {/* Left: items */}
          <div className="lg:col-span-8 rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Items</p>
              <Link href="/shop" className="text-sm text-stone-700 hover:underline">Shop more</Link>
            </div>
            <div className="mt-3 space-y-4">
              {CART_ITEMS.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="relative h-20 w-16 overflow-hidden rounded-xl ring-1 ring-stone-200">
                    <Image src={p.image} alt={p.title} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-xs text-stone-600">Qty {p.qty}</p>
                  </div>
                  <div className="text-sm">{money(p.price * p.qty)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: delivery + totals */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold">Delivery</p>
              <div className="mt-2 text-sm text-stone-700">
                <p>Ali Raza</p>
                <p>House 12, Street 8, DHA Phase 6</p>
                <p>Karachi, Sindh 75500</p>
                <p>Pakistan</p>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-1 text-xs text-stone-700 ring-1 ring-stone-200">
                <Truck className="h-3.5 w-3.5" /> Standard — est. 3–5 business days
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold">Payment</p>
              <p className="mt-2 text-sm text-stone-700">Visa •••• 1234 — exp 08/28</p>
              <div className="mt-3 border-t border-stone-200 pt-3 space-y-1 text-sm">
                <Row label="Subtotal" value={money(subtotal)} />
                <Row label="Shipping" value={shipping === 0 ? 'Free' : money(shipping)} />
                <Row label="Tax" value={money(tax)} />
                <div className="my-2 border-t border-stone-200" />
                <Row label={<span className="font-semibold">Total</span>} value={<span className="font-semibold">{money(total)}</span>} />
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold">Next steps</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-stone-700 space-y-1.5">
                <li>You’ll get a shipping confirmation with tracking.</li>
                <li>Need help? Contact support@silsila.co</li>
              </ul>
              <div className="mt-3">
                <Link
                  href="/track"
                  className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
                >
                  Track your order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-stone-600">{label}</span>
      <span className="text-stone-800">{value}</span>
    </div>
  );
}