import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import EntityStatusBar from "@/components/extensive/EntityStatusBar";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullProject, useFullProjectReport } from "@/connections/Entity";
import { useTask } from "@/connections/Task";
import { ContextCondition } from "@/context/ContextCondition";
import FrameworkProvider, { Framework } from "@/context/framework.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { ProjectReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useValueChanged } from "@/hooks/useValueChanged";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";
import ProjectReportBreadcrumbs from "@/pages/reports/project-report/components/ProjectReportBreadcrumbs";
import ProjectReportHeader from "@/pages/reports/project-report/components/ProjectReportHeader";
import Log from "@/utils/log";

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
  const [isLoaded, { data: projectReport, loadFailure }] = useFullProjectReport({ id: uuid });
  const { openToast } = useToastContext();
  useValueChanged(isLoaded, () => {
    if (isLoaded && projectReport == null) {
      Log.error("Project report not found", { uuid, loadFailure });
      openToast("Project report not found", ToastType.ERROR);
    }
  });

  const [, { data: project }] = useFullProject({ id: projectReport?.projectUuid! });
  const [, { data: task }] = useTask({ id: projectReport?.taskUuid! });

  const report = (projectReport ?? {}) as ProjectReportFullDto;
  const reportTitle = report?.reportTitle ?? t("Project Report");

  return (
    <FrameworkProvider frameworkKey={report?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        {projectReport == null ? null : (
          <>
            <Head>
              <title>{reportTitle}</title>
            </Head>
            <ProjectReportBreadcrumbs title={reportTitle} report={report} task={task} />
            <ProjectReportHeader report={report} title={reportTitle} />
            <EntityStatusBar entityName="projectReports" entity={report} />
            <PageBody className="pt-0">
              <SecondaryTabs
                tabItems={[
                  {
                    key: "report-data",
                    title: t("Report Data"),
                    body: <ReportDataTab report={report} dueAt={task?.dueAt} />
                  },
                  {
                    key: "gallery",
                    title: t("Gallery"),
                    body: (
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
                    body: <SiteReportsTab taskUuid={projectReport.taskUuid!} />
                  },
                  {
                    key: "nursery-reports",
                    title: t("Nursery reports"),
                    body: <NurseryReportsTab taskUuid={projectReport.taskUuid!} />,
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
              <br />
              <br />
              <br />
              <PageFooter />
            </PageBody>
          </>
        )}
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default ProjectReportDetailPage;
