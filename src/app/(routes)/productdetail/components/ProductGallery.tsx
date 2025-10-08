'use client';

import Image from 'next/image';

export default function ProductGallery({
  title,
  images = [],
  badges = [],
  activeImage = 0,
  setActiveImage,
}: {
  title: string;
  images?: string[];
  badges?: string[];
  activeImage?: number;
  setActiveImage: (i: number) => void;
}) {
  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl ring-1 ring-stone-200/70 bg-white">
        <div className="relative h-[56vw] max-h-[620px] w-full">
          <Image
            src={images[activeImage]}
            alt={`${title} image ${activeImage + 1}`}
            fill
            sizes="(max-width:1024px) 100vw, 60vw"
            className="object-cover"
            priority
          />
          {badges?.length ? (
            <div className="absolute left-4 top-4 flex gap-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-900"
                >
                  {b}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-3 no-scrollbar flex gap-3 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(i)}
            className={[
              'relative h-20 w-16 overflow-hidden rounded-xl ring-1 transition',
              i === activeImage ? 'ring-stone-900' : 'ring-stone-200 hover:ring-stone-300',
            ].join(' ')}
            aria-label={`View image ${i + 1}`}
          >
            <Image src={img} alt={`thumb ${i + 1}`} fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}