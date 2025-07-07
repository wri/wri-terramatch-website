import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2FinancialReportsUUID } from "@/generated/apiComponents";
import { V2FinancialReportRead } from "@/generated/apiSchemas";

import FinancialReportHeader from "./components/FinancialReportHeader";
import FinancialReportStatusBar from "./components/FinancialReportStatusBar";
import FinancialReportOverviewTab from "./tabs/Overview";

const FinancialReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const financialReportUUID = router.query.uuid as string;

  const { data, isLoading } = useGetV2FinancialReportsUUID<{ data: V2FinancialReportRead }>({
    pathParams: {
      uuid: financialReportUUID
    }
  });

  const organisationInfo = data?.data?.organisation;
  const financialReportInfo = data?.data;

  return (
    <LoadingContainer loading={isLoading}>
      <Head>
        <title>{`${t("Financial Report")}`}</title>
      </Head>
      <PageBreadcrumbs
        links={[
          { title: organisationInfo?.name ?? "", path: `/organization/${organisationInfo?.uuid}` },
          {
            title: `Financial Report ${
              financialReportInfo?.created_at ? new Date(financialReportInfo?.created_at).toLocaleDateString() : ""
            }`
          }
        ]}
      />
      <FinancialReportHeader financialReport={financialReportInfo} />
      <FinancialReportStatusBar financialReport={financialReportInfo} />
      <SecondaryTabs
        tabItems={[
          { key: "overview", title: t("Overview"), body: <FinancialReportOverviewTab report={financialReportInfo} /> }
        ]}
        containerClassName="max-w-[82vw] px-10 xl:px-0 w-full  overflow-y-hidden"
      />
    </LoadingContainer>
  );
};

export default FinancialReportDetailPage;
