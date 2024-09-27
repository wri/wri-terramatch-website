import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { ContextCondition } from "@/context/ContextCondition";
import FrameworkProvider, { Framework } from "@/context/framework.provider";
import { useGetV2ENTITYUUID, useGetV2ProjectsUUID, useGetV2TasksUUID } from "@/generated/apiComponents";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";
import ProjectReportBreadcrumbs from "@/pages/reports/project-report/components/ProjectReportBreadcrumbs";
import ProjectReportHeader from "@/pages/reports/project-report/components/ProjectReportHeader";

import NurseryReportsTab from "./tabs/NurseryReports";
import PPCSocioeconomicTab from "./tabs/PPCSocioeconomic";
import ReportDataTab from "./tabs/ReportData";
import SiteReportsTab from "./tabs/SiteReports";
import TFSocioeconomicTab from "./tabs/TFSocioeconomic";
import UploadedFilesTab from "./tabs/UploadedFiles";

const ProjectReportDetailPage = () => {
  const uuid = useRouter().query.uuid as string;

  const t = useT();
  const { data, isLoading } = useGetV2ENTITYUUID(
    {
      pathParams: { entity: "project-reports", uuid }
    },
    {
      enabled: !!uuid
    }
  );

  const { data: project } = useGetV2ProjectsUUID(
    {
      pathParams: { uuid: data?.data?.project?.uuid }
    },
    {
      enabled: !!data?.data?.project?.uuid
    }
  );

  const { data: reportingTaskData } = useGetV2TasksUUID(
    {
      pathParams: { uuid: data?.data?.task_uuid }
    },
    {
      enabled: !!data?.data?.task_uuid
    }
  );

  const reportingTask = reportingTaskData?.data as any;
  const report = data?.data ?? {};
  const reportTitle = report.report_title ?? report.title ?? t("Project Report");

  return (
    <FrameworkProvider frameworkKey={report.framework_key}>
      <LoadingContainer loading={isLoading}>
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
                  // @ts-ignore incorrect docs
                  entityData={project}
                  emptyStateContent={t(
                    "Your gallery is currently empty. Add images by using the 'Edit' button on this report."
                  )}
                  sharedDriveLink={report?.shared_drive_link}
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
              body: <SiteReportsTab taskUuid={report.task_uuid} />
            },
            {
              key: "nursery-reports",
              title: t("Nursery reports"),
              body: <NurseryReportsTab taskUuid={report.task_uuid} />,
              hide: [Framework.PPC]
            },
            {
              key: "uploaded-files",
              title: t("Uploaded Files"),
              body: <UploadedFilesTab report={report} />
            }
          ]}
          containerClassName="max-w-[82vw] px-10 xl:px-0 w-full"
        />
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default ProjectReportDetailPage;
