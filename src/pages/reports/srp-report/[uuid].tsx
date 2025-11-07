import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullSRPReport } from "@/connections/Entity";
import { toFramework } from "@/context/framework.provider";
import { SrpReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";

import SocioEconomicReportHeader from "./components/SocioEconomicReportHeader";
import AuditLog from "./tabs/AuditLog";
import ReportDataTab from "./tabs/ReportDataTab";

const SocioEconomicReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const socioEconomicReportUUID = router.query.uuid as string;

  const [isLoaded, { data: srpReport }] = useFullSRPReport({ id: socioEconomicReportUUID });

  const window = useReportingWindow(toFramework(srpReport?.frameworkKey), srpReport?.dueAt as string);
  const taskTitle = t("Reporting Task {window}", { window });

  return (
    <LoadingContainer loading={!isLoaded}>
      <Head>
        <title>{`${t("Annual Socio-Economic Report")}`}</title>
      </Head>
      <PageBreadcrumbs
        links={[
          { title: t("My Projects"), path: "/my-projects" },
          { title: srpReport?.projectName ?? t("Project"), path: `/project/${srpReport?.projectUuid}` },
          { title: taskTitle, path: `/project/${srpReport?.projectUuid}/reporting-task/${srpReport?.taskUuid}` }
        ]}
      />
      <SocioEconomicReportHeader socioEconomicReport={srpReport as SrpReportFullDto} />
      <StatusBar entityName="srp-reports" entity={srpReport} />
      <PageBody className="pt-0">
        <SecondaryTabs
          tabItems={[
            {
              key: "report-data",
              title: t("Report Data"),
              body: <ReportDataTab report={srpReport as SrpReportFullDto} />
            },
            {
              key: "audit-log",
              title: t("Audit Log"),
              body: <AuditLog srpReport={srpReport as SrpReportFullDto} />
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
