import { useT } from "@transifex/react";
import { startCase } from "lodash";
import { ReactNode } from "react";

import { getShortPeriodLabel } from "@/components/extensive/WizardForm/utils";
import { ProgressState } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission.type";
import { EntityName, SingularEntityName } from "@/types/common";

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
  taskTitle?: string;
};

export type EntityLinkHeaderMap = Record<string, Array<{ label: string; link: string; icon?: ReactNode }>>;

export const mapStatusToTagState = (status: string | null | undefined): TagSubmissionState | undefined => {
  switch (status) {
    case "draft":
      return "draft";
    case "due":
      return "due";
    case "started":
      return "draft";
    case "awaiting-approval":
      return "pending-approval";
    case "needs-more-information":
      return "information-required";
    case "requires-more-information":
      return "information-required";
    case "approved":
      return "approved";
    case "no-update":
      return "nothing-reported";
    default:
      return undefined;
  }
};

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
  const { isAdmin, model, uuid, redirectEntityPage, adminListPath, entity, firstLinkIcon, t, taskTitle = "" } = params;
  const linkLabel = t(startCase(model));

  const editLink = uuid ? `/entity/${singularEntityName(model as EntityName | SingularEntityName)}/edit/${uuid}` : "#";
  const entityTitle = mapEntityTitle(entity?.title ?? entity?.name ?? null, model, t);
  const projectTitle = mapEntityTitle(entity?.projectName ?? null, "project", t);
  const siteTitle = mapEntityTitle(entity?.siteName ?? null, "site", t);
  const nurseryTitle = mapEntityTitle(entity?.nurseryName ?? null, "nursery", t);

  const withFirstIcon = (
    items: Array<{ label: string; link: string }>
  ): Array<{ label: string; link: string; icon?: ReactNode }> =>
    items.map((item, i) => (i === 0 ? { ...item, icon: firstLinkIcon } : item));

  const entityPageLink =
    isAdmin && redirectEntityPage == undefined ? adminListPath! : redirectEntityPage ?? "/my-projects";

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
    projectReports: withFirstIcon([
      {
        label: "Projects",
        link: isAdmin ? adminListPath! : "/my-projects"
      },
      {
        label: projectTitle,
        link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}`
      },
      {
        label: "Reports",
        link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}?tab=reporting-tasks`
      },
      {
        label: getShortPeriodLabel(taskTitle),
        link: `/project/${entity?.projectUuid ?? ""}/reporting-task/${entity?.taskUuid ?? ""}`
      },
      { label: entityTitle, link: entityPageLink },
      { label: t("Edit"), link: editLink }
    ]),
    siteReports: withFirstIcon([
      {
        label: "Projects",
        link: isAdmin ? adminListPath! : "/my-projects"
      },
      {
        label: projectTitle,
        link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}`
      },
      {
        label: "Sites",
        link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}?tab=sites`
      },
      {
        label: siteTitle,
        link: isAdmin ? adminListPath! : `/site/${entity?.siteUuid ?? ""}`
      },
      {
        label: "Reports",
        link: isAdmin ? adminListPath! : `/site/${entity?.siteUuid ?? ""}?tab=completed-tasks`
      },
      { label: entityTitle + " - " + getShortPeriodLabel(taskTitle), link: entityPageLink },
      { label: t("Edit"), link: editLink }
    ]),
    nurseryReports: withFirstIcon([
      {
        label: "Projects",
        link: isAdmin ? adminListPath! : "/my-projects"
      },
      {
        label: projectTitle?.slice(0, 20) + "...",
        link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}`
      },
      {
        label: "Nurseries",
        link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}?tab=nurseries`
      },
      {
        label: nurseryTitle,
        link: isAdmin ? adminListPath! : `/nursery/${entity?.nurseryUuid ?? ""}`
      },
      {
        label: "Reports",
        link: isAdmin ? adminListPath! : `/nursery/${entity?.nurseryUuid ?? ""}?tab=completed-tasks`
      },
      { label: entityTitle + " - " + getShortPeriodLabel(taskTitle), link: entityPageLink },
      { label: t("Edit"), link: editLink }
    ]),
    financialReports: withFirstIcon([
      {
        label: isAdmin
          ? linkLabel
          : t("Organisation - {organisationName}", { organisationName: entity?.organisationName ?? "" }),
        link: isAdmin ? adminListPath! : `/organization/${entity?.organisationUuid ?? ""}?tab=financial_information`
      },
      {
        label: t("Financial Reports"),
        link: isAdmin ? adminListPath! : `/organization/${entity?.organisationUuid ?? ""}?tab=financial_information`
      },
      { label: entityTitle + " - " + getShortPeriodLabel(taskTitle ?? "", true), link: entityPageLink },
      { label: t("Edit"), link: editLink }
    ]),
    disturbanceReports: withFirstIcon([
      {
        label: t("Projects"),
        link: isAdmin ? adminListPath! : "/my-projects"
      },
      {
        label: projectTitle,
        link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}`
      },
      {
        label: t("Reports"),
        link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}?tab=reporting-tasks`
      },
      {
        label: t("Disturbance Reports"),
        link: isAdmin
          ? adminListPath!
          : `/project/${entity?.projectUuid ?? ""}?tab=reporting-tasks&subTab=disturbance-reports`
      },
      { label: entityTitle, link: entityPageLink },
      { label: t("Edit"), link: editLink }
    ]),
    srpReports: withFirstIcon([
      {
        label: "Projects",
        link: isAdmin ? adminListPath! : "/my-projects"
      },
      {
        label: projectTitle,
        link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}`
      },
      {
        label: "Reports",
        link: isAdmin ? adminListPath! : `/project/${entity?.projectUuid ?? ""}?tab=reporting-tasks`
      },
      {
        label: getShortPeriodLabel(taskTitle),
        link: `/project/${entity?.projectUuid ?? ""}/reporting-task/${entity?.taskUuid ?? ""}`
      },
      { label: entityTitle, link: entityPageLink },
      { label: t("Edit"), link: editLink }
    ])
  };
}
