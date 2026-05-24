export type LeadSource =
  | "linkedin"
  | "whatsapp"
  | "referral"
  | "cold_dm"
  | "website"
  | "other";

export type LeadStatus =
  | "new"
  | "contacted"
  | "proposal_sent"
  | "negotiating"
  | "closed_won"
  | "closed_lost";

export type ProposalStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "accepted"
  | "rejected"
  | "expired";

export type ProjectStage =
  | "discovery"
  | "design"
  | "development"
  | "review"
  | "launch"
  | "completed";

export type MaintenancePlanType = "basic" | "standard" | "premium";

export type RevenueSource =
  | "project_deposit"
  | "project_balance"
  | "maintenance"
  | "blueprint"
  | "consulting";

export type ReferralSourceType = "client" | "promoter" | "friend" | "other";

export interface Lead {
  id: string;
  created_at: string;
  business_name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  source: LeadSource | null;
  status: LeadStatus;
  last_contact: string | null;
  next_action: string | null;
  next_action_date: string | null;
  notes: string | null;
  estimated_value: number | null;
  website_lead_id: number | null;
}

export interface Proposal {
  id: string;
  created_at: string;
  lead_id: string | null;
  proposal_number: string | null;
  amount: number;
  status: ProposalStatus;
  sent_date: string | null;
  viewed_date: string | null;
  accepted_date: string | null;
  follow_up_date: string | null;
  notes: string | null;
  leads?: Pick<Lead, "business_name" | "contact_name" | "email"> | null;
}

export interface Project {
  id: string;
  created_at: string;
  client_name: string;
  lead_id: string | null;
  project_name: string;
  deposit_amount: number | null;
  deposit_received: boolean;
  deposit_received_date: string | null;
  total_amount: number | null;
  balance_due: number | null;
  stage: ProjectStage;
  estimated_delivery_date: string | null;
  actual_delivery_date: string | null;
  notes: string | null;
}

export interface MaintenancePlan {
  id: string;
  created_at: string;
  client_name: string;
  project_id: string | null;
  plan_type: MaintenancePlanType;
  monthly_amount: number;
  start_date: string;
  next_invoice_date: string;
  active: boolean;
}

export interface RevenueEntry {
  id: string;
  created_at: string;
  date: string;
  source: RevenueSource;
  amount: number;
  client_name: string | null;
  notes: string | null;
}

export interface Referral {
  id: string;
  created_at: string;
  source_name: string;
  source_type: ReferralSourceType;
  referred_lead_id: string | null;
  commission_amount: number | null;
  commission_paid: boolean;
  leads?: Pick<Lead, "business_name" | "status"> | null;
}

export interface DashboardData {
  activeLeads: number;
  proposalsSentThisMonth: number;
  activeProjects: number;
  mrr: number;
  revenueLast30Days: { date: string; amount: number }[];
  leadsBySource: { source: string; count: number }[];
  proposalStats: { accepted: number; rejected: number; pending: number };
  upcomingTasks: Lead[];
  overdueFollowUps: Proposal[];
}

export type LeadInsert = Omit<Lead, "id" | "created_at" | "website_lead_id">;
export type LeadUpdate = Partial<LeadInsert>;

export type ProposalInsert = Omit<
  Proposal,
  "id" | "created_at" | "proposal_number" | "leads"
>;
export type ProposalUpdate = Partial<ProposalInsert>;

export type ProjectInsert = Omit<Project, "id" | "created_at">;
export type ProjectUpdate = Partial<ProjectInsert>;

export type MaintenancePlanInsert = Omit<MaintenancePlan, "id" | "created_at">;
export type MaintenancePlanUpdate = Partial<MaintenancePlanInsert>;

export type RevenueInsert = Omit<RevenueEntry, "id" | "created_at">;
export type RevenueUpdate = Partial<RevenueInsert>;

export type ReferralInsert = Omit<Referral, "id" | "created_at" | "leads">;
export type ReferralUpdate = Partial<ReferralInsert>;

/** Minimal Database typing for Supabase client generics */
export interface Database {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: LeadInsert;
        Update: LeadUpdate;
        Relationships: [];
      };
      proposals: {
        Row: Proposal;
        Insert: ProposalInsert;
        Update: ProposalUpdate;
        Relationships: [
          {
            foreignKeyName: "proposals_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
        Relationships: [
          {
            foreignKeyName: "projects_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      maintenance_plans: {
        Row: MaintenancePlan;
        Insert: MaintenancePlanInsert;
        Update: MaintenancePlanUpdate;
        Relationships: [
          {
            foreignKeyName: "maintenance_plans_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      revenue: {
        Row: RevenueEntry;
        Insert: RevenueInsert;
        Update: RevenueUpdate;
        Relationships: [];
      };
      referrals: {
        Row: Referral;
        Insert: ReferralInsert;
        Update: ReferralUpdate;
        Relationships: [
          {
            foreignKeyName: "referrals_referred_lead_id_fkey";
            columns: ["referred_lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      website_leads: {
        Row: { id: number; created_at: string };
        Insert: { id?: number; created_at?: string };
        Update: { id?: number; created_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
