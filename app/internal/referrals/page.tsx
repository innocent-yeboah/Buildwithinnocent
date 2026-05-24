import { PageHeader } from "@/components/internal/KpiCard";
import { ReferralsManager } from "@/components/internal/referrals/ReferralsManager";

export default function ReferralsPage() {
  return (
    <>
      <PageHeader
        title="Referrals"
        description="Track who sent business your way and commission owed."
      />
      <ReferralsManager />
    </>
  );
}
