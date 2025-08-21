import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullFinancialReport } from "@/connections/Entity";
import { FinancialReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import FinancialReportHeader from "./components/FinancialReportHeader";
import FinancialReportStatusBar from "./components/FinancialReportStatusBar";
import FinancialReportOverviewTab from "./tabs/Overview";

const FinancialReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const financialReportUUID = router.query.uuid as string;

  const [isLoaded, { data: financialReport }] = useFullFinancialReport({ id: financialReportUUID });

  return (
    <LoadingContainer loading={!isLoaded}>
      <Head>
        <title>{`${t("Financial Report")}`}</title>
      </Head>
      <PageBreadcrumbs
        links={[
          {
            title: financialReport?.organisationName ?? "",
            path: `/organization/${financialReport?.organisationUuid}`
          },
          {
            title: `Financial Report ${
              financialReport?.createdAt ? new Date(financialReport?.createdAt).toLocaleDateString() : ""
            }`
          }
        ]}
      />
      <FinancialReportHeader financialReport={financialReport} />
      <FinancialReportStatusBar financialReport={financialReport as FinancialReportFullDto} />
      <SecondaryTabs
        tabItems={[
          { key: "overview", title: t("Overview"), body: <FinancialReportOverviewTab report={financialReport} /> }
        ]}
        containerClassName="max-w-[82vw] px-10 xl:px-0 w-full  overflow-y-hidden"
      />
    </LoadingContainer>
  );
};

export default FinancialReportDetailPage;
