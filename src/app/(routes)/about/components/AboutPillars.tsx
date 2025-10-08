import Link from 'next/link';
import Image from 'next/image';

export default function AboutPillars() {
  return (
    <section id="pillars" className="px-6 md:px-10 lg:px-20 pb-12">
      <div className="mx-auto ">
        <Header eyebrow="Creative Pillars" title="What shapes our point of view" subtitle="Culture-first design expressed through four anchors." />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <PillarCard iconClass="fa-solid fa-music" title="Southeastern Hymns" image="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80" />
          <PillarCard iconClass="fa-solid fa-palette" title="Artistic Passion" image="https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1400&q=80" />
          <PillarCard iconClass="fa-solid fa-wind" title="Echoes of the Winds" image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80" />
          <PillarCard iconClass="fa-solid fa-hand-holding-heart" title="Uplifting Culture" image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1400&q=80" />
        </div>
      </div>
    </section>
  );
}

function Header({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">{eyebrow}</p>
      <h2 className="text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {title}
      </h2>
      {subtitle ? <p className="text-stone-600">{subtitle}</p> : null}
    </div>
  );
}

function PillarCard({ iconClass, title, image }: { iconClass: string; title: string; image: string }) {
  return (
    <Link href="/themes" className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 hover:shadow-md transition">
      <div className="relative w-full pt-[68%]">
        <Image src={image} alt={title} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-stone-900">
          <i className={iconClass} aria-hidden="true" />
          <span>Theme</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-white text-lg font-semibold">{title}</p>
        </div>
      </div>
    </Link>
  );
}