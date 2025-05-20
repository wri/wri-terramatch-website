import { StoreResourceMap } from "@/store/apiSlice";
import { TotalSectionHeaderDto } from "./dashboardServiceSchemas";

export const DASHBOARD_SERVICE_RESOURCES = ["totalSectionHeaders"] as const;

export type DashboardServiceApiResources = {
  totalSectionHeaders: StoreResourceMap<TotalSectionHeaderDto>;
};
