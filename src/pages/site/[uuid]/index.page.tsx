import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import EntityGalleryTab from "@/components/extensive/EntityGallery/EntityGalleryTab";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import SiteCompletedReportsTab from "@/pages/site/[uuid]/tabs/CompletedReports";
import SiteDetailTab from "@/pages/site/[uuid]/tabs/Details";
import GoalsAndProgressTab from "@/pages/site/[uuid]/tabs/GoalsAndProgress";
import SiteOverviewTab from "@/pages/site/[uuid]/tabs/Overview";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import SiteBanner from "@/redesignComponents/content/Banner/SiteBanner/SiteBanner";
import { ProjectIcon } from "@/redesignComponents/foundations/Icons";

import SitePageProviders from "./components/SitePageProviders";
import { useSitePageLoad } from "./hooks/useSitePageLoad";
import AuditLog from "./tabs/AuditLog";
import SitePolygonsTab from "./tabs/SitePolygonsTab";

const SiteDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const siteUUID = router.query.uuid as string;

  const { isLoaded, site, refetch } = useSitePageLoad(siteUUID);

  const currentTab = (router.query.tab as string) ?? "overview";
  const isSuffixView = currentTab === "completed-tasks";
  const activeTab = isSuffixView ? "overview" : currentTab;

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
      key: "audit-log",
      title: t("Audit Log"),
      body: <AuditLog site={site!} refresh={refetch} />
    }
  ];

  const suffixContent = isSuffixView ? <SiteCompletedReportsTab site={site!} /> : null;

  return (
    <SitePageProviders frameworkKey={site?.frameworkKey} isLoaded={isLoaded}>
      {site == null ? null : (
        <>
          <SiteBanner
            site={site}
            breadcrumbs={[
              {
                label: t("Projects"),
                link: "/my-projects",
                icon: <ProjectIcon className="!text-theme-primary-900" />
              },
              { label: site.projectName ?? "", link: `/project/${site.projectUuid}` },
              { label: site.name ?? "", link: `/site/${site.uuid}` },
              ...(isSuffixView ? [{ label: t("Reports"), link: `/site/${site.uuid}?tab=completed-tasks` }] : [])
            ]}
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
                  <span className="text-theme-neutral-300 text-sm">|</span>
                  <Button
                    variant="borderless"
                    size="small"
                    className="underline underline-offset-2"
                    onClick={() => router.push(`/site/${site.uuid}?tab=completed-tasks`)}
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
          <div className="flex flex-1">{suffixContent ?? TabItems.find(item => item.key === activeTab)?.body}</div>
        </>
      )}
      <PageFooter />
    </SitePageProviders>
  );
};

export default SiteDetailPage;
