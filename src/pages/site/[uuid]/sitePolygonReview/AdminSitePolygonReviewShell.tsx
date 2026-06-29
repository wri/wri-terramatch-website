import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import Loader from "@/components/generic/Loading/Loader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullSite } from "@/connections/Entity";
import FrameworkProvider from "@/context/framework.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useValueChanged } from "@/hooks/useValueChanged";
import SiteCompletedReportsTab from "@/pages/site/[uuid]/tabs/CompletedReports";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import SiteBanner from "@/redesignComponents/content/Banner/SiteBanner/SiteBanner";
import { SiteIcon } from "@/redesignComponents/foundations/Icons";
import Layout from "@/redesignComponents/Loayout/Layout";
import ProjectResponsiveTypography from "@/styles/ResponsiveTypography";
import Log from "@/utils/log";

import SitePolygonsTab from "../tabs/SitePolygonsTab";

const SiteDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const { loading } = useLoading();
  const siteUUID = router.query.uuid as string;

  const [isLoaded, { data: site, loadFailure }] = useFullSite({ id: siteUUID });
  const { openToast } = useToastContext();
  useValueChanged(isLoaded, () => {
    if (isLoaded && site == null) {
      Log.error("Site not found", { siteUUID, loadFailure });
      openToast("Site not found", ToastType.ERROR);
    }
  });

  const currentTab = (router.query.tab as string) ?? "polygons";
  const isSuffixView = currentTab === "completed-tasks";
  const activeTab = isSuffixView ? "polygons" : currentTab;

  const TabItems = [{ key: "polygons", title: t("Polygons"), body: <SitePolygonsTab site={site!} /> }];

  const suffixContent = isSuffixView ? <SiteCompletedReportsTab site={site!} /> : null;

  return (
    <Layout>
      <MapAreaProvider>
        <ProjectResponsiveTypography />
        <FrameworkProvider frameworkKey={site?.frameworkKey}>
          {loading && (
            <div className="fixed top-0 z-50 flex h-screen w-screen items-center justify-center backdrop-brightness-50">
              <Loader />
            </div>
          )}
          <LoadingContainer loading={!isLoaded}>
            {site == null ? null : (
              <>
                <SiteBanner
                  site={site}
                  breadcrumbs={[
                    {
                      label: t("Sites"),
                      link: "/admin#/site?filter=%7B%7D&order=ASC&page=1&perPage=10&sort=",
                      icon: <SiteIcon className="!text-theme-primary-900" />
                    },
                    { label: site.name ?? "", link: `/admin#/site/${site.uuid}/show` },
                    ...(isSuffixView ? [{ label: t("Reports"), link: `/site/${site.uuid}?tab=completed-tasks` }] : [])
                  ]}
                  suffix={
                    <div className="flex gap-1.5">
                      <div className="flex gap-1.5">
                        <Button
                          variant="borderless"
                          size="small"
                          className="underline underline-offset-2"
                          onClick={() => router.push(`/admin#/project/${site.projectUuid}/show`)}
                        >
                          {t("Project Profile")}
                        </Button>
                        <span className="text-theme-neutral-300 text-sm">|</span>
                        <Button
                          variant="borderless"
                          size="small"
                          className="underline underline-offset-2"
                          onClick={() => router.push(`/admin#/site/${site.uuid}/show?tab=completed-tasks`)}
                        >
                          {t("Site Reports")}
                        </Button>
                      </div>
                    </div>
                  }
                  toolbar={{
                    tabBar: {
                      tabs: TabItems.map(item => ({
                        value: item.key,
                        label: item.title
                      })),
                      defaultValue: isSuffixView ? "__none__" : activeTab,
                      onTabClick: (tabValue: string) => {
                        router.push(`/site/${siteUUID}?tab=${tabValue}`, undefined, { shallow: true });
                      }
                    }
                  }}
                />
                <div className="flex flex-1">
                  {suffixContent ?? TabItems.find(item => item.key === activeTab)?.body}
                </div>
              </>
            )}
            <PageFooter />
          </LoadingContainer>
        </FrameworkProvider>
      </MapAreaProvider>
    </Layout>
  );
};

export default SiteDetailPage;
