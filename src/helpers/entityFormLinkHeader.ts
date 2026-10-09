import { useT } from "@transifex/react";
import { startCase } from "lodash";
import type { ParsedUrlQuery } from "querystring";
import { ReactNode } from "react";

import { getShortPeriodLabel } from "@/components/extensive/WizardForm/utils";
import { DisturbanceReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { disturbanceReportTitle } from "@/pages/reports/disturbance-report/[uuid]/index.page";
import { buildReportTrail } from "@/pages/reports/reportBreadcrumbs.utils";
import {
  getReportProfileOriginFromQuery,
  getReportsIndexHrefFromQuery,
  ReportsIndexSource
} from "@/pages/reports/reportIndex.utils";
import { ProgressState } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { EntityName, SingularEntityName } from "@/types/common";
import { appendQueryParams } from "@/utils/appendQueryParams";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

import { singularEntityName } from "./entity";

type EntityForLinkHeader = {
  uuid?: string | null;
  title?: string | null;
  name?: string | null;
  projectName?: string | null;
  projectUuid?: string | null;
  taskUuid?: string | null;
  organisationName?: string | null;
  organisationUuid?: string | null;
  siteName?: string | null;
  siteUuid?: string | null;
  nurseryName?: string | null;
  nurseryUuid?: string | null;
  reportTitle?: string | null;
};

export type EntityLinkHeaderParams = {
  isAdmin: boolean;
  model: string;
  uuid?: string;
  redirectEntityPage?: string;
  adminListPath?: string;
  entity: EntityForLinkHeader | null | undefined;
  firstLinkIcon: ReactNode;
  t: typeof useT;
  from?: ParsedUrlQuery["from"];
  origin?: ParsedUrlQuery["origin"];
  profile?: ParsedUrlQuery["profile"];
  profileUuid?: ParsedUrlQuery["profileUuid"];
  taskTitle?: string;
};

export type EntityLinkHeaderMap = Record<string, Array<{ label: string; link: string; icon?: ReactNode }>>;

export const mapStatusToTagState = (status: string | null | undefined): TagSubmissionState | undefined =>
  mapStatusToTagStateEntity(status)?.type;

export const mapPlantingStatusToProgressState = (status: string | null | undefined): ProgressState | undefined => {
  switch (status) {
    case "not-started":
      return "not-started";
    case "in-progress":
      return "in-progress";
    case "completed":
      return "completed";
    case "replacement-planting":
      return "in-progress";
    case "no-restoration-expected":
      return "in-progress";
    default:
      return undefined;
  }
};

export const mapEntityTitle = (title: string | null, model: string, t: typeof useT): string => {
  if (title == null || title === "") return t(startCase(singularEntityName(model as EntityName | SingularEntityName)));
  return title;
};

export function entityLinkHeaderMap(params: EntityLinkHeaderParams): EntityLinkHeaderMap {
  const {
    isAdmin,
    model,
    uuid,
    redirectEntityPage,
    adminListPath,
    entity,
    firstLinkIcon,
    t,
    from,
    origin,
    profile,
    profileUuid,
    taskTitle
  } = params;
  const linkLabel = t(startCase(model));

  const originStr = typeof origin === "string" ? origin : undefined;
  const originParam = originStr ? `?origin=${encodeURIComponent(originStr)}` : "";
  const editLink = uuid
    ? `/entity/${singularEntityName(model as EntityName | SingularEntityName)}/edit/${uuid}${originParam}`
    : "#";
  const entityTitle = mapEntityTitle(entity?.title ?? entity?.name ?? null, model, t);
  const withFirstIcon = (
    items: Array<{ label: string; link: string }>
  ): Array<{ label: string; link: string; icon?: ReactNode }> =>
    items.map((item, i) => (i === 0 ? { ...item, icon: firstLinkIcon } : item));

  const entityPageLink =
    isAdmin && redirectEntityPage == undefined ? adminListPath! : redirectEntityPage ?? "/my-projects";

  const isFromIndex =
    originStr != null && (originStr === "sites" || originStr === "nurseries" || originStr === "reports");

  // redirectEntityPage may already carry a query (report origin params), so merge instead of appending.
  const entityPageLinkWithOrigin =
    isFromIndex && originStr ? appendQueryParams(entityPageLink, { origin: originStr }) : entityPageLink;

  const financialReportsHref =
    getReportsIndexHrefFromQuery(from, undefined) ??
    (entity?.organisationUuid != null ? `/organization/${entity.organisationUuid}` : entityPageLink);

  const reportBreadcrumb = (reportsHref: string, label: string = entityTitle) =>
    withFirstIcon([
      {
        label: t("Reports"),
        link: isAdmin ? adminListPath! : reportsHref
      },
      { label, link: isFromIndex ? entityPageLinkWithOrigin : entityPageLink },
      { label: t("Edit"), link: editLink }
    ]);

  // Report edit trails share the same builder as the report view page, so going back always matches the view.
  const reportTrail = (reportLevel: ReportsIndexSource, reportCrumb: { label: string; link: string }) => {
    const { crumbs } = buildReportTrail({
      t,
      reportLevel,
      reportCrumb,
      entities: {
        project: { uuid: entity?.projectUuid, name: entity?.projectName },
        site: { uuid: entity?.siteUuid, name: entity?.siteName },
        nursery: { uuid: entity?.nurseryUuid, name: entity?.nurseryName }
      },
      from,
      profile: getReportProfileOriginFromQuery(profile, profileUuid),
      contextOrigin: originStr
    });
    const trail = crumbs.map((crumb, i) =>
      isAdmin && i < crumbs.length - 1 ? { ...crumb, link: adminListPath! } : crumb
    );
    return withFirstIcon([...trail, { label: t("Edit"), link: editLink }]);
  };

  const siteReportBreadcrumbLabel = t("Site Report {window}: {siteName}", {
    window: getShortPeriodLabel(taskTitle ?? "", true),
    siteName: entity?.siteName
  });
  const nurseryReportBreadcrumbLabel = t("Nursery Report {window}: {nurseryName}", {
    window: getShortPeriodLabel(taskTitle ?? "-", true),
    nurseryName: entity?.nurseryName ?? "-"
  });

  return {
    projects: withFirstIcon([
      {
        label: isAdmin ? linkLabel : t("My Projects"),
        link: isAdmin ? adminListPath! : "/my-projects"
      },
      { label: entityTitle.length > 25 ? `${entityTitle.slice(0, 25)}...` : entityTitle, link: entityPageLink },
      { label: t("Edit"), link: editLink }
    ]),
    sites:
      isFromIndex && originStr === "sites"
        ? withFirstIcon([
            {
              label: t("Sites"),
              link: "/site"
            },
            { label: entityTitle ?? "-", link: entityPageLinkWithOrigin },
            { label: t("Edit"), link: editLink }
          ])
        : withFirstIcon([
            {
              label: isAdmin ? linkLabel : t("Projects"),
              link: isAdmin ? adminListPath! : "/my-projects"
            },
            {
              label: isAdmin ? linkLabel : entity?.projectName ?? "",
              link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}?tab=sites`
            },
            { label: entityTitle, link: entityPageLink },
            { label: t("Edit"), link: editLink }
          ]),
    nurseries:
      isFromIndex && originStr === "nurseries"
        ? withFirstIcon([
            {
              label: t("Nurseries"),
              link: "/nurserie"
            },
            { label: entityTitle ?? "-", link: entityPageLinkWithOrigin },
            { label: t("Edit"), link: editLink }
          ])
        : withFirstIcon([
            {
              label: isAdmin ? linkLabel : t("Projects"),
              link: isAdmin ? adminListPath! : "/my-projects"
            },
            {
              label: isAdmin ? linkLabel : entity?.projectName ?? "",
              link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}?tab=nurseries`
            },
            { label: entityTitle, link: entityPageLink },
            { label: t("Edit"), link: editLink }
          ]),
    projectReports: reportTrail("project", { label: entity?.reportTitle ?? entityTitle, link: entityPageLink }),
    siteReports: reportTrail("site", { label: siteReportBreadcrumbLabel, link: entityPageLink }),
    nurseryReports: reportTrail("nursery", { label: nurseryReportBreadcrumbLabel, link: entityPageLink }),
    financialReports:
      isFromIndex && originStr === "reports"
        ? reportBreadcrumb(financialReportsHref, entityTitle + " - " + getShortPeriodLabel(taskTitle ?? "", true))
        : withFirstIcon([
            {
              label: isAdmin
                ? linkLabel
                : t("Organisation - {organisationName}", { organisationName: entity?.organisationName ?? "" }),
              link: isAdmin ? adminListPath! : `/organization/${entity?.organisationUuid ?? ""}`
            },
            {
              label: t("Financial Reports"),
              link: isAdmin ? adminListPath! : financialReportsHref
            },
            { label: entityTitle + " - " + getShortPeriodLabel(taskTitle ?? "", true), link: entityPageLink },
            { label: t("Edit"), link: editLink }
          ]),
    disturbanceReports: reportTrail("project", {
      label: disturbanceReportTitle(entity as DisturbanceReportFullDto),
      link: entityPageLink
    }),
    srpReports: reportTrail("project", { label: entityTitle, link: entityPageLink })
  };
}
