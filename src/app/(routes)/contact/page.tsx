'use client';

import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* Hero */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto max-w-7xl">
          <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">Say hello</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Contact
          </h1>
          <p className="mt-3 text-stone-700">
            We’d love to hear from you — product questions, partnerships, or press.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-10 lg:px-20 pb-16">
        <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <form
            className="rounded-2xl border border-stone-200 bg-white p-6"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              console.log('contact', Object.fromEntries(f.entries()));
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Input name="name" placeholder="Your name" />
              <Input name="email" type="email" placeholder="Your email" />
            </div>
            <div className="mt-3">
              <Input name="subject" placeholder="Subject" />
            </div>
            <div className="mt-3">
              <textarea
                name="message"
                placeholder="Message"
                rows={6}
                className="w-full rounded-xl border border-stone-300/80 px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800">
                Send message
              </button>
              <Link href="/faqs" className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50">
                View FAQs
              </Link>
            </div>
          </form>

          {/* Info */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-stone-500">HQ</p>
              <p className="mt-1 text-stone-700">Silsila Studio, Karachi / Lahore — Pakistan</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Info label="Email" value="support@silsila.co" />
                <Info label="Hours" value="Mon–Fri, 10:00–18:00 PKT" />
              </div>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Find us</p>
              <div className="mt-3 h-56 w-full rounded-xl bg-stone-100" />
              <p className="mt-2 text-sm text-stone-600">
                Store locator coming soon — meanwhile, shop online or write to us.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Input({ name, type = 'text', placeholder }: any) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full rounded-xl border border-stone-300/80 px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
      required
    />
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-1 text-stone-800">{value}</p>
    </div>
  );
}