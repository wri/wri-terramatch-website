import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactElement, useCallback, useEffect, useMemo } from "react";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import { getFormHeaderLabel, getShortPeriodLabel } from "@/components/extensive/WizardForm/utils";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullFinancialReport } from "@/connections/Entity";
import FrameworkProvider, { toFramework } from "@/context/framework.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { FinancialReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { useValueChanged } from "@/hooks/useValueChanged";
import { getReportsIndexHrefFromQuery } from "@/pages/reports/report-index/reportIndex.utils";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ReportBanner from "@/redesignComponents/content/Banner/ReportBanner/ReportBanner";
import { OrganizationIcon } from "@/redesignComponents/foundations/Icons";
import ApiSlice from "@/store/apiSlice";
import ResponsiveTypography from "@/styles/ResponsiveTypography";
import Log from "@/utils/log";

import AuditLog from "./tabs/AuditLog";
import FinancialReportDetailsTab from "./tabs/Details";
import FinancialReportOverviewTab from "./tabs/Overview";

type TabItem = {
  key: string;
  title: string;
  renderBody: () => ReactElement;
};

type FinancialReportContentProps = {
  financialReport: FinancialReportFullDto;
  taskDueAt?: string;
};

const FinancialReportContent: FC<FinancialReportContentProps> = ({ financialReport, taskDueAt }) => {
  const t = useT();
  const router = useRouter();
  const financialReportUUID = financialReport.uuid;
  const currentTab = (router.query.tab as string) ?? "report-data";

  const window = useReportingWindow(toFramework(financialReport.frameworkKey), financialReport?.dueAt!);
  const taskTitle = t("Reporting Task {window}", { window });

  const headerReportTitle = getFormHeaderLabel(financialReport.organisationName ?? "", taskTitle);

  const navigateToTab = useCallback(
    (tab: string) => {
      void router.push(
        {
          pathname: `/reports/financial-report/${financialReportUUID}`,
          query: { ...router.query, tab }
        },
        undefined,
        { shallow: true }
      );
    },
    [router, financialReportUUID]
  );

  const tabItems = useMemo<TabItem[]>(
    () => [
      {
        key: "report-data",
        title: t("Report Data"),
        renderBody: () => <FinancialReportOverviewTab report={financialReport} />
      },
      {
        key: "details",
        title: t("Report Details"),
        renderBody: () => <FinancialReportDetailsTab report={financialReport} />
      },
      {
        key: "audit-log",
        title: t("Audit Log"),
        renderBody: () => <AuditLog financialReport={financialReport} />
      }
    ],
    [financialReport, t]
  );

  const visibleTabItems = useMemo(() => {
    if (financialReport.nothingToReport) {
      return tabItems.filter(item => item.key === "report-data");
    }

    return tabItems;
  }, [financialReport.nothingToReport, tabItems]);

  const tabBarTabs = useMemo(
    () =>
      visibleTabItems.map(item => ({
        value: item.key,
        label: item.title
      })),
    [visibleTabItems]
  );

  const activeTab = visibleTabItems.some(item => item.key === currentTab) ? currentTab : "report-data";
  const activeTabItem = visibleTabItems.find(item => item.key === activeTab) ?? visibleTabItems[0];
  const organisationHref =
    financialReport.organisationUuid != null ? `/organization/${financialReport.organisationUuid}` : "/my-projects";
  const reportsIndexHref = getReportsIndexHrefFromQuery(router.query.from, organisationHref) ?? organisationHref;

  return (
    <>
      <ResponsiveTypography />
      <Head>
        <title>{headerReportTitle}</title>
      </Head>
      <ReportBanner
        report={financialReport}
        title={headerReportTitle}
        dueAt={taskDueAt ?? financialReport.dueAt}
        entityName="financial-report"
        breadcrumbs={[
          {
            label: t("Organization - {organisationName}", { organisationName: financialReport.organisationName }),
            link: organisationHref,
            icon: <OrganizationIcon className="!text-theme-primary-900" />
          },
          {
            label: t("Financial Reports"),
            link: reportsIndexHref
          },
          {
            label: t("Financial Report - {period}", { period: getShortPeriodLabel(taskTitle ?? "", true) }),
            link: `/reports/financial-report/${financialReportUUID}`
          }
        ]}
        suffix={
          <div className="flex items-center gap-1.5">
            <Button
              variant="borderless"
              size="small"
              className="underline underline-offset-2"
              onClick={() => router.push("/my-projects")}
            >
              {t("Projects")}
            </Button>
            {financialReport.organisationUuid != null && (
              <>
                <span className="text-sm text-theme-neutral-300">|</span>
                <Button
                  variant="borderless"
                  size="small"
                  className="underline underline-offset-2"
                  onClick={() => router.push(`/organization/${financialReport.organisationUuid}`)}
                >
                  {t("Organisation Profile")}
                </Button>
              </>
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

const FinancialReportDetailPage = () => {
  const router = useRouter();
  const financialReportUUID = router.query.uuid as string;

  const [isLoaded, { data: financialReport, loadFailure }] = useFullFinancialReport({ id: financialReportUUID });
  const { openToast } = useToastContext();

  useEffect(() => {
    if (router.isReady && financialReportUUID && financialReport != null && financialReport.lightResource !== false) {
      ApiSlice.pruneCache("financialReports", [financialReportUUID]);
    }
  }, [router.isReady, financialReportUUID, financialReport]);

  useValueChanged(isLoaded, () => {
    if (isLoaded && financialReport == null) {
      Log.error("Financial report not found", { financialReportUUID, loadFailure });
      openToast("Financial report not found", ToastType.ERROR);
    }
  });

  return (
    <FrameworkProvider frameworkKey={financialReport?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        {financialReport == null ? null : (
          <FinancialReportContent financialReport={financialReport} taskDueAt={financialReport.dueAt!} />
        )}
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default FinancialReportDetailPage;
