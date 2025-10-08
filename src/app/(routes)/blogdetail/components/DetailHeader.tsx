'use client';

import Link from 'next/link';

export type BlogHeaderProps = {
  backHref?: string;
  tag: string;
  date: string;
  read: string;
  title: string;
  className?: string;
};

export default function DetailHeader({
  backHref = '/blogs',
  tag,
  date,
  read,
  title,
  className = '',
}: BlogHeaderProps) {
  return (
    <section className={`px-6 md:px-10 lg:px-20 pt-16 ${className}`}>
      <div className="mx-auto">
        <Link href={backHref} className="text-sm text-stone-600 hover:text-stone-900">
          <i className="fa-solid fa-arrow-left mr-2" aria-hidden="true" />
          Back to Stories
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white">
            {tag}
          </span>
          <span className="text-xs text-stone-500">{date}</span>
          <span className="text-xs text-stone-300">•</span>
          <span className="text-xs text-stone-500">{read}</span>
        </div>
        <h1
          className="mt-2 text-3xl md:text-5xl font-semibold leading-tight"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {title}
        </h1>
      </div>
    </section>
  );
}