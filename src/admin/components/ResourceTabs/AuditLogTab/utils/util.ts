import { AuditLogEntity } from "../constants/types";

export const getRequestPathParam = (entityType: AuditLogEntity) => {
  if (entityType === "Polygon") {
    return "site-polygon";
  }
  return entityType.toLocaleLowerCase();
};
