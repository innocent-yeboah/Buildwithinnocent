"use client";

import { track } from "@vercel/analytics/react";

const WA_BOOTCAMP =
  "https://wa.me/233530710628?text=" + encodeURIComponent("BOOTCAMP");

export function BootcampWhatsAppLink({ className, children }) {
  return (
    <a
      href={WA_BOOTCAMP}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track("bootcamp_whatsapp_click")}
    >
      {children}
    </a>
  );
}
