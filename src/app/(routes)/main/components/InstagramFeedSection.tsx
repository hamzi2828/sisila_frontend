'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, PackageSearch, MapPin, Headphones, CreditCard } from 'lucide-react';

export type IGPost = { id: string; image: string; href?: string; likes?: number };

type Props = { className?: string; handle?: string; posts?: IGPost[] };

const DEFAULT_POSTS: IGPost[] = [
  { id: 'ig-1', image: 'https://images.unsplash.com/photo-1581691952693-d2d60c02f2ac?auto=format&fit=crop&w=1600&q=80', likes: 1240 },
  { id: 'ig-2', image: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&w=1600&q=80', likes: 980 },
  { id: 'ig-3', image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=1600&q=80', likes: 860 },
  { id: 'ig-4', image: 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1600&q=80', likes: 1420 },
  { id: 'ig-5', image: 'https://images.unsplash.com/photo-1499013819532-e4ff41b00669?auto=format&fit=crop&w=1600&q=80', likes: 650 },
  { id: 'ig-6', image: 'https://images.unsplash.com/photo-1536335550880-118d3d624d07?auto=format&fit=crop&w=1600&q=80', likes: 720 },
];

export default function InstagramFeedSection({
  className = '',
  handle = '@silsila',
  posts = DEFAULT_POSTS,
}: Props) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setCanPrev(el.scrollLeft > 8);
      setCanNext(el.scrollLeft < max - 8);
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [posts]);

  const scroll = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className={`px-6 md:px-10 lg:px-20 py-12 ${className}`}>
      <div className="mx-auto">
        {/* Title + handle */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-center text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Instagram
          </h2>
          <Link href="https://instagram.com/" target="_blank" className="text-sm text-stone-700 hover:text-stone-900 hover:underline underline-offset-4">
            {handle} • Follow us
          </Link>
        </div>

        {/* Rail */}
        <div className="relative mt-6 group">
          {/* Left control (md+ on hover) */}
          <button
            aria-label="Previous"
            onClick={() => scroll(-1)}
            disabled={!canPrev}
            className={[
              'hidden md:flex items-center justify-center',
              'absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 ring-1 ring-stone-200 shadow-sm',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              !canPrev ? 'pointer-events-none opacity-0' : '',
            ].join(' ')}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Right control (md+ on hover) */}
          <button
            aria-label="Next"
            onClick={() => scroll(1)}
            disabled={!canNext}
            className={[
              'hidden md:flex items-center justify-center',
              'absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 ring-1 ring-stone-200 shadow-sm',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              !canNext ? 'pointer-events-none opacity-0' : '',
            ].join(' ')}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={railRef}
            className="flex snap-x snap-mandatory gap-4 no-scrollbar overflow-x-auto scroll-smooth px-1 md:px-2"
          >
            {posts.map((p, i) => (
              <Link
                key={p.id}
                href={p.href || '#'}
                className={[
                  'group relative shrink-0 snap-start overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200/80',
                  'w-[88%] sm:w-[64%] md:w-1/3',
                ].join(' ')}
                aria-label="Instagram post"
              >
                <div className="relative w-full pt-[66%]">
                  <Image
                    src={p.image}
                    alt="Instagram post"
                    fill
                    sizes="(max-width: 640px) 88vw, (max-width: 1024px) 64vw, 33vw"
                    className="object-cover"
                    priority={i < 3}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Feature row (non-duplicative to hero/footer) */}
        <div className="mt-8 grid grid-cols-1 gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
          <Feature icon={<PackageSearch className="h-5 w-5" />} title="Track Your Order" desc="Click here for quick updates" />
          <Feature icon={<MapPin className="h-5 w-5" />} title="Store locator" desc="Find a nearby store" />
          <Feature icon={<Headphones className="h-5 w-5" />} title="Support 24/7" desc="We’re here anytime" />
          <Feature icon={<CreditCard className="h-5 w-5" />} title="Payment Methods" desc="COD • Visa • MasterCard" />
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-900">
        {icon}
      </div>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 max-w-[18rem] text-xs text-stone-600">{desc}</p>
    </div>
  );
}