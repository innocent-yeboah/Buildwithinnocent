import {
  addDays,
  format,
  parseISO,
  startOfMonth,
  subDays,
} from "date-fns";

import { getInternalDb } from "@/lib/supabase/internal-db";
import type {
  DashboardData,
  Lead,
  MaintenancePlan,
  Project,
  Proposal,
  Referral,
  RevenueEntry,
} from "@/lib/internal/types";

function activeLeadStatuses() {
  return ["new", "contacted", "proposal_sent", "negotiating"];
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = getInternalDb();
  const today = format(new Date(), "yyyy-MM-dd");
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");

  const [
    activeLeadsRes,
    proposalsMonthRes,
    activeProjectsRes,
    maintenanceRes,
    revenue30Res,
    leadsSourceRes,
    proposalsAllRes,
    upcomingRes,
    overdueRes,
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .in("status", activeLeadStatuses()),
    supabase
      .from("proposals")
      .select("id", { count: "exact", head: true })
      .gte("sent_date", monthStart)
      .in("status", ["sent", "viewed"]),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .neq("stage", "completed"),
    supabase.from("maintenance_plans").select("monthly_amount").eq("active", true),
    supabase
      .from("revenue")
      .select("date, amount")
      .gte("date", thirtyDaysAgo)
      .order("date", { ascending: true }),
    supabase.from("leads").select("source"),
    supabase.from("proposals").select("status"),
    supabase
      .from("leads")
      .select("*")
      .not("next_action_date", "is", null)
      .gte("next_action_date", today)
      .lte("next_action_date", tomorrow)
      .order("next_action_date", { ascending: true })
      .limit(10),
    supabase
      .from("proposals")
      .select("*, leads(business_name, contact_name, email)")
      .in("status", ["sent", "viewed"])
      .lt("follow_up_date", today)
      .order("follow_up_date", { ascending: true })
      .limit(10),
  ]);

  const errors = [
    activeLeadsRes.error,
    proposalsMonthRes.error,
    activeProjectsRes.error,
    maintenanceRes.error,
    revenue30Res.error,
  ].filter(Boolean);

  if (errors.length) {
    throw new Error(errors[0]?.message ?? "Failed to load dashboard data");
  }

  const mrr =
    (maintenanceRes.data as { monthly_amount: number }[] | null)?.reduce(
      (sum, row) => sum + Number(row.monthly_amount ?? 0),
      0
    ) ?? 0;

  const revenueByDay = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const d = format(subDays(new Date(), 29 - i), "yyyy-MM-dd");
    revenueByDay.set(d, 0);
  }
  (revenue30Res.data as { date: string; amount: number }[] | null)?.forEach((row) => {
    const key = row.date.slice(0, 10);
    revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + Number(row.amount));
  });

  const sourceCounts = new Map<string, number>();
  (leadsSourceRes.data as { source: string | null }[] | null)?.forEach((row) => {
    const src = row.source ?? "other";
    sourceCounts.set(src, (sourceCounts.get(src) ?? 0) + 1);
  });

  const proposalStats = { accepted: 0, rejected: 0, pending: 0 };
  (proposalsAllRes.data as { status: string }[] | null)?.forEach((row) => {
    if (row.status === "accepted") proposalStats.accepted += 1;
    else if (row.status === "rejected") proposalStats.rejected += 1;
    else if (["sent", "viewed", "draft"].includes(row.status)) proposalStats.pending += 1;
  });

  return {
    activeLeads: activeLeadsRes.count ?? 0,
    proposalsSentThisMonth: proposalsMonthRes.count ?? 0,
    activeProjects: activeProjectsRes.count ?? 0,
    mrr,
    revenueLast30Days: Array.from(revenueByDay.entries()).map(([date, amount]) => ({
      date,
      amount,
    })),
    leadsBySource: Array.from(sourceCounts.entries()).map(([source, count]) => ({
      source,
      count,
    })),
    proposalStats,
    upcomingTasks: (upcomingRes.data ?? []) as Lead[],
    overdueFollowUps: (overdueRes.data ?? []) as Proposal[],
  };
}

export async function getLeads(filters?: {
  status?: string;
  source?: string;
  from?: string;
  to?: string;
}): Promise<Lead[]> {
  const supabase = getInternalDb();
  let query = supabase.from("leads").select("*").order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.source) query = query.eq("source", filters.source);
  if (filters?.from) query = query.gte("created_at", filters.from);
  if (filters?.to) query = query.lte("created_at", filters.to);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Lead[];
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const supabase = getInternalDb();
  const { data, error } = await supabase.from("leads").select("*").eq("id", id).single();
  if (error) return null;
  return data as Lead;
}

export async function getProposals(filters?: {
  status?: string;
  from?: string;
  to?: string;
}): Promise<Proposal[]> {
  const supabase = getInternalDb();
  let query = supabase
    .from("proposals")
    .select("*, leads(business_name, contact_name, email)")
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.from) query = query.gte("sent_date", filters.from);
  if (filters?.to) query = query.lte("sent_date", filters.to);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Proposal[];
}

export async function getProjects(): Promise<Project[]> {
  const supabase = getInternalDb();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
}

export async function getRevenueSummary() {
  const supabase = getInternalDb();
  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const yearStart = format(new Date(new Date().getFullYear(), 0, 1), "yyyy-MM-dd");

  const [allRes, mtdRes, ytdRes, maintenanceRes, projectsRes] = await Promise.all([
    supabase.from("revenue").select("*").order("date", { ascending: false }),
    supabase.from("revenue").select("amount").gte("date", monthStart),
    supabase.from("revenue").select("amount").gte("date", yearStart),
    supabase.from("maintenance_plans").select("monthly_amount").eq("active", true),
    supabase.from("projects").select("balance_due").neq("stage", "completed"),
  ]);

  if (allRes.error) throw new Error(allRes.error.message);

  const sum = (rows: { amount?: number }[] | null) =>
    rows?.reduce((s, r) => s + Number(r.amount ?? 0), 0) ?? 0;

  const mrr =
    (maintenanceRes.data as { monthly_amount: number }[] | null)?.reduce(
      (s, r) => s + Number(r.monthly_amount ?? 0),
      0
    ) ?? 0;
  const outstanding =
    (projectsRes.data as { balance_due: number | null }[] | null)?.reduce(
      (s, r) => s + Number(r.balance_due ?? 0),
      0
    ) ?? 0;

  const entries = (allRes.data ?? []) as RevenueEntry[];

  const bySource = new Map<string, number>();
  entries.forEach((e) => {
    bySource.set(e.source, (bySource.get(e.source) ?? 0) + Number(e.amount));
  });

  const byMonth = new Map<string, number>();
  entries.forEach((e) => {
    const month = e.date.slice(0, 7);
    byMonth.set(month, (byMonth.get(month) ?? 0) + Number(e.amount));
  });

  return {
    entries,
    mtd: sum(mtdRes.data),
    ytd: sum(ytdRes.data),
    mrr,
    outstanding,
    bySource: Array.from(bySource.entries()).map(([source, amount]) => ({ source, amount })),
    byMonth: Array.from(byMonth.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => b.month.localeCompare(a.month)),
  };
}

export async function getMaintenancePlans(): Promise<MaintenancePlan[]> {
  const supabase = getInternalDb();
  const { data, error } = await supabase
    .from("maintenance_plans")
    .select("*")
    .order("next_invoice_date", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as MaintenancePlan[];
}

export async function getReferrals(): Promise<Referral[]> {
  const supabase = getInternalDb();
  const { data, error } = await supabase
    .from("referrals")
    .select("*, leads(business_name, status)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Referral[];
}

export async function recordProposalView(proposalId: string): Promise<void> {
  const supabase = getInternalDb();
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: existing } = await supabase
    .from("proposals")
    .select("status, viewed_date")
    .eq("id", proposalId)
    .single();

  if (!existing) return;

  const row = existing as { status: string; viewed_date: string | null };
  const updates: { viewed_date: string; status?: string } = { viewed_date: today };
  if (row.status === "sent") updates.status = "viewed";

  const sb = supabase as import("@supabase/supabase-js").SupabaseClient;
  await sb.from("proposals").update(updates).eq("id", proposalId);
}

export async function getProposalPublic(id: string): Promise<Proposal | null> {
  const supabase = getInternalDb();
  const { data, error } = await supabase
    .from("proposals")
    .select("*, leads(business_name, contact_name, email)")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Proposal;
}

export function isOverdueFollowUp(proposal: Proposal): boolean {
  if (!proposal.follow_up_date) return false;
  if (!["sent", "viewed"].includes(proposal.status)) return false;
  try {
    return parseISO(proposal.follow_up_date) < new Date();
  } catch {
    return false;
  }
}
