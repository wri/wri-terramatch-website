import { IdProp, v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook } from "@/connections/util/connectionShortcuts";
import {
  dashboardEntityGet,
  dashboardEntityIndex,
  DashboardEntityIndexQueryParams,
  getDashboardSitePolygons,
  GetDashboardSitePolygonsQueryParams
} from "@/generated/v3/dashboardService/dashboardServiceComponents";
import {
  DashboardProjectsFullDto,
  DashboardProjectsLightDto,
  DashboardSitePolygonsLightDto
} from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import ApiSlice from "@/store/apiSlice";

const dashboardProjectsConnection = v3Resource("dashboardProjects", dashboardEntityIndex)
  .index<DashboardProjectsLightDto>(() => ({
    pathParams: { entity: "dashboardProjects" }
  }))
  .filter<DashboardEntityIndexQueryParams>()
  .refetch(() => ApiSlice.pruneIndex("dashboardProjects", ""))
  .buildConnection();

const dashboardProjectConnection = v3Resource("dashboardProjects", dashboardEntityGet)
  .singleFullResource<DashboardProjectsFullDto>(({ id }: IdProp) =>
    id == null ? undefined : { pathParams: { entity: "dashboardProjects" as const, uuid: id } }
  )
  .refetch(({ id }) => {
    if (id != null) ApiSlice.pruneCache("dashboardProjects", [id]);
  })
  .buildConnection();

const dashboardSitePolygonsConnection = v3Resource("dashboardSitepolygons", getDashboardSitePolygons)
  .index<DashboardSitePolygonsLightDto>(() => ({
    queryParams: { polygonStatus: [], projectUuid: "" }
  }))
  .filter<GetDashboardSitePolygonsQueryParams>()
  .enabledProp()
  .refetch(() => ApiSlice.pruneIndex("dashboardSitepolygons", ""))
  .buildConnection();

export const useDashboardProjects = connectionHook(dashboardProjectsConnection);
export const useDashboardProject = connectionHook(dashboardProjectConnection);
export const useDashboardSitePolygons = connectionHook(dashboardSitePolygonsConnection);
