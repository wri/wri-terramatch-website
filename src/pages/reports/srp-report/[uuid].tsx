import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactElement, useCallback, useMemo } from "react";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import { getFormHeaderLabel, getShortPeriodLabel } from "@/components/extensive/WizardForm/utils";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullSRPReport } from "@/connections/Entity";
import FrameworkProvider, { toFramework } from "@/context/framework.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { SrpReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { useValueChanged } from "@/hooks/useValueChanged";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ReportBanner from "@/redesignComponents/content/Banner/ReportBanner/ReportBanner";
import { ProjectIcon } from "@/redesignComponents/foundations/Icons";
import ResponsiveTypography from "@/styles/ResponsiveTypography";
import Log from "@/utils/log";

import AuditLog from "./tabs/AuditLog";
import SrpReportDetailsTab from "./tabs/Details";

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
  const currentTab = (router.query.tab as string) ?? "details";

  const window = useReportingWindow(toFramework(srpReport.frameworkKey), srpReport?.dueAt!);
  const taskTitle = t("Reporting Task {window}", { window });

  const headerReportTitle = getFormHeaderLabel(srpReport.projectName ?? "", taskTitle);

  const navigateToTab = useCallback(
    (tab: string) => {
      router.push(`/reports/srp-report/${srpReportUUID}?tab=${tab}`, undefined, { shallow: true });
    },
    [router, srpReportUUID]
  );

  const tabItems = useMemo<TabItem[]>(
    () => [
      {
        key: "details",
        title: t("Report Details"),
        renderBody: () => <SrpReportDetailsTab report={srpReport} />
      },
      {
        key: "audit-log",
        title: t("Audit Log"),
        renderBody: () => <AuditLog srpReport={srpReport} />
      }
    ],
    [srpReport, t]
  );

  const visibleTabItems = useMemo(() => {
    if (srpReport.nothingToReport) {
      return tabItems.filter(item => item.key === "details");
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

  const activeTab = visibleTabItems.some(item => item.key === currentTab) ? currentTab : "details";
  const activeTabItem = visibleTabItems.find(item => item.key === activeTab) ?? visibleTabItems[0];

  return (
    <>
      <ResponsiveTypography />
      <Head>
        <title>{getFormHeaderLabel(srpReport.projectName ?? "", taskTitle, true)}</title>
      </Head>
      <ReportBanner
        report={srpReport}
        title={headerReportTitle}
        dueAt={taskDueAt ?? srpReport.dueAt}
        entityName="srp-report"
        breadcrumbs={[
          {
            label: t("Projects"),
            link: "/my-projects",
            icon: <ProjectIcon className="!text-theme-primary-900" />
          },
          {
            label: srpReport.projectName ?? t("Project"),
            link: `/project/${srpReport.projectUuid}`
          },
          {
            label: t("Reports"),
            link: `/project/${srpReport.projectUuid}?tab=reporting-tasks`
          },
          {
            label: getShortPeriodLabel(taskTitle ?? "", true),
            link: `/project/${srpReport.projectUuid ?? ""}/reporting-task/${srpReport.taskUuid ?? ""}`
          },
          {
            label: t("SRP Report"),
            link: `/reports/srp-report/${srpReportUUID}`
          }
        ]}
        suffix={
          <div className="flex items-center gap-1.5">
            {srpReport.projectUuid != null && (
              <Button
                variant="borderless"
                size="small"
                className="underline underline-offset-2"
                onClick={() => router.push(`/project/${srpReport.projectUuid}`)}
              >
                {t("Project Profile")}
              </Button>
            )}
            {srpReport.projectUuid != null && <span className="text-theme-neutral-300 text-sm">|</span>}
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

const SocioEconomicReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const socioEconomicReportUUID = router.query.uuid as string;

  const [isLoaded, { data: srpReport, loadFailure }] = useFullSRPReport({ id: socioEconomicReportUUID });
  const { openToast } = useToastContext();
  useValueChanged(isLoaded, () => {
    if (isLoaded && srpReport == null) {
      Log.error("SRP report not found", { socioEconomicReportUUID, loadFailure });
      openToast("SRP report not found", ToastType.ERROR);
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
