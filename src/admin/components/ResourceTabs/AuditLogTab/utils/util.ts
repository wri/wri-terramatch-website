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
  }
  return entityType.toLocaleLowerCase();
};
