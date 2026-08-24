"use client";

import { track } from "@vercel/analytics/react";
import Script from "next/script";
import { useState, type FormEvent } from "react";

import { captureLeadAttribution } from "@/lib/lead-attribution";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function InquiryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const website = String(data.get("website") ?? "");
    const turnstileToken = String(data.get("cf-turnstile-response") ?? "");

    if (!name || !email || !phone || !message) {
      setError("Please fill in your name, email, phone, and what you want built.");
      return;
    }

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError("Please complete the security check below.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          website,
          turnstileToken: TURNSTILE_SITE_KEY ? turnstileToken : undefined,
          attribution: captureLeadAttribution(),
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        setError(body.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      track("inquiry_submitted");
      setDone(true);
      form.reset();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="conversation" className="scroll-mt-24 border-t border-brand-navy/10 bg-[color:var(--background)] px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-xl">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-brand-navy sm:text-4xl">Start a conversation</h2>
        <p className="mt-3 text-brand-body">I will reply within one business day.</p>

        {done ? (
          <p className="mt-10 rounded-md border border-brand-navy/10 bg-white px-5 py-6 text-brand-navy" role="status">
            Thank you. I have this, and I will write back within one business day.
          </p>
        ) : (
          <form className="relative mt-10 space-y-6" onSubmit={onSubmit} noValidate>
            <div className="absolute left-[-10000px] top-0 h-px w-px overflow-hidden opacity-0" aria-hidden>
              <label htmlFor="lead-website">Company website</label>
              <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            <div>
              <label htmlFor="lead-name" className="block text-sm font-medium text-brand-navy">
                Name <span aria-hidden="true">*</span>
              </label>
              <input
                id="lead-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="mt-2 w-full rounded-md border border-brand-navy/20 bg-white px-4 py-3 text-brand-navy outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label htmlFor="lead-email" className="block text-sm font-medium text-brand-navy">
                Email <span aria-hidden="true">*</span>
              </label>
              <input
                id="lead-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-md border border-brand-navy/20 bg-white px-4 py-3 text-brand-navy outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label htmlFor="lead-phone" className="block text-sm font-medium text-brand-navy">
                Phone <span aria-hidden="true">*</span>
              </label>
              <input
                id="lead-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+233 …"
                className="mt-2 w-full rounded-md border border-brand-navy/20 bg-white px-4 py-3 text-brand-navy outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label htmlFor="lead-message" className="block text-sm font-medium text-brand-navy">
                What you want built <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="lead-message"
                name="message"
                required
                rows={5}
                className="mt-2 w-full rounded-md border border-brand-navy/20 bg-white px-4 py-3 text-brand-navy outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
              />
            </div>

            {TURNSTILE_SITE_KEY ? (
              <>
                <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
                <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />
              </>
            ) : null}

            {error ? (
              <p className="text-sm text-brand-navy" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-md bg-brand-green px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-green-muted disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy"
            >
              {submitting ? "Sending…" : "Start a conversation"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
