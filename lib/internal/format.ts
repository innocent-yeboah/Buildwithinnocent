import { format, parseISO, startOfMonth, startOfYear, subDays } from "date-fns";

import { CURRENCY } from "@/lib/internal/constants";

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return `${CURRENCY} 0.00`;
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  try {
    return format(parseISO(date.length === 10 ? date : date.slice(0, 10)), "dd MMM yyyy");
  } catch {
    return date;
  }
}

export function formatDateShort(date: string | null | undefined): string {
  if (!date) return "—";
  try {
    return format(parseISO(date.length === 10 ? date : date.slice(0, 10)), "dd/MM/yy");
  } catch {
    return date;
  }
}

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function monthStartISO(): string {
  return format(startOfMonth(new Date()), "yyyy-MM-dd");
}

export function yearStartISO(): string {
  return format(startOfYear(new Date()), "yyyy-MM-dd");
}

export function thirtyDaysAgoISO(): string {
  return format(subDays(new Date(), 30), "yyyy-MM-dd");
}

export function labelFor(
  items: { value: string; label: string }[],
  value: string | null | undefined
): string {
  if (!value) return "—";
  return items.find((i) => i.value === value)?.label ?? value;
}

export function projectStageProgress(stage: string): number {
  const stages = ["discovery", "design", "development", "review", "launch", "completed"];
  const idx = stages.indexOf(stage);
  if (idx < 0) return 0;
  return Math.round(((idx + 1) / stages.length) * 100);
}
