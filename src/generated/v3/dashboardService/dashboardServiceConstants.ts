import { StoreResourceMap } from "@/store/apiSlice";
import { TotalSectionHeaderDto, DelayedJobDto } from "./dashboardServiceSchemas";

export const DASHBOARD_SERVICE_RESOURCES = ["totalSectionHeaders", "delayedJobs"] as const;

export type DashboardServiceApiResources = {
  totalSectionHeaders: StoreResourceMap<TotalSectionHeaderDto>;
  delayedJobs: StoreResourceMap<DelayedJobDto>;
};
