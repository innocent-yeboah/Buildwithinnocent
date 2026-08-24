import Image from "next/image";

import { WORK } from "@/content/work";

export function WorkList() {
  return (
    <section id="work" className="scroll-mt-24 border-t border-brand-navy/10 bg-[color:var(--background)] px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-brand-navy sm:text-4xl">Work</h2>
        <p className="mt-3 max-w-xl text-brand-body">Two live systems. The first is the kind I start with. The second is larger proof — not the Ghana starting build.</p>

        <ul className="mt-14 space-y-20">
          {WORK.map((item) => (
            <li key={item.slug}>
              <article>
                <div className="overflow-hidden rounded-lg border border-brand-navy/10 bg-white shadow-sm">
                  <Image
                    src={item.still}
                    alt={item.alt}
                    width={1280}
                    height={800}
                    className="h-auto w-full object-cover object-top"
                    sizes="(min-width: 1024px) 960px, 100vw"
                  />
                </div>
                <div className="mt-6 max-w-2xl">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl text-brand-navy">{item.title}</h3>
                  <p className="mt-3 text-brand-body leading-relaxed">{item.summary}</p>
                  <p className="mt-4 text-sm leading-relaxed text-brand-navy/80">{item.caption}</p>
                  <p className="mt-5">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-brand-navy underline underline-offset-4 hover:text-brand-navy-muted"
                    >
                      Visit live site
                    </a>
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
