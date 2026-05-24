"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { KpiCard } from "@/components/internal/KpiCard";
import { ErrorBanner, LoadingPage } from "@/components/internal/LoadingSpinner";
import {
  FormField,
  inputClass,
  Modal,
  PrimaryButton,
  SecondaryButton,
  selectClass,
} from "@/components/internal/Modal";
import { REFERRAL_SOURCE_TYPES } from "@/lib/internal/constants";
import { formatCurrency, labelFor } from "@/lib/internal/format";
import { useLeads, useReferrals } from "@/lib/internal/hooks";
import type { ReferralSourceType } from "@/lib/internal/types";

type ReferralFormValues = {
  source_name: string;
  source_type: ReferralSourceType;
  referred_lead_id: string;
  commission_amount: string;
  commission_paid: boolean;
};

export function ReferralsManager() {
  const { data: referrals, loading, error, refetch, createReferral, updateReferral } =
    useReferrals();
  const { data: leads } = useLeads();

  const [formOpen, setFormOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const form = useForm<ReferralFormValues>({
    defaultValues: {
      source_name: "",
      source_type: "client",
      referred_lead_id: "",
      commission_amount: "",
      commission_paid: false,
    },
  });

  const totals = useMemo(() => {
    const list = referrals ?? [];
    const owed = list
      .filter((r) => !r.commission_paid)
      .reduce((sum, r) => sum + (r.commission_amount ?? 0), 0);
    const paid = list
      .filter((r) => r.commission_paid)
      .reduce((sum, r) => sum + (r.commission_amount ?? 0), 0);
    return { owed, paid };
  }, [referrals]);

  const topReferrers = useMemo(() => {
    const map = new Map<
      string,
      { name: string; count: number; commission: number }
    >();
    for (const r of referrals ?? []) {
      const existing = map.get(r.source_name) ?? {
        name: r.source_name,
        count: 0,
        commission: 0,
      };
      existing.count += 1;
      existing.commission += r.commission_amount ?? 0;
      map.set(r.source_name, existing);
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 5);
  }, [referrals]);

  const onSave = form.handleSubmit(async (values) => {
    setActionBusy(true);
    setActionError(null);
    try {
      await createReferral({
        source_name: values.source_name.trim(),
        source_type: values.source_type,
        referred_lead_id: values.referred_lead_id || null,
        commission_amount: values.commission_amount
          ? Number(values.commission_amount)
          : null,
        commission_paid: values.commission_paid,
      });
      setFormOpen(false);
      form.reset({
        source_name: "",
        source_type: "client",
        referred_lead_id: "",
        commission_amount: "",
        commission_paid: false,
      });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not add referral");
    } finally {
      setActionBusy(false);
    }
  });

  const togglePaid = async (id: string, paid: boolean) => {
    setActionBusy(true);
    setActionError(null);
    try {
      await updateReferral(id, { commission_paid: paid });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update referral");
    } finally {
      setActionBusy(false);
    }
  };

  if (loading) return <LoadingPage message="Loading referrals…" />;
  if (error) return <ErrorBanner message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <PrimaryButton onClick={() => setFormOpen(true)}>Add referral</PrimaryButton>
      </div>

      {actionError ? (
        <ErrorBanner message={actionError} onRetry={() => setActionError(null)} />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <KpiCard
          label="Commission owed"
          value={formatCurrency(totals.owed)}
          hint="Unpaid referrals"
          accent="accent"
        />
        <KpiCard
          label="Commission paid"
          value={formatCurrency(totals.paid)}
          hint="Paid out"
          accent="green"
        />
      </div>

      {topReferrers.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-brand-navy">Top referrers</h3>
          <ul className="mt-4 space-y-2">
            {topReferrers.map((r) => (
              <li
                key={r.name}
                className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
              >
                <span className="font-medium text-brand-navy">{r.name}</span>
                <span className="text-brand-body">
                  {r.count} referral{r.count !== 1 ? "s" : ""} · {formatCurrency(r.commission)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Referrer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Referred lead</th>
              <th className="px-4 py-3 text-right">Commission</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(referrals ?? []).length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-body">
                  No referrals recorded yet.
                </td>
              </tr>
            ) : (
              (referrals ?? []).map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-brand-navy">{r.source_name}</td>
                  <td className="px-4 py-3 text-brand-body">
                    {labelFor(REFERRAL_SOURCE_TYPES, r.source_type)}
                  </td>
                  <td className="px-4 py-3 text-brand-body">
                    {r.leads?.business_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-brand-navy">
                    {formatCurrency(r.commission_amount)}
                  </td>
                  <td className="px-4 py-3">
                    {r.commission_paid ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                        Owed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <SecondaryButton
                      disabled={actionBusy}
                      onClick={() => togglePaid(r.id, !r.commission_paid)}
                    >
                      {r.commission_paid ? "Mark unpaid" : "Mark paid"}
                    </SecondaryButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Add referral">
        <form onSubmit={onSave} className="space-y-4">
          {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}
          <FormField label="Referrer name" required>
            <input
              className={inputClass}
              {...form.register("source_name", { required: true })}
            />
          </FormField>
          <FormField label="Source type">
            <select className={selectClass} {...form.register("source_type")}>
              {REFERRAL_SOURCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Referred lead">
            <select className={selectClass} {...form.register("referred_lead_id")}>
              <option value="">—</option>
              {(leads ?? []).map((l) => (
                <option key={l.id} value={l.id}>
                  {l.business_name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Commission amount (GHS)">
            <input
              type="number"
              min="0"
              step="0.01"
              className={inputClass}
              {...form.register("commission_amount")}
            />
          </FormField>
          <label className="flex items-center gap-2 text-sm text-brand-navy">
            <input type="checkbox" {...form.register("commission_paid")} className="rounded" />
            Commission already paid
          </label>
          <div className="flex justify-end gap-2">
            <SecondaryButton type="button" onClick={() => setFormOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={actionBusy}>
              Add referral
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
