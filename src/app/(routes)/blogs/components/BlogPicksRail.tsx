'use client';

import Link from 'next/link';
import Image from 'next/image';

type BlogPost = {
  id: string;
  title: string;
  read: string;
  image: string;
};

export default function BlogPicksRail({
  posts,
  title = "Editor’s Picks",
  subtitle = 'Hand-picked reads from recent releases.',
}: {
  posts: BlogPost[];
  title?: string;
  subtitle?: string;
}) {
  if (!posts?.length) return null;
  return (
    <section className="px-6 md:px-10 lg:px-20 py-12">
      <div className="mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <h2
              className="text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {title}
            </h2>
            <p className="text-stone-600">{subtitle}</p>
          </div>
        </div>

        <div className="mt-4 no-scrollbar flex gap-5 overflow-x-auto px-1 py-2">
          {posts.map((p, idx) => (
            <Link
              key={`pick-${p.id}-${idx}`}
              href="/blogdetail"
              className="group relative h-[280px] w-[220px] shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 transition hover:shadow-md"
            >
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="220px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="line-clamp-1 text-sm font-medium text-white">{p.title}</p>
                <p className="text-xs text-white/85">{p.read}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}