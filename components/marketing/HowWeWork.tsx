const STEPS = [
  {
    n: "1",
    text: "You and I agree the scope (what is in the Ghana base vs extra, including how you collect money). Then 50% to start (GHS 1,750 at the Ghana base).",
  },
  {
    n: "2",
    text: "You try it on a private link before it is public.",
  },
  {
    n: "3",
    text: "You pay the remaining 50%. Then it goes live on your domain. You own it. If the second half is not paid, it does not go live.",
  },
] as const;

const INCLUDES = [
  "A public website",
  "Customers place orders on the site; you collect money the way you already do",
  "A simple admin to see orders",
  "WhatsApp alerts",
  "Staff login",
] as const;

export function HowWeWork() {
  return (
    <section id="how" className="border-t border-brand-navy/10 bg-white px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-brand-navy sm:text-4xl">How we work</h2>
          <ol className="mt-10 space-y-8">
            {STEPS.map((step) => (
              <li key={step.n} className="flex gap-4">
                <span className="font-[family-name:var(--font-display)] text-2xl text-brand-navy/40" aria-hidden>
                  {step.n}
                </span>
                <p className="pt-1 text-brand-body leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-sm leading-relaxed text-brand-body">
            You own the software. No monthly fee to Innocent. Domain and hosting are yours. Support only if both agree.
          </p>
        </div>

        <div>
          <h3 className="font-[family-name:var(--font-display)] text-2xl text-brand-navy">Ghana starting build</h3>
          <p className="mt-3 text-sm text-brand-body">What is in the Ghana base — not a payment gateway.</p>
          <ul className="mt-8 list-disc space-y-3 pl-5 text-brand-body">
            {INCLUDES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <dl className="mt-12 space-y-5 border-t border-brand-accent/60 pt-8 text-sm leading-relaxed text-brand-navy">
            <div>
              <dt className="font-semibold">Ghana, from GHS 3,500</dt>
            </div>
            <div>
              <dt className="font-semibold">50% after you and I agree scope, 50% after you approve a private link</dt>
            </div>
            <div>
              <dt className="font-semibold">Outside Ghana, I send a price after we talk.</dt>
            </div>
            <div>
              <dt className="font-semibold">Typical time in Ghana: 2–4 weeks</dt>
              <dd className="mt-1 text-brand-body">A range, not a guarantee.</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
