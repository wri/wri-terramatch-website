import {
  ApiConnectionFactory,
  EnabledProp,
  FilterProp,
  IdProp,
  SideloadsProp
} from "@/connections/util/apiConnectionFactory";
import {
  entityDelete,
  entityGet,
  EntityGetPathParams,
  EntityGetVariables,
  entityIndex,
  EntityIndexQueryParams,
  EntityIndexVariables,
  entityUpdate
} from "@/generated/v3/entityService/entityServiceComponents";
import { SupportedEntities } from "@/generated/v3/entityService/entityServiceConstants";
import {
  NurseryFullDto,
  NurseryLightDto,
  NurseryReportFullDto,
  NurseryReportLightDto,
  NurseryReportUpdateData,
  NurseryUpdateData,
  ProjectFullDto,
  ProjectLightDto,
  ProjectReportFullDto,
  ProjectReportLightDto,
  ProjectReportUpdateData,
  ProjectUpdateData,
  SiteFullDto,
  SiteLightDto,
  SiteReportFullDto,
  SiteReportLightDto,
  SiteReportUpdateData,
  SiteUpdateData
} from "@/generated/v3/entityService/entityServiceSchemas";
import {
  entityDeleteFetchFailed,
  entityGetFetchFailed,
  entityIndexFetchFailed,
  entityIndexIndexMeta,
  entityUpdateFetchFailed,
  entityUpdateIsFetching
} from "@/generated/v3/entityService/entityServiceSelectors";
import ApiSlice from "@/store/apiSlice";
import { EntityName } from "@/types/common";
import { PaginatedConnectionProps } from "@/types/connection";
import { connectedResourceDeleter } from "@/utils/connectedResourceDeleter";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";

export type EntityFullDto =
  | ProjectFullDto
  | SiteFullDto
  | NurseryFullDto
  | ProjectReportFullDto
  | NurseryReportFullDto
  | SiteReportFullDto;
export type EntityLightDto =
  | ProjectLightDto
  | SiteLightDto
  | NurseryLightDto
  | ProjectReportLightDto
  | NurseryReportLightDto
  | SiteReportLightDto;
export type EntityDtoType = EntityFullDto | EntityLightDto;

export type EntityUpdateData =
  | ProjectUpdateData
  | SiteUpdateData
  | NurseryUpdateData
  | ProjectReportUpdateData
  | SiteReportUpdateData
  | NurseryReportUpdateData;

type EntityIndexFilter = Omit<
  EntityIndexQueryParams,
  "page[size]" | "page[number]" | "sort[field]" | "sort[direction]" | "sideloads"
>;

export type EntityIndexConnectionProps = PaginatedConnectionProps &
  FilterProp<EntityIndexFilter> &
  EnabledProp &
  SideloadsProp<EntityIndexQueryParams["sideloads"]>;

export type SupportedEntity = EntityGetPathParams["entity"];

const specificEntityParams = (entity: SupportedEntity, uuid?: string) => ({ pathParams: { entity, uuid: uuid ?? "" } });

const createEntityGetConnection = <D extends EntityDtoType, U extends EntityUpdateData>(
  entity: U["type"],
  requireFullEntity: boolean = true
) => {
  const pathParamsFactory = ({ id }: IdProp) => (id == null ? undefined : { pathParams: { entity, uuid: id } });
  const factory = requireFullEntity
    ? ApiConnectionFactory.singleFullResource<D, EntityGetVariables>(entity, entityGet, pathParamsFactory)
    : ApiConnectionFactory.singleResource<D, EntityGetVariables>(entity, entityGet, pathParamsFactory);
  return factory
    .fetchFailure(entityGetFetchFailed)
    .isDeleted()
    .refetch(({ id }) => {
      if (id != null) ApiSlice.pruneCache(entity, [id]);
    })
    .update<U>(entityUpdate, entityUpdateIsFetching, entityUpdateFetchFailed)
    .buildConnection();
};

const createEntityIndexConnection = <T extends EntityLightDto>(entity: SupportedEntity) =>
  ApiConnectionFactory.index<T, EntityIndexVariables>(
    entity,
    entityIndex,
    entityIndexIndexMeta,
    () => ({ pathParams: { entity } } as EntityIndexVariables)
  )
    .pagination()
    .filters<EntityIndexFilter>()
    .sideloads()
    .enabledFlag()
    .refetch(() => ApiSlice.pruneIndex(entity, ""))
    .fetchFailure(entityIndexFetchFailed)
    .buildConnection();

export const entityIsSupported = (entity: EntityName): entity is SupportedEntity =>
  SupportedEntities.ENTITY_TYPES.includes(entity as SupportedEntity);

export const pruneEntityCache = (entity: EntityName, uuid: string) => {
  if (entityIsSupported(entity)) {
    ApiSlice.pruneCache(entity, [uuid]);
  }
};

// The "light" version of entity connections will return the full DTO if it's what's cached in the store. However,
// the type of the entity will use the Light DTO. For the "full" version of the entity connection, if the version that's
// currently cached is the "light" version, it will issue a request to the server to get the full version.

// Projects
const fullProjectConnection = createEntityGetConnection<ProjectFullDto, ProjectUpdateData>("projects");
export const loadFullProject = connectionLoader(fullProjectConnection);
export const useFullProject = connectionHook(fullProjectConnection);
export const deleteProject = connectedResourceDeleter(
  "projects",
  uuid => entityDeleteFetchFailed(specificEntityParams("projects", uuid)),
  uuid => (uuid == null ? null : entityDelete(specificEntityParams("projects", uuid)))
);

const indexProjectConnection = createEntityIndexConnection("projects");
export const loadProjectIndex = connectionLoader(indexProjectConnection);
export const useProjectIndex = connectionHook(indexProjectConnection);

// Sites
const fullSiteConnection = createEntityGetConnection<SiteFullDto, EntityUpdateData>("sites");
export const loadFullSite = connectionLoader(fullSiteConnection);
export const useFullSite = connectionHook(fullSiteConnection);
export const deleteSite = connectedResourceDeleter(
  "sites",
  uuid => entityDeleteFetchFailed(specificEntityParams("sites", uuid)),
  uuid => (uuid == null ? null : entityDelete(specificEntityParams("sites", uuid)))
);
export const indexSiteConnection = createEntityIndexConnection<SiteLightDto>("sites");
export const loadSiteIndex = connectionLoader(indexSiteConnection);
export const useSiteIndex = connectionHook(indexSiteConnection);

// Nurseries
const fullNurseryConnection = createEntityGetConnection<NurseryFullDto, EntityUpdateData>("nurseries");
export const loadFullNursery = connectionLoader(fullNurseryConnection);
export const useFullNursery = connectionHook(fullNurseryConnection);
export const deleteNursery = connectedResourceDeleter(
  "nurseries",
  uuid => entityDeleteFetchFailed(specificEntityParams("nurseries", uuid)),
  uuid => (uuid == null ? null : entityDelete(specificEntityParams("nurseries", uuid)))
);
export const indexNurseryConnection = createEntityIndexConnection<NurseryLightDto>("nurseries");
export const loadNurseryIndex = connectionLoader(indexNurseryConnection);
export const useNurseryIndex = connectionHook(indexNurseryConnection);

// Project Reports
const indexProjectReportConnection = createEntityIndexConnection<ProjectReportLightDto>("projectReports");
export const loadProjectReportIndex = connectionLoader(indexProjectReportConnection);
export const useProjectReportIndex = connectionHook(indexProjectReportConnection);
const fullProjectReportConnection = createEntityGetConnection<ProjectReportFullDto, ProjectReportUpdateData>(
  "projectReports"
);
const lightProjectReportConnection = createEntityGetConnection<ProjectReportLightDto, ProjectReportUpdateData>(
  "projectReports",
  false
);
export const loadFullProjectReport = connectionLoader(fullProjectReportConnection);
export const loadLightProjectReport = connectionLoader(lightProjectReportConnection);
export const useFullProjectReport = connectionHook(fullProjectReportConnection);
export const useLightProjectReport = connectionHook(lightProjectReportConnection);
export const deleteProjectReport = connectedResourceDeleter(
  "projectReports",
  uuid => entityDeleteFetchFailed(specificEntityParams("projectReports", uuid)),
  uuid => (uuid == null ? null : entityDelete(specificEntityParams("projectReports", uuid)))
);

// Site Reports
export const indexSiteReportConnection = createEntityIndexConnection<SiteReportLightDto>("siteReports");
export const loadSiteReportIndex = connectionLoader(indexSiteReportConnection);
export const useSiteReportIndex = connectionHook(indexSiteReportConnection);
const fullSiteReportConnection = createEntityGetConnection<SiteReportFullDto, SiteReportUpdateData>("siteReports");
const lightSiteReportConnection = createEntityGetConnection<SiteReportLightDto, SiteReportUpdateData>(
  "siteReports",
  false
);
export const loadFullSiteReport = connectionLoader(fullSiteReportConnection);
export const useFullSiteReport = connectionHook(fullSiteReportConnection);
export const useLightSiteReport = connectionHook(lightSiteReportConnection);
const siteReportListConnection = ApiConnectionFactory.list<SiteReportLightDto>("siteReports").buildConnection();
/**
 * Delivers the cached light DTOs for site reports corresponding to the UUIDs in the props. Does
 * not attempt to load them from the server.
 */
export const useLightSiteReportList = connectionHook(siteReportListConnection);
export const loadLightSiteReportList = connectionLoader(siteReportListConnection);
export const deleteSiteReport = connectedResourceDeleter(
  "siteReports",
  uuid => entityDeleteFetchFailed(specificEntityParams("siteReports", uuid)),
  uuid => (uuid == null ? null : entityDelete(specificEntityParams("siteReports", uuid)))
);

// Nursery Reports
export const indexNurseryReportConnection = createEntityIndexConnection<NurseryReportLightDto>("nurseryReports");
export const loadNurseryReportIndex = connectionLoader(indexNurseryReportConnection);
const fullNurseryReportConnection = createEntityGetConnection<NurseryReportFullDto, NurseryReportUpdateData>(
  "nurseryReports"
);
const lightNurseryReportConnection = createEntityGetConnection<NurseryReportLightDto, NurseryReportUpdateData>(
  "nurseryReports",
  false
);
export const loadFullNurseryReport = connectionLoader(fullNurseryReportConnection);
export const useFullNurseryReport = connectionHook(fullNurseryReportConnection);
export const useLightNurseryReport = connectionHook(lightNurseryReportConnection);
const nurseryReportListConnection =
  ApiConnectionFactory.list<NurseryReportLightDto>("nurseryReports").buildConnection();
/**
 * Delivers the cached light DTOs for nursery reports corresponding to the UUIDs in the props. Does
 * not attempt to load them from the server.
 */
export const useLightNurseryReportList = connectionHook(nurseryReportListConnection);
export const loadLightNurseryReportList = connectionLoader(nurseryReportListConnection);
export const deleteNurseryReport = connectedResourceDeleter(
  "nurseryReports",
  uuid => entityDeleteFetchFailed(specificEntityParams("nurseryReports", uuid)),
  uuid => (uuid == null ? null : entityDelete(specificEntityParams("nurseryReports", uuid)))
);

/**
 * Get the full entity connection in a component that is shared amongst entity types. It's technically
 * against the rules of hooks to use control logic to select hooks, but each of these hooks has the
 * same number of dependencies internally (they're all different versions of the same hook), so we're
 * skirting the rules in a safe way here. That being said, please don't use this if you're expecting
 * the entity value to change within the lifecycle of a mounted component.
 */
export const useFullEntity = (entity: SupportedEntity, id: string) => {
  switch (entity) {
    case "projects":
      return useFullProject({ id });
    case "sites":
      return useFullSite({ id });
    case "nurseries":
      return useFullNursery({ id });
    case "projectReports":
      return useFullProjectReport({ id });
    case "siteReports":
      return useFullSiteReport({ id });
    case "nurseryReports":
      return useFullNurseryReport({ id });
    default:
      throw new Error(`Unsupported entity type [${entity}]`);
  }
};
