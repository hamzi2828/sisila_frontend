'use client';

import Link from 'next/link';
import Image from 'next/image';

export type BlogPost = {
  id: string; // kept for future use, not used in href
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  read: string;
  image: string;
};

export const HOMEPAGE_POSTS: BlogPost[] = [
  {
    id: 'poets-behind-prints',
    title: 'The Poets Behind the Prints: Ghalib to Elia',
    excerpt:
      'Tracing verses into visuals — how couplets evolve into composition, texture, and type for the Poets Series.',
    tag: 'Poets Series',
    date: 'May 12, 2025',
    read: '6 min read',
    image:
      'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'designing-echoes',
    title: 'Designing Echoes of the Winds: Palette + Texture',
    excerpt:
      'From dunes and ocean breath to fabric drape — crafting the airy motion behind Echoes of the Winds.',
    tag: 'Theme — Echoes',
    date: 'May 4, 2025',
    read: '4 min read',
    image:
      'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'street-to-studio',
    title: 'From Street to Studio: Building the Core Collection',
    excerpt:
      'Loose fits, graphic hits — the editorial process behind our attitude-forward street pieces.',
    tag: 'Category — Street',
    date: 'Apr 28, 2025',
    read: '5 min read',
    image:
      'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'type-as-identity',
    title: 'Typography as Identity: Type-Led Graphics',
    excerpt:
      'Why letters carry culture — composing hierarchy, rhythm, and contrast in type-first designs.',
    tag: 'Category — Typography',
    date: 'Apr 20, 2025',
    read: '7 min read',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80',
  },
];

export default function BlogsSection({
  posts = HOMEPAGE_POSTS,
  className = '',
  title = 'Stories',
  subtitle = 'Culture, craft, and the making of Silsila — behind the prints, palettes, and fits.',
}: {
  posts?: BlogPost[];
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section id="stories" className={`px-6 md:px-10 lg:px-20 py-12 ${className}`}>
      <div className="mx-auto  ">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">
              Brand Journal
            </p>
            <h2
              className="mt-1 text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {title}
            </h2>
            <p className="mt-2 text-stone-600">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/blogs"
              className="inline-flex items-center rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
            >
              View all stories ↗
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post, i) => (
            <StoryCard key={post.id} post={post} priority={i < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryCard({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  return (
    <Link
      href="/blogdetail"
      className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition"
    >
      <div className="relative w-full pt-[66%] bg-stone-100">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover"
          priority={priority}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-900">
            {post.tag}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.read}</span>
        </div>
        <h3 className="mt-1 text-stone-900 text-base font-semibold">{post.title}</h3>
        <p className="mt-1 text-sm text-stone-600 line-clamp-2">{post.excerpt}</p>

        <span className="mt-3 inline-flex items-center rounded-full bg-stone-900 px-3 py-1 text-sm font-medium text-white hover:bg-stone-800">
          Read ↗
        </span>
      </div>
    </Link>
  );
}