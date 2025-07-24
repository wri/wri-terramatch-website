import { IdProp, v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook } from "@/connections/util/connectionShortcuts";
import {
  dashboardEntityGet,
  dashboardEntityIndex,
  DashboardEntityIndexQueryParams
} from "@/generated/v3/dashboardService/dashboardServiceComponents";
import {
  DashboardProjectsFullDto,
  DashboardProjectsLightDto
} from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import ApiSlice from "@/store/apiSlice";

const dashboardProjectsConnection = v3Resource("dashboardProjects", dashboardEntityIndex)
  .index<DashboardProjectsLightDto>(() => ({
    pathParams: { entity: "dashboardProjects" }
  }))
  .filter<DashboardEntityIndexQueryParams>()
  .refetch(() => ApiSlice.pruneIndex("dashboardProjects", ""))
  .buildConnection();

const createDashboardProjectGetConnection = <D extends DashboardProjectsFullDto | DashboardProjectsLightDto>(
  requireFullEntity: boolean = true
) => {
  const pathParamsFactory = ({ id }: IdProp) =>
    id == null ? undefined : { pathParams: { entity: "dashboardProjects" as const, uuid: id } };
  const factory = requireFullEntity
    ? v3Resource("dashboardProjects", dashboardEntityGet).singleFullResource<D>(pathParamsFactory)
    : v3Resource("dashboardProjects", dashboardEntityGet).singleResource<D>(pathParamsFactory);
  return factory
    .refetch(({ id }) => {
      if (id != null) ApiSlice.pruneCache("dashboardProjects", [id]);
    })
    .buildConnection();
};

const dashboardProjectConnection = createDashboardProjectGetConnection<DashboardProjectsFullDto>();

export const useDashboardProjects = connectionHook(dashboardProjectsConnection);
export const useDashboardProject = connectionHook(dashboardProjectConnection);
