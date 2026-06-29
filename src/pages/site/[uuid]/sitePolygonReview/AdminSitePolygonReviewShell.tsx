import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC } from "react";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import SiteCompletedReportsTab from "@/pages/site/[uuid]/tabs/CompletedReports";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import SiteBanner from "@/redesignComponents/content/Banner/SiteBanner/SiteBanner";
import { SiteIcon } from "@/redesignComponents/foundations/Icons";
import Layout from "@/redesignComponents/Loayout/Layout";

import SitePolygonsWorkspace from "./SitePolygonsWorkspace";

interface AdminSitePolygonReviewShellProps {
  site: SiteFullDto;
}

const AdminSitePolygonReviewShell: FC<AdminSitePolygonReviewShellProps> = ({ site }) => {
  const t = useT();
  const router = useRouter();
  const siteUUID = router.query.uuid as string;
  const polygonReviewPath = `/site/${siteUUID}/polygon-review`;

  const currentTab = (router.query.tab as string) ?? "polygons";
  const isSuffixView = currentTab === "completed-tasks";
  const activeTab = isSuffixView ? "polygons" : currentTab;

  const tabItems = [
    {
      key: "polygons",
      title: t("Polygons"),
      body: <SitePolygonsWorkspace site={site} variant="adminReview" />
    }
  ];

  const suffixContent = isSuffixView ? <SiteCompletedReportsTab site={site} /> : null;

  return (
    <Layout>
      <SiteBanner
        site={site}
        reviewLabel={t("Cycle 1 QA:")}
        showStatusTag
        breadcrumbs={[
          {
            label: t("Sites"),
            link: "/admin#/site?filter=%7B%7D&order=ASC&page=1&perPage=10&sort=",
            icon: <SiteIcon className="!text-theme-primary-900" />
          },
          { label: site.name ?? "", link: `/admin#/site/${site.uuid}/show` },
          ...(isSuffixView ? [{ label: t("Reports"), link: `${polygonReviewPath}?tab=completed-tasks` }] : [])
        ]}
        suffix={
          <div className="flex gap-1.5">
            <Button
              variant="borderless"
              size="small"
              className="underline underline-offset-2"
              onClick={() => router.push(`/admin#/project/${site.projectUuid}/show`)}
            >
              {t("Project Profile")}
            </Button>
            <span className="text-sm text-theme-neutral-300">|</span>
            <Button
              variant="borderless"
              size="small"
              className="underline underline-offset-2"
              onClick={() => router.push(`/admin#/site/${site.uuid}/show?tab=completed-tasks`)}
            >
              {t("Site Reports")}
            </Button>
          </div>
        }
        toolbar={{
          tabBar: {
            tabs: tabItems.map(item => ({
              value: item.key,
              label: item.title
            })),
            defaultValue: isSuffixView ? "__none__" : activeTab,
            onTabClick: (tabValue: string) => {
              void router.push(`${polygonReviewPath}?tab=${tabValue}`, undefined, { shallow: true });
            }
          }
        }}
      />
      <div className="flex flex-1">{suffixContent ?? tabItems.find(item => item.key === activeTab)?.body}</div>
      <PageFooter />
    </Layout>
  );
};

export default AdminSitePolygonReviewShell;
