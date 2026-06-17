import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";

import SecondaryTabs, { TabItem } from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import EntityStatusBar from "@/components/extensive/EntityStatusBar";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullNursery, useFullNurseryReport } from "@/connections/Entity";
import { useTask } from "@/connections/Task";
import FrameworkProvider, { toFramework } from "@/context/framework.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { useValueChanged } from "@/hooks/useValueChanged";
import NurseryReportHeader from "@/pages/reports/nursery-report/components/NurseryReportHeader";
import NurseryReportDetailsTab from "@/pages/reports/nursery-report/tabs/Details";
import NurseryReportDataTab from "@/pages/reports/nursery-report/tabs/ReportData";
import Log from "@/utils/log";

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

  const [nurseryLoaded, { data: nursery }] = useFullNursery({ id: nurseryReport?.nurseryUuid! });
  const [taskLoaded, { data: task }] = useTask({ id: nurseryReport?.taskUuid ?? undefined });

  const reportTitle = nurseryReport?.reportTitle ?? nurseryReport?.title ?? t("Nursery Report");
  const headerReportTitle = nursery?.name != null ? `${nursery.name} ${reportTitle}` : "";

  const window = useReportingWindow(toFramework(nurseryReport?.frameworkKey), task?.dueAt);
  const taskTitle = t("Reporting Task {window}", { window });

  const tabItems = useMemo<TabItem[]>(
    () =>
      nurseryReport == null
        ? []
        : [
            {
              key: "report-data",
              title: t("Report Data"),
              renderBody: () => <NurseryReportDataTab report={nurseryReport} nursery={nursery} />
            },
            {
              key: "details",
              title: t("Report Details"),
              renderBody: () => <NurseryReportDetailsTab report={nurseryReport} />
            }
          ],
    [nurseryReport, nursery, t]
  );

  const isLoaded = reportLoaded && nurseryLoaded && taskLoaded;

  return (
    <FrameworkProvider frameworkKey={nurseryReport?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        {nurseryReport == null ? null : (
          <>
            <Head>
              <title>{reportTitle}</title>
            </Head>
            <PageBreadcrumbs
              links={[
                { title: t("My Projects"), path: "/my-projects" },
                { title: nurseryReport.projectName ?? t("Project"), path: `/project/${nurseryReport.projectUuid}` },
                {
                  title: taskTitle,
                  path: `/project/${nurseryReport.projectUuid}/reporting-task/${nurseryReport.taskUuid}`
                },
                { title: reportTitle }
              ]}
            />
            <NurseryReportHeader report={nurseryReport} title={headerReportTitle} />
            <EntityStatusBar entityName="nurseryReports" entity={nurseryReport} />
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

export default NurseryReportDetailPage;
