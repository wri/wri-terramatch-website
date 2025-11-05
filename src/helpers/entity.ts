import { camelCase, kebabCase } from "lodash";
import pluralize from "pluralize";

import { BaseModelNames, Entity, EntityName, ReportsModelNames, SingularEntityName } from "@/types/common";

export const pluralEntityName = (name: EntityName | SingularEntityName): EntityName =>
  pluralize.plural(name) as EntityName;
export const singularEntityName = (name: EntityName | SingularEntityName): SingularEntityName =>
  pluralize.singular(name) as SingularEntityName;

export const v3Entity = (entity?: Entity) => (entity == null ? undefined : v3EntityName(entity.entityName));
export const v3EntityName = (name: EntityName | SingularEntityName) => camelCase(pluralEntityName(name)) as EntityName;

export const v2EntityName = (name: EntityName | SingularEntityName) => kebabCase(pluralEntityName(name)) as EntityName;

export const ReportModelNameToBaseModel = (reportModelName: ReportsModelNames, singular?: boolean) => {
  const mapping: any = {
    "project-report": singular ? "project" : "projects",
    "project-reports": singular ? "project" : "projects",

    "site-report": singular ? "site" : "sites",
    "site-reports": singular ? "site" : "sites",

    "nursery-report": singular ? "nursery" : "nurseries",
    "nursery-reports": singular ? "nursery" : "nurseries"
  };

  return mapping[reportModelName] as BaseModelNames;
};

export const getEntityDetailPageLink = (entityName: EntityName, uuid: string, tab?: string) =>
  `${entityName.includes("report") ? "/reports" : ""}/${singularEntityName(entityName)}/${uuid}${
    tab ? `?tab=${tab}` : ""
  }`;

export const isEntityReport = (entityName: EntityName) => {
  return entityName.includes("report");
};

/**
 * Get entity status with respect to update request status.
 * @param entity Entity full resource
 * @returns combinedStatus
 */
export const getEntityCombinedStatus = (entity: any): string => {
  return !!entity.update_request_status && entity.update_request_status !== "no-update"
    ? entity.update_request_status
    : entity.status;
};

export const getCurrentPathEntity = () => {
  const currentRoute = window.location.href + window.location.hash;
  if (currentRoute?.includes("nursery")) return "nursery";
  if (currentRoute?.includes("site")) return "site";
  if (currentRoute?.includes("project")) return "project";
  return "";
};
