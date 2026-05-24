import { CookieConsentLoader } from "@/components/CookieConsentLoader.jsx";
import { LeadAttributionCapture } from "@/components/LeadAttributionCapture.jsx";
import { Navbar } from "@/components/Navbar";

export default function MarketingLayout({ children }) {
  return (
    <>
      <LeadAttributionCapture />
      <Navbar />
      {children}
      <CookieConsentLoader />
    </>
  );
}
