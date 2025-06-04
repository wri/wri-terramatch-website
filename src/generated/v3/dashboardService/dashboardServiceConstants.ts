import { StoreResourceMap } from "@/store/apiSlice";
import { TotalSectionHeaderDto, DelayedJobDto, TreeRestorationGoalDto } from "./dashboardServiceSchemas";

export const DASHBOARD_SERVICE_RESOURCES = ["totalSectionHeaders", "delayedJobs", "treeRestorationGoals"] as const;

export type DashboardServiceApiResources = {
  totalSectionHeaders: StoreResourceMap<TotalSectionHeaderDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
  treeRestorationGoals: StoreResourceMap<TreeRestorationGoalDto>;
};
