import { PageHeader } from "@/components/internal/KpiCard";
import { ProjectsManager } from "@/components/internal/projects/ProjectsManager";

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Projects"
        description="Monitor active builds, deposits, and delivery stages."
      />
      <ProjectsManager />
    </>
  );
}
