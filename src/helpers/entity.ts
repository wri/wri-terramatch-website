import { camelCase } from "lodash";

import {
  BaseModelNames,
  Entity,
  EntityName,
  isSingularEntityName,
  ReportsModelNames,
  SingularEntityName
} from "@/types/common";

export const singularEntityNameToPlural = (singular: SingularEntityName): EntityName => {
  if (singular === "nursery") return "nurseries";
  else return `${singular}s` as EntityName;
};

export const pluralEntityNameToSingular = (plural: EntityName): SingularEntityName => {
  if (plural === "nurseries") return "nursery";
  if (plural === "project-pitches") return "project-pitch";
  else return plural.substring(0, plural.length - 1) as SingularEntityName;
};

export const v3Entity = (entity?: Entity) => {
  if (entity == null) return undefined;
  const name = isSingularEntityName(entity.entityName)
    ? singularEntityNameToPlural(entity.entityName)
    : entity.entityName;
  return camelCase(name);
};

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
  `${entityName.includes("report") ? "/reports" : ""}/${pluralEntityNameToSingular(entityName)}/${uuid}${
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
