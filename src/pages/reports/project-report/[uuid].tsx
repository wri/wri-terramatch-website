import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactElement, useMemo } from "react";

import EntityGalleryTab from "@/components/extensive/EntityGallery/EntityGalleryTab";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import { getShortPeriodLabel } from "@/components/extensive/WizardForm/utils";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullProject, useFullProjectReport } from "@/connections/Entity";
import { useTask } from "@/connections/Task";
import FrameworkProvider, { Framework, toFramework, useFrameworkContext } from "@/context/framework.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { ProjectReportFullDto, TaskFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { useValueChanged } from "@/hooks/useValueChanged";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ReportBanner from "@/redesignComponents/content/Banner/ReportBanner/ReportBanner";
import { ProjectIcon } from "@/redesignComponents/foundations/Icons";
import ResponsiveTypography from "@/styles/ResponsiveTypography";
import Log from "@/utils/log";

import AuditLog from "./tabs/AuditLog";
import ProjectReportDetailsTab from "./tabs/Details";
import Overview from "./tabs/Overview";

type TabItem = {
  key: string;
  title: string;
  renderBody: () => ReactElement;
};

type ProjectReportContentProps = {
  projectReport: ProjectReportFullDto;
  task?: TaskFullDto;
};

const ProjectReportContent: FC<ProjectReportContentProps> = ({ projectReport, task }) => {
  const t = useT();
  const router = useRouter();
  const { framework } = useFrameworkContext();
  const [, { data: project }] = useFullProject({ id: projectReport.projectUuid! });
  const shouldHideNurseries = framework === Framework.PPC;
  const reportingWindow = useReportingWindow(toFramework(projectReport?.frameworkKey), projectReport?.dueAt!);
  const taskTitle = t("Reporting Task {window}", { window: reportingWindow });

  const reportTitle = projectReport.reportTitle ?? t("Project Report");
  const currentTab = (router.query.tab as string) ?? "overview";

  const tabItems = useMemo<TabItem[]>(
    () => [
      {
        key: "overview",
        title: t("Overview"),
        renderBody: () => <Overview projectReport={projectReport} project={project} />
      },
      {
        key: "details",
        title: t("Report Details"),
        renderBody: () => <ProjectReportDetailsTab report={projectReport} />
      },
      {
        key: "gallery",
        title: t("Gallery"),
        renderBody: () => (
          <EntityGalleryTab
            modelName="projectReports"
            modelUUID={projectReport.uuid}
            modelTitle={t("Report")}
            entityData={project}
            emptyStateContent={t(
              "Your gallery is currently empty. Add images by using the 'Edit' button on this report."
            )}
            sharedDriveLink={projectReport.sharedDriveLink!}
          />
        )
      },
      {
        key: "audit-log",
        title: t("Audit Log"),
        renderBody: () => <AuditLog projectReport={projectReport} />
      }
    ],
    [projectReport, project, t]
  );

  const tabBarTabs = useMemo(
    () =>
      tabItems
        .filter(item => !(item.key === "nursery-reports" && shouldHideNurseries))
        .map(item => ({ value: item.key, label: item.title })),
    [tabItems, shouldHideNurseries]
  );

  const activeTabItem = tabItems.find(item => item.key === currentTab) ?? tabItems[0];

  return (
    <>
      <ResponsiveTypography />
      <Head>
        <title>{reportTitle}</title>
      </Head>
      <ReportBanner
        report={projectReport}
        title={reportTitle}
        dueAt={task?.dueAt ?? projectReport.dueAt}
        entityName="project-report"
        breadcrumbs={[
          {
            label: t("Projects"),
            link: `/my-projects`,
            icon: <ProjectIcon className="!text-theme-primary-900" />
          },
          {
            label: projectReport.projectName ?? t("Project"),
            link: `/project/${projectReport.projectUuid}`
          },
          {
            label: t("Reports"),
            link: `/project/${projectReport.projectUuid}?tab=reporting-tasks`
          },
          {
            label: getShortPeriodLabel(taskTitle ?? ""),
            link: `/project/${projectReport.projectUuid ?? ""}/reporting-task/${projectReport.taskUuid ?? ""}`
          },
          { label: reportTitle, link: `/reports/project-report/${projectReport.uuid}` }
        ]}
        suffix={
          <div className="flex gap-1.5">
            <div className="flex gap-1.5">
              <Button
                variant="borderless"
                size="small"
                className="underline underline-offset-2"
                onClick={() => router.push(`/project/${projectReport.projectUuid}`)}
              >
                {t("Project Profile")}
              </Button>
              <span className="text-sm text-theme-neutral-300">|</span>
              <Button
                variant="borderless"
                size="small"
                className="underline underline-offset-2"
                onClick={() =>
                  router.push(`/reports/project-report/${projectReport.uuid}?tab=site-reports`, undefined, {
                    shallow: true
                  })
                }
              >
                {t("Site Reports")}
              </Button>
              {!shouldHideNurseries && (
                <>
                  <span className="text-sm text-theme-neutral-300">|</span>
                  <Button
                    variant="borderless"
                    size="small"
                    className="underline underline-offset-2"
                    onClick={() =>
                      router.push(`/reports/project-report/${projectReport.uuid}?tab=nursery-reports`, undefined, {
                        shallow: true
                      })
                    }
                  >
                    {t("Nursery Reports")}
                  </Button>
                </>
              )}
            </div>
          </div>
        }
        toolbar={{
          tabBar: {
            tabs: tabBarTabs,
            defaultValue: currentTab,
            onTabClick: (tabValue: string) => {
              router.push(`/reports/project-report/${projectReport.uuid}?tab=${tabValue}`, undefined, {
                shallow: true
              });
            }
          }
        }}
      />
      <div className="flex flex-1">{activeTabItem.renderBody()}</div>
      <PageFooter />
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

  const [, { data: task }] = useTask({ id: projectReport?.taskUuid! });

  return (
    <FrameworkProvider frameworkKey={projectReport?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        {projectReport == null ? null : <ProjectReportContent projectReport={projectReport} task={task} />}
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default ProjectReportDetailPage;
