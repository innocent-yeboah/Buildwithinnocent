const STORAGE_KEY = "bwi_lead_attribution";

const CRM_SOURCE_MAP = {
  linkedin: "linkedin",
  whatsapp: "whatsapp",
  wa: "whatsapp",
  referral: "referral",
  refer: "referral",
  cold_dm: "cold_dm",
  dm: "cold_dm",
  instagram: "other",
  facebook: "other",
  google: "website",
  website: "website",
};

/**
 * Capture first-touch attribution from URL params and referrer (client-side).
 */
export function captureLeadAttribution() {
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }

  const params = new URLSearchParams(window.location.search);
  const attribution = {
    utm_source: params.get("utm_source") || params.get("source") || null,
    utm_medium: params.get("utm_medium") || null,
    utm_campaign: params.get("utm_campaign") || null,
    referrer: typeof document !== "undefined" ? document.referrer || null : null,
    landing_page:
      typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : null,
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    /* ignore */
  }

  return attribution;
}

/**
 * Map UTM / source param to CRM leads.source enum.
 */
export function mapAttributionToCrmSource(attribution) {
  const raw = String(attribution?.utm_source ?? "")
    .toLowerCase()
    .trim();

  if (CRM_SOURCE_MAP[raw]) return CRM_SOURCE_MAP[raw];
  if (raw) return "other";
  return "website";
}

export function buildAttributionNotes(attribution) {
  if (!attribution || typeof attribution !== "object") return null;

  const lines = [];
  if (attribution.utm_source) lines.push(`UTM source: ${attribution.utm_source}`);
  if (attribution.utm_medium) lines.push(`UTM medium: ${attribution.utm_medium}`);
  if (attribution.utm_campaign) lines.push(`UTM campaign: ${attribution.utm_campaign}`);
  if (attribution.referrer) lines.push(`Referrer: ${attribution.referrer}`);
  if (attribution.landing_page) lines.push(`Landing page: ${attribution.landing_page}`);

  return lines.length ? lines.join("\n") : null;
}
