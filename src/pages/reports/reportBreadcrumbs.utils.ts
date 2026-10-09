import type { ParsedUrlQuery } from "querystring";

import { getEntityDetailPageLink } from "@/helpers/entity";
import { appendQueryParams } from "@/utils/appendQueryParams";

import { getReportsIndexHrefFromQuery, ReportProfileOrigin, ReportsIndexSource } from "./reportIndex.utils";

export type ReportTrailCrumb = { label: string; link: string };

export type ReportTrailRoot = "reports" | "sites" | "nurseries" | "projects";

export type ReportTrailEntity = { uuid?: string | null; name?: string | null };

export type ReportTrailEntities = Partial<Record<ReportsIndexSource, ReportTrailEntity>>;

type Translate = (message: string) => string;

export type BuildReportTrailParams = {
  t: Translate;
  /** The level the report itself belongs to: a project, site or nursery report. */
  reportLevel: ReportsIndexSource;
  reportCrumb: ReportTrailCrumb;
  entities: ReportTrailEntities;
  from?: ParsedUrlQuery["from"];
  profile?: ReportProfileOrigin;
  contextOrigin?: ParsedUrlQuery["origin"];
};

/**
 * Builds the breadcrumb trail shared by a report page and its edit form, so both show the same path.
 * The root is where the user came from:
 * - Sites / Nurseries list, when a site or nursery Reports tab was the origin.
 * - Reports index, when the report was opened from the reports index (`from`).
 * - Otherwise Projects → project → (site | nursery) → report.
 */
export const buildReportTrail = ({
  t,
  reportLevel,
  reportCrumb,
  entities,
  from,
  profile,
  contextOrigin
}: BuildReportTrailParams): { root: ReportTrailRoot; crumbs: ReportTrailCrumb[] } => {
  const origin = typeof contextOrigin === "string" ? contextOrigin : undefined;
  const profileName = profile == null ? undefined : entities[profile.source]?.name;

  if (profile != null) {
    if (origin === "sites" && profile.source === "site") {
      return {
        root: "sites",
        crumbs: [
          { label: t("Sites"), link: "/site" },
          {
            label: profileName ?? t("Site"),
            link: appendQueryParams(getEntityDetailPageLink("sites", profile.uuid, "reports"), { origin: "sites" })
          },
          reportCrumb
        ]
      };
    }

    if (origin === "nurseries" && profile.source === "nursery") {
      return {
        root: "nurseries",
        crumbs: [
          { label: t("Nurseries"), link: "/nurserie" },
          {
            label: profileName ?? t("Nursery"),
            link: appendQueryParams(getEntityDetailPageLink("nurseries", profile.uuid, "reports"), {
              origin: "nurseries"
            })
          },
          reportCrumb
        ]
      };
    }
  }

  const reportsIndexHref = getReportsIndexHrefFromQuery(from);
  if (reportsIndexHref != null && profile == null) {
    return { root: "reports", crumbs: [{ label: t("Reports"), link: reportsIndexHref }, reportCrumb] };
  }

  const { project, site, nursery } = entities;
  const crumbs: ReportTrailCrumb[] = [
    { label: t("Projects"), link: "/my-projects" },
    {
      label: project?.name ?? t("Project"),
      link: project?.uuid != null ? `/project/${project.uuid}` : "/my-projects"
    }
  ];

  const showsProfileLevel = (level: ReportsIndexSource) => profile == null || profile.source === level;

  if (reportLevel === "site" && site?.uuid != null && showsProfileLevel("site")) {
    crumbs.push({ label: site.name ?? t("Site"), link: getEntityDetailPageLink("sites", site.uuid, "reports") });
  }

  if (reportLevel === "nursery" && nursery?.uuid != null && showsProfileLevel("nursery")) {
    crumbs.push({
      label: nursery.name ?? t("Nursery"),
      link: getEntityDetailPageLink("nurseries", nursery.uuid, "reports")
    });
  }

  return { root: "projects", crumbs: [...crumbs, reportCrumb] };
};
