import { PageHeader } from "@/components/internal/KpiCard";
import { MaintenanceManager } from "@/components/internal/maintenance/MaintenanceManager";

export default function MaintenancePage() {
  return (
    <>
      <PageHeader
        title="Maintenance"
        description="Recurring plans, invoice dates, and client retainers."
      />
      <MaintenanceManager />
    </>
  );
}
