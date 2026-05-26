import type { Metadata } from "next";
import type { ReactNode } from "react";

import { InternalShell } from "@/components/internal/InternalShell";

/** Auth-gated CRM data — skip static prerender (CI/build has no Supabase secrets). */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Internal OS · Build With Innocent",
};

export default function InternalLayout({ children }: { children: ReactNode }) {
  return <InternalShell>{children}</InternalShell>;
}
