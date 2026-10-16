'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/helper/helper';
import { formatPrice } from '@/lib/formatPrice';
import {
  loadCheckoutCart,
  calcShipping,
  standardShippingFee,
  EXPRESS_SHIPPING_FEE,
  type CheckoutCartItem,
} from './utils/checkoutCart';

type CartItem = CheckoutCartItem;
type Contact = { email: string; phone?: string };
type Address = { name: string; line1: string; line2?: string; city: string; region: string; postal: string; country: string };
type CheckoutState = { contact?: Contact; address?: Address; shipping?: 'standard' | 'express'; discount?: number };

const CHECKOUT_KEY = 'silsila_checkout';
const money = (v: number) => formatPrice(v);

export default function CheckoutShippingPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [contact, setContact] = useState<Contact>({ email: '' });
  const [address, setAddress] = useState<Address>({ name: '', line1: '', city: '', region: '', postal: '', country: 'PK' });
  const [shipping, setShipping] = useState<'standard' | 'express'>('standard');
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(true);

  // Auto-fill user data if logged in
  useEffect(() => {
    const currentUser = getCurrentUser();

    if (currentUser) {
      console.log('Auto-filling user data:', currentUser);

      // Auto-fill contact information
      setContact(prev => ({
        email: currentUser.email || prev.email,
        phone: currentUser.phoneNumber || currentUser.phone || prev.phone
      }));

      // Auto-fill address with user's name
      if (currentUser.firstName || currentUser.lastName) {
        const fullName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
        setAddress(prev => ({
          ...prev,
          name: fullName || prev.name
        }));
      }

      setIsAutoFilled(true);
    }
  }, []);

  // Load cart (logged in: GET /api/cart, guest: localStorage)
  const fetchCart = async () => {
    try {
      setIsLoadingCart(true);
      setCart(await loadCheckoutCart());
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart([]);
    } finally {
      setIsLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchCart();

    const raw = localStorage.getItem(CHECKOUT_KEY);
    if (raw) {
      const s: CheckoutState = JSON.parse(raw);
      if (s.contact) setContact(prev => ({ ...prev, ...s.contact }));
      if (s.address) setAddress(prev => ({ ...prev, ...s.address }));
      if (s.shipping) setShipping(s.shipping);
    }
  }, []);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const shipCost = calcShipping(subtotal, shipping);
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
              {isAutoFilled && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
                  <i className="fa-solid fa-circle-check mr-2"></i>
                  Your account information has been auto-filled. You can modify any field as needed.
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Email"
                  value={contact.email}
                  onChange={(v) => setContact({ ...contact, email: v })}
                  type="email"
                  required
                  autoFilled={isAutoFilled && !!contact.email}
                />
                <Input
                  label="Phone"
                  required
                  type="tel"
                  value={contact.phone || ''}
                  onChange={(v) => setContact({ ...contact, phone: v })}
                  autoFilled={isAutoFilled && !!contact.phone}
                />
              </div>

              <h2 className="pt-2 text-lg font-semibold">Shipping Address</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Full name"
                  value={address.name}
                  onChange={(v) => setAddress({ ...address, name: v })}
                  required
                  autoFilled={isAutoFilled && !!address.name}
                />
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
                  sub={standardShippingFee(subtotal) === 0 ? 'Free' : money(standardShippingFee(subtotal))}
                  checked={shipping === 'standard'}
                  onChange={() => setShipping('standard')}
                />
                <Radio
                  name="ship"
                  label="Express (1–2 days)"
                  sub={money(EXPRESS_SHIPPING_FEE)}
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

              {/* Loading state */}
              {isLoadingCart && (
                <div className="mt-4 flex justify-center py-8">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-stone-900"></div>
                    <span>Loading cart...</span>
                  </div>
                </div>
              )}

              {/* Empty cart */}
              {!isLoadingCart && cart.length === 0 && (
                <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-6 text-center">
                  <i className="fa-solid fa-shopping-cart text-3xl text-stone-400 mb-3"></i>
                  <p className="text-sm text-stone-600">Your cart is empty</p>
                  <Link href="/shop" className="mt-3 inline-block text-sm text-stone-900 underline hover:no-underline">
                    Continue shopping
                  </Link>
                </div>
              )}

              {/* Cart Items */}
              {!isLoadingCart && cart.length > 0 && (
                <div className="mt-4 space-y-3 border-b border-stone-200 pb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                            priority={false}
                          />
                        )}
                        <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-xs text-white z-10">
                          {item.qty}
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-sm font-medium text-stone-900 line-clamp-1">{item.title}</p>
                          {item.variant && (
                            <p className="text-xs text-stone-500">
                              {item.variant.color} / {item.variant.size}
                            </p>
                          )}
                          <p className="text-xs text-stone-500">Qty: {item.qty}</p>
                        </div>
                        <p className="text-sm font-medium text-stone-900">{money(item.price * item.qty)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Summary */}
              <div className="mt-3 space-y-2 text-sm">
                <Row label="Subtotal" value={money(subtotal)} />
                <Row label="Shipping" value={shipCost === 0 ? 'Free' : money(shipCost)} />
                <div className="border-t pt-2">
                  <Row label="Total" value={money(total)} bold />
                </div>
              </div>
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
  autoFilled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoFilled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-stone-600">
        {label}{required ? ' *' : ''}
        {autoFilled && (
          <span className="ml-2 text-xs text-green-600 font-normal">
            <i className="fa-solid fa-circle-check mr-1"></i>
            Auto-filled
          </span>
        )}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-xl border px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400 ${
          autoFilled ? 'border-green-300 bg-green-50/30' : 'border-stone-300/80'
        }`}
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