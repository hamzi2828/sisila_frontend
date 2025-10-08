'use client';

import { Truck, ShieldCheck, Sparkles } from 'lucide-react';

export default function NewArrivalsValue() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Value icon={<Sparkles className="h-4 w-4" />} title="Limited colorways" note="First run — limited quantities" />
      <Value icon={<Truck className="h-4 w-4" />} title="Ships in 48 hours" note="Fast dispatch on new drops" />
      <Value icon={<ShieldCheck className="h-4 w-4" />} title="Quality check" note="Every piece inspected" />
    </div>
  );
}

function Value({ icon, title, note }: any) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-100">{icon}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-stone-600">{note}</p>
      </div>
    </div>
  );
}