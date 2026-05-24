import type {
  LeadSource,
  LeadStatus,
  MaintenancePlanType,
  ProjectStage,
  ProposalStatus,
  ReferralSourceType,
  RevenueSource,
} from "@/lib/internal/types";

export const LEAD_SOURCES: { value: LeadSource; label: string }[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "referral", label: "Referral" },
  { value: "cold_dm", label: "Cold DM" },
  { value: "website", label: "Website" },
  { value: "other", label: "Other" },
];

export const LEAD_STATUSES: { value: LeadStatus; label: string; color: string }[] = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-800" },
  { value: "contacted", label: "Contacted", color: "bg-sky-100 text-sky-800" },
  { value: "proposal_sent", label: "Proposal Sent", color: "bg-amber-100 text-amber-800" },
  { value: "negotiating", label: "Negotiating", color: "bg-orange-100 text-orange-800" },
  { value: "closed_won", label: "Closed Won", color: "bg-green-100 text-green-800" },
  { value: "closed_lost", label: "Closed Lost", color: "bg-red-100 text-red-800" },
];

export const PROPOSAL_STATUSES: { value: ProposalStatus; label: string; color: string }[] = [
  { value: "draft", label: "Draft", color: "bg-slate-100 text-slate-700" },
  { value: "sent", label: "Sent", color: "bg-blue-100 text-blue-800" },
  { value: "viewed", label: "Viewed", color: "bg-indigo-100 text-indigo-800" },
  { value: "accepted", label: "Accepted", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "expired", label: "Expired", color: "bg-gray-100 text-gray-600" },
];

export const PROJECT_STAGES: { value: ProjectStage; label: string; order: number }[] = [
  { value: "discovery", label: "Discovery", order: 1 },
  { value: "design", label: "Design", order: 2 },
  { value: "development", label: "Development", order: 3 },
  { value: "review", label: "Review", order: 4 },
  { value: "launch", label: "Launch", order: 5 },
  { value: "completed", label: "Completed", order: 6 },
];

export const REVENUE_SOURCES: { value: RevenueSource; label: string }[] = [
  { value: "project_deposit", label: "Project Deposit" },
  { value: "project_balance", label: "Project Balance" },
  { value: "maintenance", label: "Maintenance" },
  { value: "blueprint", label: "Blueprint" },
  { value: "consulting", label: "Consulting" },
];

export const PLAN_TYPES: { value: MaintenancePlanType; label: string }[] = [
  { value: "basic", label: "Basic" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
];

export const REFERRAL_SOURCE_TYPES: { value: ReferralSourceType; label: string }[] = [
  { value: "client", label: "Client" },
  { value: "promoter", label: "Promoter" },
  { value: "friend", label: "Friend" },
  { value: "other", label: "Other" },
];

export const INTERNAL_NAV = [
  { href: "/internal/dashboard", label: "Overview", icon: "dashboard" },
  { href: "/internal/leads", label: "Leads", icon: "leads" },
  { href: "/internal/proposals", label: "Proposals", icon: "proposals" },
  { href: "/internal/projects", label: "Projects", icon: "projects" },
  { href: "/internal/revenue", label: "Revenue", icon: "revenue" },
  { href: "/internal/maintenance", label: "Maintenance", icon: "maintenance" },
  { href: "/internal/referrals", label: "Referrals", icon: "referrals" },
] as const;

export const CURRENCY = "GHS";
