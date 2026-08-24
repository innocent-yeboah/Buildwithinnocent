import type { ReactNode } from "react";

import { CookieConsentLoader } from "@/components/CookieConsentLoader.jsx";
import { LeadAttributionCapture } from "@/components/LeadAttributionCapture.jsx";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LeadAttributionCapture />
      <SiteHeader />
      {children}
      <SiteFooter />
      <CookieConsentLoader />
    </>
  );
}
