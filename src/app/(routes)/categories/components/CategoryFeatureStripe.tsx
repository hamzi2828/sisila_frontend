'use client';

import Link from 'next/link';
import Image from 'next/image';

type GalleryItem = { title: string; image: string; href?: string };
type Section = {
  id: string;
  title: string;
  description: string;
  cover: string;
  accent?: string;
  gallery: GalleryItem[];
};

export default function CategoryFeatureStripe({
  section,
  flipped = false,
}: {
  section: Section;
  flipped?: boolean;
}) {
  const { id, title, description, cover, accent = 'from-black/90 to-black/5', gallery } = section;
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
        <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${accent}`} />

        <div className={`grid gap-0 lg:grid-cols-12 ${flipped ? 'lg:[&>.media]:order-1' : ''}`}>
          {/* Media */}
          <div className="media relative lg:col-span-7">
            <div className="p-4 md:p-6 lg:p-8">
              {/* Mobile */}
              <div className="space-y-2 md:hidden">
                <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-stone-200/70 pt-[62%]">
                  <Image src={big} alt={`${title} — primary`} fill sizes="100vw" className="object-cover" priority />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[rightTop, rightBottom].map((img, i) => (
                    <div key={i} className="relative w-full overflow-hidden rounded-2xl ring-1 ring-stone-200/70 pt-[62%]">
                      <Image src={img} alt={`${title} — detail ${i ? 'B' : 'A'}`} fill sizes="50vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop */}
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

          {/* Text/CTA */}
          <div className="relative flex items-center lg:col-span-5">
            <div className="relative z-10 p-6 md:p-8 lg:p-10">
              <span className="inline-flex items-center rounded-full border border-stone-300/70 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.18em]">
                {title}
              </span>
              <h3
                className="mt-3 text-2xl md:text-3xl font-semibold uppercase"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {title}
              </h3>
              <p className="mt-2 text-stone-600">{description}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/productdetail?category=${id}`}
                  className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition"
                >
                  Shop {title}
                </Link>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-tr from-black/5 to-transparent blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}