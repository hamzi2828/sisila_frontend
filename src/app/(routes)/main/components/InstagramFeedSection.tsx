'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, PackageSearch, MapPin, Headphones, CreditCard } from 'lucide-react';
import { publicProductService } from '../services/publicProductService';
import { FALLBACK_GALLERY, productImage, productHref } from '@/lib/productMedia';

export type IGPost = { id: string; image: string; href?: string; likes?: number };

type Props = { className?: string; handle?: string; posts?: IGPost[] };

const DEFAULT_POSTS: IGPost[] = FALLBACK_GALLERY.map((image, i) => ({ id: `ig-${i + 1}`, image }));

export default function InstagramFeedSection({
  className = '',
  handle = '@silsila.pk',
  posts: postsProp,
}: Props) {
  const [posts, setPosts] = useState<IGPost[]>(postsProp ?? DEFAULT_POSTS);
  const profileUrl = `https://instagram.com/${handle.replace(/^@/, '')}`;

  // Without explicit posts, show the latest product shots.
  useEffect(() => {
    if (postsProp) return;
    let cancelled = false;
    publicProductService
      .getLatestProducts(6)
      .then((res) => {
        if (cancelled || !res?.data?.length) return;
        setPosts(res.data.map((p) => ({ id: p._id, image: productImage(p), href: productHref(p) })));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [postsProp]);
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
          <Link href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-stone-700 hover:text-stone-900 hover:underline underline-offset-4">
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
                href={p.href || profileUrl}
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
          <Feature href="/track" icon={<PackageSearch className="h-5 w-5" />} title="Track Your Order" desc="Click here for quick updates" />
          <Feature href="/contact" icon={<MapPin className="h-5 w-5" />} title="Store locator" desc="Find us or get in touch" />
          <Feature href="/faqs" icon={<Headphones className="h-5 w-5" />} title="Support 24/7" desc="Answers to common questions, anytime" />
          <Feature href="/faqs" icon={<CreditCard className="h-5 w-5" />} title="Payment Methods" desc="COD • Visa • MasterCard" />
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, desc, href }: { icon: React.ReactNode; title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="group flex flex-col items-center">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-900">
        {icon}
      </div>
      <p className="mt-3 text-sm font-semibold group-hover:underline underline-offset-4">{title}</p>
      <p className="mt-1 max-w-[18rem] text-xs text-stone-600">{desc}</p>
    </Link>
  );
}