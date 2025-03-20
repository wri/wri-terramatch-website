import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import Loader from "@/components/generic/Loading/Loader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullSite } from "@/connections/Entity";
import FrameworkProvider from "@/context/framework.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";
import SiteHeader from "@/pages/site/[uuid]/components/SiteHeader";
import SiteCompletedReportsTab from "@/pages/site/[uuid]/tabs/CompletedReports";
import SiteDetailTab from "@/pages/site/[uuid]/tabs/Details";
import GoalsAndProgressTab from "@/pages/site/[uuid]/tabs/GoalsAndProgress";
import SiteOverviewTab from "@/pages/site/[uuid]/tabs/Overview";

import AuditLog from "./tabs/AuditLog";

const ButtonStates = {
  PROJECTS: 0,
  SITE: 1,
  POLYGON: 2
};

const SiteDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const { loading } = useLoading();
  const siteUUID = router.query.uuid as string;

  const [isLoaded, { entity: site, refetch }] = useFullSite({
    uuid: siteUUID
  });

  return (
    (!isLoaded || site != null) && (
      <MapAreaProvider>
        <FrameworkProvider frameworkKey={site?.frameworkKey}>
          {loading && (
            <div className="fixed top-0 z-50 flex h-screen w-screen items-center justify-center backdrop-brightness-50">
              <Loader />
            </div>
          )}
          <LoadingContainer loading={!isLoaded}>
            <Head>
              <title>{`${t("Site")} ${site?.name}`}</title>
            </Head>
            <PageBreadcrumbs
              links={[
                { title: t("My Projects"), path: "/my-projects" },
                { title: site?.projectName ?? "", path: `/project/${site?.projectUuid}` },
                { title: site?.name ?? "" }
              ]}
            />
            <SiteHeader site={site!} />
            <StatusBar entityName="sites" entity={site} />
            <SecondaryTabs
              tabItems={[
                { key: "overview", title: t("Overview"), body: <SiteOverviewTab site={site!} refetch={refetch} /> },
                { key: "details", title: t("Details"), body: <SiteDetailTab site={site!} /> },
                {
                  key: "gallery",
                  title: t("Gallery"),
                  body: (
                    <GalleryTab
                      modelName="sites"
                      modelUUID={site?.uuid ?? ""}
                      modelTitle={t("Site")}
                      entityData={site}
                      emptyStateContent={t(
                        "Your gallery is currently empty. Add images by using the 'Edit' button on this site, or images added to your site reports will also automatically populate this gallery."
                      )}
                    />
                  )
                },
                { key: "goals", title: t("Progress & Goals"), body: <GoalsAndProgressTab site={site!} /> },
                {
                  key: "completed-tasks",
                  title: t("Completed Reports"),
                  body: <SiteCompletedReportsTab siteUUID={site?.uuid ?? ""} />
                },
                {
                  key: "audit-log",
                  title: t("Audit Log"),
                  body: <AuditLog site={site} refresh={refetch} enableChangeStatus={ButtonStates.POLYGON} />
                }
              ]}
              containerClassName="max-w-[82vw] px-10 xl:px-0 w-full"
            />
            <PageFooter />
          </LoadingContainer>
        </FrameworkProvider>
      </MapAreaProvider>
    )
  );
};

export default SiteDetailPage;
