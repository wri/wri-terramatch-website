import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC } from "react";

import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getReportsIndexUrl } from "@/pages/reports/report-index/reportIndex.utils";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import SiteBanner from "@/redesignComponents/content/Banner/SiteBanner/SiteBanner";
import { SiteIcon } from "@/redesignComponents/foundations/Icons";
import Layout from "@/redesignComponents/Layout/Layout";

import SitePolygonsWorkspace from "./SitePolygonsWorkspace";

interface AdminSitePolygonReviewShellProps {
  site: SiteFullDto;
}

const AdminSitePolygonReviewShell: FC<AdminSitePolygonReviewShellProps> = ({ site }) => {
  const t = useT();
  const router = useRouter();
  const siteUUID = router.query.uuid as string;
  const polygonReviewPath = `/site/${siteUUID}/polygon-review`;

  const activeTab = (router.query.tab as string) ?? "polygons";

  const tabItems = [
    {
      key: "polygons",
      title: t("Polygons"),
      body: <SitePolygonsWorkspace site={site} variant="adminReview" />
    }
  ];

  return (
    <Layout>
      <SiteBanner
        site={site}
        breadcrumbs={[
          {
            label: t("Sites"),
            link: "/admin#/site?filter=%7B%7D&order=ASC&page=1&perPage=10&sort=",
            icon: <SiteIcon className="!text-theme-primary-900" />
          },
          { label: site.name ?? "", link: `/admin#/site/${site.uuid}/show` }
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
            <span className="text-theme-neutral-300 text-sm">|</span>
            <Button
              variant="borderless"
              size="small"
              className="underline underline-offset-2"
              onClick={() => router.push(getReportsIndexUrl("site", site.uuid))}
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
            defaultValue: activeTab,
            onTabClick: (tabValue: string) => {
              void router.push(`${polygonReviewPath}?tab=${tabValue}`, undefined, { shallow: true });
            }
          }
        }}
      />
      <div className="flex w-full min-w-0 flex-1">{tabItems.find(item => item.key === activeTab)?.body}</div>
    </Layout>
  );
};

export default AdminSitePolygonReviewShell;
