"use client";

import Image from "next/image";
import Link from "next/link";

import { LOGO, TAGLINE, WA_PRIMARY } from "@/lib/brand";

type FooterProps = {
  onBookConsult: () => void;
};

const SOCIAL = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/innocent-golden",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/buildwithinnocent",
  },
  {
    label: "GitHub",
    href: "https://github.com/innocent-yeboah",
  },
] as const;

export function Footer({ onBookConsult }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-brand-navy px-4 py-14 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-block rounded-lg bg-white p-2 shadow-sm">
              <Image
                src={LOGO.full}
                alt="Build With Innocent"
                width={200}
                height={260}
                className="h-20 w-auto object-contain object-left"
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-300">{TAGLINE}</p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-green">
              Quick links
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/#top" className="transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#services" className="transition hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/#work" className="transition hover:text-white">
                  Work
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onBookConsult}
                  className="text-left transition hover:text-white"
                >
                  Contact
                </button>
              </li>
              <li>
                <Link href="/bootcamp" className="transition hover:text-white">
                  Coding Bootcamp
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="transition hover:text-white">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-green">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a href="tel:+233530710628" className="transition hover:text-white">
                  +233 530 710 628
                </a>
              </li>
              <li>
                <a
                  href={WA_PRIMARY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:igtechgh@gmail.com" className="transition hover:text-white">
                  igtechgh@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-green">
              Social
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-600 pt-6 text-center text-sm text-slate-400">
          <p>
            © {year} Build With Innocent — {TAGLINE}
          </p>
        </div>
      </div>
    </footer>
  );
}
