import { getSupabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/leads-ip";
import { NextResponse } from "next/server";
import { buildAdminLeadEmailHtml, buildCustomerLeadEmailHtml } from "@/lib/lead-emails";

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
  const emailHtml = buildAdminLeadEmailHtml(leadData);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set; skipping admin notification email.");
    return false;
  }

  const isRegistration =
    leadData.source === "bootcamp_registration" || leadData.form_type === "registration";
  const namePlain = leadData.name;
  const servicePlain = leadData.service_interest || "";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Build With Innocent <notifications@buildwithinnocent.com>",
        to: ["igtechgh@gmail.com"],
        subject: isRegistration
          ? `Bootcamp registration · ${namePlain}`
          : `New lead · ${namePlain} — ${servicePlain || "software"}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      console.error("Resend error:", await res.text());
    }
    return res.ok;
  } catch (error) {
    console.error("Email notification error:", error);
    return false;
  }
}

async function sendCustomerEmail(leadData) {
  const emailHtml = buildCustomerLeadEmailHtml(leadData);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set; skipping customer acknowledgment email.");
    return false;
  }

  const namePlain = leadData.name;
  const isRegistration =
    leadData.source === "bootcamp_registration" || leadData.form_type === "registration";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Build With Innocent <hello@buildwithinnocent.com>",
        to: [leadData.email],
        subject: isRegistration
          ? `${namePlain}, you're on the bootcamp list (confirmed)`
          : `${namePlain}, thanks — I've got your note`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      console.error("Customer email error:", await res.text());
    }
    return res.ok;
  } catch (error) {
    console.error("Customer email error:", error);
    return false;
  }
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

    const { error } = await getSupabase().from("leads").insert(row);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    sendEmailNotification(leadData).catch((err) => console.error("Admin email failed:", err));
    sendCustomerEmail(leadData).catch((err) => console.error("Customer email failed:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving lead:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
