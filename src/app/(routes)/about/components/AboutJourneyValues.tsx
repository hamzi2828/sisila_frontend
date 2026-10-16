export default function AboutJourneyValues() {
  return (
    <>
      {/* Timeline */}
      <section id="timeline" className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto max-w-7xl ">
          <Header eyebrow="Journey" title="Milestones" subtitle="From sketchbooks in Lahore to our first collection." />
          <div className="mt-6 space-y-4">
            {[
              { y: 'The idea', t: 'Sketchbook beginnings', d: 'Researching Urdu poetry, cinema frames, regional music, and the shapes of our alphabet.' },
              { y: '2025', t: 'Silsila is founded', d: 'Four themes — Southeastern Hymns, Artistic Passion, Echoes of the Winds, and Uplifting Culture.' },
              { y: 'First drop', t: 'Poets & Alphabets', d: 'Homages to Ghalib, Faiz Ahmed Faiz, John Elia, Habib Jalib, and Muneer Niazi — plus Alif, Bay, Pay letterform pieces.' },
              { y: 'Next', t: 'Cinema & Anime', d: 'New series celebrating the screens and stories that shaped a generation.' },
            ].map((row, idx) => (
              <TimelineItem key={idx} {...row} />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto ">
          <Header eyebrow="Values" title="What we care about" subtitle="Roots, creativity, quality, and community." />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <ValueCard iconClass="fa-solid fa-wand-magic-sparkles" title="Culture-first">
              Rooted in Pakistani heritage — respectful references and an original voice in every release.
            </ValueCard>
            <ValueCard iconClass="fa-solid fa-shield-halved" title="Quality daily-wear">
              Relaxed casual fits, durable prints, and fabrics made for everyday wear.
            </ValueCard>
            <ValueCard iconClass="fa-solid fa-palette" title="Creativity">
              Poetry, wit, fun, and art — five categories that let you wear your mood and express yourself.
            </ValueCard>
            <ValueCard iconClass="fa-solid fa-people-group" title="Community">
              Designed in Pakistan, for people who want their clothes to carry a story — and uplift their vibe.
            </ValueCard>
          </div>
        </div>
      </section>
    </>
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

function TimelineItem({ y, t, d }: { y: string; t: string; d: string }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-5 md:grid-cols-12 md:items-center">
      <div className="md:col-span-2">
        <span className="inline-flex items-center rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white">{y}</span>
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

function ValueCard({ iconClass, title, children }: { iconClass: string; title: string; children: React.ReactNode }) {
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