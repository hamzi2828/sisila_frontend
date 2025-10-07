'use client';

import Image from 'next/image';
import Link from 'next/link';

export type GalleryItem = {
  id: string;
  title: string;
  image: string;
  href?: string;
};

type Props = {
  className?: string;
  items?: GalleryItem[];
};

const DEFAULT_ITEMS: GalleryItem[] = [
  {
    id: 'look-1',
    title: 'Dune Lines — Echoes',
    image:
      '/images/image.png',
  },
  {
    id: 'look-2',
    title: 'Studio Warmth — Hymns',
     image:
      '/images/image.png',
  },
  {
    id: 'look-3',
    title: 'Palette Motion — Passion',
 image:
      '/images/image.png',
  },
  {
    id: 'look-4',
    title: 'City Glow — Anime',
    image:
      '/images/image.png',
  },
  {
    id: 'look-5',
    title: 'Forest Mist — Echoes',
 image:
      '/images/image.png',
  },
];

export default function EditorialGallerySection({ className = '', items = DEFAULT_ITEMS }: Props) {
  const a = items[0], b = items[1], c = items[2], d = items[3], e = items[4];

  return (
    <section className={`px-6 md:px-10 lg:px-20 py-12 ${className}`}>
      <div className="mx-auto ">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">Lookbook</p>
            <h2
              className="mt-2 text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Editorial Gallery
            </h2>
            <p className="mt-2 text-stone-600">A visual journal across themes, categories, and series.</p>
          </div>
          <Link
            href="/lookbook"
            className="shrink-0 inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50 transition"
          >
            View lookbook ↗
          </Link>
        </div>

        {/* Mosaic layout (large + supporting tiles) */}
        <div className="mt-6 grid grid-cols-12 gap-3">
          {/* Large left */}
          <GalleryTile item={a} className="col-span-12 md:col-span-7 h-[400px] md:h-[600px]" />
          {/* Right column: top image */}
          <GalleryTile item={b} className="col-span-12 md:col-span-5 h-[400px] md:h-[600px]" />
          {/* Right column: two small images */}
          <div className="col-span-12 md:col-span-10 h-[300px] md:h-[292px] grid grid-cols-4 gap-3">
            <GalleryTile item={c} className="col-span-1 h-full" compact />
            <GalleryTile item={d} className="col-span-1 h-full" compact />
               <GalleryTile item={c} className="col-span-1 h-full" compact />
            <GalleryTile item={d} className="col-span-1 h-full" compact />
          </div>
          {/* Full-width footer image */}
          <GalleryTile item={e} className="col-span-12 h-[400px] md:h-[400px]" wide />
        </div>
      </div>
    </section>
  );
}

function GalleryTile({
  item,
  className = '',
  compact = false,
  wide = false,
}: {
  item?: GalleryItem;
  className?: string;
  compact?: boolean;
  wide?: boolean;
}) {
  if (!item) return null;

  return (
    <Link
      href={item.href || '#'}
      className={[
        'group relative overflow-hidden rounded-2xl ring-1 ring-stone-200/80 bg-white',
        'block',
        className,
      ].join(' ')}
    >
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          priority={!compact}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />
        <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
          <p className="text-white text-sm md:text-base font-medium">{item.title}</p>
          <p className="text-white/80 text-xs">Open</p>
        </div>
      </div>
    </Link>
  );
}