export default function AboutJourneyValues() {
  return (
    <>
      {/* Timeline */}
      <section id="timeline" className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto max-w-7xl ">
          <Header eyebrow="Journey" title="Milestones" subtitle="Highlights from sketchbooks to the first collection." />
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

      {/* Values */}
      <section id="values" className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto ">
          <Header eyebrow="Values" title="What we care about" subtitle="Culture, quality, responsibility, and community." />
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