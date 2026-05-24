"use client";

import { useEffect } from "react";

import { captureLeadAttribution } from "@/lib/lead-attribution";

/** Stores first-touch UTM/referrer in sessionStorage for lead form submissions. */
export function LeadAttributionCapture() {
  useEffect(() => {
    captureLeadAttribution();
  }, []);

  return null;
}
