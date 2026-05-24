import { LEAD_STATUSES, PROPOSAL_STATUSES } from "@/lib/internal/constants";

export function StatusBadge({
  type,
  value,
}: {
  type: "lead" | "proposal";
  value: string;
}) {
  const list = type === "lead" ? LEAD_STATUSES : PROPOSAL_STATUSES;
  const item = list.find((s) => s.value === value);
  const color = item?.color ?? "bg-slate-100 text-slate-700";
  const label = item?.label ?? value;

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

export function StageBadge({ stage }: { stage: string }) {
  const labels: Record<string, string> = {
    discovery: "Discovery",
    design: "Design",
    development: "Development",
    review: "Review",
    launch: "Launch",
    completed: "Completed",
  };
  return (
    <span className="inline-flex rounded-full bg-brand-tint px-2.5 py-0.5 text-xs font-medium text-brand-green">
      {labels[stage] ?? stage}
    </span>
  );
}
