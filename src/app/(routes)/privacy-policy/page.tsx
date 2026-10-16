'use client';

export default function PrivacyPolicyPage() {
  const updated = '2026-10-16';
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Privacy Policy
          </h1>
          <p className="mt-2 text-stone-600">Last updated: {updated}</p>

          <div className="mt-6 space-y-6 text-stone-700">
            <Section title="1. Information we collect">
              We collect information you provide (e.g., name, email, phone number, and delivery address in Pakistan) when you place an order, create an account, subscribe to our newsletter, or contact us, along with analytics data (cookies, device info) to improve our services.
            </Section>
            <Section title="2. How we use information">
              To process orders, provide support, personalize content, and improve products and marketing with your consent or legitimate interest.
            </Section>
            <Section title="3. Sharing & disclosure">
              We do not sell your data. We share only what is needed with trusted service providers — such as our courier partners for delivery within Pakistan, card payment processors, and analytics tools. We never store your full card details.
            </Section>
            <Section title="4. Security">
              We use industry-standard safeguards. No method of transmission is 100% secure; please use strong passwords and keep them confidential.
            </Section>
            <Section title="5. Your rights">
              You may request access to, correction of, or deletion of your personal data, and unsubscribe from marketing emails at any time. Contact us at hello@silsilla.pk.
            </Section>
            <Section title="6. Data retention">
              We keep data as long as necessary to provide services and meet legal obligations, then delete or anonymize it.
            </Section>
            <Section title="7. Cookies">
              We use cookies to remember preferences and measure performance. You can manage cookies via your browser settings.
            </Section>
            <Section title="8. Changes">
              We may update this policy periodically. Continued use of our services indicates acceptance of the updated policy.
            </Section>
            <Section title="9. Contact">
              For privacy questions, email hello@silsilla.pk or write to Silsila, Lahore, Pakistan.
            </Section>
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