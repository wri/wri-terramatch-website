import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import EntityStatusBar from "@/components/extensive/EntityStatusBar";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullDisturbanceReport } from "@/connections/Entity";
import FrameworkProvider from "@/context/framework.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

import DisturbanceReportHeader from "./components/DisturbanceReportHeader";
import AuditLog from "./tabs/AuditLog";
import GalleryTab from "./tabs/Gallery";
import FinancialReportOverviewTab from "./tabs/Overview";
import UploadedFilesTab from "./tabs/UploadedFiles";

const DisturbanceReportDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const disturbanceReportUUID = router.query.uuid as string;

  const [isLoaded, { data: disturbanceReport, loadFailure }] = useFullDisturbanceReport({ id: disturbanceReportUUID });
  const { openToast } = useToastContext();
  useValueChanged(isLoaded, () => {
    if (isLoaded && disturbanceReport == null) {
      Log.error("Disturbance report not found", { disturbanceReportUUID, loadFailure });
      openToast("Disturbance report not found", ToastType.ERROR);
    }
  });

  return (
    <FrameworkProvider frameworkKey={disturbanceReport?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        {disturbanceReport == null ? null : (
          <>
            <Head>
              <title>{`${t("Disturbance Report")}`}</title>
            </Head>
            <PageBreadcrumbs
              links={[
                { title: t("My Projects"), path: "/my-projects" },
                {
                  title: disturbanceReport.projectName ?? "",
                  path: `/project/${disturbanceReport.projectUuid}`
                },
                {
                  title: `Disturbance Report ${
                    disturbanceReport.createdAt != null
                      ? new Date(disturbanceReport.createdAt).toLocaleDateString()
                      : ""
                  }`
                }
              ]}
            />
            <DisturbanceReportHeader disturbanceReport={disturbanceReport} />
            <EntityStatusBar entityName="disturbanceReports" entity={disturbanceReport} />
            <SecondaryTabs
              tabItems={[
                {
                  key: "overview",
                  title: t("Overview"),
                  body: <FinancialReportOverviewTab report={disturbanceReport} />
                },
                {
                  key: "gallery",
                  title: t("Gallery"),
                  body: (
                    <GalleryTab
                      modelName="disturbanceReports"
                      modelUUID={disturbanceReport.uuid}
                      modelTitle={t("Disturbance Report")}
                      entityData={disturbanceReport}
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
            <PageFooter />
          </>
        )}
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default DisturbanceReportDetailPage;
