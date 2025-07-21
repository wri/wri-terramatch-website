import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook } from "@/connections/util/connectionShortcuts";
import {
  dashboardEntityIndex,
  DashboardEntityIndexQueryParams
} from "@/generated/v3/dashboardService/dashboardServiceComponents";
import { DashboardProjectsLightDto } from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import ApiSlice from "@/store/apiSlice";

const dashboardProjectsConnection = v3Resource("dashboardProjects", dashboardEntityIndex)
  .index<DashboardProjectsLightDto>(() => ({
    pathParams: { entity: "dashboardProjects" }
  }))
  .filter<DashboardEntityIndexQueryParams>()
  .refetch(() => ApiSlice.pruneIndex("dashboardProjects", ""))
  .buildConnection();

export const useDashboardProjects = connectionHook(dashboardProjectsConnection);
