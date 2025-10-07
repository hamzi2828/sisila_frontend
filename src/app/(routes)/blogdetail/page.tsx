'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function BlogDetailPage() {
  const COVER =
    'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1600&q=80';

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* Header */}
      <section className="px-6 md:px-10 lg:px-20 pt-16">
        <div className="mx-auto ">
          <Link href="/blogs" className="text-sm text-stone-600 hover:text-stone-900">
            <i className="fa-solid fa-arrow-left mr-2" /> Back to Stories
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white">
              Poets Series
            </span>
            <span className="text-xs text-stone-500">May 12, 2025</span>
            <span className="text-xs text-stone-300">•</span>
            <span className="text-xs text-stone-500">6 min read</span>
          </div>
          <h1
            className="mt-2 text-3xl md:text-5xl font-semibold leading-tight"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            The Poets Behind the Prints: Ghalib to Elia
          </h1>
        </div>
      </section>

      {/* Cover */}
      <section className="px-6 md:px-10 lg:px-20 mt-6">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl ring-1 ring-stone-200">
          <div className="relative w-full pt-[48%] bg-stone-100">
            <Image src={COVER} alt="Cover" fill sizes="(max-width:1024px) 100vw, 70vw" className="object-cover" priority />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="px-6 md:px-10 lg:px-20 py-10">
        <article className="mx-auto max-w-5xl prose prose-stone prose-p:leading-relaxed">
          <p>
            Silsila’s creative practice begins with respectful research — collecting references,
            sketching, and writing. From verses and frames to letterforms and drape, ideas pass
            through a process that balances culture with modern daily‑wear.
          </p>
          <p>
            We translate motifs into composition with careful typography, color palettes, and
            textures. The aim is wearable design with visual rhythm — pieces that feel both new
            and familiar.
          </p>

          <div className="not-prose my-6 grid grid-cols-12 gap-3">
            <Figure
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80"
              alt="Studio"
              className="col-span-12 md:col-span-7"
            />
            <Figure
              src="https://images.unsplash.com/photo-1494319827402-c4b9b83f5741?auto=format&fit=crop&w=1400&q=80"
              alt="Canvas"
              className="col-span-12 md:col-span-5"
            />
          </div>

          <h3>Process notes</h3>
          <ul>
            <li>Sketch first, refine later — give space for visual language to surface.</li>
            <li>Balance typography with texture — clarity and character in equal parts.</li>
            <li>Prototype trims and prints — test for comfort, longevity, and colorfastness.</li>
          </ul>

          <div className="my-6 rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-stone-800 text-lg">
              “Design should carry meaning gently — enough to be felt, not forced.”
            </p>
            <p className="mt-2 text-sm text-stone-600">— Silsila Notes</p>
          </div>

          <p>
            Explore more stories across Themes, Categories, and Series — or shop the latest drops
            with the same design vocabulary brought into product.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                } catch {}
              }}
              className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-sm hover:bg-stone-50"
            >
              <i className="fa-solid fa-link mr-2" />
              Copy link
            </button>
            <Link
              href="/blogs"
              className="inline-flex items-center rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
            >
              More stories
            </Link>
          </div>
        </article>
      </section>

      {/* Related (static, links to same detail page by requirement) */}
      <section className="px-6 md:px-10 lg:px-20 pb-20">
        <div className="mx-auto ">
          <div className="flex items-end justify-between">
            <div>
              <h2
                className="text-2xl md:text-3xl font-semibold uppercase"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Related stories
              </h2>
              <p className="text-stone-600">More reads you may enjoy.</p>
            </div>
            <Link
              href="/blogs"
              className="hidden md:inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RELATED.map((p) => (
              <Link
                key={p.title}
                href="/blogdetail"
                className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition"
              >
                <div className="relative w-full pt-[66%] bg-stone-100">
                  <Image src={p.image} alt={p.title} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover" />
                  <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-900">
                    {p.tag}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xs text-stone-500">{p.date} • {p.read}</div>
                  <p className="mt-1 line-clamp-2 text-sm font-medium">{p.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-stone-600">{p.excerpt}</p>
                  <span className="mt-3 inline-flex items-center rounded-full bg-stone-900 px-3 py-1 text-sm font-medium text-white">
                    Read ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const RELATED = [
  {
    title: 'Designing Echoes of the Winds: Palette + Texture',
    tag: 'Theme — Echoes',
    date: 'May 4, 2025',
    read: '4 min read',
    image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1600&q=80',
    excerpt:
      'From dunes and ocean breath to fabric drape — crafting the airy motion behind Echoes of the Winds.',
  },
  {
    title: 'Typography as Identity: Type-Led Graphics',
    tag: 'Category — Typography',
    date: 'Apr 20, 2025',
    read: '7 min read',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80',
    excerpt:
      'Why letters carry culture — composing hierarchy, rhythm, and contrast in type-first designs.',
  },
  {
    title: 'Color Stories for Artistic Passion',
    tag: 'Theme — Artistic Passion',
    date: 'Apr 12, 2025',
    read: '5 min read',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80',
    excerpt:
      'Gradients, pigments, and painterly motion — building an expressive color language.',
  },
];

function Figure({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={['relative overflow-hidden rounded-2xl ring-1 ring-stone-200', className].join(' ')}>
      <div className="relative w-full pt-[62%] bg-stone-100">
        <Image src={src} alt={alt} fill sizes="(max-width:1024px) 60vw, 40vw" className="object-cover" />
      </div>
    </div>
  );
}