import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { buildAttributionNotes, mapAttributionToCrmSource } from "@/lib/lead-attribution";

/**
 * Create or skip a CRM lead from a website_leads row (Internal OS).
 * Uses service role so it works without relying on DB triggers alone.
 */
export async function syncWebsiteLeadToCrm(websiteLead, attribution) {
  try {
    const admin = getSupabaseAdmin();
    const crmSource = mapAttributionToCrmSource(attribution);

    const { data: existing } = await admin
      .from("leads")
      .select("id")
      .eq("website_lead_id", websiteLead.id)
      .maybeSingle();

    if (existing) {
      return { ok: true, duplicate: true, leadId: existing.id };
    }

    const isRegistration = websiteLead.form_type === "registration";
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attributionNotes = buildAttributionNotes(attribution);
    const notes = [
      websiteLead.message ? `Message: ${websiteLead.message}` : null,
      websiteLead.goals ? `Goals: ${websiteLead.goals}` : null,
      websiteLead.experience_level ? `Experience: ${websiteLead.experience_level}` : null,
      `Form: ${websiteLead.form_type}`,
      websiteLead.source ? `Website tag: ${websiteLead.source}` : null,
      attributionNotes,
    ]
      .filter(Boolean)
      .join("\n");

    const { data: lead, error } = await admin
      .from("leads")
      .insert({
        business_name:
          websiteLead.service_interest?.trim() ||
          websiteLead.name?.trim() ||
          "Website inquiry",
        contact_name: websiteLead.name,
        phone: websiteLead.phone,
        email: websiteLead.email,
        source: crmSource,
        status: "new",
        next_action: isRegistration
          ? "Follow up on bootcamp registration"
          : "Respond to consultation request",
        next_action_date: tomorrow.toISOString().slice(0, 10),
        notes: notes || null,
        website_lead_id: websiteLead.id,
      })
      .select("id")
      .single();

    if (error) throw error;

    return { ok: true, leadId: lead?.id, crmSource };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      console.warn("CRM sync skipped: SUPABASE_SERVICE_ROLE_KEY not configured.");
      return { ok: false, skipped: true };
    }

    console.error("CRM sync error:", err);
    return { ok: false, error: message };
  }
}
