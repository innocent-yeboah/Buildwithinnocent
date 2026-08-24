import Link from "next/link";

import { COMPANY_NAME, WA_HUMAN_DISPLAY, WA_PRIMARY } from "@/lib/brand";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-navy/10 bg-brand-navy text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold">{COMPANY_NAME}</p>
          <p className="mt-2 text-sm text-white/70">© {year} Innocent Golden</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-col gap-2 text-sm text-white/80">
            <li>
              <a
                href={WA_PRIMARY}
                className="underline-offset-4 transition hover:text-white hover:underline"
              >
                WhatsApp {WA_HUMAN_DISPLAY}
              </a>
            </li>
            <li>
              <Link href="/bootcamp" className="underline-offset-4 transition hover:text-white hover:underline">
                Coding bootcamp
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="underline-offset-4 transition hover:text-white hover:underline">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="underline-offset-4 transition hover:text-white hover:underline">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="underline-offset-4 transition hover:text-white hover:underline">
                Cookies
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
