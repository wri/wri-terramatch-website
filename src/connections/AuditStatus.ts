import { AuditLogEntity } from "@/admin/components/ResourceTabs/AuditLogTab/constants/types";
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

const auditStatusIndexConnection = v3Resource("auditStatuses", getAuditStatuses)
  .index<AuditStatusDto, GetAuditStatusesPathParams>(({ entity, uuid }) => ({
    pathParams: { entity, uuid }
  }))
  .refetch(() => ApiSlice.pruneIndex("auditStatuses", ""))
  .buildConnection();

export const useAuditStatuses = connectionHook(auditStatusIndexConnection);
export const loadAuditStatuses = connectionLoader(auditStatusIndexConnection);

export const getV3AuditStatusEntity = (entityType: AuditLogEntity): GetAuditStatusesPathParams["entity"] => {
  const mapping: Record<string, GetAuditStatusesPathParams["entity"]> = {
    Polygon: "sitePolygons",
    Project_Report: "projectReports",
    Site_Report: "siteReports",
    Nursery_Report: "nurseryReports",
    Disturbance_Report: "disturbanceReports",
    Srp_Report: "srpReports",
    Financial_Report: "financialReports",
    Project: "projects",
    Site: "sites",
    Nursery: "nurseries"
  };

  const mapped = mapping[entityType];
  if (mapped == null) {
    throw new Error(`Unsupported audit log entity type: ${entityType}. Cannot map to V3 entity.`);
  }
  return mapped;
};

const auditStatusCreateConnection = v3Resource("auditStatuses", createAuditStatus)
  .create<AuditStatusDto, CreateAuditStatusPathParams>(({ entity, uuid }) => ({
    pathParams: { entity, uuid }
  }))
  .buildConnection();

export const useCreateAuditStatus = creationHook(auditStatusCreateConnection);
