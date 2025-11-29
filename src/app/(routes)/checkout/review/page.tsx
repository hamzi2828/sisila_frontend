'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, CreditCard, MapPin, Mail, PackageCheck, Pencil, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';

type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
  image: string;
  color?: string;
  size?: string;
};

const CART_ITEMS: CartItem[] = [
  {
    id: 'verses-tee',
    title: 'Verses Tee',
    price: 38,
    qty: 1,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    color: 'Black',
    size: 'M',
  },
  {
    id: 'palette-crew',
    title: 'Palette Crew',
    price: 66,
    qty: 1,
    image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1200&q=80',
    color: 'Stone',
    size: 'L',
  },
];

const money = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

export default function ReviewPage() {
  const router = useRouter();
  const [agree, setAgree] = useState(true);
  const [promo, setPromo] = useState('');
  const [applied, setApplied] = useState<{ code: string; amount: number } | null>(null);
  const [placing, setPlacing] = useState(false);

  const subtotal = useMemo(
    () => CART_ITEMS.reduce((sum, i) => sum + i.price * i.qty, 0),
    []
  );

  const promoDiscount = applied?.amount ?? 0;
  const shipping = subtotal - promoDiscount >= 75 ? 0 : 6.5;
  const tax = Math.round(((subtotal - promoDiscount) * 0.08) * 100) / 100;
  const total = Math.max(0, subtotal - promoDiscount) + shipping + tax;

  const handleApply = () => {
    const code = promo.trim().toUpperCase();
    if (!code) return;
    if (code === 'SIL10') {
      setApplied({ code, amount: Math.round(subtotal * 0.1 * 100) / 100 });
    } else {
      setApplied({ code, amount: 0 });
    }
  };

  const placeOrder = async () => {
    if (!agree || placing) return;
    setPlacing(true);
    // Simulate processing then go to success page with a mock order id
    const id = `SO-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    setTimeout(() => {
      router.push(`/checkout/success?order=${encodeURIComponent(id)}`);
    }, 900);
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
                <p>Ali Raza</p>
                <p>House 12, Street 8, DHA Phase 6</p>
                <p>Karachi, Sindh 75500</p>
                <p>Pakistan</p>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-1 text-xs text-stone-700 ring-1 ring-stone-200">
                <Truck className="h-3.5 w-3.5" /> Standard — 3–5 business days
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
                  <p>Email: ali@silsila.co</p>
                  <p>Phone: +92 300 0000000</p>
                </div>
              </Card>

              <Card>
                <Header
                  icon={<CreditCard className="h-4 w-4" />}
                  title="Payment"
                  action={<Link href="/checkout/payment" className="text-sm text-stone-700 hover:underline inline-flex items-center gap-1"><Pencil className="h-3.5 w-3.5" /> Edit</Link>}
                />
                <div className="mt-2 text-sm text-stone-700">
                  <p>Visa •••• 1234 — exp 08/28</p>
                  <p>Billing same as shipping</p>
                </div>
              </Card>
            </div>

            {/* Items (compact) */}
            <Card>
              <Header
                icon={<PackageCheck className="h-4 w-4" />}
                title={`Items (${CART_ITEMS.reduce((s, i) => s + i.qty, 0)})`}
                action={<Link href="/shop" className="text-sm text-stone-700 hover:underline inline-flex items-center gap-1"><Pencil className="h-3.5 w-3.5" /> Edit cart</Link>}
              />
              <div className="mt-3 space-y-4">
                {CART_ITEMS.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="relative h-20 w-16 overflow-hidden rounded-xl ring-1 ring-stone-200">
                      <Image src={p.image} alt={p.title} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <Link href="/productdetail" className="text-sm font-medium hover:underline">{p.title}</Link>
                      <p className="text-xs text-stone-600">
                        {p.color ? `Color: ${p.color}` : ''} {p.size ? `• Size: ${p.size}` : ''} • Qty {p.qty}
                      </p>
                    </div>
                    <div className="text-sm">{money(p.price * p.qty)}</div>
                  </div>
                ))}
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

              {/* Promo */}
              <div className="mt-3 flex gap-2">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Promo code (e.g., SIL10)"
                  className="flex-1 rounded-xl border border-stone-300/80 px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
                />
                <button
                  onClick={handleApply}
                  className="inline-flex items-center rounded-xl border border-stone-300/80 bg-white px-3 py-2 text-sm hover:bg-stone-50"
                >
                  Apply
                </button>
              </div>
              {applied ? (
                <p className={`mt-1 text-xs ${applied.amount > 0 ? 'text-emerald-700' : 'text-stone-600'}`}>
                  Code {applied.code} {applied.amount > 0 ? `applied — ${money(applied.amount)} off` : 'is not valid for this order'}
                </p>
              ) : null}

              {/* Totals */}
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={money(subtotal)} />
                {promoDiscount > 0 ? <Row label="Discount" value={`- ${money(promoDiscount)}`} /> : null}
                <Row label="Shipping" value={shipping === 0 ? 'Free' : money(shipping)} />
                <Row label="Tax (8%)" value={money(tax)} />
                <div className="my-2 border-t border-stone-200" />
                <Row label={<span className="font-semibold">Total</span>} value={<span className="font-semibold">{money(total)}</span>} />
              </div>

              {/* CTA */}
              <button
                onClick={placeOrder}
                disabled={!agree || placing}
                className={[
                  'mt-6 inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition',
                  !agree || placing ? 'opacity-60' : 'hover:bg-stone-800',
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