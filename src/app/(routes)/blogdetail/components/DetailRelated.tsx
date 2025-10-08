'use client';

import Link from 'next/link';
import Image from 'next/image';

export type RelatedPost = {
  title: string;
  tag: string;
  date: string;
  read: string;
  image: string;
  href?: string;
};

export default function DetailRelated({
  items,
  heading = 'Related stories',
  subheading = 'More reads you may enjoy.',
  backHref = '/blogs',
  className = '',
}: {
  items: RelatedPost[];
  heading?: string;
  subheading?: string;
  backHref?: string;
  className?: string;
}) {
  return (
    <section className={`px-6 md:px-10 lg:px-20 pb-20 ${className}`}>
      <div className="mx-auto ">
        <div className="flex items-end justify-between">
          <div>
            <h2
              className="text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {heading}
            </h2>
            <p className="text-stone-600">{subheading}</p>
          </div>
          <Link
            href={backHref}
            className="hidden md:inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
          >
            View all
          </Link>
        </div>

        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Link
              key={p.title}
              href={p.href || '/blogdetail'}
              className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition"
            >
              <div className="relative w-full pt-[66%] bg-stone-100">
                <Image src={p.image} alt={p.title} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover" />
                <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-900">
                  {p.tag}
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-stone-500">
                  {p.date} • {p.read}
                </div>
                <p className="mt-1 line-clamp-2 text-sm font-medium">{p.title}</p>
                <span className="mt-3 inline-flex items-center rounded-full bg-stone-900 px-3 py-1 text-sm font-medium text-white">
                  Read ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}