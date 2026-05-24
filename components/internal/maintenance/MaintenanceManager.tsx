"use client";

import { addDays, isWithinInterval, parseISO, startOfDay } from "date-fns";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { ErrorBanner, LoadingPage } from "@/components/internal/LoadingSpinner";
import {
  FormField,
  inputClass,
  Modal,
  PrimaryButton,
  SecondaryButton,
  selectClass,
} from "@/components/internal/Modal";
import { PLAN_TYPES } from "@/lib/internal/constants";
import { formatCurrency, formatDate, labelFor, todayISO } from "@/lib/internal/format";
import { useMaintenancePlans, useProjects } from "@/lib/internal/hooks";
import type { MaintenancePlan, MaintenancePlanType } from "@/lib/internal/types";

type PlanFormValues = {
  client_name: string;
  project_id: string;
  plan_type: MaintenancePlanType;
  monthly_amount: string;
  start_date: string;
  next_invoice_date: string;
  active: boolean;
};

export function MaintenanceManager() {
  const { data: plans, loading, error, refetch, createPlan, markInvoiceSent } =
    useMaintenancePlans();
  const { data: projects } = useProjects();

  const [formOpen, setFormOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const form = useForm<PlanFormValues>({
    defaultValues: {
      client_name: "",
      project_id: "",
      plan_type: "standard",
      monthly_amount: "",
      start_date: todayISO(),
      next_invoice_date: todayISO(),
      active: true,
    },
  });

  const activePlans = useMemo(
    () => (plans ?? []).filter((p) => p.active),
    [plans]
  );

  const dueThisWeek = useMemo(() => {
    const today = startOfDay(new Date());
    const weekEnd = addDays(today, 7);
    return activePlans.filter((p) => {
      const d = parseISO(p.next_invoice_date);
      return isWithinInterval(d, { start: today, end: weekEnd });
    });
  }, [activePlans]);

  const onSave = form.handleSubmit(async (values) => {
    setActionBusy(true);
    setActionError(null);
    try {
      await createPlan({
        client_name: values.client_name.trim(),
        project_id: values.project_id || null,
        plan_type: values.plan_type,
        monthly_amount: Number(values.monthly_amount),
        start_date: values.start_date,
        next_invoice_date: values.next_invoice_date,
        active: values.active,
      });
      setFormOpen(false);
      form.reset({
        client_name: "",
        project_id: "",
        plan_type: "standard",
        monthly_amount: "",
        start_date: todayISO(),
        next_invoice_date: todayISO(),
        active: true,
      });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not create plan");
    } finally {
      setActionBusy(false);
    }
  });

  const runMarkSent = async (plan: MaintenancePlan) => {
    setActionBusy(true);
    setActionError(null);
    try {
      await markInvoiceSent(plan);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update plan");
    } finally {
      setActionBusy(false);
    }
  };

  if (loading) return <LoadingPage message="Loading maintenance plans…" />;
  if (error) return <ErrorBanner message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <PrimaryButton onClick={() => setFormOpen(true)}>Add plan</PrimaryButton>
      </div>

      {actionError ? (
        <ErrorBanner message={actionError} onRetry={() => setActionError(null)} />
      ) : null}

      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-navy">Due this week</h3>
        <p className="mt-1 text-xs text-brand-body">Invoices due in the next 7 days</p>
        {dueThisWeek.length === 0 ? (
          <p className="mt-4 text-sm text-brand-body">Nothing due this week.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {dueThisWeek.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-100 bg-white p-3 text-sm"
              >
                <div>
                  <p className="font-medium text-brand-navy">{p.client_name}</p>
                  <p className="text-xs text-brand-body">
                    {labelFor(PLAN_TYPES, p.plan_type)} · {formatCurrency(p.monthly_amount)}/mo
                  </p>
                  <p className="text-xs text-amber-800">
                    Invoice due: {formatDate(p.next_invoice_date)}
                  </p>
                </div>
                <PrimaryButton disabled={actionBusy} onClick={() => runMarkSent(p)}>
                  Mark invoice sent
                </PrimaryButton>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <h3 className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-brand-navy">
          Active plans ({activePlans.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Monthly</th>
                <th className="px-4 py-3">Next invoice</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activePlans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-brand-body">
                    No active maintenance plans.
                  </td>
                </tr>
              ) : (
                activePlans.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-medium text-brand-navy">{p.client_name}</td>
                    <td className="px-4 py-3 text-brand-body">
                      {labelFor(PLAN_TYPES, p.plan_type)}
                    </td>
                    <td className="px-4 py-3 text-brand-navy">
                      {formatCurrency(p.monthly_amount)}
                    </td>
                    <td className="px-4 py-3 text-brand-body">
                      {formatDate(p.next_invoice_date)}
                    </td>
                    <td className="px-4 py-3">
                      <PrimaryButton disabled={actionBusy} onClick={() => runMarkSent(p)}>
                        Mark invoice sent
                      </PrimaryButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Add maintenance plan">
        <form onSubmit={onSave} className="space-y-4">
          {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}
          <FormField label="Client name" required>
            <input
              className={inputClass}
              {...form.register("client_name", { required: true })}
            />
          </FormField>
          <FormField label="Linked project">
            <select className={selectClass} {...form.register("project_id")}>
              <option value="">—</option>
              {(projects ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project_name} ({p.client_name})
                </option>
              ))}
            </select>
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Plan type">
              <select className={selectClass} {...form.register("plan_type")}>
                {PLAN_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Monthly amount (GHS)" required>
              <input
                type="number"
                min="0"
                step="0.01"
                className={inputClass}
                {...form.register("monthly_amount", { required: true })}
              />
            </FormField>
            <FormField label="Start date" required>
              <input
                type="date"
                className={inputClass}
                {...form.register("start_date", { required: true })}
              />
            </FormField>
            <FormField label="Next invoice date" required>
              <input
                type="date"
                className={inputClass}
                {...form.register("next_invoice_date", { required: true })}
              />
            </FormField>
          </div>
          <label className="flex items-center gap-2 text-sm text-brand-navy">
            <input type="checkbox" {...form.register("active")} className="rounded" />
            Active plan
          </label>
          <div className="flex justify-end gap-2">
            <SecondaryButton type="button" onClick={() => setFormOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={actionBusy}>
              Create plan
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
