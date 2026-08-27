import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactElement, useCallback, useMemo } from "react";

import EntityGalleryTab from "@/components/extensive/EntityGallery/EntityGalleryTab";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import useCollectionsTotal, { CollectionsTotalProps } from "@/components/extensive/TrackingCollapseGrid/hooks";
import { getShortPeriodLabel } from "@/components/extensive/WizardForm/utils";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullSite, useFullSiteReport } from "@/connections/Entity";
import { useTask } from "@/connections/Task";
import FrameworkProvider, { Framework, toFramework, useFrameworkContext } from "@/context/framework.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { SiteFullDto, SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { useValueChanged } from "@/hooks/useValueChanged";
import { SuffixButtonConfig } from "@/pages/project/[uuid]/index.page";
import { getReportsIndexUrl } from "@/pages/reports/report-index/reportIndex.utils";
import Details from "@/pages/reports/site-report/tabs/Details";
import Overview from "@/pages/reports/site-report/tabs/Overview";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ReportBanner from "@/redesignComponents/content/Banner/ReportBanner/ReportBanner";
import { ReportsIcon } from "@/redesignComponents/foundations/Icons";
import ResponsiveTypography from "@/styles/ResponsiveTypography";
import Log from "@/utils/log";

import AuditLog from "./tabs/AuditLog";
import GoalsAndProgressTab from "./tabs/GoalsAndProgress";

type TabItem = {
  key: string;
  title: string;
  renderBody: () => ReactElement;
  hideForFrameworks?: Framework[];
};

type SiteReportContentProps = {
  siteReport: SiteReportFullDto;
  site?: SiteFullDto;
  taskDueAt?: string;
  projectReportUuid?: string | null;
  workdaysTotal?: number | null;
};

const SiteReportContent: FC<SiteReportContentProps> = ({
  siteReport,
  site,
  taskDueAt,
  projectReportUuid,
  workdaysTotal
}) => {
  const t = useT();
  const router = useRouter();
  const { framework } = useFrameworkContext();
  const siteReportUUID = siteReport.uuid;

  const currentTab = (router.query.tab as string) ?? "overview";
  const reportTitle = siteReport.reportTitle ?? siteReport.title ?? t("Site Report");
  const headerReportTitle = site?.name != null ? `${site.name} ${reportTitle}` : reportTitle;

  const window = useReportingWindow(toFramework(siteReport.frameworkKey), taskDueAt);
  const taskTitle = t("Reporting Task {window}", { window });

  const navigateToTab = useCallback(
    (tab: string) => {
      router.push(`/reports/site-report/${siteReportUUID}?tab=${tab}`, undefined, { shallow: true });
    },
    [router, siteReportUUID]
  );

  const navigateToSuffix = useCallback(
    (key: string) => {
      if (key === "site-profile" && siteReport.siteUuid != null) {
        router.push(`/site/${siteReport.siteUuid}`);
        return;
      }

      if (key === "project-report" && projectReportUuid != null) {
        router.push(`/reports/project-report/${projectReportUuid}`);
      }
    },
    [router, projectReportUuid, siteReport.siteUuid]
  );

  const tabItems = useMemo<TabItem[]>(
    () => [
      {
        key: "overview",
        title: t("Overview"),
        renderBody: () => <Overview siteReport={siteReport} site={site} workdaysTotal={workdaysTotal} />
      },
      {
        key: "details",
        title: t("Report Details"),
        renderBody: () => <Details report={siteReport} />
      },
      {
        key: "gallery",
        title: t("Gallery"),
        renderBody: () => (
          <EntityGalleryTab
            modelName="sites"
            modelUUID={siteReport.siteUuid!}
            galleryEntity="siteReports"
            galleryUuid={siteReport.uuid}
            entityData={site}
            modelTitle={t("Site Report")}
            emptyStateContent={t(
              "Your gallery is currently empty. Add images by using the 'Edit' button on this site report."
            )}
            sharedDriveLink={siteReport.sharedDriveLink ?? undefined}
          />
        )
      },
      {
        key: "goals",
        title: t("Indicators & Insights"),
        renderBody: () => <GoalsAndProgressTab siteReport={siteReport} site={site} workdaysTotal={workdaysTotal} />
      },
      {
        key: "audit-log",
        title: t("Audit Log"),
        renderBody: () => <AuditLog siteReport={siteReport} />
      }
    ],
    [siteReport, site, workdaysTotal, t]
  );

  const visibleTabItems = useMemo(() => {
    const filtered = tabItems.filter(item => !item.hideForFrameworks?.includes(framework));
    if (siteReport.nothingToReport) {
      return filtered.filter(item => item.key === "overview");
    }
    return filtered;
  }, [tabItems, framework, siteReport.nothingToReport]);

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
  const reportsIndexHref = getReportsIndexUrl("site", siteReport.siteUuid!);
  const suffixButtons: SuffixButtonConfig[] = useMemo(
    () => [
      { key: "site-profile", labelKey: t("Site Profile") },
      { key: "project-report", labelKey: t("Project Report") }
    ],
    [t]
  );

  return (
    <>
      <ResponsiveTypography />
      <Head>
        <title>{reportTitle}</title>
      </Head>
      <ReportBanner
        report={siteReport}
        title={headerReportTitle}
        dueAt={taskDueAt ?? siteReport.dueAt}
        entityName="site-report"
        breadcrumbs={[
          {
            label: t("Reports"),
            link: reportsIndexHref,
            icon: <ReportsIcon className="!text-theme-primary-900" />
          },
          {
            label: t("Site Report {window}: {siteName}", {
              window: getShortPeriodLabel(taskTitle ?? "", true),
              siteName: site?.name
            }),
            link: `/reports/site-report/${siteReportUUID}`
          }
        ]}
        suffix={
          <Flex gap={1.5} alignItems="center">
            {suffixButtons.map((button, index) => (
              <Flex key={button.key} gap={1.5} alignItems="center">
                {index > 0 && <span className="text-sm text-theme-neutral-300">|</span>}
                <Button
                  variant="borderless"
                  size="small"
                  className="underline underline-offset-2"
                  onClick={() => {
                    navigateToSuffix(button.key);
                  }}
                >
                  {t(button.labelKey)}
                </Button>
              </Flex>
            ))}
          </Flex>
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

const SiteReportDetailPage = () => {
  const router = useRouter();
  const siteReportUUID = router.query.uuid as string;
  const t = useT();

  const [reportLoaded, { data: siteReport, loadFailure }] = useFullSiteReport({ id: siteReportUUID });
  useValueChanged(reportLoaded, () => {
    if (reportLoaded && siteReport == null) {
      Log.error("Site report not found", { siteReportUUID, loadFailure });
      showToast({
        label: t("Site report not found"),
        type: "error",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
    }
  });

  const [siteLoaded, { data: site }] = useFullSite({ id: siteReport?.siteUuid! });
  const [taskLoaded, { data: task, projectReportUuid }] = useTask({ id: siteReport?.taskUuid ?? undefined });

  const totalProps: Omit<CollectionsTotalProps, "collections"> = {
    entity: "siteReports",
    uuid: siteReportUUID,
    domain: "demographics",
    trackingType: "workdays"
  };
  const workdaysTotal = useCollectionsTotal({ ...totalProps, collections: DemographicCollections.WORKDAYS_SITE });

  const isLoaded = reportLoaded && siteLoaded && taskLoaded;

  return (
    <MapAreaProvider>
      <FrameworkProvider frameworkKey={siteReport?.frameworkKey}>
        <LoadingContainer loading={!isLoaded}>
          {siteReport == null ? null : (
            <SiteReportContent
              siteReport={siteReport}
              site={site}
              taskDueAt={task?.dueAt}
              projectReportUuid={projectReportUuid}
              workdaysTotal={workdaysTotal}
            />
          )}
        </LoadingContainer>
      </FrameworkProvider>
    </MapAreaProvider>
  );
};

export default SiteReportDetailPage;
