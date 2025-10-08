import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullDisturbanceReport } from "@/connections/Entity";
import FrameworkProvider from "@/context/framework.provider";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";

import DisturbanceReportHeader from "./components/DisturbanceReportHeader";
import AuditLog from "./tabs/AuditLog";
import FinancialReportOverviewTab from "./tabs/Overview";
import UploadedFilesTab from "./tabs/UploadedFiles";

const DisturbanceReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const disturbanceReportUUID = router.query.uuid as string;

  const [isLoaded, { data: disturbanceReport }] = useFullDisturbanceReport({ id: disturbanceReportUUID });
  return (
    <FrameworkProvider frameworkKey={disturbanceReport?.frameworkKey!}>
      <LoadingContainer loading={!isLoaded}>
        <Head>
          <title>{`${t("Disturbance Report")}`}</title>
        </Head>
        <PageBreadcrumbs
          links={[
            { title: t("My Projects"), path: "/my-projects" },
            {
              title: disturbanceReport?.projectName ?? "",
              path: `/project/${disturbanceReport?.projectUuid}`
            },
            {
              title: `Disturbance Report ${
                disturbanceReport?.createdAt ? new Date(disturbanceReport?.createdAt).toLocaleDateString() : ""
              }`
            }
          ]}
        />
        <DisturbanceReportHeader disturbanceReport={disturbanceReport} />
        <StatusBar entityName="disturbance-reports" entity={disturbanceReport} />
        <SecondaryTabs
          tabItems={[
            { key: "overview", title: t("Overview"), body: <FinancialReportOverviewTab report={disturbanceReport} /> },
            {
              key: "gallery",
              title: t("Gallery"),
              body: (
                <GalleryTab
                  modelName="disturbanceReports"
                  modelUUID={disturbanceReport?.uuid as string}
                  modelTitle={t("Disturbance Report")}
                  entityData={undefined}
                  emptyStateContent={t(
                    "Your gallery is currently empty. Add images by using the 'Edit' button on this disturbance report."
                  )}
                />
              )
            },
            {
              key: "uploaded-files",
              title: t("Uploaded Files"),
              body: <UploadedFilesTab report={disturbanceReport} />
            },
            { key: "audit-log", title: t("Audit Log"), body: <AuditLog disturbanceReport={disturbanceReport} /> }
          ]}
          containerClassName="max-w-[82vw] px-10 xl:px-0 w-full  overflow-y-hidden"
        />
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default DisturbanceReportDetailPage;
