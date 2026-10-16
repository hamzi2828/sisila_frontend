'use client';

import { Truck, RefreshCcw, Banknote, Sparkles } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD, formatPrice } from '@/lib/formatPrice';

export default function ShopValueBar() {
  return (
    <section className="px-6 md:px-10 lg:px-20 pb-6">
      <div className="mx-auto  grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ValueItem icon={<Truck className="h-4 w-4" />} title="Free shipping" desc={`On orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}`} />
        <ValueItem icon={<Banknote className="h-4 w-4" />} title="Cash on Delivery" desc="Available nationwide" />
        <ValueItem icon={<RefreshCcw className="h-4 w-4" />} title="Easy exchanges" desc="7-day exchange window" />
        <ValueItem icon={<Sparkles className="h-4 w-4" />} title="Quality guaranteed" desc="Designed & printed in Pakistan" />
      </div>
    </section>
  );
}

function ValueItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-100">{icon}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-stone-600">{desc}</p>
      </div>
    </div>
  );
}