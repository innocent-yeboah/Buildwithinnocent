"use client";

import { format, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { KpiCard } from "@/components/internal/KpiCard";
import { ErrorBanner, LoadingPage } from "@/components/internal/LoadingSpinner";
import {
  FormField,
  inputClass,
  Modal,
  PrimaryButton,
  SecondaryButton,
  selectClass,
  textareaClass,
} from "@/components/internal/Modal";
import { REVENUE_SOURCES } from "@/lib/internal/constants";
import {
  formatCurrency,
  labelFor,
  monthStartISO,
  todayISO,
  yearStartISO,
} from "@/lib/internal/format";
import { useMaintenancePlans, useProjects, useRevenue } from "@/lib/internal/hooks";
import type { RevenueSource } from "@/lib/internal/types";

type RevenueFormValues = {
  date: string;
  source: RevenueSource;
  amount: string;
  client_name: string;
  notes: string;
};

export function RevenueManager() {
  const { data: entries, loading, error, refetch, createEntry } = useRevenue();
  const { data: plans } = useMaintenancePlans();
  const { data: projects } = useProjects();

  const [formOpen, setFormOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const form = useForm<RevenueFormValues>({
    defaultValues: {
      date: todayISO(),
      source: "project_deposit",
      amount: "",
      client_name: "",
      notes: "",
    },
  });

  const monthStart = monthStartISO();
  const yearStart = yearStartISO();

  const summary = useMemo(() => {
    const list = entries ?? [];
    const mtd = list
      .filter((e) => e.date >= monthStart)
      .reduce((sum, e) => sum + e.amount, 0);
    const ytd = list
      .filter((e) => e.date >= yearStart)
      .reduce((sum, e) => sum + e.amount, 0);
    const mrr = (plans ?? [])
      .filter((p) => p.active)
      .reduce((sum, p) => sum + p.monthly_amount, 0);
    const outstanding = (projects ?? [])
      .filter((p) => p.stage !== "completed" && (p.balance_due ?? 0) > 0)
      .reduce((sum, p) => sum + (p.balance_due ?? 0), 0);
    return { mtd, ytd, mrr, outstanding };
  }, [entries, plans, projects, monthStart, yearStart]);

  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of entries ?? []) {
      map.set(e.source, (map.get(e.source) ?? 0) + e.amount);
    }
    return REVENUE_SOURCES.map((s) => ({
      name: s.label,
      amount: map.get(s.value) ?? 0,
    })).filter((d) => d.amount > 0);
  }, [entries]);

  const monthlyRows = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of entries ?? []) {
      const month = e.date.slice(0, 7);
      map.set(month, (map.get(month) ?? 0) + e.amount);
    }
    return [...map.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([month, total]) => ({
        month,
        label: format(parseISO(`${month}-01`), "MMM yyyy"),
        total,
      }));
  }, [entries]);

  const onSave = form.handleSubmit(async (values) => {
    setActionBusy(true);
    setActionError(null);
    try {
      await createEntry({
        date: values.date,
        source: values.source,
        amount: Number(values.amount),
        client_name: values.client_name.trim() || null,
        notes: values.notes.trim() || null,
      });
      setFormOpen(false);
      form.reset({
        date: todayISO(),
        source: "project_deposit",
        amount: "",
        client_name: "",
        notes: "",
      });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not add entry");
    } finally {
      setActionBusy(false);
    }
  });

  if (loading) return <LoadingPage message="Loading revenue…" />;
  if (error) return <ErrorBanner message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <PrimaryButton onClick={() => setFormOpen(true)}>Add revenue entry</PrimaryButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Revenue MTD" value={formatCurrency(summary.mtd)} accent="green" />
        <KpiCard label="Revenue YTD" value={formatCurrency(summary.ytd)} accent="navy" />
        <KpiCard
          label="MRR"
          value={formatCurrency(summary.mrr)}
          hint="Active maintenance plans"
          accent="green"
        />
        <KpiCard
          label="Outstanding"
          value={formatCurrency(summary.outstanding)}
          hint="Project balances due"
          accent="accent"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-brand-navy">Revenue by source</h3>
        {chartData.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatCurrency(Number(v ?? 0))} />
              <Bar dataKey="amount" fill="#2E7D32" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-12 text-center text-sm text-brand-body">No revenue recorded yet.</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <h3 className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-brand-navy">
          Monthly totals
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Month</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlyRows.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-5 py-8 text-center text-brand-body">
                    No monthly data yet.
                  </td>
                </tr>
              ) : (
                monthlyRows.map((row) => (
                  <tr key={row.month}>
                    <td className="px-5 py-3 text-brand-navy">{row.label}</td>
                    <td className="px-5 py-3 text-right font-medium text-brand-navy">
                      {formatCurrency(row.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <h3 className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-brand-navy">
          All entries
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(entries ?? []).map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-3 text-brand-body">{e.date}</td>
                  <td className="px-4 py-3 text-brand-body">
                    {labelFor(REVENUE_SOURCES, e.source)}
                  </td>
                  <td className="px-4 py-3 text-brand-navy">{e.client_name ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-medium text-brand-navy">
                    {formatCurrency(e.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Add revenue entry">
        <form onSubmit={onSave} className="space-y-4">
          {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}
          <FormField label="Date" required>
            <input type="date" className={inputClass} {...form.register("date", { required: true })} />
          </FormField>
          <FormField label="Source">
            <select className={selectClass} {...form.register("source")}>
              {REVENUE_SOURCES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Amount (GHS)" required>
            <input
              type="number"
              min="0"
              step="0.01"
              className={inputClass}
              {...form.register("amount", { required: true })}
            />
          </FormField>
          <FormField label="Client name">
            <input className={inputClass} {...form.register("client_name")} />
          </FormField>
          <FormField label="Notes">
            <textarea className={textareaClass} {...form.register("notes")} />
          </FormField>
          <div className="flex justify-end gap-2">
            <SecondaryButton type="button" onClick={() => setFormOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={actionBusy}>
              Add entry
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
