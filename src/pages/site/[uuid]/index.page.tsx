import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import EntityStatusBar from "@/components/extensive/EntityStatusBar";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import Loader from "@/components/generic/Loading/Loader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullSite } from "@/connections/Entity";
import FrameworkProvider from "@/context/framework.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useValueChanged } from "@/hooks/useValueChanged";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";
import SiteHeader from "@/pages/site/[uuid]/components/SiteHeader";
import SiteCompletedReportsTab from "@/pages/site/[uuid]/tabs/CompletedReports";
import SiteDetailTab from "@/pages/site/[uuid]/tabs/Details";
import GoalsAndProgressTab from "@/pages/site/[uuid]/tabs/GoalsAndProgress";
import SiteOverviewTab from "@/pages/site/[uuid]/tabs/Overview";
import SiteBanner from "@/redesignComponents/content/Banner/SiteBanner/SiteBanner";
import { ProjectIcon } from "@/redesignComponents/foundations/Icons";
import Log from "@/utils/log";

import AuditLog from "./tabs/AuditLog";

const SiteDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const { loading } = useLoading();
  const siteUUID = router.query.uuid as string;

  const [isLoaded, { data: site, loadFailure, refetch }] = useFullSite({ id: siteUUID });
  const { openToast } = useToastContext();
  useValueChanged(isLoaded, () => {
    if (isLoaded && site == null) {
      Log.error("Site not found", { siteUUID, loadFailure });
      openToast("Site not found", ToastType.ERROR);
    }
  });

  return (
    <MapAreaProvider>
      <FrameworkProvider frameworkKey={site?.frameworkKey}>
        {loading && (
          <div className="fixed top-0 z-50 flex h-screen w-screen items-center justify-center backdrop-brightness-50">
            <Loader />
          </div>
        )}
        <LoadingContainer loading={!isLoaded}>
          {site == null ? null : (
            <>
              <Head>
                <title>{`${t("Site")} ${site.name}`}</title>
              </Head>
              <PageBreadcrumbs
                links={[
                  { title: t("My Projects"), path: "/my-projects" },
                  { title: site.projectName ?? "", path: `/project/${site.projectUuid}` },
                  { title: site.name ?? "" }
                ]}
              />
              <SiteHeader site={site} />
              <SiteBanner
                site={site}
                className="top-[70px]"
                breadcrumbs={[
                  {
                    label: t("My Projects"),
                    link: "/my-projects",
                    icon: <ProjectIcon className="!text-theme-primary-900" />
                  },
                  { label: site.projectName ?? "", link: `/project/${site.projectUuid}` },
                  { label: site.name ?? "", link: `/site/${site.uuid}` }
                ]}
                suffix={<>Sufix</>}
                toolbar={{
                  tabBar: {
                    tabs: [
                      { value: "overview", label: t("Overview") },
                      { value: "details", label: t("Details") },
                      { value: "gallery", label: t("Gallery") },
                      { value: "goals", label: t("Progress & Goals") },
                      { value: "completed-tasks", label: t("Completed Reports") },
                      { value: "audit-log", label: t("Audit Log") }
                    ],
                    defaultValue: "overview",
                    onTabClick: (tabValue: string) => {
                      router.push(`/site/${site.uuid}?tab=${tabValue}`);
                    }
                  }
                }}
              />

              <EntityStatusBar entityName="sites" entity={site} />
              <SecondaryTabs
                tabItems={[
                  { key: "overview", title: t("Overview"), body: <SiteOverviewTab site={site} refetch={refetch} /> },
                  { key: "details", title: t("Details"), body: <SiteDetailTab site={site} /> },
                  {
                    key: "gallery",
                    title: t("Gallery"),
                    body: (
                      <GalleryTab
                        modelName="sites"
                        modelUUID={site.uuid}
                        modelTitle={t("Site")}
                        entityData={site}
                        emptyStateContent={t(
                          "Your gallery is currently empty. Add images by using the 'Edit' button on this site, or images added to your site reports will also automatically populate this gallery."
                        )}
                      />
                    )
                  },
                  { key: "goals", title: t("Progress & Goals"), body: <GoalsAndProgressTab site={site} /> },
                  {
                    key: "completed-tasks",
                    title: t("Completed Reports"),
                    body: <SiteCompletedReportsTab site={site} />
                  },
                  {
                    key: "audit-log",
                    title: t("Audit Log"),
                    body: <AuditLog site={site} refresh={refetch} />
                  }
                ]}
                containerClassName="max-w-[82vw] px-10 xl:px-0 w-full"
              />
              <PageFooter />
            </>
          )}
        </LoadingContainer>
      </FrameworkProvider>
    </MapAreaProvider>
  );
};

export default SiteDetailPage;
