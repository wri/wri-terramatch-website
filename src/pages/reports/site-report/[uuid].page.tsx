import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";

import SecondaryTabs, { TabItem } from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import EntityStatusBar from "@/components/extensive/EntityStatusBar";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import { getShortPeriodLabel } from "@/components/extensive/WizardForm/utils";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullSite, useFullSiteReport } from "@/connections/Entity";
import FrameworkProvider, { toFramework } from "@/context/framework.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { useValueChanged } from "@/hooks/useValueChanged";
import SiteReportHeader from "@/pages/reports/site-report/components/SiteReportHeader";
import SiteReportDetailsTab from "@/pages/reports/site-report/tabs/Details";
import SiteReportDataTab from "@/pages/reports/site-report/tabs/ReportData";
import Log from "@/utils/log";

const SiteReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const siteReportUUID = router.query.uuid as string;

  const [reportLoaded, { data: siteReport, loadFailure }] = useFullSiteReport({ id: siteReportUUID });
  const { openToast } = useToastContext();
  useValueChanged(reportLoaded, () => {
    if (reportLoaded && siteReport == null) {
      Log.error("Site report not found", { siteReportUUID, loadFailure });
      openToast(t("Site report not found"), ToastType.ERROR);
    }
  });

  const [siteLoaded, { data: site }] = useFullSite({ id: siteReport?.siteUuid! });

  const reportTitle = siteReport?.reportTitle ?? siteReport?.title ?? t("Site Report");
  const headerReportTitle = site?.name != null ? `${site.name} ${reportTitle}` : "";

  const reportingWindow = useReportingWindow(toFramework(siteReport?.frameworkKey), siteReport?.dueAt!);
  const taskTitle = t("Reporting Task {window}", { window: reportingWindow });

  const tabItems = useMemo<TabItem[]>(
    () =>
      siteReport == null
        ? []
        : [
            {
              key: "report-data",
              title: t("Report Data"),
              renderBody: () => <SiteReportDataTab report={siteReport} site={site} />
            },
            {
              key: "details",
              title: t("Report Details"),
              renderBody: () => <SiteReportDetailsTab report={siteReport} />
            }
          ],
    [siteReport, site, t]
  );

  const isLoaded = reportLoaded && siteLoaded;

  return (
    <FrameworkProvider frameworkKey={siteReport?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        {siteReport == null ? null : (
          <>
            <Head>
              <title>{reportTitle}</title>
            </Head>
            <PageBreadcrumbs
              links={[
                { title: t("Projects"), path: "/my-projects" },
                { title: siteReport.projectName ?? t("Project"), path: `/project/${siteReport.projectUuid}` },
                {
                  title: "Sites",
                  path: `/project/${siteReport.projectUuid ?? ""}?tab=sites`
                },
                {
                  title: siteReport.siteName ?? t("Site"),
                  path: `/site/${siteReport.siteUuid ?? ""}`
                },
                {
                  title: "Reports",
                  path: `/site/${siteReport.siteUuid ?? ""}?tab=completed-tasks`
                },
                { title: "Site Report - " + getShortPeriodLabel(taskTitle ?? "") }
              ]}
            />
            <SiteReportHeader report={siteReport} reportTitle={headerReportTitle} />
            <EntityStatusBar entityName="siteReports" entity={siteReport} />
            <PageBody className="pt-0">
              <SecondaryTabs tabItems={tabItems} containerClassName="max-w-[82vw] px-10 xl:px-0 w-full" lazyMount />
              <br />
              <br />
              <br />
            </PageBody>
            <PageFooter />
          </>
        )}
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default SiteReportDetailPage;
