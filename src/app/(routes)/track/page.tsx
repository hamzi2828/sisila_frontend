'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TrackPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
        <div className="mx-auto max-w-lg">
          <h1 className="text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Track your order
          </h1>
          <p className="mt-2 text-stone-600">Enter your order number and email to see the latest status.</p>

          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              router.push('/checkout/success?order=SO-2025-0001');
            }}
          >
            <input
              placeholder="Order number (e.g., SO-2025-0001)"
              className="w-full rounded-xl border border-stone-300/80 px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
              required
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-xl border border-stone-300/80 px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
              required
            />
            <button className="w-full rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800">
              Track order
            </button>
          </form>

          <div className="mt-4">
            <Link href="/shop" className="text-sm underline underline-offset-4 text-stone-700 hover:text-stone-900">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}