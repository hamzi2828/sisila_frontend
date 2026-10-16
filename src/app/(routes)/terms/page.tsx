'use client';

export default function TermsPage() {
  const updated = '2026-10-16';
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Terms & Conditions
          </h1>
          <p className="mt-2 text-stone-600">Last updated: {updated}</p>

          <div className="mt-6 space-y-6 text-stone-700">
            <Section title="1. Introduction">These terms govern your use of the Silsila website (www.silsilla.pk) and any purchase you make from us. Silsila is a clothing brand based in Lahore, Pakistan.</Section>
            <Section title="2. Eligibility">You must be at least 18 years old, or have the consent of a parent or guardian, to place an order.</Section>
            <Section title="3. Products & pricing">All prices are listed in Pakistani Rupees (PKR) and include applicable taxes. We may update prices, availability, and descriptions at any time; the price shown at checkout is the price you pay.</Section>
            <Section title="4. Orders & payment">Orders are offers to buy; we may refuse or cancel an order (for example, if an item is out of stock or details cannot be verified). We accept Cash on Delivery and Visa/MasterCard cards; card payments are processed securely by our payment partners.</Section>
            <Section title="5. Shipping & delivery">We currently deliver within Pakistan only, usually in 3–5 working days. Shipping is free on orders over Rs 5,000; a flat Rs 250 charge applies below that. Delivery timelines are estimates and may vary due to courier delays or public holidays.</Section>
            <Section title="6. Returns & refunds">Unworn, unwashed items with original tags can be exchanged within 7 days of delivery. Damaged or incorrect items must be reported within 48 hours of delivery. Where a refund is approved, card payments are refunded to the original card and COD orders via bank transfer.</Section>
            <Section title="7. Intellectual property">All content, graphics, and designs are owned by Silsila or its licensors.</Section>
            <Section title="8. User conduct">No unlawful, infringing, or abusive behavior. We may restrict access for violations.</Section>
            <Section title="9. Disclaimers">Services are provided “as is” without warranties, to the extent allowed by law.</Section>
            <Section title="10. Limitation of liability">We are not liable for indirect, incidental, or consequential damages.</Section>
            <Section title="11. Governing law">These terms are governed by the laws of Pakistan, without regard to conflicts of law.</Section>
            <Section title="12. Contact">Questions? Email hello@silsilla.pk or call +92 300 0000000.</Section>
          </div>
        </div>
      </section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2">{children}</p>
    </section>
  );
}