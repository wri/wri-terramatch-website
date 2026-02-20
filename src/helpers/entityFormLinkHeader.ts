import { useT } from "@transifex/react";
import { startCase } from "lodash";
import { ReactNode } from "react";

import { toFramework } from "@/context/framework.provider";
import { useReportingWindow } from "@/hooks/useReportingWindow";
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
  dueAt?: string | null;
  frameworkKey?: string | null;
};

export type EntityLinkHeaderParams = {
  isAdmin: boolean;
  model: string;
  uuid?: string;
  redirectEntityPage: string;
  entity: EntityForLinkHeader | null | undefined;
  firstLinkIcon: ReactNode;
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
    case "approved":
      return "approved";
    case "no-update":
      return "nothing-reported";
    default:
      return undefined;
  }
};

export const mapEntityTitle = (title: string | null, model: string): string => {
  if (title == null || title === "") return startCase(singularEntityName(model as EntityName | SingularEntityName));
  return title;
};

export function entityLinkHeaderMap(params: EntityLinkHeaderParams): EntityLinkHeaderMap {
  const t = useT();
  const { isAdmin, model, uuid, redirectEntityPage, entity, firstLinkIcon } = params;

  const window = useReportingWindow(toFramework(entity?.frameworkKey), entity?.dueAt as string);
  const taskTitle = t("Reporting Task {window}", { window });
  const linkLabel = t(startCase(model));

  const adminListUrl = `/admin?formStepId=summary#/${singularEntityName(
    model as EntityName | SingularEntityName
  )}?filter=%7B%7D&order=ASC&page=1&perPage=10&sort=`;
  const editLink = uuid ? `/entity/${singularEntityName(model as EntityName | SingularEntityName)}/edit/${uuid}` : "#";
  const entityTitle = mapEntityTitle(entity?.title ?? entity?.name ?? null, model);

  const withFirstIcon = (
    items: Array<{ label: string; link: string }>
  ): Array<{ label: string; link: string; icon?: ReactNode }> =>
    items.map((item, i) => (i === 0 ? { ...item, icon: firstLinkIcon } : item));

  return {
    projects: withFirstIcon([
      {
        label: isAdmin ? linkLabel : t("My Projects"),
        link: isAdmin ? adminListUrl : "/my-projects"
      },
      { label: entityTitle, link: redirectEntityPage },
      { label: "Edit", link: editLink }
    ]),
    sites: withFirstIcon([
      {
        label: isAdmin ? linkLabel : t(entity?.projectName ?? ""),
        link: isAdmin ? adminListUrl : `/project/${entity?.projectUuid ?? ""}?tab=sites`
      },
      { label: entityTitle, link: redirectEntityPage },
      { label: "Edit", link: editLink }
    ]),
    nurseries: withFirstIcon([
      {
        label: isAdmin ? linkLabel : t(entity?.projectName ?? ""),
        link: isAdmin ? adminListUrl : `/project/${entity?.projectUuid ?? ""}?tab=nurseries`
      },
      { label: entityTitle, link: redirectEntityPage },
      { label: "Edit", link: editLink }
    ]),
    projectReports: withFirstIcon([
      {
        label: isAdmin ? linkLabel : taskTitle,
        link: isAdmin ? adminListUrl : `/project/${entity?.projectUuid ?? ""}/reporting-task/${entity?.taskUuid ?? ""}`
      },
      { label: entityTitle, link: redirectEntityPage },
      { label: "Edit", link: editLink }
    ]),
    siteReports: withFirstIcon([
      {
        label: isAdmin ? linkLabel : taskTitle,
        link: isAdmin ? adminListUrl : `/project/${entity?.projectUuid ?? ""}/reporting-task/${entity?.taskUuid ?? ""}`
      },
      { label: entityTitle, link: redirectEntityPage },
      { label: "Edit", link: editLink }
    ]),
    nurseryReports: withFirstIcon([
      {
        label: isAdmin ? linkLabel : taskTitle,
        link: isAdmin ? adminListUrl : `/project/${entity?.projectUuid ?? ""}/reporting-task/${entity?.taskUuid ?? ""}`
      },
      { label: entityTitle, link: redirectEntityPage },
      { label: "Edit", link: editLink }
    ]),
    financialReports: withFirstIcon([
      {
        label: isAdmin ? linkLabel : entity?.organisationName ?? "",
        link: isAdmin ? adminListUrl : `/organization/${entity?.organisationUuid ?? ""}?tab=financial_information`
      },
      { label: entityTitle, link: redirectEntityPage },
      { label: "Edit", link: editLink }
    ]),
    disturbanceReports: withFirstIcon([
      {
        label: isAdmin ? linkLabel : entity?.projectName ?? "",
        link: isAdmin
          ? adminListUrl
          : `/project/${entity?.projectUuid ?? ""}?tab=reporting-tasks&subTab=disturbance-reports`
      },
      { label: entityTitle, link: redirectEntityPage },
      { label: "Edit", link: editLink }
    ]),
    srpReports: withFirstIcon([
      {
        label: isAdmin ? linkLabel : taskTitle,
        link: isAdmin ? adminListUrl : `/project/${entity?.projectUuid ?? ""}/reporting-task/${entity?.taskUuid ?? ""}`
      },
      { label: entityTitle, link: redirectEntityPage },
      { label: "Edit", link: editLink }
    ])
  };
}
