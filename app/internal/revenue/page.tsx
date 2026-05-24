import { PageHeader } from "@/components/internal/KpiCard";
import { RevenueManager } from "@/components/internal/revenue/RevenueManager";

export default function RevenuePage() {
  return (
    <>
      <PageHeader
        title="Revenue"
        description="Income tracking, MRR, and outstanding balances."
      />
      <RevenueManager />
    </>
  );
}
