import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactElement, useCallback, useMemo } from "react";

import EntityGalleryTab from "@/components/extensive/EntityGallery/EntityGalleryTab";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import { getShortPeriodLabel } from "@/components/extensive/WizardForm/utils";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullNursery, useFullNurseryReport } from "@/connections/Entity";
import { useTask } from "@/connections/Task";
import FrameworkProvider, { toFramework } from "@/context/framework.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { NurseryFullDto, NurseryReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { useValueChanged } from "@/hooks/useValueChanged";
import NurseryReportDetailsTab from "@/pages/reports/nursery-report/tabs/Details";
import NurseryReportGoalsAndProgressTab from "@/pages/reports/nursery-report/tabs/GoalsAndProgress";
import NurseryReportOverview from "@/pages/reports/nursery-report/tabs/Overview";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ReportBanner from "@/redesignComponents/content/Banner/ReportBanner/ReportBanner";
import { ProjectIcon } from "@/redesignComponents/foundations/Icons";
import ResponsiveTypography from "@/styles/ResponsiveTypography";
import Log from "@/utils/log";

import AuditLog from "./tabs/AuditLog";

type TabItem = {
  key: string;
  title: string;
  renderBody: () => ReactElement;
};

type NurseryReportContentProps = {
  nurseryReport: NurseryReportFullDto;
  nursery?: NurseryFullDto | null;
  taskDueAt?: string;
};

const NurseryReportContent: FC<NurseryReportContentProps> = ({ nurseryReport, nursery, taskDueAt }) => {
  const t = useT();
  const router = useRouter();
  const nurseryReportUUID = nurseryReport.uuid;
  const currentTab = (router.query.tab as string) ?? "overview";

  const reportTitle = nurseryReport.reportTitle ?? nurseryReport.title ?? t("Nursery Report");
  const headerReportTitle = nursery?.name != null ? `${nursery.name} ${reportTitle}` : reportTitle;

  const window = useReportingWindow(toFramework(nurseryReport.frameworkKey), taskDueAt);
  const taskTitle = t("Reporting Task {window}", { window });

  const navigateToTab = useCallback(
    (tab: string) => {
      router.push(`/reports/nursery-report/${nurseryReportUUID}?tab=${tab}`, undefined, { shallow: true });
    },
    [router, nurseryReportUUID]
  );

  const tabItems = useMemo<TabItem[]>(
    () => [
      {
        key: "overview",
        title: t("Overview"),
        renderBody: () => <NurseryReportOverview report={nurseryReport} />
      },
      {
        key: "details",
        title: t("Report Details"),
        renderBody: () => <NurseryReportDetailsTab report={nurseryReport} />
      },
      {
        key: "gallery",
        title: t("Gallery"),
        renderBody: () => (
          <EntityGalleryTab
            modelName="nurseryReports"
            modelUUID={nurseryReport.uuid}
            entityData={nurseryReport}
            modelTitle={t("Nursery Report")}
            emptyStateContent={t(
              "Your gallery is currently empty. Add images by using the 'Edit' button on this nursery report."
            )}
            sharedDriveLink={nurseryReport.sharedDriveLink ?? undefined}
          />
        )
      },
      {
        key: "goals",
        title: t("Indicators & Insights"),
        renderBody: () => <NurseryReportGoalsAndProgressTab nurseryReport={nurseryReport} />
      },
      {
        key: "audit-log",
        title: t("Audit Log"),
        renderBody: () => <AuditLog nurseryReport={nurseryReport} />
      }
    ],
    [nurseryReport, t]
  );

  const visibleTabItems = useMemo(() => {
    if (nurseryReport.nothingToReport) {
      return tabItems.filter(item => item.key === "overview");
    }

    return tabItems;
  }, [nurseryReport.nothingToReport, tabItems]);

  const tabBarTabs = useMemo(
    () =>
      visibleTabItems.map(item => ({
        value: item.key,
        label: item.title
      })),
    [visibleTabItems]
  );

  const activeTab = visibleTabItems.some(item => item.key === currentTab) ? currentTab : "overview";
  const activeTabItem = visibleTabItems.find(item => item.key === activeTab) ?? visibleTabItems[0];

  return (
    <>
      <ResponsiveTypography />
      <Head>
        <title>{reportTitle}</title>
      </Head>
      <ReportBanner
        report={nurseryReport}
        title={headerReportTitle}
        dueAt={taskDueAt ?? nurseryReport.dueAt}
        entityName="nursery-report"
        breadcrumbs={[
          {
            label: t("Projects"),
            link: "/my-projects",
            icon: <ProjectIcon className="!text-theme-primary-900" />
          },
          {
            label: nurseryReport.projectName ?? t("Project"),
            link: `/project/${nurseryReport.projectUuid}`
          },
          {
            label: t("Nurseries"),
            link: `/project/${nurseryReport.projectUuid}?tab=nurseries`
          },
          {
            label: nurseryReport.nurseryName ?? t("Nursery"),
            link: `/nursery/${nurseryReport.nurseryUuid}`
          },
          {
            label: t("Reports"),
            link: `/nursery/${nurseryReport.nurseryUuid}?tab=completed-tasks`
          },
          {
            label: t("Nursery Report - {window}", { window: getShortPeriodLabel(taskTitle ?? "", true) }),
            link: `/reports/nursery-report/${nurseryReportUUID}`
          }
        ]}
        suffix={
          <div className="flex items-center gap-1.5">
            {nurseryReport.nurseryUuid != null && (
              <Button
                variant="borderless"
                size="small"
                className="underline underline-offset-2"
                onClick={() => router.push(`/nursery/${nurseryReport.nurseryUuid}`)}
              >
                {t("Nursery Profile")}
              </Button>
            )}
            {nurseryReport.nurseryUuid != null && nurseryReport.projectReportUuid != null && (
              <span className="text-sm text-theme-neutral-300">|</span>
            )}
            {nurseryReport.projectReportUuid != null && (
              <Button
                variant="borderless"
                size="small"
                className="underline underline-offset-2"
                onClick={() => router.push(`/reports/project-report/${nurseryReport.projectReportUuid}`)}
              >
                {t("Project Report")}
              </Button>
            )}
          </div>
        }
        toolbar={{
          tabBar: {
            tabs: tabBarTabs,
            defaultValue: activeTab,
            onTabClick: (tabValue: string) => {
              navigateToTab(tabValue);
            }
          }
        }}
      />
      <div className="flex flex-1">{activeTabItem.renderBody()}</div>
      <PageFooter />
    </>
  );
};

const NurseryReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const nurseryReportUUID = router.query.uuid as string;

  const [reportLoaded, { data: nurseryReport, loadFailure }] = useFullNurseryReport({ id: nurseryReportUUID });
  const { openToast } = useToastContext();
  useValueChanged(reportLoaded, () => {
    if (reportLoaded && nurseryReport == null) {
      Log.error("Nursery report not found", { nurseryReportUUID, loadFailure });
      openToast(t("Nursery report not found"), ToastType.ERROR);
    }
  });

  const [nurseryLoaded, { data: nursery }] = useFullNursery({ id: nurseryReport?.nurseryUuid ?? undefined });
  const [taskLoaded, { data: task }] = useTask({ id: nurseryReport?.taskUuid ?? undefined });
  const isLoaded = reportLoaded && nurseryLoaded && taskLoaded;

  return (
    <FrameworkProvider frameworkKey={nurseryReport?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        {nurseryReport == null ? null : (
          <NurseryReportContent nurseryReport={nurseryReport} nursery={nursery} taskDueAt={task?.dueAt} />
        )}
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default NurseryReportDetailPage;
