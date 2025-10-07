'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type CartItem = { id: string; title: string; price: number; image: string; qty: number };
type Contact = { email: string; phone?: string };
type Address = { name: string; line1: string; line2?: string; city: string; region: string; postal: string; country: string };
type CheckoutState = { contact?: Contact; address?: Address; shipping?: 'standard' | 'express'; discount?: number };

const CART_KEY = 'silsila_cart';
const CHECKOUT_KEY = 'silsila_checkout';
const money = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

export default function CheckoutShippingPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [contact, setContact] = useState<Contact>({ email: '' });
  const [address, setAddress] = useState<Address>({ name: '', line1: '', city: '', region: '', postal: '', country: 'PK' });
  const [shipping, setShipping] = useState<'standard' | 'express'>('standard');

  useEffect(() => {
    const c = localStorage.getItem(CART_KEY);
    if (c) setCart(JSON.parse(c));
    const raw = localStorage.getItem(CHECKOUT_KEY);
    if (raw) {
      const s: CheckoutState = JSON.parse(raw);
      if (s.contact) setContact(s.contact);
      if (s.address) setAddress({ ...address, ...s.address });
      if (s.shipping) setShipping(s.shipping);
    }
  }, []);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const shipCost = shipping === 'standard' ? (subtotal >= 75 ? 0 : 6.95) : 14.95;
  const total = subtotal + shipCost;

  const saveAndNext = () => {
    const payload: CheckoutState = { contact, address, shipping, discount: 0 };
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(payload));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
        <div className="mx-auto max-w-7xl">
          <Steps step={1} />

          <div className="mt-6 grid gap-8 lg:grid-cols-12">
            {/* Form */}
            <form
              className="space-y-6 lg:col-span-7 rounded-2xl border border-stone-200 bg-white p-6"
              onSubmit={(e) => {
                e.preventDefault();
                saveAndNext();
                window.location.href = '/checkout/payment';
              }}
            >
              <h2 className="text-lg font-semibold">Contact</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} type="email" required />
                <Input label="Phone (optional)" value={contact.phone || ''} onChange={(v) => setContact({ ...contact, phone: v })} />
              </div>

              <h2 className="pt-2 text-lg font-semibold">Shipping Address</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Full name" value={address.name} onChange={(v) => setAddress({ ...address, name: v })} required />
                <Input label="Country" value={address.country} onChange={(v) => setAddress({ ...address, country: v })} required />
              </div>
              <Input label="Address line 1" value={address.line1} onChange={(v) => setAddress({ ...address, line1: v })} required />
              <Input label="Address line 2 (optional)" value={address.line2 || ''} onChange={(v) => setAddress({ ...address, line2: v })} />
              <div className="grid gap-3 sm:grid-cols-3">
                <Input label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} required />
                <Input label="Region/State" value={address.region} onChange={(v) => setAddress({ ...address, region: v })} required />
                <Input label="Postal code" value={address.postal} onChange={(v) => setAddress({ ...address, postal: v })} required />
              </div>

              <h2 className="pt-2 text-lg font-semibold">Shipping Method</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Radio
                  name="ship"
                  label="Standard (3–5 days)"
                  sub={subtotal >= 75 ? 'Free' : money(6.95)}
                  checked={shipping === 'standard'}
                  onChange={() => setShipping('standard')}
                />
                <Radio
                  name="ship"
                  label="Express (1–2 days)"
                  sub={money(14.95)}
                  checked={shipping === 'express'}
                  onChange={() => setShipping('express')}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link href="/cart" className="text-sm text-stone-600 hover:text-stone-900">
                  ← Back to cart
                </Link>
                <button className="inline-flex items-center rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800">
                  Continue to payment
                </button>
              </div>
            </form>

            {/* Summary */}
            <aside className="lg:col-span-5 rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="text-base font-semibold">Order Summary</h3>
              <div className="mt-3 space-y-2 text-sm">
                <Row label="Subtotal" value={money(subtotal)} />
                <Row label="Shipping" value={money(shipCost)} />
                <div className="border-t pt-2">
                  <Row label="Total" value={money(total)} bold />
                </div>
              </div>
              <p className="mt-2 text-xs text-stone-500">Taxes calculated at payment.</p>
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
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-stone-600">{label}{required ? ' *' : ''}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-stone-300/80 px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
      />
    </label>
  );
}

function Radio({
  name,
  label,
  sub,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  sub: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-300/80 bg-white px-3 py-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-stone-600">{sub}</p>
      </div>
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