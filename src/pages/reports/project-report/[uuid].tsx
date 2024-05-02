import { useT } from "@transifex/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2ENTITYUUID, useGetV2ProjectsUUID, useGetV2TasksUUID } from "@/generated/apiComponents";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useFramework } from "@/hooks/useFramework";
import { useGetReportingWindow } from "@/hooks/useGetReportingWindow";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";

import NurseryReportsTab from "./tabs/NurseryReports";
import PPCSocioeconomicTab from "./tabs/PPCSocioeconomic";
import ReportDataTab from "./tabs/ReportData";
import SiteReportsTab from "./tabs/SiteReports";
import TFSocioeconomicTab from "./tabs/TFSocioeconomic";
import UploadedFilesTab from "./tabs/UploadedFiles";

const ProjectReportDetailPage = () => {
  const uuid = useRouter().query.uuid as string;
  const { getReportingWindow } = useGetReportingWindow();

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

  const report = data?.data || {};
  const { isPPC } = useFramework(report);

  const taskTitle =
    t("Reporting Task") + ` ${getReportingWindow(reportingTask?.due_at, isPPC ? "quarterly" : "bi-annually")}`;
  const reportTitle = report.report_title || report.title || t("Project Report");
  const { handleExport } = useGetExportEntityHandler("project-reports", uuid, report?.title);
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "project-reports",
    entityUUID: uuid,
    entityStatus: report?.status,
    updateRequestStatus: report.update_request_status
  });

  return (
    <LoadingContainer loading={isLoading}>
      <Head>
        <title>{reportTitle}</title>
      </Head>
      <PageBreadcrumbs
        links={[
          { title: t("My Projects"), path: "/my-projects" },
          { title: report.project?.name || t("Project"), path: `/project/${report.project?.uuid}` },
          { title: taskTitle, path: `/project/${report.project?.uuid}/reporting-task/${report.task_uuid}` },
          { title: reportTitle }
        ]}
      />
      <PageHeader
        className="h-[203px]"
        title={reportTitle}
        subtitles={[report.project?.name, isPPC ? t("Priceless Planet Coalition") : t("TerraFund")]}
        hasBackButton={false}
      >
        <If condition={report?.status === "started"}>
          <Then>
            <Button as={Link} href={`/entity/project-reports/edit/${uuid}`}>
              {t("Continue Report")}
            </Button>
          </Then>
          <Else>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={handleExport}>
                {t("Export")}
              </Button>
              <Button onClick={handleEdit}>{t("Edit")}</Button>
            </div>
          </Else>
        </If>
      </PageHeader>
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
                boundaryGeojson={project?.data?.boundary_geojson}
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
              <If condition={isPPC}>
                <Then>
                  <PPCSocioeconomicTab report={report} />
                </Then>
                <Else>
                  <TFSocioeconomicTab report={report} />
                </Else>
              </If>
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
            hidden: isPPC
          },
          {
            key: "uploaded-files",
            title: t("Uploaded Files"),
            body: <UploadedFilesTab report={report} />
          }
        ]}
        containerClassName="max-w-7xl px-10 xl:px-0 w-full overflow-auto"
      />
    </LoadingContainer>
  );
};

export default ProjectReportDetailPage;
