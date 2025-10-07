'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  read: string;
  image: string;
};

const POSTS: BlogPost[] = [
  {
    id: 'poets-behind-prints',
    title: 'The Poets Behind the Prints: Ghalib to Elia',
    excerpt:
      'Tracing verses into visuals — how couplets evolve into composition, texture, and type for the Poets Series.',
    tag: 'Poets Series',
    date: 'May 12, 2025',
    read: '6 min read',
    image: 'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'designing-echoes',
    title: 'Designing Echoes of the Winds: Palette + Texture',
    excerpt:
      'From dunes and ocean breath to fabric drape — crafting the airy motion behind Echoes of the Winds.',
    tag: 'Theme — Echoes',
    date: 'May 4, 2025',
    read: '4 min read',
    image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'street-to-studio',
    title: 'From Street to Studio: Building the Core Collection',
    excerpt:
      'Loose fits, graphic hits — the editorial process behind our attitude-forward street pieces.',
    tag: 'Category — Street',
    date: 'Apr 28, 2025',
    read: '5 min read',
    image: 'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'type-as-identity',
    title: 'Typography as Identity: Type-Led Graphics',
    excerpt:
      'Why letters carry culture — composing hierarchy, rhythm, and contrast in type-first designs.',
    tag: 'Category — Typography',
    date: 'Apr 20, 2025',
    read: '7 min read',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'color-stories',
    title: 'Color Stories for Artistic Passion',
    excerpt:
      'Gradients, pigments, and painterly motion — building an expressive color language.',
    tag: 'Theme — Artistic Passion',
    date: 'Apr 12, 2025',
    read: '5 min read',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'fabric-notes',
    title: 'Fabric Notes: Choices that Shape Fit + Feel',
    excerpt:
      'From combed cotton to brushed fleece — our approach to materials, durability, and drape.',
    tag: 'Craft',
    date: 'Apr 2, 2025',
    read: '4 min read',
    image: 'https://images.unsplash.com/photo-1534791547709-75aabed69e0e?auto=format&fit=crop&w=1600&q=80',
  },
];

const TAGS = [
  'All',
  'Poets Series',
  'Theme — Echoes',
  'Theme — Artistic Passion',
  'Category — Street',
  'Category — Typography',
  'Craft',
] as const;
type Tag = (typeof TAGS)[number];

export default function BlogsPage() {
  const [tag, setTag] = useState<Tag>('All');
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    let r = [...POSTS];
    if (tag !== 'All') r = r.filter((p) => p.tag === tag);
    if (q.trim()) {
      const t = q.toLowerCase();
      r = r.filter((p) => p.title.toLowerCase().includes(t) || p.excerpt.toLowerCase().includes(t) || p.tag.toLowerCase().includes(t));
    }
    return r;
  }, [tag, q]);

  const featured = rows[0];
  const rest = rows.slice(1);

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto ">
          <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">Brand Journal</p>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h1 className="text-3xl md:text-5xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Stories
            </h1>
            <div className="flex w-full max-w-md items-center gap-2">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search stories, themes, categories…"
                  className="w-full rounded-full border border-stone-300/80 bg-white pl-9 pr-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
                />
              </div>
              <button onClick={() => setQ('')} className="rounded-full border border-stone-300/80 bg-white px-3 py-2 text-sm hover:bg-stone-50">
                Clear
              </button>
            </div>
          </div>

          {/* Tag chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {TAGS.map((t) => {
              const active = t === tag;
              return (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={[
                    'inline-flex items-center rounded-full px-3 py-1 text-sm transition',
                    active ? 'bg-black text-white' : 'border border-stone-300/80 bg-white text-stone-800 hover:bg-stone-50',
                  ].join(' ')}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED + GRID */}
      <section className="px-6 md:px-10 lg:px-20">
        <div className="mx-auto ">
          {featured ? <Featured post={featured} /> : null}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Card key={p.id} post={p} />
            ))}
          </div>
        </div>
      </section>

      {/* EDITOR PICKS */}
      <section className="px-6 md:px-10 lg:px-20 py-12">
        <div className="mx-auto ">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Editor’s Picks
              </h2>
              <p className="text-stone-600">Hand-picked reads from recent releases.</p>
            </div>
          </div>

          <div className="mt-4 no-scrollbar flex gap-5 overflow-x-auto px-1 py-2">
            {POSTS.slice(0, 6).map((p, idx) => (
              <Link
                key={`pick-${p.id}-${idx}`}
                href="/blogdetail"
                className="group relative h-[280px] w-[220px] shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 transition hover:shadow-md"
              >
                <Image src={p.image} alt={p.title} fill sizes="220px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
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

      {/* NEWSLETTER CTA */}
      <section className="px-6 md:px-10 lg:px-20 pb-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 text-center">
          <p className="text-stone-700">Get new stories in your inbox</p>
          <form
            className="mt-3 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget as HTMLFormElement);
              console.log('subscribe:', data.get('email'));
            }}
          >
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="w-full max-w-sm rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
            />
            <button className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}

function Featured({ post }: { post: BlogPost }) {
  return (
    <Link href="/blogdetail" className="group relative overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200">
      <div className="relative w-full pt-[45%]">
        <Image src={post.image} alt={post.title} fill sizes="(max-width:1024px) 100vw, 60vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-stone-900">
            {post.tag}
          </span>
          <h2 className="mt-2 text-xl md:text-2xl font-semibold text-white">{post.title}</h2>
          <p className="mt-1 hidden max-w-2xl text-white/85 md:block">{post.excerpt}</p>
        </div>
      </div>
    </Link>
  );
}

function Card({ post }: { post: BlogPost }) {
  return (
    <Link href="/blogdetail" className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition">
      <div className="relative w-full pt-[66%] bg-stone-100">
        <Image src={post.image} alt={post.title} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover" />
        <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-900">
          {post.tag}
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs text-stone-500">{post.date} • {post.read}</div>
        <p className="mt-1 line-clamp-2 text-sm font-medium">{post.title}</p>
        <p className="mt-1 line-clamp-2 text-sm text-stone-600">{post.excerpt}</p>
        <span className="mt-3 inline-flex items-center rounded-full bg-stone-900 px-3 py-1 text-sm font-medium text-white">
          Read ↗
        </span>
      </div>
    </Link>
  );
}