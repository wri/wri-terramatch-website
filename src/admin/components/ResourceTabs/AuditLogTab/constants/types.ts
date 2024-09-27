/* eslint-disable */
export enum AuditLogEntityEnum {
  Project = "Project",
  Site = "Site",
  Polygon = "Polygon",
  Nursery = "Nursery",
  Nursery_Report = "Nursery_Report",
  Site_Report = "Site_Report",
  Project_Report = "Project_Report"
}

export type AuditLogEntity = keyof typeof AuditLogEntityEnum;
