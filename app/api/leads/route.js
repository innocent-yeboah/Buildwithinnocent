import { getSupabase } from "@/lib/supabase";
import { escapeHtml } from "@/lib/escape-html";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/leads-ip";
import { NextResponse } from "next/server";

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
  const namePlain = leadData.name;
  const servicePlain = leadData.service_interest || "";
  const isRegistration = leadData.source === "bootcamp_registration";
  const name = escapeHtml(leadData.name);
  const email = escapeHtml(leadData.email);
  const phone = escapeHtml(leadData.phone);
  const serviceInterest = escapeHtml(leadData.service_interest || "");
  const message = escapeHtml(leadData.message || "");
  const waDigits = String(leadData.phone || "").replace(/\D/g, "");
  const heading = isRegistration ? "New bootcamp registration" : "New lead";

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
        h2 { color: #1E3A5F; border-bottom: 2px solid #2E7D32; padding-bottom: 10px; }
        .label { font-weight: bold; color: #1E3A5F; margin-top: 15px; }
        .value { background: #f5f5f5; padding: 10px; border-radius: 5px; margin-top: 5px; }
        .footer { margin-top: 20px; font-size: 12px; color: #888; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>${heading}</h2>
        <div class="label">Name:</div>
        <div class="value">${name}</div>
        <div class="label">Email:</div>
        <div class="value">${email}</div>
        <div class="label">Phone:</div>
        <div class="value">${phone}</div>
        <div class="label">Service interest:</div>
        <div class="value">${serviceInterest || "Not specified"}</div>
        <div class="label">Message:</div>
        <div class="value">${message || "No message provided"}</div>
        <div class="label">Submitted:</div>
        <div class="value">${escapeHtml(new Date().toLocaleString("en-GH"))}</div>
        <div class="footer">
          Reply via WhatsApp: <a href="https://wa.me/${escapeHtml(waDigits)}">WhatsApp ${phone}</a>
        </div>
      </div>
    </body>
    </html>
  `;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set; skipping admin notification email.");
    return false;
  }

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
          ? `Bootcamp registration: ${namePlain}`
          : `New lead: ${namePlain} — ${servicePlain || "software"}`,
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
  const namePlain = leadData.name;
  const isRegistration = leadData.source === "bootcamp_registration";
  const name = escapeHtml(leadData.name);
  const phone = escapeHtml(leadData.phone);
  const serviceInterest = escapeHtml(leadData.service_interest || "");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
        .header { background-color: #1E3A5F; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
        .content { padding: 30px; background-color: #ffffff; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px; }
        .greeting { font-size: 20px; font-weight: bold; color: #1E3A5F; margin-bottom: 20px; }
        .message { margin-bottom: 20px; color: #555; }
        .details { background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2E7D32; }
        .whatsapp-button { background-color: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #888; }
        .signature { margin-top: 20px; font-weight: bold; color: #1E3A5F; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Build With Innocent</h1></div>
        <div class="content">
          <div class="greeting">Hello ${name}!</div>
          <div class="message">${
            isRegistration
              ? `Thank you for registering interest in the <strong>Build With Innocent Bootcamp</strong>. I have received your details and will follow up with next steps (curriculum and payment options).`
              : `Thank you for reaching out to <strong>Build With Innocent</strong>. I have received your request and am excited to help you grow your business.`
          }</div>
          <div class="details">
            <p><strong>Your request summary:</strong></p>
            <p>• Service requested: <strong>${serviceInterest || (isRegistration ? "Coding Bootcamp" : "Consultation")}</strong></p>
            <p>• Contact number: <strong>${phone}</strong></p>
            <p>• Submitted on: <strong>${escapeHtml(new Date().toLocaleString("en-GH"))}</strong></p>
          </div>
          <div class="message"><strong>What happens next?</strong></div>
          <div class="message">I will contact you via WhatsApp within <strong>24 hours</strong> to discuss your needs in detail.<br><br>If you need immediate assistance, you can reach me directly:</div>
          <div style="text-align: center;">
            <a href="https://wa.me/233530710628" class="whatsapp-button">Chat with me on WhatsApp</a>
          </div>
          <div class="message">While you wait, explore completed projects at:<br><a href="https://buildwithinnocent.com" style="color: #1E3A5F;">buildwithinnocent.com</a></div>
          <div class="signature">
            Best regards,<br>
            <strong style="color: #2E7D32;">Innocent Golden</strong><br>
            Founder, Build With Innocent
          </div>
        </div>
        <div class="footer">
          <p>© 2026 Build With Innocent. All rights reserved.</p>
          <p>You received this email because you submitted a form on our website.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set; skipping customer acknowledgment email.");
    return false;
  }

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
          ? `Bootcamp — thanks ${namePlain}! I received your registration`
          : `Thank you, ${namePlain}! I've received your request`,
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

    let composedMessage = typeof message === "string" ? message.trim() : "";
    if (isRegistration) {
      const exp =
        typeof experienceLevel === "string" ? experienceLevel.trim() : "";
      const header = `[Bootcamp registration]\nExperience level: ${exp || "Not specified"}`;
      composedMessage = composedMessage ? `${header}\n\n${composedMessage}` : header;
    }

    const leadSource = isRegistration ? "bootcamp_registration" : "website";

    const leadData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service_interest: isRegistration ? "Coding Bootcamp" : service || null,
      message: composedMessage || null,
      source: leadSource,
    };

    const { error } = await getSupabase()
      .from("leads")
      .insert({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        service_interest: leadData.service_interest,
        message: leadData.message,
        source: leadSource,
        contacted: false,
        created_at: new Date().toISOString(),
      });

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
