import { AuditStatusEntityType, v3EntityToAuditLogEntity } from "@/connections/AuditStatus";

export const getRequestPathParam = (entityType: AuditStatusEntityType): string => {
  const legacyType = v3EntityToAuditLogEntity(entityType);

  if (legacyType === "Polygon") {
    return "site-polygon";
  } else if (legacyType === "Nursery_Report") {
    return "nursery-reports";
  } else if (legacyType === "Site_Report") {
    return "site-reports";
  } else if (legacyType === "Project_Report") {
    return "project-reports";
  } else if (legacyType === "Disturbance_Report") {
    return "disturbance-reports";
  } else if (legacyType === "Srp_Report") {
    return "srp-reports";
  } else if (legacyType === "Financial_Report") {
    return "financial-reports";
  }
  return legacyType.toLowerCase();
};
