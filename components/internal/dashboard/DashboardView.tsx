"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { KpiCard } from "@/components/internal/KpiCard";
import { StatusBadge } from "@/components/internal/StatusBadge";
import { LEAD_SOURCES } from "@/lib/internal/constants";
import { formatCurrency, formatDate, labelFor } from "@/lib/internal/format";
import type { DashboardData } from "@/lib/internal/types";

const CHART_COLORS = ["#1E3A5F", "#2E7D32", "#FFC107", "#4ECDC4", "#710628", "#94a3b8"];

export function DashboardView({ data }: { data: DashboardData }) {
  const donutData = [
    { name: "Accepted", value: data.proposalStats.accepted, fill: "#2E7D32" },
    { name: "Rejected", value: data.proposalStats.rejected, fill: "#710628" },
    { name: "Pending", value: data.proposalStats.pending, fill: "#FFC107" },
  ].filter((d) => d.value > 0);

  const sourceData = data.leadsBySource.map((item) => ({
    name: labelFor(LEAD_SOURCES, item.source),
    count: item.count,
  }));

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active leads" value={data.activeLeads} accent="navy" />
        <KpiCard label="Proposals sent (month)" value={data.proposalsSentThisMonth} accent="green" />
        <KpiCard label="Active projects" value={data.activeProjects} accent="accent" />
        <KpiCard
          label="Monthly recurring revenue"
          value={formatCurrency(data.mrr)}
          hint="From active maintenance plans"
          accent="green"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue · last 30 days">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.revenueLast30Days}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Line type="monotone" dataKey="amount" stroke="#1E3A5F" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Leads by source">
          {sourceData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={sourceData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2E7D32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No leads yet" />
          )}
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Proposal acceptance">
          {donutData.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {donutData.map((entry, i) => (
                    <Cell key={entry.name} fill={entry.fill ?? CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No proposals yet" />
          )}
        </ChartCard>

        <Panel title="Upcoming tasks" subtitle="Today & tomorrow">
          {data.upcomingTasks.length ? (
            <ul className="space-y-3">
              {data.upcomingTasks.map((lead) => (
                <li key={lead.id} className="rounded-lg border border-slate-100 p-3 text-sm">
                  <p className="font-medium text-brand-navy">{lead.business_name}</p>
                  <p className="text-brand-body">{lead.next_action ?? "Follow up"}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDate(lead.next_action_date)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No tasks scheduled for today or tomorrow.</p>
          )}
          <Link href="/internal/leads" className="mt-4 inline-block text-sm font-medium text-brand-green">
            View all leads →
          </Link>
        </Panel>

        <Panel title="Follow-up alerts" subtitle="Overdue proposals">
          {data.overdueFollowUps.length ? (
            <ul className="space-y-3">
              {data.overdueFollowUps.map((p) => (
                <li key={p.id} className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm">
                  <p className="font-medium text-brand-navy">
                    {p.proposal_number ?? "Draft"} · {p.leads?.business_name ?? "Client"}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusBadge type="proposal" value={p.status} />
                    <span className="text-xs text-amber-800">
                      Follow-up: {formatDate(p.follow_up_date)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No overdue follow-ups. Well done.</p>
          )}
          <Link href="/internal/proposals" className="mt-4 inline-block text-sm font-medium text-brand-green">
            View proposals →
          </Link>
        </Panel>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-brand-navy">{title}</h3>
      {children}
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-brand-navy">{title}</h3>
      {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[220px] items-center justify-center text-sm text-slate-500">{message}</div>
  );
}

