import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactElement, useCallback, useMemo } from "react";

import EntityGalleryTab from "@/components/extensive/EntityGallery/EntityGalleryTab";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullDisturbanceReport } from "@/connections/Entity";
import FrameworkProvider from "@/context/framework.provider";
import { DisturbanceReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useValueChanged } from "@/hooks/useValueChanged";
import { getReportsIndexHrefFromQuery, getReportsIndexUrl } from "@/pages/reports/report-index/reportIndex.utils";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ReportBanner from "@/redesignComponents/content/Banner/ReportBanner/ReportBanner";
import { ReportsIcon } from "@/redesignComponents/foundations/Icons";
import ResponsiveTypography from "@/styles/ResponsiveTypography";
import Log from "@/utils/log";

import AuditLog from "./tabs/AuditLog";
import DisturbanceReportDetailsTab from "./tabs/Details";
import DisturbanceReportOverviewTab from "./tabs/Overview";

type TabItem = {
  key: string;
  title: string;
  renderBody: () => ReactElement;
};

type DisturbanceReportContentProps = {
  disturbanceReport: DisturbanceReportFullDto;
};

const DisturbanceReportContent: FC<DisturbanceReportContentProps> = ({ disturbanceReport }) => {
  const t = useT();
  const router = useRouter();
  const disturbanceReportUUID = disturbanceReport.uuid;
  const currentTab = (router.query.tab as string) ?? "report-data";

  const headerReportTitle = disturbanceReport.projectName + " - " + disturbanceReport.title;

  const navigateToTab = useCallback(
    (tab: string) => {
      router.push(`/reports/disturbance-report/${disturbanceReportUUID}?tab=${tab}`, undefined, { shallow: true });
    },
    [router, disturbanceReportUUID]
  );

  const tabItems = useMemo<TabItem[]>(
    () => [
      {
        key: "report-data",
        title: t("Report Data"),
        renderBody: () => <DisturbanceReportOverviewTab report={disturbanceReport} />
      },
      {
        key: "details",
        title: t("Report Details"),
        renderBody: () => <DisturbanceReportDetailsTab report={disturbanceReport} />
      },
      {
        key: "gallery",
        title: t("Gallery"),
        renderBody: () => (
          <EntityGalleryTab
            modelName="disturbanceReports"
            modelUUID={disturbanceReport.uuid}
            modelTitle={t("Report")}
            entityData={disturbanceReport}
            emptyStateContent={t(
              "Your gallery is currently empty. Add images by using the 'Edit' button on this report."
            )}
          />
        )
      },
      {
        key: "audit-log",
        title: t("Audit Log"),
        renderBody: () => <AuditLog disturbanceReport={disturbanceReport} />
      }
    ],
    [disturbanceReport, t]
  );

  const visibleTabItems = useMemo(() => {
    if (disturbanceReport.nothingToReport) {
      return tabItems.filter(item => item.key === "report-data");
    }

    return tabItems;
  }, [disturbanceReport.nothingToReport, tabItems]);

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
  const reportsIndexHref =
    getReportsIndexHrefFromQuery(router.query.from) ??
    (disturbanceReport.projectUuid != null
      ? getReportsIndexUrl("project", disturbanceReport.projectUuid, { tab: "additional-reports" })
      : "/my-projects");

  return (
    <>
      <ResponsiveTypography />
      <Head>
        <title>{disturbanceReport.projectName + " - " + disturbanceReport.title}</title>
      </Head>
      <ReportBanner
        report={disturbanceReport}
        title={headerReportTitle}
        dueAt={disturbanceReport.dueAt}
        entityName="disturbance-report"
        breadcrumbs={[
          {
            label: t("Reports"),
            link: reportsIndexHref,
            icon: <ReportsIcon className="!text-theme-primary-900" />
          },
          {
            label: t("Disturbance Report"),
            link: `/reports/disturbance-report/${disturbanceReportUUID}`
          }
        ]}
        suffix={
          disturbanceReport.projectUuid != null ? (
            <Button
              variant="borderless"
              size="small"
              className="underline underline-offset-2"
              onClick={() => router.push(`/project/${disturbanceReport.projectUuid}?tab=sites`)}
            >
              {t("Sites")}
            </Button>
          ) : null
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

const DisturbanceReportDetailPage = () => {
  const router = useRouter();
  const t = useT();
  const disturbanceReportUUID = router.query.uuid as string;

  const [isLoaded, { data: disturbanceReport, loadFailure }] = useFullDisturbanceReport({ id: disturbanceReportUUID });
  useValueChanged(isLoaded, () => {
    if (isLoaded && disturbanceReport == null) {
      Log.error("Disturbance report not found", { disturbanceReportUUID, loadFailure });
      showToast({
        label: t("Disturbance report not found"),
        type: "error",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
    }
  });

  return (
    <FrameworkProvider frameworkKey={disturbanceReport?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        {disturbanceReport == null ? null : <DisturbanceReportContent disturbanceReport={disturbanceReport} />}
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default DisturbanceReportDetailPage;
