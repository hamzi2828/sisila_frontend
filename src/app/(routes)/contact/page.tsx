'use client';

import { useState } from 'react';
import Link from 'next/link';

type Status = { type: 'success' | 'error'; message: string } | null;

export default function ContactPage() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    const f = new FormData(form);
    const payload = {
      fullName: String(f.get('name') || '').trim(),
      emailAddress: String(f.get('email') || '').trim(),
      phoneNumber: String(f.get('phone') || '').trim() || undefined,
      subject: String(f.get('subject') || '').trim(),
      message: String(f.get('message') || '').trim(),
      category: 'general',
    };
    if (!payload.fullName || !payload.emailAddress || !payload.message) {
      setStatus({ type: 'error', message: 'Please fill in your name, email and message.' });
      return;
    }

    setBusy(true);
    setStatus(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const res = await fetch(`${baseUrl}/api/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success !== false) {
        setStatus({ type: 'success', message: 'Thanks for reaching out — we’ll get back to you within 24–48 hours.' });
        form.reset();
      } else {
        const detail = Array.isArray(data?.errors) && data.errors.length ? ` ${data.errors.join(' ')}` : '';
        setStatus({ type: 'error', message: (data?.message || 'Could not send your message. Please try again.') + detail });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error — please try again, or email us at hello@silsilla.pk.' });
    } finally {
      setBusy(false);
    }
  };

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
            onSubmit={handleSubmit}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Input name="name" placeholder="Your name" />
              <Input name="email" type="email" placeholder="Your email" />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Input name="phone" type="tel" placeholder="Phone (optional)" required={false} />
              <Input name="subject" placeholder="Subject" required={false} />
            </div>
            <div className="mt-3">
              <textarea
                name="message"
                placeholder="Message"
                rows={6}
                required
                aria-label="Message"
                className="w-full rounded-xl border border-stone-300/80 px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                disabled={busy}
                className={['inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition', busy ? 'opacity-70' : 'hover:bg-stone-800'].join(' ')}
              >
                {busy ? 'Sending…' : 'Send message'}
              </button>
              <Link href="/faqs" className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50">
                View FAQs
              </Link>
            </div>
            {status && (
              <p
                role="status"
                aria-live="polite"
                className={[
                  'mt-4 rounded-xl border px-4 py-3 text-sm',
                  status.type === 'success' ? 'border-stone-200 bg-stone-50 text-stone-800' : 'border-red-200 bg-red-50 text-red-700',
                ].join(' ')}
              >
                {status.message}
              </p>
            )}
          </form>

          {/* Info */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-stone-500">HQ</p>
              <p className="mt-1 text-stone-700">Silsila Studio, Lahore, Pakistan</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Info label="Email" value="hello@silsilla.pk" href="mailto:hello@silsilla.pk" />
                <Info label="Phone" value="+92 300 0000000" href="tel:+923000000000" />
                <Info label="Hours" value="Mon–Sat, 10am–7pm PKT" />
                <Info label="Shipping" value="Across Pakistan, 3–5 working days" />
              </div>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Find us</p>
              <div className="mt-3 h-56 w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                <iframe
                  title="Silsila studio location — Lahore, Pakistan"
                  src="https://www.google.com/maps?q=Lahore,Pakistan&output=embed"
                  className="h-full w-full border-0 grayscale"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <p className="mt-2 text-sm text-stone-600">
                We’re an online-first brand based in Lahore — shop online and we deliver anywhere in Pakistan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Input({
  name,
  type = 'text',
  placeholder,
  required = true,
}: {
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      aria-label={placeholder}
      className="w-full rounded-xl border border-stone-300/80 px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
      required={required}
    />
  );
}
function Info({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{label}</p>
      {href ? (
        <a href={href} className="mt-1 block text-stone-800 hover:underline underline-offset-4">
          {value}
        </a>
      ) : (
        <p className="mt-1 text-stone-800">{value}</p>
      )}
    </div>
  );
}