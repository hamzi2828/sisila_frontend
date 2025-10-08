'use client';

import Image from 'next/image';

export default function DetailCover({
  src,
  alt = 'Cover',
  className = '',
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    <section className={`px-6 md:px-10 lg:px-20 mt-6 ${className}`}>
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl ring-1 ring-stone-200">
        <div className="relative w-full pt-[48%] bg-stone-100">
          <Image src={src} alt={alt} fill sizes="(max-width:1024px) 100vw, 70vw" className="object-cover" priority />
        </div>
      </div>
    </section>
  );
}