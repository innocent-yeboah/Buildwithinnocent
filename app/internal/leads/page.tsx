import { LeadsManager } from "@/components/internal/leads/LeadsManager";
import { PageHeader } from "@/components/internal/KpiCard";

export default function LeadsPage() {
  return (
    <>
      <PageHeader
        title="Leads"
        description="Track prospects, log contact, and move deals forward."
      />
      <LeadsManager />
    </>
  );
}
