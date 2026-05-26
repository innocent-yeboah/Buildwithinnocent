/** Build With Innocent — brand tokens (site, OG, email). */

export const COMPANY_NAME = "Build With Innocent";

export const TAGLINE = "Digital Business Systems for African Enterprises";

export const SITE_TITLE = `${COMPANY_NAME} — ${TAGLINE}`;

export const SITE_DESCRIPTION =
  "Custom software, websites, and business operating systems for African enterprises. Free prototype. Based in Accra, Ghana.";

export const BRAND = {
  primary: "#1E3A5F",
  primaryMuted: "#172E4C",
  secondary: "#2E7D32",
  secondaryMuted: "#256628",
  accent: "#FFC107",
  surface: "#f9fafb",
  body: "#475569",
  bodyDark: "#334155",
  border: "#e2e8f0",
  tint: "#e8f5e9",
  white: "#ffffff",
  maroon: "#710628",
  maroonMuted: "#5c0520",
  /** Email templates (lib/lead-emails.js) */
  navy: "#1E3A5F",
  navyMuted: "#172E4C",
  green: "#2E7D32",
  greenMuted: "#256628",
  greenTint: "#e8f5e9",
} as const;

export const WA_HUMAN_E164 = "233530710628";
export const WA_HUMAN_DISPLAY = "+233 530 710 628";
export const WA_PRIMARY = `https://wa.me/${WA_HUMAN_E164}`;

export const WA_AI_E164 = "233530453400";
export const WA_AI_DISPLAY = "+233 530 453 400";
export const WA_AI_PREFILL_MESSAGE =
  "Hello! I'm interested in building a digital business system for my business.";
export const WA_AI_CHAT_URL = `https://wa.me/${WA_AI_E164}?text=${encodeURIComponent(WA_AI_PREFILL_MESSAGE)}`;

export const LOGO = {
  full: "/images/logo-full.png",
  icon: "/images/logo-icon.png",
  fullPublic: "/logo.png",
  iconPublic: "/logo-icon.png",
} as const;
