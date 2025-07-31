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
  DashboardImpactStoryFullDto,
  DashboardImpactStoryLightDto,
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

const dashboardImpactStoriesConnection = v3Resource("dashboardImpactStories", dashboardEntityIndex)
  .index<DashboardImpactStoryLightDto>(() => ({
    pathParams: { entity: "dashboardImpactStories" }
  }))
  .filter<DashboardEntityIndexQueryParams>()
  .refetch(() => ApiSlice.pruneIndex("dashboardImpactStories", ""))
  .buildConnection();

const dashboardImpactStoryConnection = v3Resource("dashboardImpactStories", dashboardEntityGet)
  .singleFullResource<DashboardImpactStoryFullDto>(({ id }: IdProp) =>
    id == null ? undefined : { pathParams: { entity: "dashboardImpactStories" as const, uuid: id } }
  )
  .refetch(({ id }) => {
    if (id != null) ApiSlice.pruneCache("dashboardImpactStories", [id]);
  })
  .buildConnection();

export const useDashboardProjects = connectionHook(dashboardProjectsConnection);
export const useDashboardProject = connectionHook(dashboardProjectConnection);
export const useDashboardSitePolygons = connectionHook(dashboardSitePolygonsConnection);
export const useDashboardImpactStories = connectionHook(dashboardImpactStoriesConnection);
export const useDashboardImpactStory = connectionHook(dashboardImpactStoryConnection);
