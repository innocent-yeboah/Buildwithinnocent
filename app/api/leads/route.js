import { getSupabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/leads-ip";
import { NextResponse } from "next/server";
import {
  buildAdminLeadEmailHtml,
  buildAdminLeadEmailText,
  buildCustomerLeadEmailHtml,
  buildCustomerLeadEmailText,
} from "@/lib/lead-emails";
import {
  getAdminNotificationEmail,
  getDefaultReplyTo,
  getResendFromAddresses,
  sendResendEmail,
} from "@/lib/resend";
import { syncWebsiteLeadToCrm } from "@/lib/sync-website-lead";

async function verifyTurnstile(token, remoteip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token || typeof token !== "string") return false;

  const body = new URLSearchParams();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteip && remoteip !== "unknown") body.append("remoteip", remoteip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();
  return data.success === true;
}

async function sendEmailNotification(leadData) {
  const isRegistration =
    leadData.source === "bootcamp_registration" || leadData.form_type === "registration";
  const namePlain = leadData.name;
  const servicePlain = leadData.service_interest || "";
  const { admin: from } = getResendFromAddresses();
  const payload = { ...leadData, submitted_at: new Date().toISOString() };

  const result = await sendResendEmail({
    from,
    to: getAdminNotificationEmail(),
    subject: isRegistration
      ? `[Bootcamp] New registration — ${namePlain}`
      : `[Lead] ${namePlain} — ${servicePlain || "consultation"}`,
    html: buildAdminLeadEmailHtml(payload),
    text: buildAdminLeadEmailText(payload),
    replyTo: leadData.email,
    headers: {
      "X-Entity-Ref-ID": `lead-admin-${Date.now()}`,
    },
    tags: [
      { name: "category", value: "lead-admin" },
      { name: "form_type", value: leadData.form_type || "consultation" },
    ],
  });

  return result.ok;
}

async function sendCustomerEmail(leadData) {
  const namePlain = leadData.name;
  const isRegistration =
    leadData.source === "bootcamp_registration" || leadData.form_type === "registration";
  const { customer: from } = getResendFromAddresses();
  const payload = { ...leadData, submitted_at: new Date().toISOString() };

  const result = await sendResendEmail({
    from,
    to: leadData.email,
    subject: isRegistration
      ? `${namePlain}, your bootcamp registration is confirmed`
      : `${namePlain}, thank you for contacting Build With Innocent`,
    html: buildCustomerLeadEmailHtml(payload),
    text: buildCustomerLeadEmailText(payload),
    replyTo: getDefaultReplyTo(),
    headers: {
      "X-Entity-Ref-ID": `lead-customer-${Date.now()}`,
    },
    listUnsubscribe: "<mailto:hello@buildwithinnocent.com?subject=Unsubscribe>",
    tags: [
      { name: "category", value: "lead-customer" },
      { name: "form_type", value: leadData.form_type || "consultation" },
    ],
  });

  return result.ok;
}

/** Bots often probe `/api/leads`; avoid 405 (treated as 4xx in Search Console). */
export function GET() {
  return NextResponse.json(
    { error: "Method not supported" },
    {
      status: 404,
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
      },
    }
  );
}

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const limited = rateLimit(`leads:${ip}`, { limit: 8, windowMs: 60_000 });
    if (!limited.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a minute and try again." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000)),
          },
        }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      service,
      message,
      goals: goalsField,
      website: honeypot,
      company: regHoneypot,
      turnstileToken,
      form,
      experienceLevel,
      agreeTerms,
      attribution,
    } = body;

    const isRegistration = form === "registration";

    if (isRegistration) {
      if (regHoneypot != null && String(regHoneypot).trim() !== "") {
        return NextResponse.json({ success: true });
      }
    } else if (honeypot != null && String(honeypot).trim() !== "") {
      return NextResponse.json({ success: true });
    }

    const turnstileOk = await verifyTurnstile(turnstileToken, ip);
    if (!turnstileOk) {
      return NextResponse.json(
        { error: "Security check failed. Please refresh and try again." },
        { status: 400 }
      );
    }

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    if (isRegistration && agreeTerms !== true) {
      return NextResponse.json(
        {
          error:
            "Please confirm you agree to the Privacy Policy and Terms of Service before registering.",
        },
        { status: 400 }
      );
    }

    const consultationMessage =
      !isRegistration && typeof message === "string" ? message.trim() : "";

    const registrationGoalsRaw =
      typeof goalsField === "string"
        ? goalsField.trim()
        : isRegistration && typeof message === "string"
          ? message.trim()
          : "";

    const experience =
      isRegistration && typeof experienceLevel === "string"
        ? experienceLevel.trim() || null
        : null;

    const goals = isRegistration ? registrationGoalsRaw || null : null;

    const leadSource = isRegistration ? "bootcamp_registration" : "website";
    const formType = isRegistration ? "registration" : "consultation";
    const agreedAt =
      isRegistration && agreeTerms === true ? new Date().toISOString() : null;

    const leadData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service_interest: isRegistration ? "Coding Bootcamp" : service || null,
      message: consultationMessage || null,
      goals,
      experience_level: experience,
      source: leadSource,
      form_type: formType,
    };

    const row = {
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      service_interest: leadData.service_interest,
      message: leadData.message,
      goals: leadData.goals,
      experience_level: leadData.experience_level,
      agreed_terms_at: agreedAt,
      form_type: formType,
      source: leadSource,
      contacted: false,
      created_at: new Date().toISOString(),
    };

    const { data: inserted, error } = await getSupabase()
      .from("website_leads")
      .insert(row)
      .select(
        "id, name, email, phone, service_interest, message, goals, experience_level, form_type, source"
      )
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const syncResult = await syncWebsiteLeadToCrm(inserted, attribution);
    if (!syncResult.ok && !syncResult.skipped) {
      console.error("Website lead saved but CRM sync failed:", syncResult.error);
    }

    // Must await Resend sends: serverless freezes after response; fire-and-forget often never completes.
    const [adminOk, customerOk] = await Promise.all([
      sendEmailNotification(leadData),
      sendCustomerEmail(leadData),
    ]);
    if (!adminOk || !customerOk) {
      console.error("Lead saved but email issue:", { adminOk, customerOk, email: leadData.email });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving lead:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
