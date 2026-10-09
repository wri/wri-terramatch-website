import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactElement, useCallback, useMemo } from "react";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import { getFormHeaderLabel } from "@/components/extensive/WizardForm/utils";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullSRPReport } from "@/connections/Entity";
import FrameworkProvider, { toFramework } from "@/context/framework.provider";
import { SrpReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useReportBreadcrumbs } from "@/hooks/useReportBreadcrumbs";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { useValueChanged } from "@/hooks/useValueChanged";
import { getReportsIndexUrl, withReportOrigin } from "@/pages/reports/reportIndex.utils";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ReportBanner from "@/redesignComponents/content/Banner/ReportBanner/ReportBanner";
import ResponsiveTypography from "@/styles/ResponsiveTypography";
import Log from "@/utils/log";

import AuditLog from "./tabs/AuditLog";
import SrpReportDetailsTab from "./tabs/Details";
import SrpReportOverviewTab from "./tabs/Overview";

type TabItem = {
  key: string;
  title: string;
  renderBody: () => ReactElement;
};

type SrpReportContentProps = {
  srpReport: SrpReportFullDto;
  taskDueAt?: string;
};

const SrpReportContent: FC<SrpReportContentProps> = ({ srpReport, taskDueAt }) => {
  const t = useT();
  const router = useRouter();
  const srpReportUUID = srpReport.uuid;
  const currentTab = (router.query.tab as string) ?? "overview";

  const window = useReportingWindow(toFramework(srpReport.frameworkKey), srpReport?.dueAt!);
  const taskTitle = t("Reporting Task {window}", { window });

  const headerReportTitle = getFormHeaderLabel(srpReport.projectName ?? "", taskTitle);

  const navigateToTab = useCallback(
    (tab: string) => {
      router.push(withReportOrigin(`/reports/srp-report/${srpReportUUID}?tab=${tab}`, router.query), undefined, {
        shallow: true
      });
    },
    [router, srpReportUUID]
  );

  const tabItems = useMemo<TabItem[]>(
    () => [
      {
        key: "overview",
        title: t("Overview"),
        renderBody: () => <SrpReportOverviewTab report={srpReport} onViewDetails={() => navigateToTab("details")} />
      },
      {
        key: "details",
        title: t("Report Details"),
        renderBody: () => <SrpReportDetailsTab report={srpReport} />
      },
      {
        key: "audit-log",
        title: t("History"),
        renderBody: () => <AuditLog srpReport={srpReport} />
      }
    ],
    [navigateToTab, srpReport, t]
  );

  const visibleTabItems = useMemo(() => {
    if (srpReport.nothingToReport) {
      return tabItems.filter(item => item.key === "overview");
    }

    return tabItems;
  }, [srpReport.nothingToReport, tabItems]);

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
  const srpReportTitle = t("Socioeconomic Restoration Partners Report") + " - " + headerReportTitle?.replace(/\D/g, "");
  const breadcrumbs = useReportBreadcrumbs(
    { label: t("SRP Report"), link: `/reports/srp-report/${srpReportUUID}` },
    getReportsIndexUrl("project", srpReport.projectUuid!, { tab: "additional-reports" }),
    { project: srpReport.projectName }
  );

  return (
    <>
      <ResponsiveTypography />
      <Head>
        <title>{getFormHeaderLabel(srpReport.projectName ?? "", taskTitle, true)}</title>
      </Head>
      <ReportBanner
        report={srpReport}
        title={srpReportTitle}
        dueAt={taskDueAt ?? srpReport.dueAt}
        entityName="srp-report"
        breadcrumbs={breadcrumbs}
        suffix={
          srpReport.projectUuid != null && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="borderless"
                size="small"
                className="underline underline-offset-2"
                onClick={() =>
                  router.push(
                    `/reports/report-index?source=project&uuid=${srpReport.projectUuid}&reportType=project-report`
                  )
                }
              >
                {t("Project Report")}
              </Button>
              <span className="text-sm text-theme-neutral-300">|</span>
              <Button
                variant="borderless"
                size="small"
                className="underline underline-offset-2"
                onClick={() => router.push(`/project/${srpReport.projectUuid}`)}
              >
                {t("Project Profile")}
              </Button>
            </div>
          )
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

const SocioEconomicReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const socioEconomicReportUUID = router.query.uuid as string;

  const [isLoaded, { data: srpReport, loadFailure }] = useFullSRPReport({ id: socioEconomicReportUUID });
  useValueChanged(srpReport, () => {
    if (isLoaded && srpReport == null) {
      Log.error("SRP report not found", { socioEconomicReportUUID, loadFailure });
      showToast({
        label: t("SRP report not found"),
        type: "error",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
    }
  });

  const window = useReportingWindow(toFramework(srpReport?.frameworkKey), srpReport?.dueAt!);
  const taskTitle = t("Reporting Task {window}", { window });

  return (
    <FrameworkProvider frameworkKey={srpReport?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        {srpReport == null ? null : <SrpReportContent srpReport={srpReport} taskDueAt={taskTitle} />}
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default SocioEconomicReportDetailPage;
