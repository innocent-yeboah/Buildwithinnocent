/**
 * Build With Innocent — brand tokens (site + transactional email).
 * Primary blue / secondary green — Digital Business Systems for African Enterprises.
 */
export const BRAND = {
  navy: "#1E3A5F",
  navyMuted: "#172E4C",
  green: "#2E7D32",
  greenMuted: "#256628",
  greenTint: "#e8f5e9",
  maroon: "#710628",
  maroonMuted: "#5c0520",
  surface: "#f9fafb",
  body: "#475569",
  bodyDark: "#334155",
  border: "#e2e8f0",
  white: "#ffffff",
};

/** Innocent — direct human support */
export const WA_HUMAN_E164 = "233530710628";
export const WA_HUMAN_DISPLAY = "+233 530 710 628";
export const WA_PRIMARY = `https://wa.me/${WA_HUMAN_E164}`;

/** WhatsApp AI Sales Assistant — automated replies */
export const WA_AI_E164 = "233530453400";
export const WA_AI_DISPLAY = "+233 530 453 400";
export const WA_AI_PREFILL_MESSAGE =
  "Hello! I'm interested in building a digital business system for my business.";
export const WA_AI_CHAT_URL = `https://wa.me/${WA_AI_E164}?text=${encodeURIComponent(WA_AI_PREFILL_MESSAGE)}`;
