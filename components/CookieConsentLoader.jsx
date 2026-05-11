"use client";

import dynamic from "next/dynamic";

const CookieConsentSuite = dynamic(
  () => import("@/components/CookieConsentSuite.jsx"),
  { ssr: false }
);

export function CookieConsentLoader() {
  return <CookieConsentSuite />;
}
