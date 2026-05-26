"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Lead,
  LeadInsert,
  LeadUpdate,
  MaintenancePlan,
  MaintenancePlanInsert,
  MaintenancePlanUpdate,
  Project,
  ProjectInsert,
  ProjectUpdate,
  Proposal,
  ProposalInsert,
  ProposalUpdate,
  Referral,
  ReferralInsert,
  ReferralUpdate,
  RevenueEntry,
  RevenueInsert,
  RevenueUpdate,
  Database,
} from "@/lib/internal/types";
import { createClient } from "@/lib/supabase/client";

function getSupabase(): SupabaseClient<Database> {
  return createClient() as SupabaseClient<Database>;
}

/** Workaround: @supabase/ssr client infers `never` for some table writes until codegen is synced. */
async function dbInsert<T extends keyof Database["public"]["Tables"]>(
  table: T,
  payload: Database["public"]["Tables"][T]["Insert"]
) {
  const sb = getSupabase() as SupabaseClient;
  const { error } = await sb.from(table).insert(payload);
  if (error) throw new Error(error.message);
}

async function dbUpdate<T extends keyof Database["public"]["Tables"]>(
  table: T,
  id: string,
  payload: Database["public"]["Tables"][T]["Update"]
) {
  const sb = getSupabase() as SupabaseClient;
  const { error } = await sb.from(table).update(payload).eq("id", id);
  if (error) throw new Error(error.message);
}

type AsyncState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

function useSupabaseQuery<T>(
  depKey: string,
  fetcher: () => Promise<T>
): AsyncState<T | null> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [depKey, refetch]);

  return { data, loading, error, refetch };
}

export function useLeads(filters?: {
  status?: string;
  source?: string;
  from?: string;
  to?: string;
}) {
  const supabase = getSupabase();
  const filterKey = JSON.stringify(filters ?? {});

  const state = useSupabaseQuery<Lead[]>(filterKey, async () => {
    let query = supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.source) query = query.eq("source", filters.source);
    if (filters?.from) query = query.gte("created_at", filters.from);
    if (filters?.to) query = query.lte("created_at", filters.to);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []) as Lead[];
  });

  const createLead = async (payload: LeadInsert) => {
    await dbInsert("leads", payload);
    await state.refetch();
  };

  const updateLead = async (id: string, payload: LeadUpdate) => {
    await dbUpdate("leads", id, payload);
    await state.refetch();
  };

  const logContact = async (id: string, note?: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const { data: lead } = await supabase
      .from("leads")
      .select("notes")
      .eq("id", id)
      .single();
    const leadNotes = (lead as { notes: string | null } | null)?.notes;
    const notes = [leadNotes, note ? `[${today}] ${note}` : `[${today}] Contact logged`]
      .filter(Boolean)
      .join("\n");
    await updateLead(id, {
      last_contact: today,
      status: "contacted",
      notes,
    });
  };

  return { ...state, createLead, updateLead, logContact };
}

export function useProposals(filters?: { status?: string; from?: string; to?: string }) {
  const supabase = getSupabase();
  const filterKey = JSON.stringify(filters ?? {});

  const state = useSupabaseQuery<Proposal[]>(filterKey, async () => {
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
  });

  const createProposal = async (payload: ProposalInsert) => {
    await dbInsert("proposals", payload);
    await state.refetch();
  };

  const updateProposal = async (id: string, payload: ProposalUpdate) => {
    await dbUpdate("proposals", id, payload);
    await state.refetch();
  };

  const markSent = async (id: string, followUpDays = 3) => {
    const today = new Date();
    const sent = today.toISOString().slice(0, 10);
    const followUp = new Date(today);
    followUp.setDate(followUp.getDate() + followUpDays);
    await updateProposal(id, {
      status: "sent",
      sent_date: sent,
      follow_up_date: followUp.toISOString().slice(0, 10),
    });
  };

  return { ...state, createProposal, updateProposal, markSent };
}

export function useProjects() {
  const supabase = getSupabase();

  const state = useSupabaseQuery<Project[]>("projects", async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Project[];
  });

  const createProject = async (payload: ProjectInsert) => {
    await dbInsert("projects", payload);
    await state.refetch();
  };

  const updateProject = async (id: string, payload: ProjectUpdate) => {
    await dbUpdate("projects", id, payload);
    await state.refetch();
  };

  const advanceStage = async (project: Project) => {
    const stages = ["discovery", "design", "development", "review", "launch", "completed"];
    const idx = stages.indexOf(project.stage);
    if (idx < stages.length - 1) {
      await updateProject(project.id, { stage: stages[idx + 1] as Project["stage"] });
    }
  };

  const recordDeposit = async (project: Project) => {
    const today = new Date().toISOString().slice(0, 10);
    await updateProject(project.id, {
      deposit_received: true,
      deposit_received_date: today,
    });
  };

  return { ...state, createProject, updateProject, advanceStage, recordDeposit };
}

export function useRevenue() {
  const supabase = getSupabase();

  const state = useSupabaseQuery<RevenueEntry[]>("revenue", async () => {
    const { data, error } = await supabase
      .from("revenue")
      .select("*")
      .order("date", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as RevenueEntry[];
  });

  const createEntry = async (payload: RevenueInsert) => {
    await dbInsert("revenue", payload);
    await state.refetch();
  };

  const updateEntry = async (id: string, payload: RevenueUpdate) => {
    await dbUpdate("revenue", id, payload);
    await state.refetch();
  };

  return { ...state, createEntry, updateEntry };
}

export function useMaintenancePlans() {
  const supabase = getSupabase();

  const state = useSupabaseQuery<MaintenancePlan[]>("maintenance", async () => {
    const { data, error } = await supabase
      .from("maintenance_plans")
      .select("*")
      .order("next_invoice_date", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as MaintenancePlan[];
  });

  const createPlan = async (payload: MaintenancePlanInsert) => {
    await dbInsert("maintenance_plans", payload);
    await state.refetch();
  };

  const updatePlan = async (id: string, payload: MaintenancePlanUpdate) => {
    await dbUpdate("maintenance_plans", id, payload);
    await state.refetch();
  };

  const markInvoiceSent = async (plan: MaintenancePlan) => {
    const next = new Date(plan.next_invoice_date);
    next.setMonth(next.getMonth() + 1);
    await updatePlan(plan.id, {
      next_invoice_date: next.toISOString().slice(0, 10),
    });
  };

  return { ...state, createPlan, updatePlan, markInvoiceSent };
}

export function useReferrals() {
  const supabase = getSupabase();

  const state = useSupabaseQuery<Referral[]>("referrals", async () => {
    const { data, error } = await supabase
      .from("referrals")
      .select("*, leads(business_name, status)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Referral[];
  });

  const createReferral = async (payload: ReferralInsert) => {
    await dbInsert("referrals", payload);
    await state.refetch();
  };

  const updateReferral = async (id: string, payload: ReferralUpdate) => {
    await dbUpdate("referrals", id, payload);
    await state.refetch();
  };

  return { ...state, createReferral, updateReferral };
}

export function useAuth() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) {
        setEmail(data.session?.user?.email ?? null);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await getSupabase().auth.signOut();
    window.location.href = "/login";
  };

  return { email, loading, signOut };
}
