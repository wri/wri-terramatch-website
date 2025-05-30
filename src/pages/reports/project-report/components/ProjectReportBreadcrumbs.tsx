import { useT } from "@transifex/react";

import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import { ProjectReportFullDto, TaskFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useReportingWindow } from "@/hooks/useReportingWindow";

interface ProjectReportBreadcrumbsProps {
  title: string;
  report?: ProjectReportFullDto;
  task?: TaskFullDto;
}

const ProjectReportBreadcrumbs = ({ title, report, task }: ProjectReportBreadcrumbsProps) => {
  const t = useT();
  const window = useReportingWindow(task?.dueAt);
  const taskTitle = t("Reporting Task {window}", { window });

  return (
    <PageBreadcrumbs
      links={[
        { title: t("My Projects"), path: "/my-projects" },
        { title: report?.projectName ?? t("Project"), path: `/project/${report?.projectUuid}` },
        { title: taskTitle, path: `/project/${report?.projectUuid}/reporting-task/${report?.taskUuid}` },
        { title }
      ]}
    />
  );
};

export default ProjectReportBreadcrumbs;
