import { escapeHtml } from "@/lib/escape-html";
import {
  COMPANY_NAME,
  DASHBOARD_LEADS_URL,
  EMAIL_BRAND,
  EMAIL_FONTS,
  FOUNDER_NAME,
  formatLeadTimestamp,
  formatServiceLabel,
  phoneToWhatsAppUrl,
  SITE_URL,
  WA_CHAT_URL,
  WA_NUMBER_DISPLAY,
} from "@/lib/email-constants";

function emailDocument({ title, preheader, bodyHtml }) {
  const t = escapeHtml(title);
  const pre = escapeHtml(preheader);
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${t}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${EMAIL_BRAND.surface};font-family:${EMAIL_FONTS.body};color:${EMAIL_BRAND.text};line-height:1.6;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${pre}&#847;&zwnj;&nbsp;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${EMAIL_BRAND.surface};padding:32px 16px;">
    <tr>
      <td align="center">${bodyHtml}</td>
    </tr>
  </table>
</body>
</html>`;
}

function brandHeader() {
  return `
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${EMAIL_BRAND.white};border-radius:12px 12px 0 0;overflow:hidden;">
  <tr>
    <td style="background-color:${EMAIL_BRAND.blue};padding:28px 32px;text-align:center;">
      <p style="margin:0;font-family:${EMAIL_FONTS.heading};font-size:13px;font-weight:700;letter-spacing:0.22em;color:${EMAIL_BRAND.white};text-transform:uppercase;">BUILD WITH INNOCENT</p>
    </td>
  </tr>
  <tr>
    <td style="height:4px;background-color:${EMAIL_BRAND.green};font-size:0;line-height:0;">&nbsp;</td>
  </tr>
</table>`;
}

function brandFooter({ includeUnsubscribe = false }) {
  const year = new Date().getFullYear();
  return `
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${EMAIL_BRAND.white};border-radius:0 0 12px 12px;border-top:1px solid ${EMAIL_BRAND.border};">
  <tr>
    <td style="padding:24px 32px;background-color:${EMAIL_BRAND.greenTint};">
      <p style="margin:0;font-family:${EMAIL_FONTS.heading};font-size:15px;font-weight:700;color:${EMAIL_BRAND.blue};">${escapeHtml(FOUNDER_NAME)}</p>
      <p style="margin:4px 0 0;font-size:13px;color:${EMAIL_BRAND.green};font-weight:600;">Founder · ${escapeHtml(COMPANY_NAME)}</p>
      <p style="margin:12px 0 0;font-size:13px;color:${EMAIL_BRAND.textMuted};">
        WhatsApp: <a href="${WA_CHAT_URL}" style="color:${EMAIL_BRAND.blue};text-decoration:none;font-weight:600;">${escapeHtml(WA_NUMBER_DISPLAY)}</a>
        &nbsp;·&nbsp;
        <a href="${SITE_URL}" style="color:${EMAIL_BRAND.blue};text-decoration:none;font-weight:600;">${SITE_URL.replace("https://", "")}</a>
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding:16px 32px 28px;text-align:center;">
      <p style="margin:0;font-size:11px;color:${EMAIL_BRAND.textMuted};line-height:1.5;">
        © ${year} ${escapeHtml(COMPANY_NAME)} · Accra, Ghana<br />
        You received this because a form was submitted on our website.
        ${includeUnsubscribe ? `<br /><a href="mailto:hello@buildwithinnocent.com?subject=Unsubscribe" style="color:${EMAIL_BRAND.textMuted};">Unsubscribe from updates</a>` : ""}
      </p>
    </td>
  </tr>
</table>`;
}

function btnPrimary(href, label) {
  return `<a href="${href}" target="_blank" style="display:inline-block;background-color:${EMAIL_BRAND.green};color:${EMAIL_BRAND.white}!important;font-family:${EMAIL_FONTS.heading};font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:8px;mso-padding-alt:0;">${escapeHtml(label)}</a>`;
}

function btnSecondary(href, label) {
  return `<a href="${href}" target="_blank" style="display:inline-block;background-color:${EMAIL_BRAND.white};color:${EMAIL_BRAND.blue}!important;font-family:${EMAIL_FONTS.heading};font-size:14px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:8px;border:2px solid ${EMAIL_BRAND.blue};margin-left:8px;mso-padding-alt:0;">${escapeHtml(label)}</a>`;
}

function detailRow(label, valueHtml) {
  return `
<tr>
  <td style="padding:12px 0;border-bottom:1px solid ${EMAIL_BRAND.border};vertical-align:top;width:38%;">
    <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${EMAIL_BRAND.green};">${escapeHtml(label)}</p>
  </td>
  <td style="padding:12px 0;border-bottom:1px solid ${EMAIL_BRAND.border};vertical-align:top;">
    <p style="margin:0;font-size:15px;color:${EMAIL_BRAND.text};">${valueHtml}</p>
  </td>
</tr>`;
}

function normalizeLead(leadData) {
  const isRegistration =
    leadData.source === "bootcamp_registration" || leadData.form_type === "registration";
  const waUrl = phoneToWhatsAppUrl(leadData.phone);
  const serviceLabel = formatServiceLabel(leadData.service_interest);
  const submittedAt = formatLeadTimestamp(
    leadData.submitted_at ? new Date(leadData.submitted_at) : new Date()
  );

  return {
    isRegistration,
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    serviceLabel,
    message: leadData.message || "",
    goals: leadData.goals || "",
    experience: leadData.experience_level || "",
    waUrl,
    submittedAt,
  };
}

/**
 * Template A — New lead notification (admin).
 */
export function buildAdminLeadEmailHtml(leadData) {
  const n = normalizeLead(leadData);
  const name = escapeHtml(n.name);
  const email = escapeHtml(n.email);
  const phone = escapeHtml(n.phone);
  const service = escapeHtml(n.serviceLabel);
  const message = escapeHtml(n.isRegistration ? n.goals || "—" : n.message || "—");
  const experience = escapeHtml(n.experience || "—");
  const submitted = escapeHtml(n.submittedAt);
  const badge = n.isRegistration ? "BOOTCAMP REGISTRATION" : "NEW INQUIRY";
  const headline = n.isRegistration
    ? `${name} registered for the bootcamp`
    : `New inquiry from ${name}`;

  const experienceRow = n.isRegistration
    ? detailRow("Experience level", experience)
    : "";

  const body = `
${brandHeader()}
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${EMAIL_BRAND.white};">
  <tr>
    <td style="padding:28px 32px 8px;">
      <p style="margin:0 0 8px;font-family:${EMAIL_FONTS.heading};font-size:11px;font-weight:700;letter-spacing:0.12em;color:${EMAIL_BRAND.green};">${badge}</p>
      <h1 style="margin:0;font-family:${EMAIL_FONTS.heading};font-size:22px;line-height:1.3;color:${EMAIL_BRAND.blue};font-weight:700;">${headline}</h1>
      <p style="margin:12px 0 0;font-size:14px;color:${EMAIL_BRAND.textMuted};">Submitted ${submitted}</p>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 32px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${EMAIL_BRAND.surface};border-radius:10px;border:1px solid ${EMAIL_BRAND.border};">
        <tr><td style="padding:8px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            ${detailRow("Contact name", `<strong style="color:${EMAIL_BRAND.blue};">${name}</strong>`)}
            ${detailRow("Email", `<a href="mailto:${email}" style="color:${EMAIL_BRAND.blue};font-weight:600;text-decoration:none;">${email}</a>`)}
            ${detailRow("Phone", `<a href="tel:${phone.replace(/\s/g, "")}" style="color:${EMAIL_BRAND.text};text-decoration:none;">${phone}</a>`)}
            ${detailRow("WhatsApp", `<a href="${n.waUrl}" style="color:${EMAIL_BRAND.green};font-weight:600;text-decoration:none;">Message on WhatsApp</a>`)}
            ${detailRow("Service interest", service)}
            ${experienceRow}
            ${detailRow(n.isRegistration ? "Goals / notes" : "Message", `<span style="white-space:pre-wrap;">${message}</span>`)}
            ${detailRow("Submitted", submitted)}
          </table>
        </td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:0 32px 32px;text-align:center;">
      ${btnPrimary(n.waUrl, "Reply on WhatsApp")}
      <!--[if mso]>&nbsp;&nbsp;<![endif]-->
      ${btnSecondary(DASHBOARD_LEADS_URL, "View in Dashboard")}
    </td>
  </tr>
</table>
${brandFooter({ includeUnsubscribe: true })}`;

  return emailDocument({
    title: n.isRegistration ? "Bootcamp registration" : "New inquiry",
    preheader: headline,
    bodyHtml: body,
  });
}

export function buildAdminLeadEmailText(leadData) {
  const n = normalizeLead(leadData);
  const lines = [
    n.isRegistration ? "BOOTCAMP REGISTRATION" : "NEW INQUIRY",
    "—".repeat(40),
    `Name: ${n.name}`,
    `Email: ${n.email}`,
    `Phone: ${n.phone}`,
    `WhatsApp: ${n.waUrl}`,
    `Service: ${n.serviceLabel}`,
  ];
  if (n.isRegistration) {
    lines.push(`Experience: ${n.experience || "—"}`, `Goals: ${n.goals || "—"}`);
  } else {
    lines.push(`Message: ${n.message || "—"}`);
  }
  lines.push(
    `Submitted: ${n.submittedAt}`,
    "",
    `Reply on WhatsApp: ${n.waUrl}`,
    `Dashboard: ${DASHBOARD_LEADS_URL}`,
    "",
    `${FOUNDER_NAME} · ${COMPANY_NAME}`,
    SITE_URL
  );
  return lines.join("\n");
}

/**
 * Template B — Customer acknowledgement.
 */
export function buildCustomerLeadEmailHtml(leadData) {
  const n = normalizeLead(leadData);
  const firstName = escapeHtml(n.name.split(/\s+/)[0] || n.name);
  const service = escapeHtml(n.serviceLabel);

  if (!n.isRegistration) {
    const body = `
${brandHeader()}
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${EMAIL_BRAND.white};">
  <tr>
    <td style="padding:36px 32px 12px;">
      <p style="margin:0;font-size:16px;color:${EMAIL_BRAND.text};line-height:1.7;">I have this. I will reply within one business day.</p>
      <p style="margin:28px 0 0;font-size:16px;color:${EMAIL_BRAND.blue};font-weight:700;">— Innocent</p>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 32px 36px;">
      <p style="margin:0;font-size:13px;color:${EMAIL_BRAND.textMuted};">
        <a href="${SITE_URL}" style="color:${EMAIL_BRAND.blue};font-weight:600;text-decoration:none;">buildwithinnocent.com</a>
      </p>
    </td>
  </tr>
</table>
${brandFooter({ includeUnsubscribe: true })}`;

    return emailDocument({
      title: "I have this — Innocent Golden",
      preheader: "I have this. I will reply within one business day.",
      bodyHtml: body,
    });
  }

  const intro = `Thank you for registering for the <strong style="color:${EMAIL_BRAND.blue};">Build With Innocent Coding Bootcamp</strong>. Your application is confirmed.`;
  const summaryExtra = `
<tr><td style="padding:10px 0;font-size:13px;color:${EMAIL_BRAND.textMuted};">Experience</td>
<td align="right" style="padding:10px 0;font-size:14px;color:${EMAIL_BRAND.text};">${escapeHtml(n.experience || "—")}</td></tr>
<tr><td colspan="2" style="padding:8px 0 0;font-size:13px;color:${EMAIL_BRAND.textMuted};">Your goals</td></tr>
<tr><td colspan="2" style="padding:6px 0;font-size:14px;color:${EMAIL_BRAND.text};background:${EMAIL_BRAND.surface};border-radius:8px;padding:12px;border-left:3px solid ${EMAIL_BRAND.green};">${escapeHtml(n.goals || "—")}</td></tr>`;

  const body = `
${brandHeader()}
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${EMAIL_BRAND.white};">
  <tr>
    <td style="padding:32px 32px 12px;">
      <p style="margin:0;font-family:${EMAIL_FONTS.heading};font-size:20px;font-weight:700;color:${EMAIL_BRAND.blue};">Hello ${firstName}!</p>
      <p style="margin:16px 0 0;font-size:16px;color:${EMAIL_BRAND.text};line-height:1.65;">${intro}</p>
    </td>
  </tr>
  <tr>
    <td style="padding:12px 32px 20px;">
      <p style="margin:0 0 12px;font-family:${EMAIL_FONTS.heading};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${EMAIL_BRAND.green};">Your request summary</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${EMAIL_BRAND.surface};border-radius:10px;border:1px solid ${EMAIL_BRAND.border};padding:4px 20px;">
        <tr><td style="padding:10px 0;font-size:13px;color:${EMAIL_BRAND.textMuted};">Service</td>
        <td align="right" style="padding:10px 0;font-size:14px;font-weight:600;color:${EMAIL_BRAND.blue};">${service}</td></tr>
        ${summaryExtra}
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:0 32px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${EMAIL_BRAND.greenTint};border-radius:10px;border-left:4px solid ${EMAIL_BRAND.green};">
        <tr><td style="padding:18px 20px;">
          <p style="margin:0 0 8px;font-family:${EMAIL_FONTS.heading};font-size:14px;font-weight:700;color:${EMAIL_BRAND.blue};">What happens next</p>
          <p style="margin:0;font-size:14px;color:${EMAIL_BRAND.text};line-height:1.6;">I will contact you within <strong>24 hours</strong> on WhatsApp to discuss your goals and the best next step for your business.</p>
        </td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:0 32px 32px;text-align:center;">
      <p style="margin:0 0 16px;font-size:14px;color:${EMAIL_BRAND.textMuted};">Prefer to chat now?</p>
      ${btnPrimary(WA_CHAT_URL, "Chat on WhatsApp")}
      <p style="margin:20px 0 0;font-size:14px;color:${EMAIL_BRAND.textMuted};">
        <a href="${SITE_URL}" style="color:${EMAIL_BRAND.blue};font-weight:700;text-decoration:none;">buildwithinnocent.com</a>
      </p>
    </td>
  </tr>
</table>
${brandFooter({ includeUnsubscribe: true })}`;

  return emailDocument({
    title: "Thank you — Build With Innocent",
    preheader: "Bootcamp registration confirmed",
    bodyHtml: body,
  });
}

export function buildCustomerLeadEmailText(leadData) {
  const n = normalizeLead(leadData);
  const firstName = n.name.split(/\s+/)[0] || n.name;
  if (!n.isRegistration) {
    return ["I have this. I will reply within one business day.", "", "— Innocent", SITE_URL].join("\n");
  }
  const lines = [
    `Hello ${firstName}!`,
    "",
    "Thank you for registering for the Build With Innocent Coding Bootcamp.",
    "",
    "YOUR REQUEST SUMMARY",
    `Service: ${n.serviceLabel}`,
    `Experience: ${n.experience || "—"}`,
    `Goals: ${n.goals || "—"}`,
    "",
    "WHAT HAPPENS NEXT",
    "I will contact you within 24 hours on WhatsApp.",
    "",
    `Chat on WhatsApp: ${WA_CHAT_URL}`,
    `Portfolio: ${SITE_URL}`,
    "",
    `${FOUNDER_NAME}`,
    `Founder · ${COMPANY_NAME}`,
    WA_NUMBER_DISPLAY,
    SITE_URL,
  ];
  return lines.join("\n");
}
