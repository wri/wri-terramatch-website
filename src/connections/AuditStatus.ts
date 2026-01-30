import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader, creationHook } from "@/connections/util/connectionShortcuts";
import {
  createAuditStatus,
  CreateAuditStatusPathParams,
  getAuditStatuses,
  GetAuditStatusesPathParams
} from "@/generated/v3/entityService/entityServiceComponents";
import { AuditStatusDto } from "@/generated/v3/entityService/entityServiceSchemas";
import ApiSlice from "@/store/apiSlice";

export type AuditStatusEntityType = GetAuditStatusesPathParams["entity"];

const auditStatusIndexConnection = v3Resource("auditStatuses", getAuditStatuses)
  .index<AuditStatusDto, GetAuditStatusesPathParams>(({ entity, uuid }) => ({
    pathParams: { entity, uuid }
  }))
  .refetch(() => ApiSlice.pruneIndex("auditStatuses", ""))
  .buildConnection();

export const useAuditStatuses = connectionHook(auditStatusIndexConnection);
export const loadAuditStatuses = connectionLoader(auditStatusIndexConnection);

const auditStatusCreateConnection = v3Resource("auditStatuses", createAuditStatus)
  .create<AuditStatusDto, CreateAuditStatusPathParams>(({ entity, uuid }) => ({
    pathParams: { entity, uuid }
  }))
  .buildConnection();

export const useCreateAuditStatus = creationHook(auditStatusCreateConnection);

export const formatAuditStatusEntityForDisplay = (entityType: AuditStatusEntityType): string => {
  if (entityType === "sitePolygons") {
    return "Polygon";
  }

  const words = entityType
    .replace(/([A-Z])/g, " $1")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .filter(word => word.length > 0);

  return words.join(" ");
};

export const v3EntityToAuditLogEntity = (entityType: AuditStatusEntityType): string => {
  const mapping: Record<AuditStatusEntityType, string> = {
    projects: "Project",
    sites: "Site",
    sitePolygons: "Polygon",
    nurseries: "Nursery",
    projectReports: "Project_Report",
    siteReports: "Site_Report",
    nurseryReports: "Nursery_Report",
    disturbanceReports: "Disturbance_Report",
    srpReports: "Srp_Report",
    financialReports: "Financial_Report"
  };

  return mapping[entityType] ?? "Project";
};
