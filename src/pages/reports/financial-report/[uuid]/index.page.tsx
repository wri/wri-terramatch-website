import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import EntityStatusBar from "@/components/extensive/EntityStatusBar";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullFinancialReport } from "@/connections/Entity";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

import FinancialReportHeader from "./components/FinancialReportHeader";
import AuditLog from "./tabs/AuditLog";
import FinancialReportOverviewTab from "./tabs/Overview";

const FinancialReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const financialReportUUID = router.query.uuid as string;

  const [isLoaded, { data: financialReport, loadFailure }] = useFullFinancialReport({ id: financialReportUUID });
  const { openToast } = useToastContext();
  useValueChanged(isLoaded, () => {
    if (isLoaded && financialReport == null) {
      Log.error("Financial report not found", { financialReportUUID, loadFailure });
      openToast("Financial report not found", ToastType.ERROR);
    }
  });

  return (
    <LoadingContainer loading={!isLoaded}>
      {financialReport == null ? null : (
        <>
          <Head>
            <title>{`${t("Financial Report")}`}</title>
          </Head>
          <PageBreadcrumbs
            links={[
              {
                title: financialReport.organisationName ?? "",
                path: `/organization/${financialReport.organisationUuid}`
              },
              {
                title: `Financial Report ${
                  financialReport.createdAt != null ? new Date(financialReport.createdAt).toLocaleDateString() : ""
                }`
              }
            ]}
          />
          <FinancialReportHeader financialReport={financialReport} />
          <EntityStatusBar entityName="financialReports" entity={financialReport} />
          <SecondaryTabs
            tabItems={[
              { key: "overview", title: t("Overview"), body: <FinancialReportOverviewTab report={financialReport} /> },
              { key: "audit-log", title: t("Audit Log"), body: <AuditLog financialReport={financialReport} /> }
            ]}
            containerClassName="max-w-[82vw] px-10 xl:px-0 w-full  overflow-y-hidden"
          />
        </>
      )}
    </LoadingContainer>
  );
};

export default FinancialReportDetailPage;
