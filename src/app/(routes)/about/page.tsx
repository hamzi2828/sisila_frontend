import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'About Silsila',
  description:
    'Silsila merges cultural heritage with contemporary fashion — themes, series, and craft shaped for modern expression.',
};

export default function AboutPage() {
  return (
    <main id="top" className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
        <div className="mx-auto ">
          <div className="relative overflow-hidden rounded-3xl border border-stone-200/70 bg-gradient-to-br from-black via-stone-900 to-stone-800 text-white">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />
            <div className="relative z-10 grid gap-8 p-8 md:grid-cols-2 md:p-12 lg:p-16">
              <div>
                <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-white/70">
                  Our Story
                </p>
                <h1
                  className="mt-2 text-3xl md:text-5xl font-semibold uppercase"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  About Silsila
                </h1>
                <p className="mt-3 text-white/85">
                  Silsila merges cultural heritage with contemporary fashion — translating
                  poetry, cinema, typography, and regional narratives into modern apparel.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    href="/themes"
                    className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-900 hover:bg-stone-100"
                  >
                    Explore Themes
                  </Link>
                  <Link
                    href="/series"
                    className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
                  >
                    Explore Series
                  </Link>
                </div>
              </div>

              {/* Collage */}
              <div className="relative hidden md:block">
                <div className="absolute right-6 top-2 h-44 w-36 overflow-hidden rounded-2xl ring-1 ring-white/20">
                  <Image
                    src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"
                    alt="Strings"
                    fill
                    sizes="(max-width: 1024px) 240px, 320px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute right-24 top-36 h-56 w-44 rotate-3 overflow-hidden rounded-2xl ring-1 ring-white/20">
                  <Image
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
                    alt="Pigments"
                    fill
                    sizes="(max-width: 1024px) 280px, 320px"
                    className="object-cover"
                  />
                </div>
                <div className="absolute right-6 bottom-6 h-48 w-40 -rotate-2 overflow-hidden rounded-2xl ring-1 ring-white/20">
                  <Image
                    src="https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1200&q=80"
                    alt="Dunes"
                    fill
                    sizes="(max-width: 1024px) 240px, 280px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mx-auto mt-6 grid  grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { k: 'Founded', v: '2025' },
              { k: 'Core Themes', v: '4' },
              { k: 'Categories', v: '10' },
              { k: 'Series', v: '4' },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-2xl border border-stone-200 bg-white p-4 text-center"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{s.k}</p>
                <p className="mt-1 text-lg font-semibold">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS with imagery */}
      <section id="pillars" className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto ">
          <Header
            eyebrow="Creative Pillars"
            title="What shapes our point of view"
            subtitle="Culture-first design expressed through four anchors."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <PillarCard
              iconClass="fa-solid fa-music"
              title="Southeastern Hymns"
              image="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80"
            />
            <PillarCard
              iconClass="fa-solid fa-palette"
              title="Artistic Passion"
              image="https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1400&q=80"
            />
            <PillarCard
              iconClass="fa-solid fa-wind"
              title="Echoes of the Winds"
              image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"
            />
            <PillarCard
              iconClass="fa-solid fa-hand-holding-heart"
              title="Uplifting Culture"
              image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1400&q=80"
            />
          </div>
        </div>
      </section>


      {/* TIMELINE */}
      <section id="timeline" className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto ">
          <Header
            eyebrow="Journey"
            title="Milestones"
            subtitle="Highlights from sketchbooks to the first collection."
          />
          <div className="mt-6 space-y-4">
            {[
              { y: '2024', t: 'Sketchbook beginnings', d: 'Researching poets, cinema frames, and letterforms.' },
              { y: '2025 Q1', t: 'Silsila launches', d: 'Four core themes, ten categories, and the first lookbook.' },
              { y: '2025 Q2', t: 'Poets Series', d: 'Homages to Ghalib, Faiz, Elia, Jalib, and Muneer.' },
              { y: '2025 Q3', t: 'Retail pop-ups', d: 'Community showcases with live print sessions and readings.' },
            ].map((row, idx) => (
              <TimelineItem key={idx} {...row} />
            ))}
          </div>
        </div>
      </section>

      {/* VALUES / RESPONSIBILITY */}
      <section id="values" className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto ">
          <Header
            eyebrow="Values"
            title="What we care about"
            subtitle="Culture, quality, responsibility, and community."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <ValueCard iconClass="fa-solid fa-wand-magic-sparkles" title="Culture-first">
              Respectful references and original voice in every release.
            </ValueCard>
            <ValueCard iconClass="fa-solid fa-shield-halved" title="Quality daily-wear">
              Balanced fits, durable prints, and considered trims.
            </ValueCard>
            <ValueCard iconClass="fa-solid fa-leaf" title="Materials">
              Preference for cottons and blends that last, minimizing waste.
            </ValueCard>
            <ValueCard iconClass="fa-solid fa-recycle" title="Packaging">
              Plastic‑free mailers and recyclable tags wherever possible.
            </ValueCard>
          </div>
        </div>
      </section>

      {/* PRESS / TESTIMONIALS */}
      <section id="press" className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto ">
          <Header eyebrow="Press & words" title="What people say" subtitle="Notes from the community." />
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <Testimonial
              quote="A thoughtful merge of poetry and streetwear. Silsila feels both new and familiar."
              source="Culture Weekly"
            />
            <Testimonial
              quote="Typography and color are used with restraint and purpose — wearable design."
              source="Design Critique"
            />
            <Testimonial
              quote="Pieces that tell stories — and make space for yours."
              source="Community Member"
            />
          </div>
        </div>
      </section>

      {/* TEAM SNAPSHOTS */}
      <section id="team" className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto">
          <Header eyebrow="Team" title="People behind the work" subtitle="Small, craft‑driven, and collaborative." />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <TeamCard
              name="Creative Direction"
              role="Concept & Composition"
              image="https://images.unsplash.com/photo-1518811554976-606607421ff6?auto=format&fit=crop&w=1200&q=80"
            />
            <TeamCard
              name="Design & Type"
              role="Typography & Graphics"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80"
            />
            <TeamCard
              name="Production"
              role="Sampling & Quality"
              image="https://images.unsplash.com/photo-1544717299-30e12c9dba40?auto=format&fit=crop&w=1200&q=80"
            />
          </div>
        </div>
      </section>

      {/* CTA ROW */}
      <section className="px-6 md:px-10 lg:px-20 pb-16">
        <div className="mx-auto  grid gap-6 lg:grid-cols-3">
          <CTA title="Shop the collection" href="/shop" />
          <CTA title="Explore Themes" href="/themes" light />
          <CTA title="Explore Series" href="/series" light />
        </div>
        <div className="mx-auto mt-6  text-center">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
          >
            Contact us
          </Link>
        </div>
      </section>

      {/* Back to top */}
      <div className="px-6 md:px-10 lg:px-20 pb-10 text-center">
        <Link
          href="#top"
          className="text-sm text-stone-500 underline underline-offset-4 hover:text-stone-800"
        >
          Back to top
        </Link>
      </div>
    </main>
  );
}

/* Helpers */

function Header({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">{eyebrow}</p>
      <h2
        className="text-2xl md:text-3xl font-semibold uppercase"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {title}
      </h2>
      {subtitle ? <p className="text-stone-600">{subtitle}</p> : null}
    </div>
  );
}

function Figure({
  image,
  alt,
  className = '',
}: {
  image: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={['relative overflow-hidden rounded-2xl ring-1 ring-stone-200', className].join(' ')}>
      <Image src={image} alt={alt} fill sizes="(max-width:1024px) 60vw, 40vw" className="object-cover" />
    </div>
  );
}

function PillarCard({
  iconClass,
  title,
  image,
}: {
  iconClass: string;
  title: string;
  image: string;
}) {
  return (
    <Link
      href="/themes"
      className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 hover:shadow-md transition"
    >
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

function TimelineItem({ y, t, d }: { y: string; t: string; d: string }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-5 md:grid-cols-12 md:items-center">
      <div className="md:col-span-2">
        <span className="inline-flex items-center rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white">
          {y}
        </span>
      </div>
      <div className="md:col-span-4">
        <p className="text-sm font-semibold">{t}</p>
      </div>
      <div className="md:col-span-6">
        <p className="text-sm text-stone-700">{d}</p>
      </div>
    </div>
  );
}

function ValueCard({
  iconClass,
  title,
  children,
}: {
  iconClass: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-900">
        <i className={iconClass} aria-hidden="true" />
      </div>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-stone-700">{children}</p>
    </div>
  );
}

function Testimonial({ quote, source }: { quote: string; source: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5">
      <i className="fa-solid fa-quote-right absolute right-4 top-4 text-stone-200 text-xl" aria-hidden="true" />
      <p className="text-stone-800">“{quote}”</p>
      <p className="mt-3 text-sm text-stone-600">— {source}</p>
    </div>
  );
}

function TeamCard({
  name,
  role,
  image,
}: {
  name: string;
  role: string;
  image: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div className="relative w-full pt-[70%]">
        <Image src={image} alt={name} fill sizes="(max-width:1024px) 33vw, 20vw" className="object-cover" />
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-stone-600">{role}</p>
      </div>
    </div>
  );
}

function CTA({ title, href, light = false }: { title: string; href: string; light?: boolean }) {
  return (
    <Link
      href={href}
      className={[
        'rounded-2xl p-6 ring-1 transition block text-center',
        light ? 'bg-white ring-stone-200 hover:shadow-md' : 'bg-black text-white ring-black/5 hover:bg-stone-800',
      ].join(' ')}
    >
      <span className={light ? 'text-stone-900' : 'text-white'}>{title} ↗</span>
      <p className={['mt-1 text-sm', light ? 'text-stone-600' : 'text-white/85'].join(' ')}>
        Visual rails, palettes, and product edits.
      </p>
    </Link>
  );
}