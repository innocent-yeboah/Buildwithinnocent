import Link from "next/link";

export const metadata = {
  title: "Cookie Policy | Build With Innocent",
  description:
    "How buildwithinnocent.com uses cookies and similar technologies, including analytics and preferences.",
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <main id="main-content" className="min-h-screen bg-white text-slate-800">
      <div className="border-b border-slate-200 bg-gradient-to-br from-brand-tint/70 via-white to-white pt-[4.75rem] sm:pt-20">
        <div className="max-w-3xl mx-auto px-4 pb-10 pt-10 md:pb-14 md:pt-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-green mb-2">
            Legal
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy">Cookie Policy</h1>
          <p className="text-slate-600 text-sm mt-2">
            Last updated:{" "}
            <time dateTime="2026-05-11">11 May 2026</time>
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 md:py-14 space-y-8 text-sm md:text-base leading-relaxed">
        <p className="text-slate-600">
          This Cookie Policy explains how{" "}
          <strong className="text-brand-navy">Build With Innocent</strong> uses cookies and related
          storage on{" "}
          <a href="https://buildwithinnocent.com" className="text-brand-green font-semibold underline">
            buildwithinnocent.com
          </a>{" "}
          (the “Site”). It should be read together with our{" "}
          <Link href="/privacy" className="text-brand-green font-semibold underline">
            Privacy Policy
          </Link>
          .
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">1. What are cookies?</h2>
          <p className="text-slate-600">
            Cookies are small text files stored on your device when you visit a website. They help the
            site remember preferences, keep sessions secure, and (with consent) measure how pages are used.
            Similar technologies include local storage, which we use to remember your cookie choices on
            your device only.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">2. How we obtain consent</h2>
          <p className="text-slate-600">
            When you first visit, you will see a cookie banner letting you choose <strong>Accept all</strong>{" "}
            or <strong>Essential only</strong>. We only enable optional analytics if you choose Accept all.
            You can change behaviour later by clearing site data for{" "}
            <span className="font-mono text-xs text-brand-navy">buildwithinnocent.com</span> in your browser —
            your choice will reset and the banner may appear again on the next visit.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">3. Cookies & storage we use</h2>

          <h3 className="text-base font-semibold text-brand-navy">3.1 Strictly necessary (always on)</h3>
          <ul className="list-disc space-y-2 pl-5 text-slate-600">
            <li>
              First-party preferences stored in{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-brand-navy">
                localStorage
              </code>{" "}
              under{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-brand-navy">
                bwincookie_preferences_v1
              </code>{" "}
              to remember whether you have answered the banner and whether analytics is allowed. This is
              required to respect your consent.
            </li>
          </ul>

          <h3 className="text-base font-semibold text-brand-navy pt-2">3.2 Analytics (optional — consent required)</h3>
          <p className="text-slate-600">
            If you accept analytics, we load <strong>Vercel Web Analytics</strong>. It focuses on aggregated
            product metrics (for example visits and performance) rather than granular cross-site profiling.
            For full technical detail, consult{" "}
            <a
              href="https://vercel.com/docs/analytics/privacy-policy"
              className="text-brand-green font-semibold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel&apos;s documentation
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">4. Third parties</h2>
          <p className="text-slate-600">
            Optional Cloudflare Turnstile widgets (when configured) interact with Cloudflare&apos;s servers
            to reduce spam submissions. Operational email may flow through providers such as Resend. Embedded
            third-party scripts only load once you browse to areas that invoke them — for example a form
            with Turnstile or analytics after consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">5. Managing cookies</h2>
          <p className="text-slate-600">
            Use your browser settings to block or delete cookies. Blocking all cookies might affect preference
            storage and require the banner again. For questions:{" "}
            <a href="mailto:igtechgh@gmail.com" className="text-brand-green underline font-semibold">
              igtechgh@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">6. Updates</h2>
          <p className="text-slate-600">
            We may update this policy to reflect new tools or legal requirements. The “Last updated” date
            above identifies the newest version.
          </p>
        </section>

        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/" className="text-brand-green font-semibold hover:underline">
            ← Back to home
          </Link>
          <Link href="/privacy" className="text-brand-green font-semibold hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}
