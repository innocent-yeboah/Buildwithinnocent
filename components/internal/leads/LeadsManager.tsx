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
import { LEAD_SOURCES, LEAD_STATUSES } from "@/lib/internal/constants";
import { formatCurrency, formatDate, labelFor, todayISO } from "@/lib/internal/format";
import { useLeads, useProposals } from "@/lib/internal/hooks";
import type { Lead, LeadInsert, LeadSource, LeadStatus } from "@/lib/internal/types";

type LeadFormValues = {
  business_name: string;
  contact_name: string;
  phone: string;
  email: string;
  source: LeadSource | "";
  status: LeadStatus;
  estimated_value: string;
  notes: string;
};

const emptyLeadForm: LeadFormValues = {
  business_name: "",
  contact_name: "",
  phone: "",
  email: "",
  source: "",
  status: "new",
  estimated_value: "",
  notes: "",
};

function leadToForm(lead: Lead): LeadFormValues {
  return {
    business_name: lead.business_name,
    contact_name: lead.contact_name ?? "",
    phone: lead.phone ?? "",
    email: lead.email ?? "",
    source: lead.source ?? "",
    status: lead.status,
    estimated_value: lead.estimated_value != null ? String(lead.estimated_value) : "",
    notes: lead.notes ?? "",
  };
}

function formToPayload(values: LeadFormValues): LeadInsert {
  return {
    business_name: values.business_name.trim(),
    contact_name: values.contact_name.trim() || null,
    phone: values.phone.trim() || null,
    email: values.email.trim() || null,
    source: values.source || null,
    status: values.status,
    estimated_value: values.estimated_value ? Number(values.estimated_value) : null,
    notes: values.notes.trim() || null,
    last_contact: null,
    next_action: null,
    next_action_date: null,
  };
}

export function LeadsManager() {
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filters = useMemo(
    () => ({
      status: statusFilter || undefined,
      source: sourceFilter || undefined,
      from: fromDate || undefined,
      to: toDate ? `${toDate}T23:59:59` : undefined,
    }),
    [statusFilter, sourceFilter, fromDate, toDate]
  );

  const { data: leads, loading, error, refetch, createLead, updateLead, logContact } =
    useLeads(filters);
  const { createProposal } = useProposals();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const selectedLead = leads?.find((l) => l.id === selectedId) ?? null;

  const leadForm = useForm<LeadFormValues>({ defaultValues: emptyLeadForm });
  const contactForm = useForm<{ note: string }>({ defaultValues: { note: "" } });
  const scheduleForm = useForm<{ next_action: string; next_action_date: string }>({
    defaultValues: { next_action: "", next_action_date: todayISO() },
  });

  const openCreate = () => {
    setEditingLead(null);
    leadForm.reset(emptyLeadForm);
    setFormOpen(true);
    setActionError(null);
  };

  const openEdit = (lead: Lead) => {
    setEditingLead(lead);
    leadForm.reset(leadToForm(lead));
    setFormOpen(true);
    setActionError(null);
  };

  const onSaveLead = leadForm.handleSubmit(async (values) => {
    setActionBusy(true);
    setActionError(null);
    try {
      const payload = formToPayload(values);
      if (editingLead) await updateLead(editingLead.id, payload);
      else await createLead(payload);
      setFormOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not save lead");
    } finally {
      setActionBusy(false);
    }
  });

  const onLogContact = contactForm.handleSubmit(async ({ note }) => {
    if (!selectedLead) return;
    setActionBusy(true);
    setActionError(null);
    try {
      await logContact(selectedLead.id, note.trim() || undefined);
      setContactOpen(false);
      contactForm.reset({ note: "" });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not log contact");
    } finally {
      setActionBusy(false);
    }
  });

  const onSchedule = scheduleForm.handleSubmit(async (values) => {
    if (!selectedLead) return;
    setActionBusy(true);
    setActionError(null);
    try {
      await updateLead(selectedLead.id, {
        next_action: values.next_action.trim() || null,
        next_action_date: values.next_action_date || null,
      });
      setScheduleOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not schedule action");
    } finally {
      setActionBusy(false);
    }
  });

  const onConvertToProposal = async () => {
    if (!selectedLead) return;
    setActionBusy(true);
    setActionError(null);
    try {
      await createProposal({
        lead_id: selectedLead.id,
        amount: selectedLead.estimated_value ?? 0,
        status: "draft",
        sent_date: null,
        viewed_date: null,
        accepted_date: null,
        follow_up_date: null,
        notes: `Draft proposal for ${selectedLead.business_name}`,
      });
      await updateLead(selectedLead.id, { status: "proposal_sent" });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not create proposal");
    } finally {
      setActionBusy(false);
    }
  };

  if (loading) return <LoadingPage message="Loading leads…" />;
  if (error) return <ErrorBanner message={error} onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Leads"
        description="Track prospects from first contact to close."
      />

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-body">Status</label>
          <select
            className={selectClass}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-body">Source</label>
          <select
            className={selectClass}
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="">All sources</option>
            {LEAD_SOURCES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-body">From</label>
          <input
            type="date"
            className={inputClass}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-body">To</label>
          <input
            type="date"
            className={inputClass}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <PrimaryButton onClick={openCreate}>Add lead</PrimaryButton>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className={selectedLead ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Next action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(leads ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-brand-body">
                      No leads match your filters.
                    </td>
                  </tr>
                ) : (
                  (leads ?? []).map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedId(lead.id)}
                      className={`cursor-pointer transition hover:bg-brand-tint/40 ${
                        selectedId === lead.id ? "bg-brand-tint/60" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-brand-navy">
                        {lead.business_name}
                      </td>
                      <td className="px-4 py-3 text-brand-body">
                        {lead.contact_name ?? lead.email ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-brand-body">
                        {labelFor(LEAD_SOURCES, lead.source)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge type="lead" value={lead.status} />
                      </td>
                      <td className="px-4 py-3 text-brand-navy">
                        {formatCurrency(lead.estimated_value)}
                      </td>
                      <td className="px-4 py-3 text-brand-body">
                        {lead.next_action_date ? formatDate(lead.next_action_date) : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedLead ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-brand-navy">
                  {selectedLead.business_name}
                </h2>
                <StatusBadge type="lead" value={selectedLead.status} />
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="text-slate-400 hover:text-brand-navy"
                aria-label="Close panel"
              >
                ✕
              </button>
            </div>

            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Contact</dt>
                <dd className="text-brand-navy">
                  {selectedLead.contact_name ?? "—"}
                  {selectedLead.email ? (
                    <span className="block text-brand-body">{selectedLead.email}</span>
                  ) : null}
                  {selectedLead.phone ? (
                    <span className="block text-brand-body">{selectedLead.phone}</span>
                  ) : null}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Source</dt>
                <dd className="text-brand-body">
                  {labelFor(LEAD_SOURCES, selectedLead.source)}
                  {selectedLead.website_lead_id ? (
                    <span className="mt-1 block text-xs font-medium text-brand-green">
                      Website form submission
                    </span>
                  ) : null}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Estimated value</dt>
                <dd className="font-medium text-brand-navy">
                  {formatCurrency(selectedLead.estimated_value)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Last contact</dt>
                <dd className="text-brand-body">{formatDate(selectedLead.last_contact)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Next action</dt>
                <dd className="text-brand-body">
                  {selectedLead.next_action ?? "—"}
                  {selectedLead.next_action_date ? (
                    <span className="block text-xs text-slate-500">
                      {formatDate(selectedLead.next_action_date)}
                    </span>
                  ) : null}
                </dd>
              </div>
              {selectedLead.notes ? (
                <div>
                  <dt className="text-xs text-slate-500">Notes</dt>
                  <dd className="whitespace-pre-wrap text-brand-body">{selectedLead.notes}</dd>
                </div>
              ) : null}
            </dl>

            {actionError ? <p className="mt-3 text-xs text-red-600">{actionError}</p> : null}

            <div className="mt-5 flex flex-wrap gap-2">
              <SecondaryButton onClick={() => openEdit(selectedLead)}>Edit</SecondaryButton>
              <SecondaryButton onClick={() => setContactOpen(true)}>Log contact</SecondaryButton>
              <SecondaryButton
                onClick={() => {
                  scheduleForm.reset({
                    next_action: selectedLead.next_action ?? "",
                    next_action_date: selectedLead.next_action_date ?? todayISO(),
                  });
                  setScheduleOpen(true);
                }}
              >
                Schedule action
              </SecondaryButton>
              <PrimaryButton disabled={actionBusy} onClick={onConvertToProposal}>
                Convert to proposal
              </PrimaryButton>
            </div>
          </div>
        ) : null}
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingLead ? "Edit lead" : "Add lead"}
        wide
      >
        <form onSubmit={onSaveLead} className="space-y-4">
          {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Business name" error={leadForm.formState.errors.business_name?.message} required>
              <input
                className={inputClass}
                {...leadForm.register("business_name", { required: "Required" })}
              />
            </FormField>
            <FormField label="Contact name">
              <input className={inputClass} {...leadForm.register("contact_name")} />
            </FormField>
            <FormField label="Email">
              <input type="email" className={inputClass} {...leadForm.register("email")} />
            </FormField>
            <FormField label="Phone">
              <input className={inputClass} {...leadForm.register("phone")} />
            </FormField>
            <FormField label="Source">
              <select className={selectClass} {...leadForm.register("source")}>
                <option value="">—</option>
                {LEAD_SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Status">
              <select className={selectClass} {...leadForm.register("status")}>
                {LEAD_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Estimated value (GHS)">
              <input
                type="number"
                min="0"
                step="0.01"
                className={inputClass}
                {...leadForm.register("estimated_value")}
              />
            </FormField>
          </div>
          <FormField label="Notes">
            <textarea className={textareaClass} {...leadForm.register("notes")} />
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <SecondaryButton type="button" onClick={() => setFormOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={actionBusy}>
              {actionBusy ? "Saving…" : "Save lead"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title="Log contact">
        <form onSubmit={onLogContact} className="space-y-4">
          <FormField label="Note (optional)">
            <textarea className={textareaClass} {...contactForm.register("note")} />
          </FormField>
          <div className="flex justify-end gap-2">
            <SecondaryButton type="button" onClick={() => setContactOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={actionBusy}>
              Log contact
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal open={scheduleOpen} onClose={() => setScheduleOpen(false)} title="Schedule next action">
        <form onSubmit={onSchedule} className="space-y-4">
          <FormField label="Action" required>
            <input
              className={inputClass}
              {...scheduleForm.register("next_action", { required: true })}
            />
          </FormField>
          <FormField label="Date" required>
            <input
              type="date"
              className={inputClass}
              {...scheduleForm.register("next_action_date", { required: true })}
            />
          </FormField>
          <div className="flex justify-end gap-2">
            <SecondaryButton type="button" onClick={() => setScheduleOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={actionBusy}>
              Save
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
