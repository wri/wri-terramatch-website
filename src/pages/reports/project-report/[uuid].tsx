import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useMemo } from "react";

import SecondaryTabs, { TabItem } from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import EntityStatusBar from "@/components/extensive/EntityStatusBar";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullProject, useFullProjectReport } from "@/connections/Entity";
import { useTask } from "@/connections/Task";
import { ContextCondition } from "@/context/ContextCondition";
import FrameworkProvider, { Framework } from "@/context/framework.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { ProjectFullDto, ProjectReportFullDto, TaskFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useValueChanged } from "@/hooks/useValueChanged";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";
import ProjectReportBreadcrumbs from "@/pages/reports/project-report/components/ProjectReportBreadcrumbs";
import ProjectReportHeader from "@/pages/reports/project-report/components/ProjectReportHeader";
import Log from "@/utils/log";

import AuditLog from "./tabs/AuditLog";
import ProjectReportDetailsTab from "./tabs/Details";
import NurseryReportsTab from "./tabs/NurseryReports";
import PPCSocioeconomicTab from "./tabs/PPCSocioeconomic";
import ReportDataTab from "./tabs/ReportData";
import SiteReportsTab from "./tabs/SiteReports";
import TFSocioeconomicTab from "./tabs/TFSocioeconomic";
import UploadedFilesTab from "./tabs/UploadedFiles";

type ProjectReportPageContentProps = {
  report: ProjectReportFullDto;
  projectReport: ProjectReportFullDto;
  project?: ProjectFullDto | null;
  task?: TaskFullDto;
};

const ProjectReportPageContent: FC<ProjectReportPageContentProps> = ({ report, projectReport, project, task }) => {
  const t = useT();

  const tabItems = useMemo<TabItem[]>(
    () => [
      {
        key: "report-data",
        title: t("Report Data"),
        renderBody: () => <ReportDataTab report={report} dueAt={task?.dueAt} />
      },
      {
        key: "details",
        title: t("Report Details"),
        renderBody: () => <ProjectReportDetailsTab report={report} />
      },
      {
        key: "gallery",
        title: t("Gallery"),
        renderBody: () => (
          <GalleryTab
            modelName="projectReports"
            modelUUID={report.uuid}
            modelTitle={t("Report")}
            entityData={project}
            emptyStateContent={t(
              "Your gallery is currently empty. Add images by using the 'Edit' button on this report."
            )}
            sharedDriveLink={report.sharedDriveLink!}
          />
        )
      },
      {
        key: "socioeconomic",
        title: t("Socioeconomic Data"),
        renderBody: () => (
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
        renderBody: () => <SiteReportsTab taskUuid={projectReport.taskUuid!} />
      },
      {
        key: "nursery-reports",
        title: t("Nursery reports"),
        renderBody: () => <NurseryReportsTab taskUuid={projectReport.taskUuid!} />,
        hide: [Framework.PPC]
      },
      {
        key: "uploaded-files",
        title: t("Uploaded Files"),
        renderBody: () => <UploadedFilesTab report={report} />
      },
      {
        key: "audit-log",
        title: t("Audit Log"),
        renderBody: () => <AuditLog projectReport={report} />
      }
    ],
    [report, projectReport.taskUuid, project, task?.dueAt, t]
  );

  const reportTitle = report.reportTitle ?? t("Project Report");

  return (
    <>
      <Head>
        <title>{reportTitle}</title>
      </Head>
      <ProjectReportBreadcrumbs title={reportTitle} report={report} task={task} />
      <ProjectReportHeader report={report} title={reportTitle} />
      <EntityStatusBar entityName="projectReports" entity={report} />
      <PageBody className="pt-0">
        <SecondaryTabs tabItems={tabItems} containerClassName="max-w-[82vw] px-10 xl:px-0 w-full" lazyMount />
        <br />
        <br />
        <br />
        <PageFooter />
      </PageBody>
    </>
  );
};

const ProjectReportDetailPage = () => {
  const uuid = useRouter().query.uuid as string;

  const t = useT();
  const [isLoaded, { data: projectReport, loadFailure }] = useFullProjectReport({ id: uuid });
  const { openToast } = useToastContext();
  useValueChanged(isLoaded, () => {
    if (isLoaded && projectReport == null) {
      Log.error("Project report not found", { uuid, loadFailure });
      openToast(t("Project report not found"), ToastType.ERROR);
    }
  });

  const [, { data: project }] = useFullProject({ id: projectReport?.projectUuid! });
  const [, { data: task }] = useTask({ id: projectReport?.taskUuid! });

  const report = (projectReport ?? {}) as ProjectReportFullDto;

  return (
    <FrameworkProvider frameworkKey={report?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        {projectReport == null ? null : (
          <ProjectReportPageContent report={report} projectReport={projectReport} project={project} task={task} />
        )}
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default ProjectReportDetailPage;
