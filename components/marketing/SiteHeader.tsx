import Link from "next/link";

import { BrandLogo } from "@/components/BrandLogo";
import { COMPANY_NAME } from "@/lib/brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-navy/10 bg-[color:var(--background)]/95 backdrop-blur-sm">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-brand-navy focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy"
          aria-label={`${COMPANY_NAME} — home`}
        >
          <BrandLogo variant="icon" priority />
          <span className="truncate text-sm font-semibold tracking-tight text-brand-navy sm:text-base">
            {COMPANY_NAME}
          </span>
        </Link>
      </div>
    </header>
  );
}
