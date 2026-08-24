import Image from "next/image";

import { BrandLogo } from "@/components/BrandLogo";
import { HERO_SENTENCE } from "@/lib/brand";

export function Hero() {
  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden">
      <Image
        src="/hero/hero-2.jpg"
        alt="Quiet developer workspace with a laptop on a wooden desk"
        fill
        priority
        quality={75}
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-brand-navy/55" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-brand-navy/20" aria-hidden />

      <div className="relative mx-auto flex min-h-[88vh] max-w-3xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-24">
        <BrandLogo variant="icon" priority />
        <p className="mt-6 font-[family-name:var(--font-display)] text-xl text-white sm:text-2xl">Innocent Golden</p>
        <p className="mt-2 text-sm text-white/85">Based in Accra. I work with clients remotely.</p>
        <h1 className="mt-8 font-[family-name:var(--font-display)] text-3xl leading-snug text-white sm:text-4xl sm:leading-snug md:text-5xl">
          {HERO_SENTENCE}
        </h1>
        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <a
            href="#conversation"
            className="inline-flex items-center justify-center rounded-md bg-brand-green px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-green-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Start a conversation
          </a>
          <a
            href="#work"
            className="text-sm font-medium text-white/90 underline-offset-4 transition hover:text-white hover:underline"
          >
            See the work
          </a>
        </div>
      </div>
    </section>
  );
}
