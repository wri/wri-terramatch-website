import { camelCase, kebabCase } from "lodash";
import pluralize from "pluralize";

import { BaseModelNames, Entity, EntityName, ReportsModelNames, SingularEntityName } from "@/types/common";

export const pluralEntityName = (name: EntityName | SingularEntityName): EntityName =>
  pluralize.plural(name) as EntityName;
export const singularEntityName = (name: EntityName | SingularEntityName): SingularEntityName =>
  pluralize.singular(name) as SingularEntityName;

export const v3Entity = (entity?: Entity) => (entity == null ? undefined : v3EntityName(entity.entityName));
export const v3EntityName = (name: EntityName | SingularEntityName) => camelCase(pluralEntityName(name)) as EntityName;
export const getEntityEditPathSegment = (name: EntityName | SingularEntityName | string) =>
  kebabCase(v3EntityName(name as EntityName | SingularEntityName));
export const isProjectPitchesEntityName = (name?: string | null): boolean => {
  if (name == null || name === "") return false;
  const normalizedName = v3EntityName(name as EntityName | SingularEntityName) as string;
  return normalizedName === "projectPitches";
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
  `${entityName.includes("report") ? "/reports" : ""}/${singularEntityName(entityName)}/${uuid}${
    tab ? `?tab=${tab}` : ""
  }`;

export const getEntityEditPageLink = (entityName: EntityName | SingularEntityName | string, uuid: string) =>
  `/entity/${getEntityEditPathSegment(entityName)}/edit/${uuid}?mode=edit&formStepId=summary`;

export const isEntityReport = (entityName: EntityName) => {
  return entityName.includes("report");
};

/**
 * Get entity status with respect to update request status.
 * A change request only overrides the entity status once the entity is approved or information-required.
 */
export const getEntityCombinedStatus = (entity: {
  status?: string | null;
  update_request_status?: string | null;
  updateRequestStatus?: string | null;
}): string => {
  const updateRequestStatus = activeUpdateRequestStatus(
    entity.status,
    entity.update_request_status ?? entity.updateRequestStatus
  );
  return updateRequestStatus ?? entity.status ?? "";
};

export const getCurrentPathEntity = () => {
  const currentRoute = window.location.href + window.location.hash;
  if (currentRoute?.includes("nursery")) return "nursery";
  if (currentRoute?.includes("site")) return "site";
  if (currentRoute?.includes("project")) return "project";
  return "";
};

export const canEntityHaveChangeRequest = (status?: string | null): boolean =>
  status === "approved" || status === "information-required";

export const activeUpdateRequestStatus = (
  status?: string | null,
  updateRequestStatus?: string | null
): string | null => {
  if (!canEntityHaveChangeRequest(status)) return null;
  if (updateRequestStatus == null || updateRequestStatus === "" || updateRequestStatus === "no-update") return null;
  return updateRequestStatus;
};

export const isEntityAwaitingApproval = (status?: string | null, updateRequestStatus?: string | null): boolean =>
  status === "pending-approval" || activeUpdateRequestStatus(status, updateRequestStatus) === "pending-approval";

const ENTITY_DRAFT_STATUSES = new Set(["draft", "draft", "due"]);

export const isEntityDraftInProgress = (status: string | null | undefined, isSetupComplete: boolean) =>
  status != null && ENTITY_DRAFT_STATUSES.has(status) && !isSetupComplete;

export const getEntitySetupButtonLabel = (
  translate: (message: string) => string,
  status: string | null | undefined,
  isSetupComplete: boolean
) => (isEntityDraftInProgress(status, isSetupComplete) ? translate("Continue") : translate("Edit"));
