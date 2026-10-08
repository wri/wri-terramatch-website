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
import { MapAreaProvider } from "@/context/mapArea.provider";
import { DisturbanceReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useReportBreadcrumbs } from "@/hooks/useReportBreadcrumbs";
import { useValueChanged } from "@/hooks/useValueChanged";
import { getReportsIndexUrl, withReportOrigin } from "@/pages/reports/reportIndex.utils";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import DisturbanceReportBanner from "@/redesignComponents/content/Banner/DisturbanceReportBanner/DisturbanceReportBanner";
import { ProjectIcon } from "@/redesignComponents/foundations/Icons";
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
  const currentTab = (router.query.tab as string) ?? "overview";

  const headerReportTitle = disturbanceReport.projectName + " - " + disturbanceReport.title;

  const navigateToTab = useCallback(
    (tab: string) => {
      router.push(
        withReportOrigin(`/reports/disturbance-report/${disturbanceReportUUID}?tab=${tab}`, router.query),
        undefined,
        { shallow: true }
      );
    },
    [router, disturbanceReportUUID]
  );

  const tabItems = useMemo<TabItem[]>(
    () => [
      {
        key: "overview",
        title: t("Overview"),
        renderBody: () => (
          <DisturbanceReportOverviewTab
            report={disturbanceReport}
            onViewDetails={() => navigateToTab("details")}
            onViewGallery={() => navigateToTab("gallery")}
          />
        )
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
    [disturbanceReport, navigateToTab, t]
  );

  const visibleTabItems = useMemo(() => {
    if (disturbanceReport.nothingToReport) {
      return tabItems.filter(item => item.key === "overview");
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

  const activeTab = visibleTabItems.some(item => item.key === currentTab) ? currentTab : "overview";
  const activeTabItem = visibleTabItems.find(item => item.key === activeTab) ?? visibleTabItems[0];
  const breadcrumbs = useReportBreadcrumbs(
    { label: t("Disturbance Report"), link: `/reports/disturbance-report/${disturbanceReportUUID}` },
    disturbanceReport.projectUuid != null
      ? getReportsIndexUrl("project", disturbanceReport.projectUuid, { tab: "additional-reports" })
      : "/my-projects",
    { project: disturbanceReport.projectName }
  );

  return (
    <>
      <ResponsiveTypography />
      <Head>
        <title>{headerReportTitle}</title>
      </Head>
      <DisturbanceReportBanner
        report={disturbanceReport}
        title={headerReportTitle}
        dueAt={disturbanceReport.dueAt}
        entityName="disturbance-report"
        breadcrumbs={breadcrumbs}
        suffix={
          disturbanceReport.projectUuid != null ? (
            <Button
              variant="borderless"
              size="small"
              className="underline underline-offset-2"
              onClick={() => router.push(`/project/${disturbanceReport.projectUuid}`)}
            >
              {t("Project Profile")}
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
      <MapAreaProvider>
        <LoadingContainer loading={!isLoaded}>
          {disturbanceReport == null ? null : <DisturbanceReportContent disturbanceReport={disturbanceReport} />}
        </LoadingContainer>
      </MapAreaProvider>
    </FrameworkProvider>
  );
};

export default DisturbanceReportDetailPage;
