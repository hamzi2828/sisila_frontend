'use client';

import { useMemo, useRef, useState } from 'react';

type FAQ = {
  id: string;
  q: string;
  a: string;
  group: 'Shipping' | 'Orders' | 'Returns' | 'Sizing' | 'Payment' | 'Account' | 'Products';
};

const DATA: FAQ[] = [
  { id: 'ship-1', group: 'Shipping', q: 'How long does shipping take?', a: 'Standard shipping arrives in 3–5 business days. Orders $75+ ship free.' },
  { id: 'ship-2', group: 'Shipping', q: 'Do you ship internationally?', a: 'We currently ship within Pakistan; international is coming soon.' },
  { id: 'orders-1', group: 'Orders', q: 'Can I edit or cancel my order?', a: 'We can update or cancel within 2 hours of placing an order. Contact support@silsila.co.' },
  { id: 'orders-2', group: 'Orders', q: 'Where can I track my order?', a: 'Use the Track page in your order email or visit /track and enter your order number.' },
  { id: 'returns-1', group: 'Returns', q: 'What is your return policy?', a: '30‑day returns on unworn items with original tags. Start a return via your order email.' },
  { id: 'returns-2', group: 'Returns', q: 'How do refunds work?', a: 'Refunds are issued to the original payment method within 3–7 business days of receiving the return.' },
  { id: 'sizing-1', group: 'Sizing', q: 'How do I find my size?', a: 'See the size guide on each product page or contact us with your measurements.' },
  { id: 'payment-1', group: 'Payment', q: 'Which payment methods do you accept?', a: 'COD, Visa, and MasterCard are accepted. More options coming soon.' },
  { id: 'account-1', group: 'Account', q: 'Do I need an account to order?', a: 'No, you can checkout as a guest. Accounts help track orders and save details.' },
  { id: 'products-1', group: 'Products', q: 'How do I care for my pieces?', a: 'Most pieces are machine wash cold and tumble dry low. See Fabric & Care on the product page.' },
];

const GROUPS = ['All', 'Shipping', 'Orders', 'Returns', 'Sizing', 'Payment', 'Account', 'Products'] as const;
type Group = (typeof GROUPS)[number];

const ICON_BY_GROUP: Record<Exclude<Group, 'All'>, string> = {
  Shipping: 'fa-truck',
  Orders: 'fa-bag-shopping',
  Returns: 'fa-rotate-left',
  Sizing: 'fa-ruler',
  Payment: 'fa-credit-card',
  Account: 'fa-user',
  Products: 'fa-shirt',
};

const SUGGESTIONS = ['shipping', 'returns', 'size', 'payment', 'order status'];

export default function FAQsPage() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<Group>('All');
  const [openIds, setOpenIds] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  const counts = useMemo(() => {
    const map = new Map<Group, number>();
    GROUPS.forEach((g) => map.set(g, 0));
    DATA.forEach((r) => {
      map.set('All', (map.get('All') || 0) + 1);
      map.set(r.group, (map.get(r.group as Group) || 0) + 1);
    });
    return map;
  }, []);

  const items = useMemo(() => {
    let rows = DATA;
    if (active !== 'All') rows = rows.filter((r) => r.group === active);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((r) => r.q.toLowerCase().includes(q) || r.a.toLowerCase().includes(q));
    }
    return rows;
  }, [query, active]);

  const toggle = (id: string) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const expandAll = () => setOpenIds(items.map((x) => x.id));
  const collapseAll = () => setOpenIds([]);

  const jumpToContent = () => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const copyLink = async (id: string) => {
    try {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      await navigator.clipboard.writeText(url);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto max-w-4xl">
          <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">Help Center</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
            FAQs
          </h1>
          <p className="mt-3 text-stone-700">Quick answers about orders, shipping, returns, and sizing.</p>

          {/* Search + suggestions */}
          <div className="mt-5">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && jumpToContent()}
                  placeholder="Search topics (e.g., shipping, returns)"
                  className="w-full rounded-full border border-stone-300/80 bg-white pl-9 pr-4 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-400"
                />
              </div>
              <button
                onClick={() => setQuery('')}
                className="rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
              >
                Clear
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setQuery(s);
                    jumpToContent();
                  }}
                  className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1 text-xs hover:bg-stone-50"
                >
                  <i className="fa-regular fa-lightbulb mr-1" /> {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TOPIC CARDS */}
      <section className="px-6 md:px-10 lg:px-20 pb-8">
        <div className="mx-auto max-w-7xl grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {(['Shipping', 'Orders', 'Returns', 'Sizing', 'Payment', 'Account'] as Exclude<Group, 'All'>[]).map((g) => (
            <button
              key={g}
              onClick={() => {
                setActive(g);
                jumpToContent();
              }}
              className="group rounded-2xl border border-stone-200 bg-white p-4 text-left hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-900">
                  <i className={`fa-solid ${ICON_BY_GROUP[g]}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{g}</p>
                  <p className="text-xs text-stone-600">{counts.get(g) || 0} articles</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="px-6 md:px-10 lg:px-20 pb-4">
        <div className="mx-auto max-w-7xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {GROUPS.map((g) => {
              const isActive = g === active;
              return (
                <button
                  key={g}
                  onClick={() => setActive(g)}
                  className={[
                    'inline-flex items-center rounded-full px-3 py-1 text-sm transition',
                    isActive ? 'bg-black text-white' : 'border border-stone-300/80 bg-white text-stone-800 hover:bg-stone-50',
                  ].join(' ')}
                >
                  {g}
                  <span className={isActive ? 'ml-2 text-white/80' : 'ml-2 text-stone-500'}>
                    {counts.get(g) || 0}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-sm hover:bg-stone-50"
            >
              <i className="fa-solid fa-chevron-down mr-2" />
              Expand all
            </button>
            <button
              onClick={collapseAll}
              className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-sm hover:bg-stone-50"
            >
              <i className="fa-solid fa-chevron-up mr-2" />
              Collapse all
            </button>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 md:px-10 lg:px-20 pb-16" ref={listRef}>
        <div className="mx-auto max-w-4xl">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-700">
              No results. Try another keyword or browse topics above.
            </div>
          ) : null}

          <div className="space-y-3">
            {items.map((row) => {
              const open = openIds.includes(row.id);
              return (
                <div id={row.id} key={row.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                  <button
                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                    onClick={() => toggle(row.id)}
                    aria-expanded={open}
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 text-stone-900">
                        <i className={`fa-solid ${ICON_BY_GROUP[row.group]}`} />
                      </span>
                      <span className="text-sm font-medium">{row.q}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Copy link to this question"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyLink(row.id);
                        }}
                        className="rounded p-1.5 text-stone-500 hover:bg-stone-100"
                        title="Copy link"
                      >
                        <i className="fa-solid fa-link" />
                      </button>
                      <i
                        className={[
                          'fa-solid transition-transform',
                          open ? 'fa-chevron-up' : 'fa-chevron-down',
                        ].join(' ')}
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                  <div
                    className={[
                      'grid transition-all',
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    ].join(' ')}
                  >
                    <div className="overflow-hidden px-4 pb-4 text-sm text-stone-700">{row.a}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* STILL NEED HELP */}
          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <i className="fa-regular fa-circle-question text-stone-600" />
              <p className="text-stone-700">Still need help?</p>
            </div>
            <div className="mt-3 flex justify-center gap-2">
              <a
                href="mailto:support@silsila.co"
                className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
              >
                <i className="fa-regular fa-envelope mr-2" />
                Email support@silsila.co
              </a>
              <a
                href="/contact"
                className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
              >
                <i className="fa-regular fa-message mr-2" />
                Contact form
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}