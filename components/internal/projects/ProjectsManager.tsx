"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

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
import { StageBadge } from "@/components/internal/StatusBadge";
import { PROJECT_STAGES } from "@/lib/internal/constants";
import {
  formatCurrency,
  formatDate,
  projectStageProgress,
  todayISO,
} from "@/lib/internal/format";
import { useLeads, useProjects } from "@/lib/internal/hooks";
import type { Project, ProjectStage } from "@/lib/internal/types";

type ProjectFormValues = {
  client_name: string;
  project_name: string;
  lead_id: string;
  stage: ProjectStage;
  deposit_amount: string;
  total_amount: string;
  balance_due: string;
  estimated_delivery_date: string;
  notes: string;
};

const emptyProjectForm: ProjectFormValues = {
  client_name: "",
  project_name: "",
  lead_id: "",
  stage: "discovery",
  deposit_amount: "",
  total_amount: "",
  balance_due: "",
  estimated_delivery_date: "",
  notes: "",
};

function projectToForm(p: Project): ProjectFormValues {
  return {
    client_name: p.client_name,
    project_name: p.project_name,
    lead_id: p.lead_id ?? "",
    stage: p.stage,
    deposit_amount: p.deposit_amount != null ? String(p.deposit_amount) : "",
    total_amount: p.total_amount != null ? String(p.total_amount) : "",
    balance_due: p.balance_due != null ? String(p.balance_due) : "",
    estimated_delivery_date: p.estimated_delivery_date ?? "",
    notes: p.notes ?? "",
  };
}

function formToPayload(values: ProjectFormValues) {
  return {
    client_name: values.client_name.trim(),
    project_name: values.project_name.trim(),
    lead_id: values.lead_id || null,
    stage: values.stage,
    deposit_amount: values.deposit_amount ? Number(values.deposit_amount) : null,
    total_amount: values.total_amount ? Number(values.total_amount) : null,
    balance_due: values.balance_due ? Number(values.balance_due) : null,
    deposit_received: false,
    deposit_received_date: null,
    estimated_delivery_date: values.estimated_delivery_date || null,
    actual_delivery_date: null,
    notes: values.notes.trim() || null,
  };
}

export function ProjectsManager() {
  const {
    data: projects,
    loading,
    error,
    refetch,
    createProject,
    updateProject,
    advanceStage,
    recordDeposit,
  } = useProjects();
  const { data: leads } = useLeads();

  const [formOpen, setFormOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [noteTarget, setNoteTarget] = useState<Project | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const form = useForm<ProjectFormValues>({ defaultValues: emptyProjectForm });
  const noteForm = useForm<{ note: string }>({ defaultValues: { note: "" } });

  const openCreate = () => {
    setEditing(null);
    form.reset(emptyProjectForm);
    setFormOpen(true);
    setActionError(null);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    form.reset(projectToForm(p));
    setFormOpen(true);
    setActionError(null);
  };

  const onSave = form.handleSubmit(async (values) => {
    setActionBusy(true);
    setActionError(null);
    try {
      const payload = formToPayload(values);
      if (editing) {
        await updateProject(editing.id, {
          ...payload,
          deposit_received: editing.deposit_received,
          deposit_received_date: editing.deposit_received_date,
          actual_delivery_date: editing.actual_delivery_date,
        });
      } else {
        await createProject(payload);
      }
      setFormOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not save project");
    } finally {
      setActionBusy(false);
    }
  });

  const onAddNote = noteForm.handleSubmit(async ({ note }) => {
    if (!noteTarget || !note.trim()) return;
    setActionBusy(true);
    setActionError(null);
    try {
      const line = `[${todayISO()}] ${note.trim()}`;
      const notes = [noteTarget.notes, line].filter(Boolean).join("\n");
      await updateProject(noteTarget.id, { notes });
      setNoteOpen(false);
      noteForm.reset({ note: "" });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not add note");
    } finally {
      setActionBusy(false);
    }
  });

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

  if (loading) return <LoadingPage message="Loading projects…" />;
  if (error) return <ErrorBanner message={error} onRetry={refetch} />;

  return (
    <div className="space-y-4">
      {actionError && !formOpen && !noteOpen ? (
        <ErrorBanner message={actionError} onRetry={() => setActionError(null)} />
      ) : null}

      <div className="flex justify-end">
        <PrimaryButton onClick={openCreate}>Add project</PrimaryButton>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Deposit</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(projects ?? []).length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-brand-body">
                  No projects yet.
                </td>
              </tr>
            ) : (
              (projects ?? []).map((p) => {
                const progress = projectStageProgress(p.stage);
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-navy">{p.project_name}</p>
                      <p className="text-xs text-brand-body">{p.client_name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StageBadge stage={p.stage} />
                    </td>
                    <td className="px-4 py-3 min-w-[140px]">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-brand-green transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{progress}%</p>
                    </td>
                    <td className="px-4 py-3">
                      {p.deposit_received ? (
                        <span className="text-brand-green">Received</span>
                      ) : (
                        <span className="text-brand-body">
                          {formatCurrency(p.deposit_amount)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brand-navy">
                      {formatCurrency(p.balance_due)}
                    </td>
                    <td className="px-4 py-3 text-brand-body">
                      {formatDate(p.estimated_delivery_date)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <SecondaryButton onClick={() => openEdit(p)}>Edit</SecondaryButton>
                        {p.stage !== "completed" ? (
                          <PrimaryButton
                            disabled={actionBusy}
                            onClick={() => runAction(() => advanceStage(p))}
                          >
                            Advance
                          </PrimaryButton>
                        ) : null}
                        {!p.deposit_received ? (
                          <SecondaryButton
                            disabled={actionBusy}
                            onClick={() => runAction(() => recordDeposit(p))}
                          >
                            Record deposit
                          </SecondaryButton>
                        ) : null}
                        <SecondaryButton
                          onClick={() => {
                            setNoteTarget(p);
                            noteForm.reset({ note: "" });
                            setNoteOpen(true);
                          }}
                        >
                          Add note
                        </SecondaryButton>
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
        title={editing ? "Edit project" : "Add project"}
        wide
      >
        <form onSubmit={onSave} className="space-y-4">
          {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Client name" required>
              <input
                className={inputClass}
                {...form.register("client_name", { required: true })}
              />
            </FormField>
            <FormField label="Project name" required>
              <input
                className={inputClass}
                {...form.register("project_name", { required: true })}
              />
            </FormField>
            <FormField label="Linked lead">
              <select className={selectClass} {...form.register("lead_id")}>
                <option value="">—</option>
                {(leads ?? []).map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.business_name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Stage">
              <select className={selectClass} {...form.register("stage")}>
                {PROJECT_STAGES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Deposit amount">
              <input type="number" min="0" step="0.01" className={inputClass} {...form.register("deposit_amount")} />
            </FormField>
            <FormField label="Total amount">
              <input type="number" min="0" step="0.01" className={inputClass} {...form.register("total_amount")} />
            </FormField>
            <FormField label="Balance due">
              <input type="number" min="0" step="0.01" className={inputClass} {...form.register("balance_due")} />
            </FormField>
            <FormField label="Est. delivery">
              <input type="date" className={inputClass} {...form.register("estimated_delivery_date")} />
            </FormField>
          </div>
          <FormField label="Notes">
            <textarea className={textareaClass} {...form.register("notes")} />
          </FormField>
          <div className="flex justify-end gap-2">
            <SecondaryButton type="button" onClick={() => setFormOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={actionBusy}>
              Save
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal open={noteOpen} onClose={() => setNoteOpen(false)} title="Add project note">
        <form onSubmit={onAddNote} className="space-y-4">
          <FormField label="Note" required>
            <textarea
              className={textareaClass}
              {...noteForm.register("note", { required: true })}
            />
          </FormField>
          <div className="flex justify-end gap-2">
            <SecondaryButton type="button" onClick={() => setNoteOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={actionBusy}>
              Add note
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
