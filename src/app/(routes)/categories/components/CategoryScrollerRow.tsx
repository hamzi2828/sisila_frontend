'use client';

import Link from 'next/link';
import Image from 'next/image';

type GalleryItem = { title: string; image: string; href?: string };
type Section = {
  id: string;
  title: string;
  description: string;
  gallery: GalleryItem[];
};

export default function CategoryScrollerRow({ section }: { section: Section }) {
  const { id, title, description, gallery } = section;

  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h3
            className="text-xl md:text-2xl font-semibold uppercase"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {title}
          </h3>
        <p className="text-stone-600">{description}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/productdetail?category=${id}`}
            className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50 transition"
          >
            Explore {title}
          </Link>
        </div>
      </div>

      <div className="mt-4 no-scrollbar flex gap-4 overflow-x-auto px-1 py-2 scroll-ps-1">
        {gallery.map((item, idx) => (
          <Link
            href={item.href || `/productdetail?category=${id}`}
            key={`${id}-${idx}`}
            className="group relative shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition w-[76vw] sm:w-[58vw] md:w-[210px] aspect-[3/4] md:aspect-auto md:h-[280px]"
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