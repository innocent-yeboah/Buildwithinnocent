import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Build With Innocent",
  description:
    "Terms governing use of buildwithinnocent.com and consultation enquiries with Build With Innocent.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="border-b border-slate-200 bg-[#1E3A5F] text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#86efac] mb-2">
            Legal
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-gray-300 text-sm mt-2">
            Last updated:{" "}
            <time dateTime="2026-05-02">2 May 2026</time>
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 md:py-14 space-y-8 text-sm md:text-base leading-relaxed">
        <p className="text-slate-600">
          These terms (“Terms”) govern your access to{" "}
          <strong className="text-[#1E3A5F]">buildwithinnocent.com</strong> (the “Site”) operated by
          Build With Innocent (“we”, “us”). By using the Site or submitting an enquiry, you agree to
          these Terms.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E3A5F]">1. Not legal or professional advice</h2>
          <p className="text-slate-600">
            Content on the Site is for general information. It is not legal, tax, or regulated
            professional advice. Engagements for delivery are agreed separately in writing where required.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E3A5F]">2. Consultations & proposals</h2>
          <p className="text-slate-600">
            Booking a consultation or submitting the contact form does not obligate either party until
            scope, fees (if any), and timelines are confirmed in a separate agreement or written order.
            “Free prototype” discussions describe our typical commercial approach and may vary per client.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E3A5F]">3. Acceptable use</h2>
          <p className="text-slate-600">
            You agree not to misuse the Site — including attempting to disrupt security, scrape at rates
            that impair service, submit unlawful content, or use automated means to abuse forms or APIs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E3A5F]">4. Intellectual property</h2>
          <p className="text-slate-600">
            Site branding, copy, layout, and supporting assets belong to Build With Innocent unless noted.
            Client projects delivered under separate contracts follow the ownership terms in those
            contracts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E3A5F]">5. Third-party links</h2>
          <p className="text-slate-600">
            Portfolio links point to sites we do not control. We are not responsible for third-party
            content, uptime, or policies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E3A5F]">6. Disclaimers</h2>
          <p className="text-slate-600">
            The Site is provided “as is” to the extent permitted by law. We do not warrant uninterrupted
            or error-free operation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E3A5F]">7. Limitation of liability</h2>
          <p className="text-slate-600">
            To the maximum extent permitted by applicable law, Build With Innocent is not liable for any
            indirect, incidental, special, consequential, or punitive damages arising from use of the
            Site. Aggregate liability for claims relating to the Site alone shall not exceed the greater
            of fifty Ghana Cedis (GH₵50) or the amounts you paid us solely for Site-related services in
            the six months before the claim (if any).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E3A5F]">8. Governing law</h2>
          <p className="text-slate-600">
            These Terms are governed by the laws of the Republic of Ghana, without regard to conflict-of-law
            principles. Courts in Ghana shall have jurisdiction, subject to mandatory consumer protections
            where applicable.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E3A5F]">9. Contact</h2>
          <p className="text-slate-600">
            <a href="mailto:igtechgh@gmail.com" className="text-[#2E7D32] underline font-medium">
              igtechgh@gmail.com
            </a>
            {" · "}
            <a href="tel:+233530710628" className="text-[#2E7D32] underline font-medium">
              +233 530 710 628
            </a>
          </p>
        </section>

        <p>
          <Link href="/" className="text-[#2E7D32] font-semibold hover:underline">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
