'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { SeriesSection } from '../main/components/SeriesSection';
import { SERIES_SECTIONS } from '../main/components/SeriesSection';

export default function SeriesPage() {
  return (
    <main id="top" className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-stone-200/60 bg-gradient-to-br from-black via-stone-900 to-stone-800 text-white">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 16px)',
              }}
            />
            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-white/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Editorial Collections
              </p>
              <h1
                className="mt-3 text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight uppercase"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Series
              </h1>
              <p className="mt-3 max-w-2xl text-white/80">
                Poets, Alphabets, Cinema, Anime — four distinct lenses shaping cultural, literary, and visual narratives.
              </p>

              {/* Quick chips */}
              <div className="mt-6 flex flex-wrap gap-3">
                {SERIES_SECTIONS.map((s) => (
                  <Link
                    key={s.id}
                    href={`#${s.id}`}
                    className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
                  >
                    {s.title}
                  </Link>
                ))}
                <Link
                  href="#rails"
                  className="inline-flex items-center rounded-full bg-white text-stone-900 px-4 py-2 text-sm font-medium hover:bg-stone-100 transition"
                >
                  Mood Rails
                </Link>
              </div>
            </div>

            {/* Collage Cluster */}
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden md:block">
              <div className="relative h-full w-[48vw] max-w-[640px]">
                {SERIES_SECTIONS.slice(0, 3).map((s, i) => (
                  <div
                    key={s.id}
                    className={`absolute rounded-2xl ring-1 ring-white/20 overflow-hidden ${
                      i === 0
                        ? 'right-12 top-10 h-48 w-40'
                        : i === 1
                        ? 'right-24 top-40 h-60 w-48 rotate-2'
                        : 'right-8 bottom-10 h-52 w-44 -rotate-3'
                    }`}
                  >
                    <Image
                      src={s.cover}
                      alt={s.title}
                      fill
                      sizes="(max-width: 768px) 200px, 320px"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className="px-6 md:px-10 lg:px-20 pb-28">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-10">
          {/* Sticky index (desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-8">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-500">Index</p>
                <nav className="grid gap-2">
                  {SERIES_SECTIONS.map((s) => (
                    <Link
                      key={s.id}
                      href={`#${s.id}`}
                      className="group inline-flex items-center justify-between rounded-xl border border-stone-200/70 bg-white px-3 py-2 text-sm hover:bg-stone-50 transition"
                    >
                      <span>{s.title}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition">↗</span>
                    </Link>
                  ))}
                </nav>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-500">Rails</p>
                <nav className="grid gap-2">
                  <Link
                    href="#rails"
                    className="inline-flex items-center justify-between rounded-xl border border-stone-200/70 bg-white px-3 py-2 text-sm hover:bg-stone-50 transition"
                  >
                    <span>All Mood Rails</span>
                    <span>↓</span>
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          {/* Content */}
          <section className="lg:col-span-9 space-y-16">
            {SERIES_SECTIONS.map((section, idx) => (
              <SeriesFeature key={section.id} section={section} flipped={idx % 2 === 1} />
            ))}

            {/* Mood Rails */}
            <div id="rails" className="scroll-mt-28">
              <h2
                className="text-2xl md:text-3xl font-semibold uppercase"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Mood Rails
              </h2>
              <p className="mt-2 text-stone-600">
                Horizontal scrollers capturing each series' vibe — poster frames, textures, and compositions.
              </p>
            </div>

            {SERIES_SECTIONS.map((section) => (
              <SeriesRail key={`${section.id}-rail`} section={section} />
            ))}

            {/* Back to top */}
            <div className="pt-8">
              <Link
                href="#top"
                className="text-sm text-stone-500 hover:text-stone-800 underline underline-offset-4"
              >
                Back to top
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Scoped scrollbar hide */}
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}

function SeriesFeature({
  section,
  flipped = false,
}: {
  section: SeriesSection;
  flipped?: boolean;
}) {
  const { id, title, description, accent = 'from-black/90 to-black/5', gallery, cover, subitems } =
    section;

  const big = gallery[0]?.image || cover;
  const rightTop = gallery[1]?.image || cover;
  const rightBottom = gallery[2]?.image || cover;

  return (
    <article id={id} className="scroll-mt-28">
      <div
        className={[
          'relative overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 ring-1 ring-black/5',
          'supports-[backdrop-filter]:bg-white/40 backdrop-blur',
        ].join(' ')}
      >
        {/* Gradient header bar */}
        <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${accent}`} />

        <div className={`grid gap-0 lg:grid-cols-12 ${flipped ? 'lg:[&>.media]:order-1' : ''}`}>
          {/* Media */}
          <div className="media relative lg:col-span-7">
            <div className="p-4 md:p-6 lg:p-8">
              {/* Mobile layout: stacked with ratios */}
              <div className="space-y-2 md:hidden">
                <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-stone-200/70 pt-[62%]">
                  <Image src={big} alt={`${title} — primary`} fill sizes="100vw" className="object-cover" priority />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-stone-200/70 pt-[62%]">
                    <Image src={rightTop} alt={`${title} — detail A`} fill sizes="50vw" className="object-cover" />
                  </div>
                  <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-stone-200/70 pt-[62%]">
                    <Image src={rightBottom} alt={`${title} — detail B`} fill sizes="50vw" className="object-cover" />
                  </div>
                </div>
              </div>

              {/* Desktop layout: original mosaic */}
              <div className="hidden md:grid grid-cols-12 grid-rows-6 gap-3 h-[480px] lg:h-[520px]">
                <div className="col-span-12 md:col-span-7 row-span-6 overflow-hidden rounded-2xl ring-1 ring-stone-200/70 relative">
                  <Image src={big} alt={`${title} — primary`} fill sizes="(max-width: 1024px) 60vw, 50vw" className="object-cover" priority />
                </div>
                <div className="col-span-12 md:col-span-5 row-span-3 overflow-hidden rounded-2xl ring-1 ring-stone-200/70 relative">
                  <Image src={rightTop} alt={`${title} — detail A`} fill sizes="(max-width: 1024px) 40vw, 30vw" className="object-cover" />
                </div>
                <div className="col-span-12 md:col-span-5 row-span-3 overflow-hidden rounded-2xl ring-1 ring-stone-200/70 relative">
                  <Image src={rightBottom} alt={`${title} — detail B`} fill sizes="(max-width: 1024px) 40vw, 30vw" className="object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* Text & CTA + subitems chips */}
          <div className="relative flex items-center lg:col-span-5">
            <div className="relative z-10 p-6 md:p-8 lg:p-10">
              <span className="inline-flex items-center rounded-full border border-stone-300/70 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.18em]">
                Series
              </span>
              <h3
                className="mt-3 text-2xl md:text-3xl font-semibold uppercase"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {title}
              </h3>
              <p className="mt-2 text-stone-600">{description}</p>

              {subitems?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {subitems.slice(0, 8).map((x) => (
                    <span
                      key={x.title}
                      className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-2.5 py-1 text-[11px] text-stone-700"
                    >
                      {x.title}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/productdetail?series=${id}`}
                  className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition"
                >
                  Shop {title}
                </Link>
               
              </div>
            </div>

            {/* Subtle ambient glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-tr from-black/5 to-transparent blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function SeriesRail({ section }: { section: SeriesSection }) {
  const { id, title, tagline, gallery } = section;

  return (
    <section id={`${id}-rail`} className="scroll-mt-28">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h4
            className="text-xl md:text-2xl font-semibold uppercase"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {title} — Mood Rail
          </h4>
          <p className="text-stone-600">{tagline}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/productdetail?series=${id}`}
            className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50 transition"
          >
            Explore {title}
          </Link>
        </div>
      </div>

      {/* Responsive scroller cards */}
      <div className="mt-4 no-scrollbar flex gap-4 overflow-x-auto px-1 py-2 scroll-ps-1">
        {gallery.map((item, idx) => (
          <Link
            href={`/productdetail?series=${id}&product=${idx}`}
            key={`${id}-${idx}`}
            className="group relative shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition
                       w-[76vw] sm:w-[58vw] md:w-[210px] aspect-[3/4] md:aspect-auto md:h-[280px]"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 76vw, (max-width: 768px) 58vw, 210px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="text-xs text-white/80">View</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}