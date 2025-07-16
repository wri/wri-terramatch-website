import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook } from "@/connections/util/connectionShortcuts";
import {
  dashboardEntityIndex,
  DashboardEntityIndexQueryParams,
  DashboardEntityIndexResponse
} from "@/generated/v3/dashboardService/dashboardServiceComponents";
import ApiSlice from "@/store/apiSlice";
import { Filter } from "@/types/connection";

type ExtendedDashboardQueryParams = DashboardEntityIndexQueryParams & {
  ["page[size]"]?: number;
  ["page[number]"]?: number;
};

const dashboardProjectsConnection = v3Resource("dashboardProjects", dashboardEntityIndex)
  .index<DashboardEntityIndexResponse>(() => ({
    pathParams: { entity: "dashboardProjects" }
  }))
  .filter<Filter<ExtendedDashboardQueryParams>>()
  .refetch(() => ApiSlice.pruneIndex("dashboardProjects", ""))
  .buildConnection();

export const useDashboardProjects = connectionHook(dashboardProjectsConnection);
