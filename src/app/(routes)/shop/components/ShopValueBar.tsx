'use client';

import { Truck, RefreshCcw, ShieldCheck, Sparkles } from 'lucide-react';

export default function ShopValueBar() {
  return (
    <section className="px-6 md:px-10 lg:px-20 pb-6">
      <div className="mx-auto  grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ValueItem icon={<Truck className="h-4 w-4" />} title="Free shipping" desc="On US orders $75+" />
        <ValueItem icon={<RefreshCcw className="h-4 w-4" />} title="Easy returns" desc="30-day window" />
        <ValueItem icon={<ShieldCheck className="h-4 w-4" />} title="Secure checkout" desc="PCI compliant" />
        <ValueItem icon={<Sparkles className="h-4 w-4" />} title="Quality guaranteed" desc="Crafted to last" />
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