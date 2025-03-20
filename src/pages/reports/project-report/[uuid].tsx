import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullProject, useFullProjectReport } from "@/connections/Entity";
import { ContextCondition } from "@/context/ContextCondition";
import FrameworkProvider, { Framework } from "@/context/framework.provider";
import { useGetV2TasksIDId, useGetV2TasksUUID } from "@/generated/apiComponents";
import { ProjectReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";
import ProjectReportBreadcrumbs from "@/pages/reports/project-report/components/ProjectReportBreadcrumbs";
import ProjectReportHeader from "@/pages/reports/project-report/components/ProjectReportHeader";

import AuditLog from "./tabs/AuditLog";
import NurseryReportsTab from "./tabs/NurseryReports";
import PPCSocioeconomicTab from "./tabs/PPCSocioeconomic";
import ReportDataTab from "./tabs/ReportData";
import SiteReportsTab from "./tabs/SiteReports";
import TFSocioeconomicTab from "./tabs/TFSocioeconomic";
import UploadedFilesTab from "./tabs/UploadedFiles";

const ProjectReportDetailPage = () => {
  const uuid = useRouter().query.uuid as string;

  const t = useT();
  const [isLoaded, { entity: projectReport }] = useFullProjectReport({ uuid: uuid });

  const [, { entity: project }] = useFullProject({ uuid: projectReport?.projectUuid! });

  const { data: reportTaskUuid } = useGetV2TasksIDId(
    { pathParams: { id: projectReport?.taskId! } },
    { enabled: !!projectReport?.taskId }
  );

  const { data: reportingTaskData } = useGetV2TasksUUID(
    {
      pathParams: { uuid: reportTaskUuid?.uuid! }
    },
    {
      enabled: !!reportTaskUuid?.uuid!
    }
  );

  const reportingTask = reportingTaskData?.data as any;
  const report = (projectReport ?? {}) as ProjectReportFullDto;
  const reportTitle = report?.reportTitle ?? t("Project Report");

  return (
    <FrameworkProvider frameworkKey={report?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        <Head>
          <title>{reportTitle}</title>
        </Head>
        <ProjectReportBreadcrumbs title={reportTitle} report={report} task={reportingTask} />
        <ProjectReportHeader report={report} title={reportTitle} />
        <StatusBar entityName="project-reports" entity={report} />
        <SecondaryTabs
          tabItems={[
            {
              key: "report-data",
              title: t("Report Data"),
              body: <ReportDataTab report={report} dueAt={reportingTask?.due_at} />
            },
            {
              key: "gallery",
              title: t("Gallery"),
              body: (
                <GalleryTab
                  modelName="project-reports"
                  modelUUID={report.uuid}
                  modelTitle={t("Report")}
                  entityData={project}
                  emptyStateContent={t(
                    "Your gallery is currently empty. Add images by using the 'Edit' button on this report."
                  )}
                  sharedDriveLink={report?.sharedDriveLink!}
                />
              )
            },
            {
              key: "socioeconomic",
              title: t("Socioeconomic Data"),
              body: (
                <>
                  <ContextCondition frameworksShow={[Framework.PPC]}>
                    <PPCSocioeconomicTab report={report} />
                  </ContextCondition>
                  <ContextCondition frameworksHide={[Framework.PPC]}>
                    <TFSocioeconomicTab report={report} />
                  </ContextCondition>
                </>
              )
            },
            {
              key: "site-reports",
              title: t("Site reports"),
              body: <SiteReportsTab taskUuid={reportTaskUuid?.uuid!} />
            },
            {
              key: "nursery-reports",
              title: t("Nursery reports"),
              body: <NurseryReportsTab taskUuid={reportTaskUuid?.uuid!} />,
              hide: [Framework.PPC]
            },
            {
              key: "uploaded-files",
              title: t("Uploaded Files"),
              body: <UploadedFilesTab report={report} />
            },
            {
              key: "audit-log",
              title: t("Audit Log"),
              body: <AuditLog projectReport={report} />
            }
          ]}
          containerClassName="max-w-[82vw] px-10 xl:px-0 w-full"
        />
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default ProjectReportDetailPage;
