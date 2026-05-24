"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { INTERNAL_NAV } from "@/lib/internal/constants";
import { useAuth } from "@/lib/internal/hooks";

const icons: Record<string, string> = {
  dashboard: "◫",
  leads: "◎",
  proposals: "▤",
  projects: "▦",
  revenue: "₵",
  maintenance: "⚙",
  referrals: "↗",
};

export function InternalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { email, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-brand-surface">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-100 px-5 py-5">
            <Link href="/internal/dashboard" className="flex items-center gap-3">
              <Image src="/images/logo-icon.png" alt="" width={36} height={36} />
              <div>
                <p className="text-sm font-bold text-brand-navy">Build With Innocent</p>
                <p className="text-xs text-brand-body">Internal OS</p>
              </div>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {INTERNAL_NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-brand-tint text-brand-green"
                      : "text-brand-body hover:bg-slate-50 hover:text-brand-navy"
                  }`}
                >
                  <span className="w-5 text-center text-base" aria-hidden>
                    {icons[item.icon]}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-slate-100 px-4 py-4">
            <p className="truncate text-xs text-slate-500">{email ?? "Signed in"}</p>
            <button
              type="button"
              onClick={signOut}
              className="mt-2 text-sm font-medium text-brand-navy hover:text-brand-green"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-brand-navy/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-8">
          <button
            type="button"
            className="rounded-lg p-2 text-brand-navy lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <p className="hidden text-sm text-brand-body lg:block">
            Digital Business Systems · Internal Operating System
          </p>
          <Link
            href="/"
            className="text-sm font-medium text-brand-green hover:underline"
            target="_blank"
          >
            View website ↗
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
