import { StoreResourceMap } from "@/store/apiSlice";
import {
  TotalSectionHeaderDto,
  DelayedJobDto,
  TreeRestorationGoalDto,
  TotalJobsCreatedDto,
  HectareRestorationDto
} from "./dashboardServiceSchemas";

export const DASHBOARD_SERVICE_RESOURCES = [
  "totalSectionHeaders",
  "delayedJobs",
  "treeRestorationGoals",
  "totalJobsCreated",
  "hectareRestoration"
] as const;

export type DashboardServiceApiResources = {
  totalSectionHeaders: StoreResourceMap<TotalSectionHeaderDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
  treeRestorationGoals: StoreResourceMap<TreeRestorationGoalDto>;
  totalJobsCreated: StoreResourceMap<TotalJobsCreatedDto>;
  hectareRestoration: StoreResourceMap<HectareRestorationDto>;
};
