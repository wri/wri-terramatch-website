import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC } from "react";

import EntityGalleryTab from "@/components/extensive/EntityGallery/EntityGalleryTab";
import EntityProfileReportsTab from "@/pages/reports/components/EntityProfileReportsTab";
import SiteDetailTab from "@/pages/site/[uuid]/tabs/Details";
import GoalsAndProgressTab from "@/pages/site/[uuid]/tabs/GoalsAndProgress";
import SiteOverviewTab from "@/pages/site/[uuid]/tabs/Overview";
import { getSiteDetailUrl, SITE_INDEX_ORIGIN } from "@/pages/site/components/siteIndex.utils";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import SiteBanner from "@/redesignComponents/content/Banner/SiteBanner/SiteBanner";
import { ProjectIcon, SiteIcon } from "@/redesignComponents/foundations/Icons";

import SitePageProviders from "./components/SitePageProviders";
import { useSitePageLoad } from "./hooks/useSitePageLoad";
import AuditLog from "./tabs/AuditLog";
import SitePolygonsTab from "./tabs/SitePolygonsTab";

const SiteDetailPage: FC = () => {
  const t = useT();
  const router = useRouter();
  const siteUUID = router.query.uuid as string;

  const { isLoaded, site, refetch } = useSitePageLoad(siteUUID);

  const activeTab = (router.query.tab as string) ?? "overview";
  const isFromSiteIndex = router.query.origin === SITE_INDEX_ORIGIN;

  const TabItems = [
    { key: "overview", title: t("Overview"), body: <SiteOverviewTab site={site!} refetch={refetch} /> },
    { key: "details", title: t("Site Details"), body: <SiteDetailTab site={site!} /> },
    { key: "polygons", title: t("Polygons"), body: <SitePolygonsTab site={site!} /> },
    {
      key: "gallery",
      title: t("Gallery"),
      body: (
        <EntityGalleryTab
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
      key: "reports",
      title: t("Reports"),
      body: (
        <EntityProfileReportsTab
          source="site"
          entityUuid={siteUUID}
          projectUuid={site?.projectUuid ?? null}
          origin={isFromSiteIndex ? SITE_INDEX_ORIGIN : undefined}
        />
      )
    },
    {
      key: "audit-log",
      title: t("History"),
      body: <AuditLog site={site!} refresh={refetch} />
    }
  ];

  return (
    <SitePageProviders frameworkKey={site?.frameworkKey} isLoaded={isLoaded}>
      {site == null ? null : (
        <>
          <SiteBanner
            site={site}
            breadcrumbs={
              isFromSiteIndex
                ? [
                    {
                      label: t("Sites"),
                      link: "/site",
                      icon: <SiteIcon className="!text-theme-primary-900" />
                    },
                    { label: site.name ?? "-", link: getSiteDetailUrl(site.uuid, true) }
                  ]
                : [
                    {
                      label: t("Projects"),
                      link: "/my-projects",
                      icon: <ProjectIcon className="!text-theme-primary-900" />
                    },
                    { label: site.projectName ?? "", link: `/project/${site.projectUuid}` },
                    { label: site.name ?? "-", link: `/site/${site.uuid}` }
                  ]
            }
            suffix={
              <div className="flex gap-1.5">
                <div className="flex gap-1.5">
                  <Button
                    variant="borderless"
                    size="small"
                    className="underline underline-offset-2"
                    onClick={() => router.push(`/project/${site.projectUuid}`)}
                  >
                    {t("Project Profile")}
                  </Button>
                  <span className="text-sm text-theme-neutral-300">|</span>
                  <Button
                    variant="borderless"
                    size="small"
                    className="underline underline-offset-2"
                    onClick={() =>
                      router.push(getSiteDetailUrl(site.uuid, isFromSiteIndex, "reports"), undefined, {
                        shallow: true
                      })
                    }
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
                defaultValue: activeTab,
                onTabClick: (tabValue: string) => {
                  router.push(getSiteDetailUrl(siteUUID, isFromSiteIndex, tabValue), undefined, {
                    shallow: true
                  });
                }
              }
            }}
          />
          <div className="flex flex-1">{TabItems.find(item => item.key === activeTab)?.body}</div>
        </>
      )}
    </SitePageProviders>
  );
};

export default SiteDetailPage;
