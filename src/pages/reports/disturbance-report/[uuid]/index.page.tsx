import { useT } from "@transifex/react";
import { format, isValid } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactElement, useCallback, useMemo } from "react";

import EntityGalleryTab from "@/components/extensive/EntityGallery/EntityGalleryTab";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullDisturbanceReport } from "@/connections/Entity";
import FrameworkProvider from "@/context/framework.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import { DisturbanceReportFullDto, DisturbanceReportLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useReportBreadcrumbs } from "@/hooks/useReportBreadcrumbs";
import { useValueChanged } from "@/hooks/useValueChanged";
import { withReportOrigin } from "@/pages/reports/reportIndex.utils";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import DisturbanceReportBanner from "@/redesignComponents/content/Banner/DisturbanceReportBanner/DisturbanceReportBanner";
import { showToast } from "@/redesignComponents/status/Toast/showToast";
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

export const getDisturbanceEntry = (
  type: string,
  report: DisturbanceReportFullDto | DisturbanceReportLightDto
): string => {
  return report?.entries?.find(entry => entry.name === type)?.value ?? "";
};

export const disturbanceReportTitle = (report: DisturbanceReportFullDto | DisturbanceReportLightDto): string => {
  const disturbanceType = getDisturbanceEntry("disturbance-type", report);
  const startDate = new Date(getDisturbanceEntry("disturbance-start-date", report));
  const dateSuffix = isValid(startDate) ? ` - ${format(startDate, "MM/yyyy")}` : "";
  let generalTitle = "Disturbance Report";
  if (["climatic", "ecological"].includes(disturbanceType)) return `Environmental ${generalTitle}${dateSuffix}`;
  if (disturbanceType == "manmade") return `Manmade ${generalTitle}${dateSuffix}`;

  return `${generalTitle}${dateSuffix}`;
};

const DisturbanceReportContent: FC<DisturbanceReportContentProps> = ({ disturbanceReport }) => {
  const t = useT();
  const router = useRouter();
  const disturbanceReportUUID = disturbanceReport.uuid;
  const currentTab = (router.query.tab as string) ?? "overview";

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
    "project",
    { project: { uuid: disturbanceReport.projectUuid, name: disturbanceReport.projectName } }
  );

  return (
    <>
      <ResponsiveTypography />
      <Head>
        <title>{disturbanceReportTitle(disturbanceReport)}</title>
      </Head>
      <DisturbanceReportBanner
        report={disturbanceReport}
        title={disturbanceReportTitle(disturbanceReport)}
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
        duration: 5000
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
