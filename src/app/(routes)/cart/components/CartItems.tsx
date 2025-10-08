'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';

type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
  color?: string;
};

type Props = {
  items: CartItem[];
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
};

const money = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

export default function CartItems({ items, onInc, onDec, onRemove, onClear }: Props) {
  return (
    <div className="space-y-4">
      {items.map((it) => {
        const decDisabled = it.qty <= 1;

        return (
          <div
            key={it.id}
            className="group grid grid-cols-12 gap-4 rounded-2xl border border-stone-200 bg-white p-3 transition-all duration-200 hover:border-stone-300 hover:shadow-sm"
          >
            <div className="relative col-span-4 sm:col-span-3 aspect-[4/5] overflow-hidden rounded-xl">
              <Image
                src={it.image}
                alt={it.title}
                fill
                sizes="(max-width:1024px) 40vw, 20vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>

            <div className="col-span-8 sm:col-span-9 flex flex-col justify-between">
              <div>
                <p className="text-sm text-stone-500">Silsila</p>
                <h3 className="text-base font-semibold">{it.title}</h3>
                <p className="mt-1 text-sm text-stone-600">
                  {it.color ? `Color: ${it.color}` : ''} {it.size ? `• Size: ${it.size}` : ''}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white px-2 py-1">
                  <button
                    onClick={() => !decDisabled && onDec(it.id)}
                    disabled={decDisabled}
                    className="rounded p-1 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 disabled:opacity-40 disabled:hover:bg-transparent"
                    aria-label="Decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[2ch] text-center text-sm">{it.qty}</span>
                  <button
                    onClick={() => onInc(it.id)}
                    className="rounded p-1 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300"
                    aria-label="Increase"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <p className="font-medium">{money(it.price * it.qty)}</p>
                  <button
                    onClick={() => onRemove(it.id)}
                    className="rounded p-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 active:scale-95"
                    aria-label="Remove"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex justify-between">
        <Link
          href="/shop"
          className="text-sm underline underline-offset-4 text-stone-700 transition-colors hover:text-stone-900"
        >
          Continue shopping
        </Link>
        <button
          onClick={onClear}
          className="text-sm text-stone-500 transition-colors hover:text-stone-800"
        >
          Clear cart
        </button>
      </div>
    </div>
  );
}