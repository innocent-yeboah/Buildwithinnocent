import { NextResponse } from "next/server";

import {
  getAdminNotificationEmail,
  getResendFromAddresses,
  sendResendEmail,
} from "@/lib/resend";

/**
 * Dev-only: POST to test Resend config. Disabled in production.
 * Body: { "to": "your@email.com" } (optional — defaults to RESEND_ADMIN_TO)
 */
export async function POST(request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  let to = getAdminNotificationEmail();
  try {
    const body = await request.json();
    if (body?.to && typeof body.to === "string") {
      to = body.to.trim();
    }
  } catch {
    /* use default */
  }

  const { admin: from } = getResendFromAddresses();
  const sandbox = process.env.RESEND_USE_SANDBOX === "true";

  const result = await sendResendEmail({
    from,
    to,
    subject: "Resend test · Build With Innocent",
    html: `<p>If you received this, Resend is configured correctly.</p><p>From: <code>${from}</code></p><p>Sandbox: ${sandbox ? "yes" : "no"}</p>`,
  });

  return NextResponse.json({
    ok: result.ok,
    to,
    from,
    sandbox,
    error: result.error ?? null,
    id: result.id ?? null,
  });
}
