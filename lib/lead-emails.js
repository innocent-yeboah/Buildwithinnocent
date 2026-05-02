import { escapeHtml } from "@/lib/escape-html";
import { BRAND, WA_PRIMARY } from "@/lib/brand";

function emailShell({ title, preheader, innerHtml }) {
  const t = escapeHtml(title);
  const pre = escapeHtml(preheader);
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${t}</title>
  <!--[if mso]><style type="text/css">body, table, td { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${BRAND.surface};font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.body};line-height:1.55;">
  <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0">${pre}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.surface};padding:24px 12px;">
    <tr>
      <td align="center">
        ${innerHtml}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function btnMaroon(href, label) {
  return `
<a href="${href}" style="display:inline-block;background:${BRAND.maroon};color:${BRAND.white}!important;text-decoration:none;font-weight:700;padding:14px 26px;border-radius:10px;font-size:15px;mso-padding-alt:0;">
  ${escapeHtml(label)}
</a>`;
}

/**
 * @param {object} leadData
 * @param {string} leadData.name
 * @param {string} leadData.email
 * @param {string} leadData.phone
 * @param {string|null} leadData.service_interest
 * @param {string|null} leadData.message
 * @param {string|null} leadData.goals
 * @param {string|null} leadData.experience_level
 * @param {string} leadData.source
 * @param {string} leadData.form_type
 */
export function buildAdminLeadEmailHtml(leadData) {
  const isRegistration =
    leadData.source === "bootcamp_registration" || leadData.form_type === "registration";
  const name = escapeHtml(leadData.name);
  const email = escapeHtml(leadData.email);
  const phone = escapeHtml(leadData.phone);
  const service = escapeHtml(leadData.service_interest || "");
  const message = escapeHtml(leadData.message || "");
  const goals = escapeHtml(leadData.goals || "");
  const exp = escapeHtml(leadData.experience_level || "");
  const waDigits = String(leadData.phone || "").replace(/\D/g, "");
  const when = escapeHtml(new Date().toLocaleString("en-GH"));
  const badge = isRegistration ? "BOOTCAMP REGISTRATION" : "NEW LEAD";
  const headline = isRegistration ? `${name} registered for the bootcamp` : `${name} requested a consultation`;

  const innerHtml = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND.white};border-radius:14px;overflow:hidden;border:1px solid ${BRAND.border};box-shadow:0 8px 24px rgba(17,39,76,0.08);">
  <tr>
    <td style="background:${BRAND.navy};padding:20px 24px;">
      <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.16em;color:#86efac;">${badge}</p>
      <h1 style="margin:8px 0 0;font-size:20px;line-height:1.25;color:${BRAND.white};">${headline}</h1>
    </td>
  </tr>
  <tr>
    <td style="padding:22px 24px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:${BRAND.green};padding-bottom:4px;">Contact</td></tr>
        <tr><td style="font-size:15px;color:${BRAND.navy};font-weight:600;">${name}</td></tr>
        <tr><td style="padding-top:10px;font-size:14px;"><a href="mailto:${email}" style="color:${BRAND.green};font-weight:600;">${email}</a></td></tr>
        <tr><td style="padding-top:6px;font-size:14px;"><a href="https://wa.me/${waDigits}" style="color:${BRAND.maroon};font-weight:600;">${phone}</a> · WhatsApp</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:0 24px 16px;">
      <div style="height:1px;background:${BRAND.border};"></div>
    </td>
  </tr>
  <tr>
    <td style="padding:0 24px 18px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:${BRAND.green};">Interest</p>
      <p style="margin:0;font-size:15px;color:${BRAND.bodyDark};">${service || "—"}</p>
      ${
        isRegistration
          ? `
      <p style="margin:14px 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:${BRAND.green};">Experience</p>
      <p style="margin:0;font-size:14px;color:${BRAND.bodyDark};background:${BRAND.surface};padding:12px 14px;border-radius:10px;border-left:4px solid ${BRAND.green};">${exp || "Not specified"}</p>
      <p style="margin:14px 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:${BRAND.green};">Goals / notes</p>
      <p style="margin:0;font-size:14px;color:${BRAND.bodyDark};background:${BRAND.surface};padding:12px 14px;border-radius:10px;border-left:4px solid ${BRAND.maroon};">${goals || "—"}</p>`
          : `
      <p style="margin:14px 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:${BRAND.green};">Message</p>
      <p style="margin:0;font-size:14px;color:${BRAND.bodyDark};background:${BRAND.surface};padding:12px 14px;border-radius:10px;border-left:4px solid ${BRAND.green};white-space:pre-wrap;">${message || "—"}</p>`
      }
      <p style="margin:18px 0 0;font-size:12px;color:${BRAND.body};">Submitted · ${when}${isRegistration ? ' · Terms accepted' : ''}</p>
    </td>
  </tr>
  <tr>
    <td style="padding:18px 24px 22px;background:${BRAND.greenTint};text-align:center;">
      ${btnMaroon(`https://wa.me/${waDigits}`, "Reply on WhatsApp")}
    </td>
  </tr>
</table>
<p style="max-width:560px;margin:16px auto 0;text-align:center;font-size:11px;color:${BRAND.body};">Build With Innocent · buildwithinnocent.com</p>`;

  return emailShell({
    title: isRegistration ? "Bootcamp registration" : "New lead",
    preheader: headline,
    innerHtml,
  });
}

export function buildCustomerLeadEmailHtml(leadData) {
  const isRegistration =
    leadData.source === "bootcamp_registration" || leadData.form_type === "registration";
  const name = escapeHtml(leadData.name);
  const phone = escapeHtml(leadData.phone);
  const service = escapeHtml(leadData.service_interest || "");
  const exp = escapeHtml(leadData.experience_level || "");
  const goals = escapeHtml(leadData.goals || "");

  const greeting = `Hello ${name}!`;
  const intro = isRegistration
    ? `Thank you for signing up for the <strong style="color:${BRAND.navy};">Build With Innocent Bootcamp</strong>. Your seat request is in — I will personally follow up with the syllabus, cohort timing, and payment options.`
    : `Thank you for reaching out to <strong style="color:${BRAND.navy};">Build With Innocent</strong>. Your consultation request is logged and I am excited to explore how we can tighten your systems.`;

  const nextBlock = isRegistration
    ? `<p style="margin:0 0 12px;"><strong style="color:${BRAND.navy};">What happens next?</strong></p>
       <ul style="margin:0;padding-left:18px;color:${BRAND.bodyDark};font-size:14px;">
         <li style="margin-bottom:8px;">Expect a WhatsApp message within <strong>24 hours</strong> with curriculum details.</li>
         <li style="margin-bottom:8px;">We will align on start date and payment plan (installments available).</li>
         <li>Bring consistency and your laptop — no prior degree required.</li>
       </ul>`
    : `<p style="margin:0 0 12px;"><strong style="color:${BRAND.navy};">What happens next?</strong></p>
       <p style="margin:0;color:${BRAND.bodyDark};font-size:14px;">I will reach out on WhatsApp within <strong>24 hours</strong> to understand your business and sketch a realistic path — often starting with a small prototype you can try.</p>`;

  const summaryRows = isRegistration
    ? `
<tr><td style="padding:8px 0;font-size:13px;color:${BRAND.body};">Program</td><td align="right" style="padding:8px 0;font-size:14px;font-weight:600;color:${BRAND.navy};">${service || "Coding Bootcamp"}</td></tr>
<tr><td style="padding:8px 0;font-size:13px;color:${BRAND.body};">Experience</td><td align="right" style="padding:8px 0;font-size:14px;color:${BRAND.bodyDark};">${exp || "—"}</td></tr>
<tr><td colspan="2" style="padding:12px 0 0;font-size:13px;color:${BRAND.body};">Your notes</td></tr>
<tr><td colspan="2" style="padding:6px 0 0;font-size:14px;color:${BRAND.bodyDark};background:${BRAND.surface};border-radius:10px;padding:12px;border-left:4px solid ${BRAND.green};">${goals || "—"}</td></tr>`
    : `
<tr><td style="padding:8px 0;font-size:13px;color:${BRAND.body};">Focus</td><td align="right" style="padding:8px 0;font-size:14px;font-weight:600;color:${BRAND.navy};">${service || "Consultation"}</td></tr>
<tr><td style="padding:8px 0;font-size:13px;color:${BRAND.body};">WhatsApp</td><td align="right" style="padding:8px 0;font-size:14px;color:${BRAND.bodyDark};">${phone}</td></tr>`;

  const innerHtml = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND.white};border-radius:14px;overflow:hidden;border:1px solid ${BRAND.border};box-shadow:0 8px 24px rgba(17,39,76,0.06);">
  <tr>
    <td style="background:linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.navyMuted} 100%);padding:28px 24px;text-align:center;">
      <p style="margin:0;font-size:22px;font-weight:800;letter-spacing:-0.02em;color:${BRAND.white};">Build With Innocent</p>
      <p style="margin:10px 0 0;font-size:13px;color:#cbd5e1;font-weight:500;">Systems · Software · Bootcamp</p>
    </td>
  </tr>
  <tr>
    <td style="padding:26px 24px 8px;">
      <p style="margin:0;font-size:18px;font-weight:700;color:${BRAND.navy};">${greeting}</p>
      <p style="margin:14px 0 0;font-size:15px;color:${BRAND.bodyDark};">${intro}</p>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 24px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.surface};border-radius:12px;padding:16px 18px;border:1px solid ${BRAND.border};">
        ${summaryRows}
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:0 24px 18px;">
      ${nextBlock}
    </td>
  </tr>
  <tr>
    <td style="padding:0 24px 26px;text-align:center;">
      <p style="margin:0 0 14px;font-size:13px;color:${BRAND.body};">Need me sooner? Tap WhatsApp below — same line as on the site.</p>
      ${btnMaroon(WA_PRIMARY, "Chat on WhatsApp")}
      <p style="margin:18px 0 0;font-size:13px;color:${BRAND.body};">Browse live builds: <a href="https://buildwithinnocent.com" style="color:${BRAND.green};font-weight:700;">buildwithinnocent.com</a></p>
    </td>
  </tr>
  <tr>
    <td style="padding:18px 24px;background:${BRAND.greenTint};border-top:1px solid ${BRAND.border};">
      <p style="margin:0;font-size:14px;font-weight:700;color:${BRAND.navy};">Innocent Golden</p>
      <p style="margin:4px 0 0;font-size:13px;color:${BRAND.green};font-weight:600;">Founder · Build With Innocent</p>
    </td>
  </tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin-top:14px;">
  <tr>
    <td style="text-align:center;font-size:11px;color:${BRAND.body};line-height:1.5;">
      You received this because you submitted a form on our website.<br />
      © ${new Date().getFullYear()} Build With Innocent · Accra, Ghana
    </td>
  </tr>
</table>`;

  return emailShell({
    title: "Thanks from Build With Innocent",
    preheader: isRegistration ? "Bootcamp registration received" : "We received your message",
    innerHtml,
  });
}
