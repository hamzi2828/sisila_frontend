import Link from 'next/link';
import Image from 'next/image';

export default function AboutHeroStats() {
  return (
    <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
      <div className="mx-auto ">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-stone-200/70 bg-gradient-to-br from-black via-stone-900 to-stone-800 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '14px 14px' }}
          />
          <div className="relative z-10 grid gap-8 p-8 md:grid-cols-2 md:p-12 lg:p-16">
            <div>
              <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-white/70">Our Story</p>
              <h1 className="mt-2 text-3xl md:text-5xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                About Silsila
              </h1>
              <p className="mt-3 text-white/85">
                Silsila merges cultural heritage with contemporary fashion — translating poetry, cinema, typography, and regional narratives into modern apparel.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/themes" className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-900 hover:bg-stone-100">
                  Explore Themes
                </Link>
                <Link href="/series" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
                  Explore Series
                </Link>
              </div>
            </div>

            {/* Collage */}
            <div className="relative hidden md:block">
              <div className="absolute right-6 top-2 h-44 w-36 overflow-hidden rounded-2xl ring-1 ring-white/20">
                <Image src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80" alt="Strings" fill sizes="(max-width:1024px) 240px, 320px" className="object-cover" priority />
              </div>
              <div className="absolute right-24 top-36 h-56 w-44 rotate-3 overflow-hidden rounded-2xl ring-1 ring-white/20">
                <Image src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80" alt="Pigments" fill sizes="(max-width:1024px) 280px, 320px" className="object-cover" />
              </div>
              <div className="absolute right-6 bottom-6 h-48 w-40 -rotate-2 overflow-hidden rounded-2xl ring-1 ring-white/20">
                <Image src="https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1200&q=80" alt="Dunes" fill sizes="(max-width:1024px) 240px, 280px" className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mx-auto mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { k: 'Founded', v: '2025' },
            { k: 'Core Themes', v: '4' },
            { k: 'Categories', v: '10' },
            { k: 'Series', v: '4' },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-stone-200 bg-white p-4 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{s.k}</p>
              <p className="mt-1 text-lg font-semibold">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}