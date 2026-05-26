/**
 * Transactional email constants — Build With Innocent.
 */

export const EMAIL_BRAND = {
  blue: "#1E3A5F",
  green: "#2E7D32",
  white: "#FFFFFF",
  text: "#333333",
  textMuted: "#64748B",
  border: "#E2E8F0",
  surface: "#F8FAFC",
  greenTint: "#E8F5E9",
};

export const EMAIL_FONTS = {
  heading:
    "'Montserrat', 'Poppins', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  body: "Arial, Helvetica, 'Segoe UI', Roboto, sans-serif",
};

export const SITE_URL = "https://buildwithinnocent.com";
export const DASHBOARD_LEADS_URL = "https://buildwithinnocent.com/internal/leads";
export const WA_NUMBER_DISPLAY = "+233 530 710 628";
export const WA_NUMBER_E164 = "233530710628";
export const WA_CHAT_URL = `https://wa.me/${WA_NUMBER_E164}`;

export const FOUNDER_NAME = "Innocent Golden";
export const COMPANY_NAME = "Build With Innocent";
export const COMPANY_TAGLINE = "Digital Business Systems for African Enterprises";

/** Maps form `service` values to human-readable labels. */
export const SERVICE_LABELS = {
  website: "Modern Website",
  whatsapp: "WhatsApp AI Automation",
  dashboard: "Business Dashboard",
  bootcamp: "Coding Bootcamp (8 weeks)",
  custom: "Custom Software",
  other: "Other / Not sure",
};

export function formatServiceLabel(serviceInterest) {
  if (!serviceInterest) return "Not specified";
  const key = String(serviceInterest).trim().toLowerCase();
  if (SERVICE_LABELS[key]) return SERVICE_LABELS[key];
  return String(serviceInterest).trim();
}

export function formatLeadTimestamp(date = new Date()) {
  return date.toLocaleString("en-GH", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function phoneToWhatsAppUrl(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : WA_CHAT_URL;
}
