import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC } from "react";

import { useFullSite } from "@/connections/Entity";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ProjectBanner from "@/redesignComponents/content/Banner/ProjectBanner/ProjectBanner";
import { ProjectIcon, SiteIcon } from "@/redesignComponents/foundations/Icons";
import Layout from "@/redesignComponents/Loayout/Layout";

import ProjectPolygonsWorkspace from "./ProjectPolygonsWorkspace";
import { useProjectSiteDrilldown } from "./useProjectSiteDrilldown";

interface AdminProjectPolygonReviewShellProps {
  project: ProjectFullDto;
}

/**
 * Admin, full-page shell for project-level polygon review. Mirrors AdminSitePolygonReviewShell one
 * level up: a ProjectBanner with breadcrumbs back into the react-admin project show, and a single
 * Polygons tab rendering the project polygon workspace in adminReview mode.
 */
const AdminProjectPolygonReviewShell: FC<AdminProjectPolygonReviewShellProps> = ({ project }) => {
  const t = useT();
  const router = useRouter();
  const projectUUID = router.query.uuid as string;
  const { siteUuid } = useProjectSiteDrilldown();
  // Cache-only in practice: ProjectSiteDrilldownView (rendered below, in the same tree) fetches this
  // exact site, so this resolves from the connection cache rather than firing a second request.
  const [, { data: drilldownSite }] = useFullSite({ id: siteUuid ?? undefined });

  const gotoAdminProjectShow = () => router.push(`/admin#/project/${project.uuid}/show`);

  const tabItems = [
    {
      key: "polygons",
      title: t("Polygons"),
      body: <ProjectPolygonsWorkspace project={project} variant="adminReview" />
    }
  ];

  // Drill-in is in-place (?site=<uuid>, no page navigation — see useProjectSiteDrilldown), so the
  // breadcrumb is the only signal of "you are now looking at one site's review, inside this
  // project's workspace" (plan §3.3). "Sites" links back to the rollup list (clears ?site=).
  const drilldownBreadcrumbs =
    siteUuid == null
      ? []
      : [
          {
            label: t("Sites"),
            link: `/project/${project.uuid}/polygon-review?tab=polygons`,
            icon: <SiteIcon className="!text-theme-primary-900" />
          },
          {
            label: drilldownSite?.name ?? "",
            link: `/project/${project.uuid}/polygon-review?tab=polygons&site=${siteUuid}`
          }
        ];

  return (
    <Layout>
      <ProjectBanner
        project={project}
        onAddTeamClick={gotoAdminProjectShow}
        gotoTeamMembers={gotoAdminProjectShow}
        breadcrumbs={[
          {
            label: t("Projects"),
            link: "/admin#/project?filter=%7B%7D&order=ASC&page=1&perPage=10&sort=",
            icon: <ProjectIcon className="!text-theme-primary-900" />
          },
          { label: project.name ?? "", link: `/admin#/project/${project.uuid}/show` },
          ...drilldownBreadcrumbs
        ]}
        suffix={
          <Button
            variant="borderless"
            size="small"
            className="underline underline-offset-2"
            onClick={gotoAdminProjectShow}
          >
            {t("Project Profile")}
          </Button>
        }
        toolbar={{
          tabBar: {
            tabs: tabItems.map(item => ({ value: item.key, label: item.title })),
            defaultValue: "polygons",
            onTabClick: (tabValue: string) => {
              void router.push(`/project/${projectUUID}/polygon-review?tab=${tabValue}`, undefined, { shallow: true });
            }
          }
        }}
      />
      <div className="flex w-full min-w-0 flex-1">{tabItems[0].body}</div>
    </Layout>
  );
};

export default AdminProjectPolygonReviewShell;
