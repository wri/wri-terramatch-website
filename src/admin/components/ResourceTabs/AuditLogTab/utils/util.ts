import { AuditLogEntity } from "../constants/types";

export const getRequestPathParam = (entityType: AuditLogEntity) => {
  if (entityType === "Polygon") {
    return "site-polygon";
  } else if (entityType === "Nursery_Report") {
    return "nursery-reports";
  } else if (entityType === "Site_Report") {
    return "site-reports";
  } else if (entityType === "Project_Report") {
    return "project-reports";
  } else if (entityType === "Disturbance_Report") {
    return "disturbance-reports";
  } else if (entityType === "Srp_Report") {
    return "srp-reports";
  } else if (entityType === "Financial_Report") {
    return "financial-reports";
  }
  return entityType.toLocaleLowerCase();
};
