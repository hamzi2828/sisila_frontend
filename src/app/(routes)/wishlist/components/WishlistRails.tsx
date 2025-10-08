'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function WishlistRails({
  backInStock = [],
  priceDrops = [],
  lists = [],
  money = (v: number) => `$${v.toFixed(2)}`,
}: {
  backInStock?: any[];
  priceDrops?: any[];
  lists?: any[];
  money?: (v: number) => string;
}) {
  return (
    <>
      {/* BACK IN STOCK */}
      <section className="px-6 md:px-10 lg:px-20 pb-12">
        <Rail
          id="back-in-stock"
          title="Back in stock"
          subtitle="Pieces you might have missed — now available."
          items={backInStock}
          money={money}
        />
      </section>

      {/* PRICE DROPS */}
      <section className="px-6 md:px-10 lg:px-20 pb-12">
        <Rail
          id="price-drops"
          title="Price drops"
          subtitle="Limited-time markdowns on your favorites."
          items={priceDrops}
          money={money}
        />
      </section>

      {/* SAVED LISTS */}
      <section className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto">
          <div className="flex items-end justify-between">
            <div>
              <h2
                className="text-2xl md:text-3xl font-semibold uppercase"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Your lists
              </h2>
              <p className="mt-1 text-stone-600">Organize saved items into themed lists.</p>
            </div>
            <button className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50">
              <i className="fa-solid fa-plus mr-2" />
              New list
            </button>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((l: any) => (
              <div
                key={l.id}
                className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 transition hover:shadow-md"
              >
                <div className="relative w-full pt-[56%] bg-stone-100">
                  <Image
                    src={l.cover}
                    alt={l.title}
                    fill
                    sizes="(max-width:1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold">{l.title}</p>
                  <p className="text-xs text-stone-600">{l.count} saved</p>
                  <div className="mt-3 flex gap-2">
                    <button className="inline-flex items-center rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800">
                      Open
                    </button>
                    <button className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-xs hover:bg-stone-50">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENTLY VIEWED */}
      <section className="px-6 md:px-10 lg:px-20 pb-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 text-center">
          <p className="text-stone-700">Keep exploring</p>
          <div className="mt-3 flex justify-center gap-2">
            <Link
              href="/new-arrivals"
              className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
            >
              New Arrivals
            </Link>
            <Link
              href="/trending"
              className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
            >
              Trending
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Rail({
  id,
  title,
  subtitle,
  items = [],
  money,
}: {
  id: string;
  title: string;
  subtitle?: string;
  items?: any[];
  money: (v: number) => string;
}) {
  return (
    <div id={id} className="mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h2
            className="text-2xl md:text-3xl font-semibold uppercase"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {title}
          </h2>
          {subtitle ? <p className="mt-1 text-stone-600">{subtitle}</p> : null}
        </div>
        <Link
          href="/shop"
          className="hidden md:inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
        >
          Shop all
        </Link>
      </div>

      <div className="mt-4 no-scrollbar flex gap-5 overflow-x-auto px-1 py-2">
        {items.map((p: any) => (
          <Link
            key={p.id}
            href="/productdetail"
            className="group relative h-[300px] w-[220px] shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 transition hover:shadow-md"
          >
            <Image
              src={p.image}
              alt={p.title}
              fill
              sizes="220px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="line-clamp-1 text-sm font-medium text-white">{p.title}</p>
              <p className="text-xs text-white/85">{money(p.price)}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}