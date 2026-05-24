import { DashboardView } from "@/components/internal/dashboard/DashboardView";
import { PageHeader } from "@/components/internal/KpiCard";
import { getDashboardData } from "@/lib/internal/queries";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <>
      <PageHeader
        title="Overview"
        description="Your business at a glance — leads, revenue, and what needs attention today."
      />
      <DashboardView data={data} />
    </>
  );
}
