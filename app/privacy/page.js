import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Build With Innocent",
  description:
    "How Build With Innocent collects, uses, and protects personal data on buildwithinnocent.com.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="border-b border-slate-200 bg-brand-navy text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#86efac] mb-2">
            Legal
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-gray-300 text-sm mt-2">
            Last updated:{" "}
            <time dateTime="2026-05-02">2 May 2026</time>
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 md:py-14 space-y-8 text-sm md:text-base leading-relaxed">
        <p className="text-slate-600">
          This policy describes how{" "}
          <strong className="text-brand-navy">Build With Innocent</strong> (“we”, “us”) handles
          information when you use{" "}
          <a href="https://buildwithinnocent.com" className="text-brand-green font-medium underline">
            buildwithinnocent.com
          </a>{" "}
          (the “Site”). For questions:{" "}
          <a href="mailto:igtechgh@gmail.com" className="text-brand-green underline">
            igtechgh@gmail.com
          </a>
          .
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">1. What we collect</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>
              <strong>Consultation &amp; bootcamp registration:</strong> name, email, WhatsApp number;
              optional service selection and message for consultations; for bootcamp sign-up we also
              store self-reported coding experience, your stated goals or notes, whether you accepted
              our terms (with a timestamp), and whether you came from the consultation or
              registration flow.
            </li>
            <li>
              <strong>Technical data:</strong> basic analytics from our hosting/analytics provider
              (e.g. pages viewed, device/browser type, approximate geography) to improve performance
              and security — see §4.
            </li>
            <li>
              <strong>Optional security checks:</strong> if enabled, Cloudflare Turnstile may process
              minimal signals to reduce spam; refer to Cloudflare’s privacy notice for their role as a
              processor.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">2. Why we use it</h2>
          <p className="text-slate-600">
            To respond to enquiries, operate and secure the Site, send acknowledgment or operational
            emails related to your request (via Resend when configured), and improve reliability and
            abuse prevention.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">3. Where data is stored</h2>
          <p className="text-slate-600">
            Lead records may be stored in{" "}
            <strong>Supabase</strong> (hosted PostgreSQL). Messages may transit email providers (
            <strong>Resend</strong>). The Site is hosted on <strong>Vercel</strong>. These providers
            process data under their agreements and may use regions outside Ghana — consistent with
            typical SaaS hosting.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">4. Analytics</h2>
          <p className="text-slate-600">
            We may use <strong>Vercel Web Analytics</strong> to measure traffic and product usage in a
            privacy-conscious way. You can limit cookies in your browser; core Site functionality should
            still work.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">5. Retention</h2>
          <p className="text-slate-600">
            We keep lead and operational records only as long as needed for client communication,
            delivery, and legal/accounting obligations, unless you ask us to delete sooner where the law
            allows.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">6. Your choices</h2>
          <p className="text-slate-600">
            You may request access, correction, or deletion of personal data tied to a consultation
            request by emailing{" "}
            <a href="mailto:igtechgh@gmail.com" className="text-brand-green underline">
              igtechgh@gmail.com
            </a>
            . We may need to verify your identity before acting on certain requests.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">7. Linked sites</h2>
          <p className="text-slate-600">
            Our portfolio links to third-party websites (for example client demos). Their privacy
            practices are governed by those sites, not this policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">8. Updates</h2>
          <p className="text-slate-600">
            We may update this policy from time to time. Material changes will be reflected by updating
            the “Last updated” date above.
          </p>
        </section>

        <p>
          <Link href="/" className="text-brand-green font-semibold hover:underline">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
