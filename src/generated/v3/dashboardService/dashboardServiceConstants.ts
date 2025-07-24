import { StoreResourceMap } from "@/store/apiSlice";
import {
  TotalSectionHeaderDto,
  DelayedJobDto,
  TreeRestorationGoalDto,
  TotalJobsCreatedDto,
  DashboardProjectsLightDto,
  DashboardProjectsFullDto,
  HectareRestorationDto
} from "./dashboardServiceSchemas";

export const DASHBOARD_SERVICE_RESOURCES = [
  "totalSectionHeaders",
  "delayedJobs",
  "treeRestorationGoals",
  "totalJobsCreated",
  "dashboardProjects",
  "hectareRestoration"
] as const;

export type DashboardServiceApiResources = {
  totalSectionHeaders: StoreResourceMap<TotalSectionHeaderDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
  treeRestorationGoals: StoreResourceMap<TreeRestorationGoalDto>;
  totalJobsCreated: StoreResourceMap<TotalJobsCreatedDto>;
  dashboardProjects: StoreResourceMap<DashboardProjectsLightDto | DashboardProjectsFullDto>;
  hectareRestoration: StoreResourceMap<HectareRestorationDto>;
};
