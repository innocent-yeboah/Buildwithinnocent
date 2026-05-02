import Image from "next/image";
import Link from "next/link";
import { BootcampWhatsAppLink } from "./BootcampCtas";

export const metadata = {
  title: "Coding Bootcamp | Build With Innocent — Zero to Production in 8 Weeks",
  description:
    "Live cohort bootcamp: 8 weeks of classes, real shipped projects, WhatsApp support, CV & LinkedIn review. Reply BOOTCAMP on WhatsApp for curriculum and payment options.",
  keywords: [
    "coding bootcamp Ghana",
    "learn web development Accra",
    "React bootcamp",
    "Next.js training Ghana",
    "Innocent Golden bootcamp",
  ],
  openGraph: {
    title: "Build With Innocent Bootcamp — Zero to Production in 8 Weeks",
    description:
      "Stop watching tutorials. Start building real products — live classes, cohort accountability, 5+ live portfolio apps.",
    url: "https://buildwithinnocent.com/bootcamp",
    siteName: "Build With Innocent",
    locale: "en_GH",
    type: "website",
  },
};

const PILLARS = [
  { title: "Live classes", detail: "Daily 2-hour sessions on Google Meet — structured, accountable, human." },
  { title: "Real projects", detail: "Ship apps you can demo — not toy exercises buried in a folder." },
  { title: "Real results", detail: "Weekly deploys, a portfolio stack, and career-ready polish by Week 8." },
];

const LAWS = [
  {
    law: "Law 1 — Make it obvious",
    headline: "The path is clear from Day 1",
    bullets: [
      "Daily 2-hour live classes (Google Meet)",
      "Weekly roadmap posted every Sunday",
      "WhatsApp group for progress and accountability",
      "Your code is visible to instructor and peers",
    ],
  },
  {
    law: "Law 2 — Make it attractive",
    headline: "An environment that pulls you forward",
    bullets: [
      "Cohort-based learning with motivated peers",
      "Weekly live code reviews",
      "Projects you are proud to show — not boring drills",
      "Continuous WhatsApp support",
    ],
  },
  {
    law: "Law 3 — Make it easy",
    headline: "Remove friction so you can execute",
    bullets: [
      "Guided setup — no maze of tooling alone",
      "Bite-sized daily work (about 2–3 hours per day)",
      "Templates and starter code provided",
      "Recordings for catch-up and revision",
    ],
  },
  {
    law: "Law 4 — Make it satisfying",
    headline: "Ship often and compound wins",
    bullets: [
      "Deploy something live every week",
      "5+ live apps in your portfolio by Week 8",
      "Certificate of completion",
      "CV and LinkedIn profile reviews",
    ],
  },
];

const WEEKS = [
  { week: 1, title: "Live personal website", stack: "HTML / CSS" },
  { week: 2, title: "Interactive to-do app", stack: "JavaScript" },
  { week: 3, title: "Weather app with live data", stack: "APIs" },
  { week: 4, title: "Movie search experience", stack: "React" },
  { week: 5, title: "Blog with login & database", stack: "Supabase" },
  { week: 6, title: "Real-time task manager", stack: "Full-stack" },
  { week: 7, title: "WhatsApp auto-reply integration", stack: "Automation" },
  { week: 8, title: "Portfolio + job-ready profile", stack: "Ship & polish" },
];

const INCLUDED = [
  "8 weeks of live classes plus recordings",
  "5+ live portfolio projects",
  "WhatsApp group + 1-on-1 support",
  "CV + LinkedIn review",
  "Certificate of completion",
  "Lifetime access to materials",
];

const AUDIENCE = [
  "University graduates ready to build employable skills",
  "Professionals switching into tech",
  "Recent high school graduates with consistency and a laptop",
  "Small business owners who want to build their own tools",
];

export default function BootcampPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="text-sm font-semibold text-brand-navy hover:text-brand-green transition"
          >
            ← Home
          </Link>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-green">
            Bootcamp
          </span>
          <BootcampWhatsAppLink className="text-sm font-semibold text-brand-green hover:underline">
            WhatsApp: BOOTCAMP →
          </BootcampWhatsAppLink>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-[#e8f5e9]/40 via-white to-white">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-green mb-3">
              Build With Innocent Bootcamp
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy tracking-tight leading-tight">
              From zero to{" "}
              <span className="text-brand-green">production-ready</span> in 8 weeks.
            </h1>
            <p className="mt-5 text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
              Stop watching tutorials. Start building real products — with live classes, shipped weekly,
              and a cohort that keeps you moving.
            </p>
            <ul className="mt-8 flex flex-wrap gap-3 list-none p-0">
              {["Live classes", "Real projects", "Real results"].map((label) => (
                <li
                  key={label}
                  className="rounded-full bg-brand-navy text-white text-xs font-semibold px-4 py-2 shadow-sm shadow-brand-navy/20"
                >
                  {label}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4">
              <BootcampWhatsAppLink className="inline-flex justify-center items-center rounded-lg bg-[#25D366] text-white px-7 py-3.5 text-base font-semibold hover:bg-[#128C7E] transition shadow-lg shadow-[#25D366]/25">
                Message “BOOTCAMP” on WhatsApp
              </BootcampWhatsAppLink>
              <a
                href="mailto:igtechgh@gmail.com?subject=Build%20With%20Innocent%20Bootcamp"
                className="inline-flex justify-center items-center rounded-lg border-2 border-brand-navy text-brand-navy px-7 py-3.5 text-base font-semibold hover:bg-brand-navy hover:text-white transition"
              >
                Email for syllabus
              </a>
              <Link
                href="/?register=1"
                className="inline-flex justify-center items-center rounded-lg border-2 border-brand-green text-brand-green px-7 py-3.5 text-base font-semibold hover:bg-brand-green hover:text-white transition"
              >
                Register online
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Lead instructor: <strong className="text-brand-navy">Innocent Golden</strong>
              <span className="mx-2 text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="text-brand-green font-medium">buildwithinnocent.com</span>
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10 ring-1 ring-slate-100">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-50">
                <Image
                  src="/bootcamp/promo.png"
                  alt="Build With Innocent Bootcamp overview — 8-week program from zero to production-ready"
                  fill
                  className="object-contain object-top"
                  sizes="(max-width: 1024px) 100vw, 480px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-brand-navy">
            Built on habit science — applied to coding
          </h2>
          <p className="text-center text-slate-600 mt-3 max-w-2xl mx-auto">
            Four laws shape how we learn, ship, and stay accountable — so progress feels inevitable,
            not heroic.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-slate-200 bg-slate-50/80 p-6 text-center hover:border-brand-green/40 transition"
              >
                <h3 className="text-lg font-bold text-brand-navy">{p.title}</h3>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-brand-surface border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-brand-navy">
            The four laws in practice
          </h2>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {LAWS.map((block) => (
              <article
                key={block.law}
                className="rounded-xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-green mb-2">
                  {block.law}
                </p>
                <h3 className="text-xl font-bold text-brand-navy">{block.headline}</h3>
                <ul className="mt-4 space-y-2 text-slate-600 text-sm leading-relaxed list-disc pl-5">
                  {block.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex rounded-full bg-brand-green text-white text-[11px] font-semibold uppercase tracking-[0.2em] px-5 py-2 mb-4 shadow-md shadow-brand-green/25">
              Curriculum
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy">
              What you build — week by week
            </h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              Project-based sprints. Each week compounds into a portfolio recruiters can open in the
              browser.
            </p>
          </div>

          <ol className="relative border-l-2 border-brand-green/35 ml-3 md:ml-6 space-y-8 pl-8 md:pl-12 list-none">
            {WEEKS.map((w) => (
              <li key={w.week} className="relative">
                <span
                  className="absolute -left-[calc(0.5rem+9px)] md:-left-[calc(1.5rem+9px)] top-1 flex h-[18px] w-[18px] rounded-full bg-brand-green ring-4 ring-white shadow"
                  aria-hidden
                />
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-5 py-4 md:px-6 md:py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-green">
                      Week {w.week}
                    </p>
                    <span className="text-[11px] font-semibold text-brand-navy/80 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                      {w.stack}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy mt-2">{w.title}</h3>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-14 px-4 bg-brand-navy text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Who this is for</h2>
            <ul className="mt-6 space-y-3 text-gray-200 leading-relaxed list-none p-0">
              {AUDIENCE.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="text-[#86efac] shrink-0" aria-hidden="true">
                    ✓
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl bg-white/10 backdrop-blur-sm px-5 py-4 ring-1 ring-white/20">
              <p className="font-semibold text-white">Prerequisites</p>
              <p className="text-gray-200 text-sm mt-2 leading-relaxed">
                No degree or prior coding experience required. You need consistency, curiosity, and a
                working laptop you can install tools on.
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-white text-slate-800 p-8 shadow-xl">
            <h2 className="text-xl font-bold text-brand-navy">Investment</h2>
            <p className="mt-4 text-3xl md:text-4xl font-bold text-brand-green tracking-tight">
              ₵1,500 – ₵2,500
            </p>
            <p className="text-slate-600 text-sm mt-2">Ghana Cedis · payment plans available</p>
            <p className="font-semibold text-brand-navy mt-8 mb-3">What&apos;s included</p>
            <ul className="space-y-2 text-sm text-slate-600 list-none p-0">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-brand-green" aria-hidden="true">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-slate-200">
              <BootcampWhatsAppLink className="block w-full text-center rounded-lg bg-[#25D366] text-white px-6 py-3.5 font-semibold hover:bg-[#128C7E] transition shadow-md">
                Get full curriculum &amp; payment options
              </BootcampWhatsAppLink>
              <p className="text-center text-xs text-slate-500 mt-3">
                Reply <strong className="text-brand-navy">BOOTCAMP</strong> on WhatsApp to start.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-brand-surface">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-xl md:text-2xl font-bold italic text-brand-navy leading-snug">
            &ldquo;I don&apos;t build tutorials. I build live products.&rdquo;
          </blockquote>
          <p className="mt-4 text-slate-600 font-medium">— Innocent Golden</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <BootcampWhatsAppLink className="inline-flex justify-center items-center rounded-lg bg-brand-green text-white px-8 py-4 text-lg font-semibold hover:bg-brand-green-muted transition shadow-lg">
              WhatsApp +233 530 710 628
            </BootcampWhatsAppLink>
            <a
              href="mailto:igtechgh@gmail.com"
              className="inline-flex justify-center items-center rounded-lg border-2 border-brand-navy text-brand-navy px-8 py-4 text-lg font-semibold hover:bg-brand-navy hover:text-white transition"
            >
              igtechgh@gmail.com
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
          <Link href="/" className="font-semibold text-brand-green hover:underline">
            ← Back to home
          </Link>
          <p className="text-center sm:text-right">
            Copyright © {new Date().getFullYear()} Build With Innocent
          </p>
        </div>
      </footer>
    </div>
  );
}
