'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type CartItem = { id: string; title: string; price: number; image: string; qty: number };
type CheckoutState = {
  contact?: { email: string; phone?: string };
  address?: { name: string; line1: string; line2?: string; city: string; region: string; postal: string; country: string };
  shipping?: 'standard' | 'express';
  payment?: { method: 'card' | 'cod'; last4?: string; name?: string };
  discount?: number;
};

const CART_KEY = 'silsila_cart';
const CHECKOUT_KEY = 'silsila_checkout';
const money = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

export default function CheckoutPaymentPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [state, setState] = useState<CheckoutState>({});
  const [method, setMethod] = useState<'card' | 'cod'>('card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const c = localStorage.getItem(CART_KEY);
    if (c) setCart(JSON.parse(c));
    const raw = localStorage.getItem(CHECKOUT_KEY);
    if (raw) {
      const s: CheckoutState = JSON.parse(raw);
      setState(s);
      if (s.payment) {
        setMethod(s.payment.method);
        setCardName(s.payment.name || '');
        setDiscount(s.discount || 0);
      }
    }
  }, []);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const shipCost = state.shipping === 'express' ? 14.95 : subtotal >= 75 ? 0 : 6.95;
  const totalBefore = subtotal + shipCost;
  const total = Math.max(0, totalBefore - discount);

  const applyCode = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo codes
    const map: Record<string, number> = { SILSILA10: 10, WELCOME5: 5 };
    const off = map[code.toUpperCase()] || 0;
    setDiscount(off);
  };

  const saveAndNext = () => {
    const payload: CheckoutState = {
      ...state,
      payment: method === 'card' ? { method, last4: cardNumber.slice(-4), name: cardName } : { method: 'cod' },
      discount,
    };
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(payload));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
        <div className="mx-auto max-w-7xl">
          <Steps step={2} />

          <div className="mt-6 grid gap-8 lg:grid-cols-12">
            {/* Payment form */}
            <form
              className="space-y-6 lg:col-span-7 rounded-2xl border border-stone-200 bg-white p-6"
              onSubmit={(e) => {
                e.preventDefault();
                saveAndNext();
                window.location.href = '/checkout/review';
              }}
            >
              <h2 className="text-lg font-semibold">Payment</h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <Radio name="payment" label="Credit / Debit Card" checked={method === 'card'} onChange={() => setMethod('card')} />
                <Radio name="payment" label="Cash on Delivery (COD)" checked={method === 'cod'} onChange={() => setMethod('cod')} />
              </div>

              {method === 'card' && (
                <div className="grid gap-3">
                  <Input label="Name on card" value={cardName} onChange={setCardName} required />
                  <Input label="Card number" value={cardNumber} onChange={setCardNumber} required placeholder="4242 4242 4242 4242" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input label="Expiry (MM/YY)" value={cardExpiry} onChange={setCardExpiry} required placeholder="12/28" />
                    <Input label="CVC" value={cardCvc} onChange={setCardCvc} required placeholder="123" />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <form onSubmit={applyCode} className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Promo code (SILSILA10)"
                    className="flex-1 rounded-xl border border-stone-300/80 px-3 py-2 text-sm outline-none focus:border-stone-400"
                  />
                  <button className="rounded-xl border border-stone-300/80 px-3 py-2 text-sm hover:bg-stone-50">
                    Apply
                  </button>
                </form>
                {discount > 0 && <p className="mt-1 text-sm text-emerald-700">Discount applied: -{money(discount)}</p>}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link href="/checkout" className="text-sm text-stone-600 hover:text-stone-900">
                  ← Back to shipping
                </Link>
                <button className="inline-flex items-center rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800">
                  Review order
                </button>
              </div>
            </form>

            {/* Summary */}
            <aside className="lg:col-span-5 rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="text-base font-semibold">Order Summary</h3>
              <div className="mt-3 space-y-2 text-sm">
                <Row label="Subtotal" value={money(subtotal)} />
                <Row label="Shipping" value={money(shipCost)} />
                {discount > 0 && <Row label="Discount" value={`-${money(discount)}`} />}
                <div className="border-t pt-2">
                  <Row label="Total" value={money(total)} bold />
                </div>
              </div>
              <p className="mt-2 text-xs text-stone-500">Secure payments — SSL encrypted.</p>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function Steps({ step }: { step: 1 | 2 | 3 }) {
  const s = ['Shipping', 'Payment', 'Review'];
  return (
    <div className="flex gap-2 text-sm text-stone-600">
      {s.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <span className={i + 1 <= step ? 'font-semibold text-stone-900' : ''}>{i + 1}. {label}</span>
          {i < s.length - 1 && <span className="text-stone-300">/</span>}
        </div>
      ))}
    </div>
  );
}

function Input({
  label, value, onChange, required, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-stone-600">{label}{required ? ' *' : ''}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="rounded-xl border border-stone-300/80 px-3 py-2 text-sm outline-none focus:border-stone-400"
      />
    </label>
  );
}

function Radio({ name, label, checked, onChange }: { name: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-300/80 bg-white px-3 py-2">
      <span className="text-sm font-medium">{label}</span>
      <input type="radio" name={name} checked={checked} onChange={onChange} className="h-4 w-4" />
    </label>
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