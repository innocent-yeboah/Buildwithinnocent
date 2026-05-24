import type { Metadata } from "next";
import { Suspense } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { LoginForm } from "@/components/internal/LoginForm";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Sign in · Build With Innocent",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-surface px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandLogo variant="full" priority />
          <h1 className="mt-6 text-2xl font-bold text-brand-navy">Internal OS</h1>
          <p className="mt-2 text-sm text-brand-body">
            Sign in to manage leads, projects, and revenue.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Suspense fallback={<p className="text-sm text-brand-body">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
