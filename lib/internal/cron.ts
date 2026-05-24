import { addDays, format, startOfWeek, subDays } from "date-fns";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

export interface CronResult {
  overdueProposals: { id: string; proposal_number: string | null; business_name: string }[];
  maintenanceDue: { id: string; client_name: string; next_invoice_date: string; monthly_amount: number }[];
  weeklySummary?: {
    newLeads: number;
    proposalsSent: number;
    revenueTotal: number;
  };
  emailsSent: number;
}

async function sendCronEmail(subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INTERNAL_ADMIN_EMAIL ?? "igtechgh@gmail.com";
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set; skipping cron email.");
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Build With Innocent OS <notifications@buildwithinnocent.com>",
      to: [to],
      subject,
      html,
    }),
  });

  return res.ok;
}

export async function runDailyChecks(): Promise<CronResult> {
  const supabase = getSupabaseAdmin();
  const today = format(new Date(), "yyyy-MM-dd");
  const threeDaysAgo = format(subDays(new Date(), 3), "yyyy-MM-dd");
  const weekEnd = format(addDays(new Date(), 7), "yyyy-MM-dd");

  const [overdueRes, maintenanceRes] = await Promise.all([
    supabase
      .from("proposals")
      .select("id, proposal_number, sent_date, leads(business_name)")
      .in("status", ["sent", "viewed"])
      .lte("sent_date", threeDaysAgo)
      .or(`follow_up_date.is.null,follow_up_date.lt.${today}`),
    supabase
      .from("maintenance_plans")
      .select("id, client_name, next_invoice_date, monthly_amount")
      .eq("active", true)
      .gte("next_invoice_date", today)
      .lte("next_invoice_date", weekEnd),
  ]);

  type OverdueProposalRow = {
    id: string;
    proposal_number: string | null;
    leads: { business_name?: string } | null;
  };
  type MaintenanceDueRow = {
    id: string;
    client_name: string;
    next_invoice_date: string;
    monthly_amount: number;
  };

  const overdueProposals =
    (overdueRes.data as OverdueProposalRow[] | null)?.map((p) => ({
      id: p.id,
      proposal_number: p.proposal_number,
      business_name: p.leads?.business_name ?? "Unknown client",
    })) ?? [];

  const maintenanceDue =
    (maintenanceRes.data as MaintenanceDueRow[] | null)?.map((m) => ({
      id: m.id,
      client_name: m.client_name,
      next_invoice_date: m.next_invoice_date,
      monthly_amount: Number(m.monthly_amount),
    })) ?? [];

  let emailsSent = 0;

  if (overdueProposals.length > 0 || maintenanceDue.length > 0) {
    const proposalRows = overdueProposals
      .map(
        (p) =>
          `<li><strong>${p.proposal_number ?? p.id.slice(0, 8)}</strong> — ${p.business_name}</li>`
      )
      .join("");
    const maintenanceRows = maintenanceDue
      .map(
        (m) =>
          `<li><strong>${m.client_name}</strong> — due ${m.next_invoice_date} (GHS ${m.monthly_amount})</li>`
      )
      .join("");

    const html = `
      <h2>Daily OS Reminders</h2>
      ${overdueProposals.length ? `<h3>Proposals needing follow-up (${overdueProposals.length})</h3><ul>${proposalRows}</ul>` : ""}
      ${maintenanceDue.length ? `<h3>Maintenance invoices due this week (${maintenanceDue.length})</h3><ul>${maintenanceRows}</ul>` : ""}
      <p><a href="https://buildwithinnocent.com/internal/dashboard">Open dashboard</a></p>
    `;

    if (await sendCronEmail("Daily reminders · Build With Innocent OS", html)) {
      emailsSent += 1;
    }
  }

  return { overdueProposals, maintenanceDue, emailsSent };
}

export async function runWeeklySummary(): Promise<CronResult> {
  const supabase = getSupabaseAdmin();
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  const today = format(new Date(), "yyyy-MM-dd");

  const [leadsRes, proposalsRes, revenueRes] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
    supabase
      .from("proposals")
      .select("id", { count: "exact", head: true })
      .gte("sent_date", weekStart)
      .lte("sent_date", today),
    supabase.from("revenue").select("amount").gte("date", weekStart).lte("date", today),
  ]);

  const revenueTotal =
    (revenueRes.data as { amount: number }[] | null)?.reduce(
      (s, r) => s + Number(r.amount ?? 0),
      0
    ) ?? 0;

  const weeklySummary = {
    newLeads: leadsRes.count ?? 0,
    proposalsSent: proposalsRes.count ?? 0,
    revenueTotal,
  };

  const html = `
    <h2>Weekly Business Summary</h2>
    <ul>
      <li>New leads: <strong>${weeklySummary.newLeads}</strong></li>
      <li>Proposals sent: <strong>${weeklySummary.proposalsSent}</strong></li>
      <li>Revenue this week: <strong>GHS ${revenueTotal.toFixed(2)}</strong></li>
    </ul>
    <p><a href="https://buildwithinnocent.com/internal/dashboard">Open dashboard</a></p>
  `;

  let emailsSent = 0;
  if (await sendCronEmail("Weekly summary · Build With Innocent OS", html)) {
    emailsSent = 1;
  }

  return {
    overdueProposals: [],
    maintenanceDue: [],
    weeklySummary,
    emailsSent,
  };
}
