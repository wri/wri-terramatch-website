import { StoreResourceMap } from "@/store/apiSlice";
import {
  TotalSectionHeaderDto,
  DelayedJobDto,
  TreeRestorationGoalDto,
  TotalJobsCreatedDto
} from "./dashboardServiceSchemas";

export const DASHBOARD_SERVICE_RESOURCES = [
  "totalSectionHeaders",
  "delayedJobs",
  "treeRestorationGoals",
  "totalJobsCreated"
] as const;

export type DashboardServiceApiResources = {
  totalSectionHeaders: StoreResourceMap<TotalSectionHeaderDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
  treeRestorationGoals: StoreResourceMap<TreeRestorationGoalDto>;
  totalJobsCreated: StoreResourceMap<TotalJobsCreatedDto>;
};
