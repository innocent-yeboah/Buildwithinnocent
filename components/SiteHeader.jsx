"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { BrandMark } from "@/components/BrandMark.jsx";

const WA = "https://wa.me/233530710628";

function NavLinks({ pathname, variant = "desktop", onNavigate }) {
  const linkClass =
    variant === "desktop"
      ? "text-sm font-medium text-slate-600 hover:text-brand-navy transition"
      : "text-base font-medium text-slate-800 hover:text-brand-green py-2 border-b border-slate-100 last:border-b-0";

  const inactive = pathname !== "/";

  const close = () => onNavigate?.();

  return (
    <>
      <Link href="/#work" className={linkClass} prefetch={inactive} scroll onClick={close}>
        Work
      </Link>
      <Link href="/#faq" className={linkClass} prefetch={inactive} scroll onClick={close}>
        FAQ
      </Link>
      <Link
        href="/bootcamp"
        className={`${linkClass} ${pathname === "/bootcamp" ? "font-semibold text-brand-navy" : ""}`}
        prefetch
        scroll
        onClick={close}
      >
        Bootcamp
      </Link>
      <Link href="/privacy" className={linkClass} prefetch scroll onClick={close}>
        Privacy
      </Link>
      <Link href="/cookies" className={linkClass} prefetch scroll onClick={close}>
        Cookies
      </Link>
    </>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const showBorder = true;

  return (
    <>
      <a
        href="#main-content"
        tabIndex={0}
        className="absolute left-4 top-[4.5rem] z-220 translate-x-[calc(-100vw-140%)] rounded-md bg-brand-navy px-4 py-3 text-sm font-semibold text-white shadow-lg ring-2 ring-transparent transition-[transform] focus-visible:translate-x-0 focus-visible:ring-brand-green"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-200 ${
          showBorder ? "shadow-sm shadow-slate-900/06 ring-1 ring-slate-200/80" : "ring-1 ring-transparent"
        }`}
        role="banner"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[4.25rem] lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label="Build With Innocent home">
            <BrandMark className="h-9 w-9 shrink-0 lg:h-10 lg:w-10" />
            <span className="truncate text-[0.9375rem] font-bold tracking-tight text-brand-navy sm:text-base lg:text-lg">
              Build With Innocent
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden lg:flex lg:items-center lg:gap-7 xl:gap-9"
          >
            <NavLinks pathname={pathname} />
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`${WA}?text=${encodeURIComponent("Hi — I'd like to book a consultation.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy-muted sm:inline-flex"
            >
              WhatsApp us
            </a>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg ring-1 ring-slate-200 text-brand-navy hover:bg-brand-tint lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav-drawer"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">Menu</span>
              {open ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {open ? (
          <nav
            id="mobile-nav-drawer"
            className="absolute inset-x-0 top-[100%] border-b border-slate-200 bg-white px-4 py-5 shadow-xl shadow-slate-900/08 lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex max-h-[70vh] flex-col gap-1 overflow-auto">
              <NavLinks pathname={pathname} variant="mobile" onNavigate={() => setOpen(false)} />
              <div className="pt-5">
                <a
                  href={`${WA}?text=${encodeURIComponent("Hi — I'd like to book a consultation.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full bg-brand-navy py-3 text-center text-sm font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  WhatsApp us
                </a>
              </div>
            </div>
          </nav>
        ) : null}
      </header>
    </>
  );
}
