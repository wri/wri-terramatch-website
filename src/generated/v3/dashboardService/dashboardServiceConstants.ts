import { StoreResourceMap } from "@/store/apiSlice";
import {
  TotalSectionHeaderDto,
  DelayedJobDto,
  TreeRestorationGoalDto,
  TotalJobsCreatedDto,
  HectareRestorationDto,
  DashboardProjectsLightDto,
  DashboardProjectsFullDto,
  DashboardSitePolygonsLightDto
} from "./dashboardServiceSchemas";

export const DASHBOARD_SERVICE_RESOURCES = [
  "totalSectionHeaders",
  "delayedJobs",
  "treeRestorationGoals",
  "totalJobsCreated",
  "hectareRestoration",
  "dashboardProjects",
  "dashboardSitepolygons"
] as const;

export type DashboardServiceApiResources = {
  totalSectionHeaders: StoreResourceMap<TotalSectionHeaderDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
  treeRestorationGoals: StoreResourceMap<TreeRestorationGoalDto>;
  totalJobsCreated: StoreResourceMap<TotalJobsCreatedDto>;
  hectareRestoration: StoreResourceMap<HectareRestorationDto>;
  dashboardProjects: StoreResourceMap<DashboardProjectsLightDto | DashboardProjectsFullDto>;
  dashboardSitepolygons: StoreResourceMap<DashboardSitePolygonsLightDto>;
};
