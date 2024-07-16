import { useT } from "@transifex/react";

import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import { useReportingWindow } from "@/hooks/useReportingWindow";

interface ProjectReportBreadcrumbsProps {
  title: string;
  report: any;
  task: any;
}

export const ProjectReportBreadcrumbs = ({ title, report, task }: ProjectReportBreadcrumbsProps) => {
  const t = useT();
  const window = useReportingWindow(task?.due_at);
  const taskTitle = t("Reporting Task {window}", { window });

  return (
    <PageBreadcrumbs
      links={[
        { title: t("My Projects"), path: "/my-projects" },
        { title: report.project?.name ?? t("Project"), path: `/project/${report.project?.uuid}` },
        { title: taskTitle, path: `/project/${report.project?.uuid}/reporting-task/${report.task_uuid}` },
        { title }
      ]}
    />
  );
};
