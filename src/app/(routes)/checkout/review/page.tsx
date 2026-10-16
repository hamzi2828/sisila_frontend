'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, CreditCard, MapPin, Mail, PackageCheck, Pencil, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/formatPrice';
import { loadCheckoutCart, calcShipping, type CheckoutCartItem } from '../utils/checkoutCart';
import { getAuthToken, isAuthenticated } from '@/helper/helper';
import { toast } from 'react-hot-toast';

type CheckoutState = {
  contact?: { email: string; phone?: string };
  address?: { name: string; line1: string; line2?: string; city: string; region: string; postal: string; country: string };
  shipping?: 'standard' | 'express';
  payment?: { method: 'stripe' | 'card' | 'cod'; last4?: string; name?: string };
};

const CHECKOUT_KEY = 'silsila_checkout';
const LAST_ORDER_KEY = 'silsila_last_order';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const money = (v: number) => formatPrice(v);

export default function ReviewPage() {
  const router = useRouter();
  const [agree, setAgree] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [cart, setCart] = useState<CheckoutCartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [checkout, setCheckout] = useState<CheckoutState>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHECKOUT_KEY);
      if (raw) setCheckout(JSON.parse(raw));
    } catch {
      // ignore malformed saved checkout state
    }

    let cancelled = false;
    loadCheckoutCart()
      .then((items) => {
        if (!cancelled) setCart(items);
      })
      .catch(() => {
        if (!cancelled) setCart([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingCart(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const subtotal = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.qty, 0), [cart]);
  const itemCount = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);
  const shippingMethod = checkout.shipping || 'standard';
  const shipping = calcShipping(subtotal, shippingMethod);
  const total = subtotal + shipping;

  const address = checkout.address;
  const contact = checkout.contact;
  const payment = checkout.payment;
  const paymentLabel =
    payment?.method === 'cod'
      ? 'Cash on Delivery'
      : payment?.method === 'card'
      ? `Card${payment.last4 ? ` •••• ${payment.last4}` : ''}`
      : payment?.method === 'stripe'
      ? 'Card via Stripe'
      : 'Not selected';

  const placeOrder = async () => {
    if (!agree || placing || cart.length === 0) return;
    if (!isAuthenticated()) {
      toast.error('Please sign in to place your order');
      router.push('/authentication?redirect=/checkout/review');
      return;
    }
    if (payment?.method !== 'cod') {
      // Card payments are completed on Stripe from the payment step.
      router.push('/checkout/payment');
      return;
    }
    if (!address || !contact) {
      toast.error('Please complete your delivery details first');
      router.push('/checkout');
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/cod-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
        body: JSON.stringify({
          shippingMethod,
          shippingAddress: {
            fullName: address.name,
            email: contact.email,
            phone: contact.phone || '',
            address: [address.line1, address.line2].filter(Boolean).join(', '),
            city: address.city,
            state: address.region,
            zipCode: address.postal,
            country: address.country || 'Pakistan',
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || 'Could not place your order');

      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(data.order));
      localStorage.removeItem('cart');
      localStorage.removeItem(CHECKOUT_KEY);
      router.push(`/checkout/success?order=${encodeURIComponent(data.order.orderNumber)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not place your order');
      setPlacing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* Header */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-2">
            <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">Checkout</p>
            <h1 className="text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Review & Place Order
            </h1>
            {/* Stepper */}
            <div className="mt-3 flex items-center gap-2 text-xs text-stone-600">
              <Step done>Cart</Step>
              <Divider />
              <Step done>Details</Step>
              <Divider />
              <Step done>Payment</Step>
              <Divider />
              <Step active>Review</Step>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="px-6 md:px-10 lg:px-20 pb-20">
        <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-12">
          {/* Left: info cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shipping address */}
            <Card>
              <Header
                icon={<MapPin className="h-4 w-4" />}
                title="Shipping address"
                action={<Link href="/checkout" className="text-sm text-stone-700 hover:underline inline-flex items-center gap-1"><Pencil className="h-3.5 w-3.5" /> Edit</Link>}
              />
              <div className="mt-2 text-sm text-stone-700">
                {address ? (
                  <>
                    <p>{address.name}</p>
                    <p>{address.line1}</p>
                    {address.line2 ? <p>{address.line2}</p> : null}
                    <p>
                      {[address.city, address.region].filter(Boolean).join(', ')} {address.postal}
                    </p>
                    <p>{address.country}</p>
                  </>
                ) : (
                  <p className="text-stone-500">No shipping address yet.</p>
                )}
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-1 text-xs text-stone-700 ring-1 ring-stone-200">
                <Truck className="h-3.5 w-3.5" />{' '}
                {shippingMethod === 'express' ? 'Express — 1–2 business days' : 'Standard — 3–5 business days'}
              </div>
            </Card>

            {/* Contact + payment */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <Header
                  icon={<Mail className="h-4 w-4" />}
                  title="Contact"
                  action={<Link href="/checkout" className="text-sm text-stone-700 hover:underline inline-flex items-center gap-1"><Pencil className="h-3.5 w-3.5" /> Edit</Link>}
                />
                <div className="mt-2 text-sm text-stone-700">
                  {contact?.email ? <p>Email: {contact.email}</p> : <p className="text-stone-500">No email yet.</p>}
                  {contact?.phone ? <p>Phone: {contact.phone}</p> : null}
                </div>
              </Card>

              <Card>
                <Header
                  icon={<CreditCard className="h-4 w-4" />}
                  title="Payment"
                  action={<Link href="/checkout/payment" className="text-sm text-stone-700 hover:underline inline-flex items-center gap-1"><Pencil className="h-3.5 w-3.5" /> Edit</Link>}
                />
                <div className="mt-2 text-sm text-stone-700">
                  <p>{paymentLabel}</p>
                  <p>Billing same as shipping</p>
                </div>
              </Card>
            </div>

            {/* Items (compact) */}
            <Card>
              <Header
                icon={<PackageCheck className="h-4 w-4" />}
                title={`Items (${itemCount})`}
                action={<Link href="/cart" className="text-sm text-stone-700 hover:underline inline-flex items-center gap-1"><Pencil className="h-3.5 w-3.5" /> Edit cart</Link>}
              />
              <div className="mt-3 space-y-4">
                {isLoadingCart ? (
                  <p className="text-sm text-stone-500">Loading your items…</p>
                ) : cart.length === 0 ? (
                  <p className="text-sm text-stone-500">
                    Your cart is empty.{' '}
                    <Link href="/shop" className="underline underline-offset-4">Continue shopping</Link>
                  </p>
                ) : (
                  cart.map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="relative h-20 w-16 overflow-hidden rounded-xl ring-1 ring-stone-200 bg-stone-100">
                        <Image src={p.image || '/images/image.png'} alt={p.title} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <Link href={`/productdetail/${p.productId}`} className="text-sm font-medium hover:underline">{p.title}</Link>
                        <p className="text-xs text-stone-600">
                          {[
                            p.variant?.color ? `Color: ${p.variant.color}` : '',
                            p.variant?.size ? `Size: ${p.variant.size}` : '',
                            `Qty ${p.qty}`,
                          ]
                            .filter(Boolean)
                            .join(' • ')}
                        </p>
                      </div>
                      <div className="text-sm">{money(p.price * p.qty)}</div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Terms */}
            <div className="rounded-2xl border border-stone-200 bg-white p-4">
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400"
                />
                <span>
                  I agree to the{' '}
                  <Link href="/terms" className="underline underline-offset-4">Terms</Link> and{' '}
                  <Link href="/privacy-policy" className="underline underline-offset-4">Privacy Policy</Link>.
                </span>
              </label>
            </div>
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 sticky top-24">
              <h3 className="text-lg font-semibold">Order summary</h3>

              {/* Totals */}
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={money(subtotal)} />
                <Row label="Shipping" value={shipping === 0 ? 'Free' : money(shipping)} />
                <div className="my-2 border-t border-stone-200" />
                <Row label={<span className="font-semibold">Total</span>} value={<span className="font-semibold">{money(total)}</span>} />
              </div>

              {/* CTA */}
              <button
                onClick={placeOrder}
                disabled={!agree || placing || cart.length === 0}
                className={[
                  'mt-6 inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition',
                  !agree || placing || cart.length === 0 ? 'opacity-60' : 'hover:bg-stone-800',
                ].join(' ')}
              >
                {placing ? 'Placing order…' : 'Place order'}
              </button>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Step({
  children,
  done,
  active,
}: {
  children: React.ReactNode;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={[
          'flex h-5 w-5 items-center justify-center rounded-full text-[11px]',
          done ? 'bg-stone-900 text-white' : active ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600',
        ].join(' ')}
      >
        {done ? <Check className="h-3 w-3" /> : '•'}
      </span>
      <span className={active ? 'text-stone-900 font-medium' : 'text-stone-500'}>{children}</span>
    </span>
  );
}

function Divider() {
  return <span className="mx-1 h-px w-6 bg-stone-300" />;
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-stone-200 bg-white p-5">{children}</div>;
}

function Header({
  icon,
  title,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2">
        {icon ? <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-900">{icon}</div> : null}
        <p className="text-sm font-semibold">{title}</p>
      </div>
      {action}
    </div>
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