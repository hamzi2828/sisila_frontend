'use client';

export default function TermsPage() {
  const updated = '2025-01-01';
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Terms & Conditions
          </h1>
          <p className="mt-2 text-stone-600">Last updated: {updated}</p>

          <div className="mt-6 space-y-6 text-stone-700">
            <Section title="1. Introduction">These terms govern your use of Silsila’s website and services.</Section>
            <Section title="2. Eligibility">You must be of legal age to make purchases in your jurisdiction.</Section>
            <Section title="3. Products & pricing">We may update prices, availability, and descriptions at any time without notice.</Section>
            <Section title="4. Orders & payment">Orders are offers to buy; we may refuse or cancel. Payments are processed securely by third parties.</Section>
            <Section title="5. Shipping & delivery">Estimated timelines are not guarantees. Customs duties or taxes (if any) are the buyer’s responsibility.</Section>
            <Section title="6. Returns & refunds">30‑day returns for unworn items per our policy. Refunds issued to original payment method.</Section>
            <Section title="7. Intellectual property">All content, graphics, and designs are owned by Silsila or its licensors.</Section>
            <Section title="8. User conduct">No unlawful, infringing, or abusive behavior. We may restrict access for violations.</Section>
            <Section title="9. Disclaimers">Services are provided “as is” without warranties, to the extent allowed by law.</Section>
            <Section title="10. Limitation of liability">We are not liable for indirect, incidental, or consequential damages.</Section>
            <Section title="11. Governing law">These terms are governed by the laws of Pakistan, without regard to conflicts of law.</Section>
            <Section title="12. Contact">Questions? Email support@silsila.co.</Section>
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