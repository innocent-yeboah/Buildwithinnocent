/**
 * Resend API helper for lead notifications and cron emails.
 * @see https://resend.com/docs/api-reference/emails/send-email
 */

function getApiKey() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key || key === "re_xxxxxxxx" || key.includes("your-")) {
    return null;
  }
  return key;
}

/** Use Resend sandbox sender until buildwithinnocent.com domain is verified. */
function isSandbox() {
  return process.env.RESEND_USE_SANDBOX === "true";
}

export function getResendFromAddresses() {
  if (isSandbox()) {
    return {
      admin: "Build With Innocent <onboarding@resend.dev>",
      customer: "Build With Innocent <onboarding@resend.dev>",
    };
  }

  return {
    admin:
      process.env.RESEND_FROM_ADMIN?.trim() ||
      "Build With Innocent <notifications@buildwithinnocent.com>",
    customer:
      process.env.RESEND_FROM_CUSTOMER?.trim() ||
      "Build With Innocent <hello@buildwithinnocent.com>",
  };
}

export function getAdminNotificationEmail() {
  return (
    process.env.RESEND_ADMIN_TO?.trim() ||
    process.env.INTERNAL_ADMIN_EMAIL?.trim() ||
    "igtechgh@gmail.com"
  );
}

/**
 * @param {{ from: string; to: string | string[]; subject: string; html: string; replyTo?: string }} opts
 * @returns {Promise<{ ok: boolean; id?: string; error?: string; status?: number }>}
 */
export async function sendResendEmail({ from, to, subject, html, replyTo }) {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set or is still a placeholder — email skipped.");
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const recipients = Array.isArray(to) ? to : [to];

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    const raw = await res.text();
    let body = {};
    try {
      body = JSON.parse(raw || "{}");
    } catch {
      body = { message: raw };
    }

    if (!res.ok) {
      const message =
        body.message ||
        body.error ||
        (typeof body === "string" ? body : JSON.stringify(body));
      console.error("Resend send failed:", {
        status: res.status,
        from,
        to: recipients,
        message,
      });
      return { ok: false, error: message, status: res.status };
    }

    if (body.id) {
      console.info("Resend email queued:", body.id, { to: recipients, subject });
    }

    return { ok: true, id: body.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Resend network error:", message);
    return { ok: false, error: message };
  }
}
