import type { ReactNode } from "react";

export function KpiCard({
  label,
  value,
  hint,
  accent = "navy",
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "navy" | "green" | "accent";
}) {
  const accentBar = {
    navy: "bg-brand-navy",
    green: "bg-brand-green",
    accent: "bg-brand-accent",
  }[accent];

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`absolute left-0 top-0 h-1 w-full ${accentBar}`} />
      <p className="text-sm font-medium text-brand-body">{label}</p>
      <p className="mt-2 text-3xl font-bold text-brand-navy">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">{title}</h1>
        {description ? <p className="mt-1 text-sm text-brand-body">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
