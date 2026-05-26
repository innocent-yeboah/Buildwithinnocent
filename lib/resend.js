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
export function isResendSandbox() {
  return process.env.RESEND_USE_SANDBOX === "true";
}

export function getResendFromAddresses() {
  if (isResendSandbox()) {
    return {
      admin: "Build With Innocent <onboarding@resend.dev>",
      customer: "Build With Innocent <onboarding@resend.dev>",
    };
  }

  return {
    admin:
      process.env.RESEND_FROM_ADMIN?.trim() ||
      "Innocent Golden <innocent@buildwithinnocent.com>",
    customer:
      process.env.RESEND_FROM_CUSTOMER?.trim() ||
      "Build With Innocent <hello@buildwithinnocent.com>",
  };
}

export function getDefaultReplyTo() {
  return (
    process.env.RESEND_REPLY_TO?.trim() ||
    "innocent@buildwithinnocent.com"
  );
}

export function getAdminNotificationEmail() {
  return (
    process.env.RESEND_ADMIN_TO?.trim() ||
    process.env.INTERNAL_ADMIN_EMAIL?.trim() ||
    "igtechgh@gmail.com"
  );
}

/**
 * Optional 1×1 open-tracking pixel URL (Resend domain open tracking is preferred).
 * @returns {string|undefined}
 */
export function getOpenTrackingPixelUrl() {
  const url = process.env.RESEND_OPEN_TRACKING_PIXEL_URL?.trim();
  return url || undefined;
}

/**
 * @param {{
 *   from: string;
 *   to: string | string[];
 *   subject: string;
 *   html: string;
 *   text?: string;
 *   replyTo?: string;
 *   headers?: Record<string, string>;
 *   tags?: { name: string; value: string }[];
 *   listUnsubscribe?: string;
 * }} opts
 * @returns {Promise<{ ok: boolean; id?: string; error?: string; status?: number }>}
 */
export async function sendResendEmail({
  from,
  to,
  subject,
  html,
  text,
  replyTo,
  headers = {},
  tags,
  listUnsubscribe,
}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set or is still a placeholder — email skipped.");
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const recipients = Array.isArray(to) ? to : [to];
  const pixelUrl = getOpenTrackingPixelUrl();
  let htmlBody = html;
  if (pixelUrl) {
    htmlBody += `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;margin:0;padding:0;" />`;
  }

  const mergedHeaders = { ...headers };
  if (listUnsubscribe) {
    mergedHeaders["List-Unsubscribe"] = listUnsubscribe;
    mergedHeaders["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

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
        html: htmlBody,
        ...(text ? { text } : {}),
        ...(replyTo ? { reply_to: replyTo } : {}),
        ...(Object.keys(mergedHeaders).length > 0 ? { headers: mergedHeaders } : {}),
        ...(tags?.length ? { tags } : {}),
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
