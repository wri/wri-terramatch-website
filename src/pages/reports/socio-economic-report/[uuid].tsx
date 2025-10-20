import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullProjectReport } from "@/connections/Entity";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";

import AuditLog from "../project-report/tabs/AuditLog";
import SocioEconomicReportHeader from "./components/SocioEconomicReportHeader";
import ReportDataTab from "./tabs/ReportDataTab";

const SocioEconomicReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const socioEconomicReportUUID = router.query.uuid as string;

  const [isLoaded, { data: socioEconomicReport }] = useFullProjectReport({ id: socioEconomicReportUUID });

  return (
    <LoadingContainer loading={!isLoaded}>
      <Head>
        <title>{`${t("Annual Socio-Economic Report")}`}</title>
      </Head>
      <PageBreadcrumbs
        links={[
          {
            title: socioEconomicReport?.organisationName ?? "",
            path: `/organization/${socioEconomicReport?.organisationUuid}`
          },
          {
            title: `Annual Socio-Economic Report ${
              socioEconomicReport?.createdAt ? new Date(socioEconomicReport?.createdAt).toLocaleDateString() : ""
            }`
          }
        ]}
      />
      <SocioEconomicReportHeader socioEconomicReport={socioEconomicReport} />
      <StatusBar entityName="project-reports" entity={socioEconomicReport} />
      <PageBody className="pt-0">
        <SecondaryTabs
          tabItems={[
            {
              key: "report-data",
              title: t("Report Data"),
              body: <ReportDataTab report={socioEconomicReport} />
            },
            {
              key: "audit-log",
              title: t("Audit Log"),
              body: <AuditLog projectReport={socioEconomicReport} />
            }
          ]}
          containerClassName="max-w-[82vw] px-10 xl:px-0 w-full overflow-y-hidden"
        />
        <br />
        <br />
        <br />

        <PageFooter />
      </PageBody>
    </LoadingContainer>
  );
};

export default SocioEconomicReportDetailPage;
