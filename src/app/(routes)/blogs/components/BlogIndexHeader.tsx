'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';

type BlogHero = {
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

const toAbsoluteUrl = (path?: string) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

function HeroButton({ href, text, primary }: { href?: string; text?: string; primary?: boolean }) {
  if (!href || !text) return null;
  const className = primary
    ? 'inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-900 hover:bg-stone-100'
    : 'inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20';
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {text}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {text}
    </Link>
  );
}

export default function BlogIndexHeader({
  q,
  setQ,
  tag,
  setTag,
  tags,
}: {
  q: string;
  setQ: Dispatch<SetStateAction<string>>;
  tag: string;
  setTag: Dispatch<SetStateAction<string>>;
  tags: readonly string[];
}) {
  const [hero, setHero] = useState<BlogHero | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadHero = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/blog-hero/active`);
        if (!res.ok) return; // 404 => no active hero, keep static header
        const json = await res.json();
        if (!cancelled && json?.success && json.data?.title) setHero(json.data as BlogHero);
      } catch {
        // Network error: keep static header
      }
    };
    loadHero();
    return () => {
      cancelled = true;
    };
  }, []);

  const heroImage = toAbsoluteUrl(hero?.backgroundImage);

  return (
    <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
      <div className="mx-auto">
        {hero ? (
          <div
            className="relative mb-8 overflow-hidden rounded-3xl border border-stone-200/70 bg-stone-900 bg-cover bg-center text-white"
            style={heroImage ? { backgroundImage: `url("${heroImage}")` } : undefined}
          >
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
            <div className="relative z-10 max-w-2xl p-8 md:p-12 lg:p-16">
              <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-white/70">Brand Journal</p>
              <h1
                className="mt-2 text-3xl md:text-5xl font-semibold uppercase"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {hero.title}
              </h1>
              {hero.subtitle ? <p className="mt-3 text-white/85">{hero.subtitle}</p> : null}
              <div className="mt-6 flex flex-wrap gap-2">
                <HeroButton href={hero.primaryButtonLink} text={hero.primaryButtonText} primary />
                <HeroButton href={hero.secondaryButtonLink} text={hero.secondaryButtonText} />
              </div>
            </div>
          </div>
        ) : (
          <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">
            Brand Journal
          </p>
        )}

        {/* Title + Search */}
        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          {hero ? (
            <h2
              className="text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Stories
            </h2>
          ) : (
            <h1
              className="text-3xl md:text-5xl font-semibold uppercase"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Stories
            </h1>
          )}

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
            <button
              onClick={() => setQ('')}
              className="rounded-full border border-stone-300/80 bg-white px-3 py-2 text-sm hover:bg-stone-50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Tag chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => {
            const active = t === tag;
            return (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={[
                  'inline-flex items-center rounded-full px-3 py-1 text-sm transition',
                  active
                    ? 'bg-black text-white'
                    : 'border border-stone-300/80 bg-white text-stone-800 hover:bg-stone-50',
                ].join(' ')}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}