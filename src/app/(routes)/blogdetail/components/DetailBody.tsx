'use client';

import Link from 'next/link';
import Image from 'next/image';

export type BodyFigure = { src: string; alt: string; side?: 'left' | 'right' | 'full' };

export default function DetailBody({
  paragraphs = DEFAULT_PARAS,
  figures = DEFAULT_FIGS,
  quote = DEFAULT_QUOTE,
  moreHref = '/blogs',
  className = '',
}: {
  paragraphs?: string[];
  figures?: BodyFigure[];
  quote?: { text: string; source?: string };
  moreHref?: string;
  className?: string;
}) {
  const figA = figures[0];
  const figB = figures[1];

  return (
    <section className={`px-6 md:px-10 lg:px-20 py-10 ${className}`}>
      <article className="mx-auto max-w-5xl prose prose-stone prose-p:leading-relaxed">
        {paragraphs.slice(0, 2).map((p, i) => (
          <p key={`p-${i}`}>{p}</p>
        ))}

        {/* Inline gallery */}
        <div className="not-prose my-6 grid grid-cols-12 gap-3">
          {figA && (
            <Figure
              src={figA.src}
              alt={figA.alt}
              className="col-span-12 md:col-span-7"
            />
          )}
          {figB && (
            <Figure
              src={figB.src}
              alt={figB.alt}
              className="col-span-12 md:col-span-5"
            />
          )}
        </div>

        {/* Process notes header if more paragraphs */}
        {paragraphs.length > 2 ? <h3>Process notes</h3> : null}

        {paragraphs.slice(2).length ? (
          <ul>
            {paragraphs.slice(2).map((p, i) => (
              <li key={`lp-${i}`}>{p}</li>
            ))}
          </ul>
        ) : null}

        {/* Pull quote */}
        <div className="my-6 rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-stone-800 text-lg">“{quote.text}”</p>
          {quote.source ? (
            <p className="mt-2 text-sm text-stone-600">— {quote.source}</p>
          ) : null}
        </div>

        {/* Footer paragraph */}
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
            <i className="fa-solid fa-link mr-2" aria-hidden="true" />
            Copy link
          </button>
          <Link
            href={moreHref}
            className="inline-flex items-center rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
          >
            More stories
          </Link>
        </div>
      </article>
    </section>
  );
}

function Figure({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={['relative overflow-hidden rounded-2xl ring-1 ring-stone-200', className].join(' ')}>
      <div className="relative w-full pt-[62%] bg-stone-100">
        <Image src={src} alt={alt} fill sizes="(max-width:1024px) 60vw, 40vw" className="object-cover" />
      </div>
    </div>
  );
}

const DEFAULT_PARAS = [
  'Silsila’s creative practice begins with respectful research — collecting references, sketching, and writing. From verses and frames to letterforms and drape, ideas pass through a process that balances culture with modern daily‑wear.',
  'We translate motifs into composition with careful typography, color palettes, and textures. The aim is wearable design with visual rhythm — pieces that feel both new and familiar.',
  // process notes (list)
  'Sketch first, refine later — give space for visual language to surface.',
  'Balance typography with texture — clarity and character in equal parts.',
  'Prototype trims and prints — test for comfort, longevity, and colorfastness.',
];

const DEFAULT_FIGS: BodyFigure[] = [
  {
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80',
    alt: 'Studio',
  },
  {
    src: 'https://images.unsplash.com/photo-1494319827402-c4b9b83f5741?auto=format&fit=crop&w=1400&q=80',
    alt: 'Canvas',
  },
];

const DEFAULT_QUOTE = {
  text: 'Design should carry meaning gently — enough to be felt, not forced.',
  source: 'Silsila Notes',
};