import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import { buildReportTrail, ReportTrailEntities, ReportTrailRoot } from "@/pages/reports/reportBreadcrumbs.utils";
import { getReportProfileOriginFromQuery, ReportsIndexSource } from "@/pages/reports/reportIndex.utils";
import { BannerProps } from "@/redesignComponents/content/Banner/Banner";
import { NurseryIcon, ProjectIcon, ReportsIcon, SiteIcon } from "@/redesignComponents/foundations/Icons";

type Breadcrumbs = BannerProps["breadcrumbs"];

const ROOT_ICONS: Record<ReportTrailRoot, JSX.Element> = {
  reports: <ReportsIcon className="!text-theme-primary-900" />,
  sites: <SiteIcon className="!text-theme-primary-900" />,
  nurseries: <NurseryIcon className="!text-theme-primary-900" />,
  projects: <ProjectIcon className="!text-theme-primary-900" />
};

/**
 * Breadcrumbs for a report view page. `reportLevel` is the level of the report itself and `entities`
 * carries the project / site / nursery the report belongs to, taken from the report DTO.
 */
export const useReportBreadcrumbs = (
  reportCrumb: Breadcrumbs[number],
  reportLevel: ReportsIndexSource,
  entities: ReportTrailEntities = {}
): Breadcrumbs => {
  const t = useT();
  const router = useRouter();

  const { root, crumbs } = buildReportTrail({
    t,
    reportLevel,
    reportCrumb,
    entities,
    from: router.query.from,
    profile: getReportProfileOriginFromQuery(router.query.profile, router.query.profileUuid),
    contextOrigin: router.query.origin
  });

  return crumbs.map((crumb, index) => (index === 0 ? { ...crumb, icon: ROOT_ICONS[root] } : crumb));
};
