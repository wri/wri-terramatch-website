import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactElement, useCallback, useMemo } from "react";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import useCollectionsTotal, { CollectionsTotalProps } from "@/components/extensive/TrackingCollapseGrid/hooks";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullSite, useFullSiteReport } from "@/connections/Entity";
import { useTask } from "@/connections/Task";
import FrameworkProvider, { Framework, toFramework, useFrameworkContext } from "@/context/framework.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { SiteFullDto, SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { useValueChanged } from "@/hooks/useValueChanged";
import { SuffixButtonConfig } from "@/pages/project/[uuid]/index.page";
import Overview from "@/pages/reports/site-report/tabs/Overview";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ReportBanner from "@/redesignComponents/content/Banner/ReportBanner/ReportBanner";
import { ProjectIcon } from "@/redesignComponents/foundations/Icons";
import ResponsiveTypography from "@/styles/ResponsiveTypography";
import Log from "@/utils/log";

type TabItem = {
  key: string;
  title: string;
  body: ReactElement;
  hideForFrameworks?: Framework[];
};

type SiteReportContentProps = {
  siteReport: SiteReportFullDto;
  site?: SiteFullDto;
  taskDueAt?: string;
  workdaysPaid: number | null | undefined;
  workdaysVolunteer: number | null | undefined;
  workdaysTotal: number | null | undefined;
};

const SiteReportContent: FC<SiteReportContentProps> = ({
  siteReport,
  site,
  taskDueAt,
  workdaysPaid,
  workdaysVolunteer,
  workdaysTotal
}) => {
  const t = useT();
  const router = useRouter();
  const { framework } = useFrameworkContext();
  const siteReportUUID = siteReport.uuid;

  const currentTab = (router.query.tab as string) ?? "overview";
  const reportTitle = siteReport.reportTitle ?? siteReport.title ?? t("Site Report");
  const headerReportTitle = site?.name ? `${site.name} ${reportTitle}` : reportTitle;

  const window = useReportingWindow(toFramework(siteReport.frameworkKey), taskDueAt);
  const taskTitle = t("Reporting Task {window}", { window });

  const navigateToTab = useCallback(
    (tab: string) => {
      router.push(`/reports/site-report/${siteReportUUID}?tab=${tab}`, undefined, { shallow: true });
    },
    [router, siteReportUUID]
  );

  const tabItems = useMemo<TabItem[]>(
    () => [
      {
        key: "overview",
        title: t("Overview"),
        body: <Overview siteReport={siteReport} site={site} />
      }
    ],
    [siteReport, site, t]
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
  const suffixButtons: SuffixButtonConfig[] = useMemo(
    () => [
      { key: "site-profile", labelKey: "Site Profile" },
      { key: "project-report", labelKey: "Project Report" }
    ],
    []
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
            label: t("Projects"),
            link: "/my-projects",
            icon: <ProjectIcon className="!text-theme-primary-900" />
          },
          { label: siteReport.projectName ?? "", link: `/project/${siteReport.projectUuid}` },
          {
            label: taskTitle,
            link: `/project/${siteReport.projectUuid}/reporting-task/${siteReport.taskUuid}`
          },
          { label: reportTitle, link: `/reports/site-report/${siteReportUUID}` }
        ]}
        suffix={
          <Flex gap={1.5} alignItems="center">
            {suffixButtons.map((button, index) => (
              <Flex key={button.key} gap={1.5} alignItems="center">
                {index > 0 && <span className="text-theme-neutral-300 text-sm">|</span>}
                <Button
                  variant="borderless"
                  size="small"
                  className="underline underline-offset-2"
                  onClick={() => {
                    navigateToTab(button.key);
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
      <div className="flex flex-1">{visibleTabItems.find(item => item.key === activeTab)?.body}</div>
      <PageFooter />
    </>
  );
};

const SiteReportDetailPage = () => {
  const router = useRouter();
  const siteReportUUID = router.query.uuid as string;

  const [reportLoaded, { data: siteReport, loadFailure }] = useFullSiteReport({ id: siteReportUUID });
  const { openToast } = useToastContext();
  useValueChanged(reportLoaded, () => {
    if (reportLoaded && siteReport == null) {
      Log.error("Site report not found", { siteReportUUID, loadFailure });
      openToast("Site report not found", ToastType.ERROR);
    }
  });

  const [siteLoaded, { data: site }] = useFullSite({ id: siteReport?.siteUuid! });
  const [taskLoaded, { data: task }] = useTask({ id: siteReport?.taskUuid ?? undefined });

  const totalProps: Omit<CollectionsTotalProps, "collections"> = {
    entity: "siteReports",
    uuid: siteReportUUID,
    domain: "demographics",
    trackingType: "workdays"
  };
  const workdaysTotal = useCollectionsTotal({ ...totalProps, collections: DemographicCollections.WORKDAYS_SITE });
  const workdaysPaid = useCollectionsTotal({
    ...totalProps,
    collections: DemographicCollections.WORKDAYS_SITE.filter(c => c.startsWith("paid-"))
  });
  const workdaysVolunteer = useCollectionsTotal({
    ...totalProps,
    collections: DemographicCollections.WORKDAYS_SITE.filter(c => c.startsWith("volunteer-"))
  });

  const isLoaded = reportLoaded && siteLoaded && taskLoaded;

  return (
    <FrameworkProvider frameworkKey={siteReport?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        {siteReport == null ? null : (
          <SiteReportContent
            siteReport={siteReport}
            site={site}
            taskDueAt={task?.dueAt}
            workdaysPaid={workdaysPaid}
            workdaysVolunteer={workdaysVolunteer}
            workdaysTotal={workdaysTotal}
          />
        )}
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default SiteReportDetailPage;
