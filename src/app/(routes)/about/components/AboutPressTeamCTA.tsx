import Link from 'next/link';
import Image from 'next/image';

export default function AboutPressTeamCTA() {
  return (
    <>
      {/* Press */}
      <section id="press" className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto ">
          <Header eyebrow="Press & words" title="What people say" subtitle="Notes from our early community." />
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <Testimonial quote="Wearing Faiz on a tee feels like carrying a verse with me all day. Soft fabric, beautiful print." source="Ayesha, Lahore" />
            <Testimonial quote="The Alphabets series is so clever — Alif never looked this good. Got compliments the first day." source="Bilal, Karachi" />
            <Testimonial quote="Casual, comfortable, and full of culture. Delivery was quick and COD made it easy." source="Sana, Islamabad" />
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="px-6 md:px-10 lg:px-20 pb-12">
        <div className="mx-auto">
          <Header eyebrow="Team" title="People behind the work" subtitle="A small, craft‑driven team based in Lahore." />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <TeamCard name="Creative Direction" role="Concept & Composition" image="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80" />
            <TeamCard name="Design & Type" role="Typography & Graphics" image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80" />
            <TeamCard name="Production" role="Sampling & Quality" image="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 lg:px-20 pb-16">
        <div className="mx-auto grid gap-6 lg:grid-cols-3">
          <CTA title="Shop the collection" href="/shop" text="Poetry, Witty, Fun, Artistic, and Creative pieces." />
          <CTA title="Explore Themes" href="/themes" light text="Four themes rooted in culture, art, and nature." />
          <CTA title="Explore Series" href="/series" light text="Poets, Alphabets, Cinema, and Anime." />
        </div>
        <div className="mx-auto mt-6 text-center">
          <Link href="/contact" className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50">
            Contact us
          </Link>
        </div>
      </section>

      {/* Back to top */}
      <div className="px-6 md:px-10 lg:px-20 pb-10 text-center">
        <Link href="#top" className="text-sm text-stone-500 underline underline-offset-4 hover:text-stone-800">
          Back to top
        </Link>
      </div>
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

function Testimonial({ quote, source }: { quote: string; source: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5">
      <i className="fa-solid fa-quote-right absolute right-4 top-4 text-stone-200 text-xl" aria-hidden="true" />
      <p className="text-stone-800">“{quote}”</p>
      <p className="mt-3 text-sm text-stone-600">— {source}</p>
    </div>
  );
}

function TeamCard({ name, role, image }: { name: string; role: string; image: string }) {
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

function CTA({ title, href, text, light = false }: { title: string; href: string; text: string; light?: boolean }) {
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
        {text}
      </p>
    </Link>
  );
}