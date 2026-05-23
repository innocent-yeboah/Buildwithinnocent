"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { TAGLINE } from "@/lib/brand";
import { dispatchOpenConsult } from "@/lib/consultation";

const NAV = [
  { href: "/#top", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Work" },
  { href: "/#story", label: "Story" },
  { href: "/#contact", label: "Contact" },
] as const;

function NavLink({
  href,
  label,
  pathname,
  onNavigate,
  className,
}: {
  href: string;
  label: string;
  pathname: string;
  onNavigate?: () => void;
  className: string;
}) {
  const isHome = pathname === "/";
  return (
    <Link
      href={href}
      className={className}
      prefetch={!isHome}
      scroll
      onClick={onNavigate}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const desktopLink =
    "text-sm font-medium text-slate-600 hover:text-brand-navy transition-colors";
  const mobileLink =
    "text-base font-medium text-slate-800 hover:text-brand-green py-2.5 border-b border-slate-100";

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
        className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/80"
        role="banner"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-[4.25rem] lg:px-8">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 sm:gap-3"
            aria-label={`${TAGLINE} — home`}
            onClick={close}
          >
            <BrandLogo variant="icon" priority />
            <span className="hidden min-w-0 flex-col text-left sm:flex">
              <span className="truncate text-sm font-bold tracking-tight text-brand-navy lg:text-base">
                Build With Innocent
              </span>
              <span className="truncate text-[10px] font-medium leading-tight text-brand-green lg:text-[11px]">
                Digital Business Systems
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex xl:gap-8">
            {NAV.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
                className={desktopLink}
              />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                dispatchOpenConsult();
                close();
              }}
              className="hidden rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-green-muted sm:inline-flex"
            >
              Book a Consultation
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-navy ring-1 ring-slate-200 hover:bg-brand-tint lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              {open ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {open ? (
          <nav
            id="mobile-nav"
            className="border-b border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col">
              {NAV.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  pathname={pathname}
                  onNavigate={close}
                  className={mobileLink}
                />
              ))}
              <Link
                href="/bootcamp"
                className={mobileLink}
                prefetch
                onClick={close}
              >
                Bootcamp
              </Link>
              <button
                type="button"
                className="mt-4 w-full rounded-full bg-brand-green py-3 text-center text-sm font-semibold text-white"
                onClick={() => {
                  dispatchOpenConsult();
                  close();
                }}
              >
                Book a Consultation
              </button>
            </div>
          </nav>
        ) : null}
      </header>
    </>
  );
}
