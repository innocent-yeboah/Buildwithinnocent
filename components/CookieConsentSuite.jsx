"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { Analytics } from "@vercel/analytics/react";

const STORAGE_KEY = "bwincookie_preferences_v1";

function parseStored() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw);
    return o && typeof o === "object" ? o : null;
  } catch {
    return null;
  }
}

export default function CookieConsentSuite() {
  const [prefs, setPrefs] = useState(() => parseStored());

  const showBanner = prefs?.version !== 1;
  const analyticsAllowed = prefs?.analytics === true;

  const persist = useCallback((allowAnalytics) => {
    const payload = {
      version: 1,
      necessary: true,
      analytics: allowAnalytics === true,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* storage blocked */
    }
    setPrefs(payload);
  }, []);

  return (
    <>
      {analyticsAllowed ? <Analytics /> : null}

      {showBanner ? (
        <div
          className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-4 shadow-[0_-8px_32px_rgba(15,23,42,0.12)] backdrop-blur-md sm:p-5"
          role="dialog"
          aria-modal="false"
          aria-label="Cookie preferences"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="min-w-0 text-sm text-slate-600">
              <p className="font-semibold text-brand-navy">
                We respect your privacy.
              </p>
              <p className="mt-1.5 leading-relaxed">
                Essential cookies keep the site working. With your permission we also use anonymous
                analytics from Vercel to understand traffic. See our{" "}
                <Link href="/cookies" className="font-semibold text-brand-green underline underline-offset-2">
                  Cookie Policy
                </Link>{" "}
                for details.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                onClick={() => persist(false)}
              >
                Essential only
              </button>
              <button
                type="button"
                className="rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-navy-muted"
                onClick={() => persist(true)}
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
