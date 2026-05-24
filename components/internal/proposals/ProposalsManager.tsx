"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { PageHeader } from "@/components/internal/KpiCard";
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
import { StatusBadge } from "@/components/internal/StatusBadge";
import { PROPOSAL_STATUSES } from "@/lib/internal/constants";
import { formatCurrency, formatDate, todayISO } from "@/lib/internal/format";
import { useLeads, useProposals } from "@/lib/internal/hooks";
import type { Proposal, ProposalStatus } from "@/lib/internal/types";

type ProposalFormValues = {
  lead_id: string;
  amount: string;
  status: ProposalStatus;
  notes: string;
};

const emptyProposalForm: ProposalFormValues = {
  lead_id: "",
  amount: "",
  status: "draft",
  notes: "",
};

function proposalToForm(p: Proposal): ProposalFormValues {
  return {
    lead_id: p.lead_id ?? "",
    amount: String(p.amount),
    status: p.status,
    notes: p.notes ?? "",
  };
}

export function ProposalsManager() {
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filters = useMemo(
    () => ({
      status: statusFilter || undefined,
      from: fromDate || undefined,
      to: toDate || undefined,
    }),
    [statusFilter, fromDate, toDate]
  );

  const { data: proposals, loading, error, refetch, createProposal, updateProposal, markSent } =
    useProposals(filters);
  const { data: leads } = useLeads();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Proposal | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const form = useForm<ProposalFormValues>({ defaultValues: emptyProposalForm });

  const openCreate = () => {
    setEditing(null);
    form.reset(emptyProposalForm);
    setFormOpen(true);
    setActionError(null);
  };

  const openEdit = (p: Proposal) => {
    setEditing(p);
    form.reset(proposalToForm(p));
    setFormOpen(true);
    setActionError(null);
  };

  const onSave = form.handleSubmit(async (values) => {
    setActionBusy(true);
    setActionError(null);
    try {
      const payload = {
        lead_id: values.lead_id || null,
        amount: Number(values.amount),
        status: values.status,
        notes: values.notes.trim() || null,
        sent_date: editing?.sent_date ?? null,
        viewed_date: editing?.viewed_date ?? null,
        accepted_date: editing?.accepted_date ?? null,
        follow_up_date: editing?.follow_up_date ?? null,
      };
      if (editing) {
        await updateProposal(editing.id, payload);
      } else {
        await createProposal(payload);
      }
      setFormOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not save proposal");
    } finally {
      setActionBusy(false);
    }
  });

  const copyLink = async (id: string) => {
    const url = `${window.location.origin}/proposal/${id}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const runAction = async (fn: () => Promise<void>) => {
    setActionBusy(true);
    setActionError(null);
    try {
      await fn();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionBusy(false);
    }
  };

  const sendFollowUpReminder = async (p: Proposal) => {
    const followUp = new Date();
    followUp.setDate(followUp.getDate() + 3);
    const dateStr = followUp.toISOString().slice(0, 10);
    const alertLine = `[${todayISO()}] Follow-up reminder scheduled for ${dateStr}`;
    const notes = [p.notes, alertLine].filter(Boolean).join("\n");
    await updateProposal(p.id, {
      follow_up_date: dateStr,
      notes,
    });
  };

  if (loading) return <LoadingPage message="Loading proposals…" />;
  if (error) return <ErrorBanner message={error} onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Proposals"
        description="Create, send, and track client proposals."
      />

      {actionError && !formOpen ? (
        <ErrorBanner message={actionError} onRetry={() => setActionError(null)} />
      ) : null}

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-body">Status</label>
          <select
            className={selectClass}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            {PROPOSAL_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-body">Sent from</label>
          <input
            type="date"
            className={inputClass}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-body">Sent to</label>
          <input
            type="date"
            className={inputClass}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <PrimaryButton onClick={openCreate}>Add proposal</PrimaryButton>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sent</th>
              <th className="px-4 py-3">Follow-up</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(proposals ?? []).length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-body">
                  No proposals match your filters.
                </td>
              </tr>
            ) : (
              (proposals ?? []).map((p) => {
                const overdue =
                  p.follow_up_date &&
                  p.follow_up_date < todayISO() &&
                  !["accepted", "rejected", "expired"].includes(p.status);
                return (
                  <tr key={p.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-navy">
                        {p.leads?.business_name ?? "—"}
                      </p>
                      <p className="text-xs text-brand-body">
                        {p.proposal_number ?? p.id.slice(0, 8)}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-medium text-brand-navy">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge type="proposal" value={p.status} />
                    </td>
                    <td className="px-4 py-3 text-brand-body">{formatDate(p.sent_date)}</td>
                    <td className="px-4 py-3">
                      <span className={overdue ? "font-medium text-amber-700" : "text-brand-body"}>
                        {formatDate(p.follow_up_date)}
                      </span>
                      {overdue ? (
                        <span className="mt-0.5 block text-xs text-amber-600">Overdue</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <SecondaryButton onClick={() => openEdit(p)}>Edit</SecondaryButton>
                        <SecondaryButton onClick={() => copyLink(p.id)}>
                          {copiedId === p.id ? "Copied!" : "Copy link"}
                        </SecondaryButton>
                        {p.status === "draft" ? (
                          <PrimaryButton
                            disabled={actionBusy}
                            onClick={() => runAction(() => markSent(p.id))}
                          >
                            Mark sent
                          </PrimaryButton>
                        ) : null}
                        {["sent", "viewed"].includes(p.status) ? (
                          <>
                            <PrimaryButton
                              disabled={actionBusy}
                              onClick={() =>
                                runAction(() =>
                                  updateProposal(p.id, {
                                    status: "accepted",
                                    accepted_date: todayISO(),
                                  })
                                )
                              }
                            >
                              Accepted
                            </PrimaryButton>
                            <SecondaryButton
                              onClick={() =>
                                runAction(() => updateProposal(p.id, { status: "rejected" }))
                              }
                            >
                              Rejected
                            </SecondaryButton>
                            <SecondaryButton
                              disabled={actionBusy}
                              onClick={() => runAction(() => sendFollowUpReminder(p))}
                            >
                              Follow-up
                            </SecondaryButton>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit proposal" : "Add proposal"}
        wide
      >
        <form onSubmit={onSave} className="space-y-4">
          {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}
          <FormField label="Lead">
            <select className={selectClass} {...form.register("lead_id")}>
              <option value="">No linked lead</option>
              {(leads ?? []).map((l) => (
                <option key={l.id} value={l.id}>
                  {l.business_name}
                </option>
              ))}
            </select>
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Amount (GHS)" error={form.formState.errors.amount?.message} required>
              <input
                type="number"
                min="0"
                step="0.01"
                className={inputClass}
                {...form.register("amount", { required: "Required" })}
              />
            </FormField>
            <FormField label="Status">
              <select className={selectClass} {...form.register("status")}>
                {PROPOSAL_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="Notes">
            <textarea className={textareaClass} {...form.register("notes")} />
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <SecondaryButton type="button" onClick={() => setFormOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={actionBusy}>
              {actionBusy ? "Saving…" : "Save proposal"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
