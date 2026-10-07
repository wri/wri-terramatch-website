import { useT } from "@transifex/react";
import { startCase } from "lodash";
import type { ParsedUrlQuery } from "querystring";
import { ReactNode } from "react";

import { getShortPeriodLabel } from "@/components/extensive/WizardForm/utils";
import {
  getReportsIndexHrefFromQuery,
  getReportsIndexUrl,
  getReportsIndexUrlForEntity
} from "@/pages/reports/reportIndex.utils";
import { ProgressState } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { EntityName, SingularEntityName } from "@/types/common";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

import { singularEntityName } from "./entity";

type EntityForLinkHeader = {
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
  const { isAdmin, model, uuid, redirectEntityPage, adminListPath, entity, firstLinkIcon, t, from, origin, taskTitle } =
    params;
  const linkLabel = t(startCase(model));

  const originParam = origin ? `?origin=${encodeURIComponent(origin)}` : "";
  const editLink = uuid
    ? `/entity/${singularEntityName(model as EntityName | SingularEntityName)}/edit/${uuid}${originParam}`
    : "#";
  const entityTitle = mapEntityTitle(entity?.title ?? entity?.name ?? null, model, t);
  const projectTitle = mapEntityTitle(entity?.projectName ?? null, "project", t);
  const withFirstIcon = (
    items: Array<{ label: string; link: string }>
  ): Array<{ label: string; link: string; icon?: ReactNode }> =>
    items.map((item, i) => (i === 0 ? { ...item, icon: firstLinkIcon } : item));

  const entityPageLink =
    isAdmin && redirectEntityPage == undefined ? adminListPath! : redirectEntityPage ?? "/my-projects";

  const isFromIndex = origin != null && (origin === "sites" || origin === "nurseries" || origin === "reports");
  const indexLabel =
    origin === "sites"
      ? t("Sites")
      : origin === "nurseries"
      ? t("Nurseries")
      : origin === "reports"
      ? t("Reports")
      : undefined;

  const entityPageLinkWithOrigin =
    isFromIndex && origin ? `${entityPageLink}?origin=${encodeURIComponent(origin)}` : entityPageLink;

  const progressReportsHref =
    getReportsIndexHrefFromQuery(from, getReportsIndexUrlForEntity("progress-reports", entity ?? {}, "project")) ??
    entityPageLink;
  const siteReportsHref =
    getReportsIndexHrefFromQuery(from, getReportsIndexUrlForEntity("progress-reports", entity ?? {}, "site")) ??
    entityPageLink;
  const nurseryReportsHref =
    getReportsIndexHrefFromQuery(from, getReportsIndexUrlForEntity("progress-reports", entity ?? {}, "nursery")) ??
    entityPageLink;
  const additionalReportsHref =
    getReportsIndexHrefFromQuery(from, getReportsIndexUrlForEntity("additional-reports", entity ?? {}, "project")) ??
    (entity?.projectUuid != null
      ? getReportsIndexUrl("project", entity.projectUuid, { tab: "additional-reports" })
      : entityPageLink);
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
      isFromIndex && indexLabel === t("Sites")
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
      isFromIndex && indexLabel === t("Nurseries")
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
    projectReports:
      isFromIndex && indexLabel === t("Reports")
        ? reportBreadcrumb(progressReportsHref, entity?.reportTitle ?? entityTitle)
        : withFirstIcon([
            {
              label: "Projects",
              link: isAdmin ? adminListPath! : "/my-projects"
            },
            {
              label: projectTitle,
              link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}`
            },
            { label: entity?.reportTitle, link: entityPageLink },
            { label: t("Edit"), link: editLink }
          ]),
    siteReports:
      isFromIndex && indexLabel === t("Reports")
        ? reportBreadcrumb(siteReportsHref, siteReportBreadcrumbLabel)
        : withFirstIcon([
            {
              label: "Projects",
              link: isAdmin ? adminListPath! : "/my-projects"
            },
            {
              label: projectTitle,
              link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}`
            },
            { label: siteReportBreadcrumbLabel, link: entityPageLink },
            { label: t("Edit"), link: editLink }
          ]),
    nurseryReports:
      isFromIndex && indexLabel === t("Reports")
        ? reportBreadcrumb(nurseryReportsHref, nurseryReportBreadcrumbLabel)
        : withFirstIcon([
            {
              label: "Projects",
              link: isAdmin ? adminListPath! : "/my-projects"
            },
            {
              label: projectTitle,
              link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}`
            },
            { label: nurseryReportBreadcrumbLabel, link: entityPageLink },
            { label: t("Edit"), link: editLink }
          ]),
    financialReports:
      isFromIndex && indexLabel === t("Reports")
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
    disturbanceReports:
      isFromIndex && indexLabel === t("Reports")
        ? reportBreadcrumb(additionalReportsHref, entityTitle)
        : withFirstIcon([
            {
              label: t("Projects"),
              link: isAdmin ? adminListPath! : "/my-projects"
            },
            {
              label: projectTitle,
              link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}`
            },
            { label: entityTitle, link: entityPageLink },
            { label: t("Edit"), link: editLink }
          ]),
    srpReports:
      isFromIndex && indexLabel === t("Reports")
        ? reportBreadcrumb(additionalReportsHref, entityTitle)
        : withFirstIcon([
            {
              label: "Projects",
              link: isAdmin ? adminListPath! : "/my-projects"
            },
            {
              label: projectTitle,
              link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}`
            },
            { label: entityTitle, link: entityPageLink },
            { label: t("Edit"), link: editLink }
          ])
  };
}
