import { useT } from "@transifex/react";
import { startCase } from "lodash";
import { ReactNode } from "react";

import { getShortPeriodLabel } from "@/components/extensive/WizardForm/utils";
import {
  getReportsIndexHrefFromQuery,
  getReportsIndexUrl,
  getReportsIndexUrlForEntity
} from "@/pages/reports/report-index/reportIndex.utils";
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
  from?: unknown;
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
  const { isAdmin, model, uuid, redirectEntityPage, adminListPath, entity, firstLinkIcon, t, from, taskTitle } = params;
  const linkLabel = t(startCase(model));

  const editLink = uuid ? `/entity/${singularEntityName(model as EntityName | SingularEntityName)}/edit/${uuid}` : "#";
  const entityTitle = mapEntityTitle(entity?.title ?? entity?.name ?? null, model, t);
  const withFirstIcon = (
    items: Array<{ label: string; link: string }>
  ): Array<{ label: string; link: string; icon?: ReactNode }> =>
    items.map((item, i) => (i === 0 ? { ...item, icon: firstLinkIcon } : item));

  const entityPageLink =
    isAdmin && redirectEntityPage == undefined ? adminListPath! : redirectEntityPage ?? "/my-projects";

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
      { label, link: entityPageLink },
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
    sites: withFirstIcon([
      {
        label: isAdmin ? linkLabel : entity?.projectName ?? "",
        link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}?tab=sites`
      },
      { label: entityTitle, link: entityPageLink },
      { label: t("Edit"), link: editLink }
    ]),
    nurseries: withFirstIcon([
      {
        label: isAdmin ? linkLabel : entity?.projectName ?? "",
        link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}?tab=nurseries`
      },
      { label: entityTitle, link: entityPageLink },
      { label: t("Edit"), link: editLink }
    ]),
    projectReports: reportBreadcrumb(progressReportsHref),
    siteReports: reportBreadcrumb(siteReportsHref, siteReportBreadcrumbLabel),
    nurseryReports: reportBreadcrumb(nurseryReportsHref, nurseryReportBreadcrumbLabel),
    financialReports: reportBreadcrumb(financialReportsHref),
    disturbanceReports: reportBreadcrumb(additionalReportsHref),
    srpReports: reportBreadcrumb(additionalReportsHref)
  };
}
