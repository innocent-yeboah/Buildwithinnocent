import { PageHeader } from "@/components/internal/KpiCard";
import { ProposalsManager } from "@/components/internal/proposals/ProposalsManager";

export default function ProposalsPage() {
  return (
    <>
      <PageHeader
        title="Proposals"
        description="Create, send, and follow up on client proposals."
      />
      <ProposalsManager />
    </>
  );
}
