"use client";

import { TAGLINE } from "@/lib/brand";

type CTAProps = {
  onBookConsult: () => void;
};

/** Primary conversion block before footer. */
export function CTA({ onBookConsult }: CTAProps) {
  return (
    <section
      className="relative overflow-hidden border-y border-brand-green/30 bg-gradient-to-br from-brand-navy via-brand-navy-muted to-brand-navy px-4 py-16 md:py-20"
      aria-labelledby="cta-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(46,125,50,0.22),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-green">
          {TAGLINE}
        </p>
        <h2
          id="cta-heading"
          className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl"
        >
          Ready to build your digital business system?
        </h2>
        <p className="mt-4 text-lg text-slate-200 leading-relaxed">
          Join businesses across Africa that trust Build With Innocent.
        </p>
        <button
          type="button"
          onClick={onBookConsult}
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand-green px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-brand-green-muted hover:-translate-y-0.5"
        >
          Book a Free Consultation
        </button>
      </div>
    </section>
  );
}
