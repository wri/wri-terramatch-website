import { EnabledProp, FilterProp, IdProp, SideloadsProp, v3Endpoint } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import {
  entityDelete,
  entityGet,
  EntityGetPathParams,
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
import ApiSlice from "@/store/apiSlice";
import { EntityName } from "@/types/common";
import { PaginatedConnectionProps } from "@/types/connection";

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
    ? v3Endpoint(entity, entityGet).singleFullResource<D>(pathParamsFactory)
    : v3Endpoint(entity, entityGet).singleResource<D>(pathParamsFactory);
  return factory
    .isDeleted()
    .refetch(({ id }) => {
      if (id != null) ApiSlice.pruneCache(entity, [id]);
    })
    .update(entityUpdate)
    .buildConnection();
};

const createEntityIndexConnection = <T extends EntityLightDto>(entity: SupportedEntity) =>
  v3Endpoint(entity, entityIndex)
    .index<T>(() => ({ pathParams: { entity } } as EntityIndexVariables))
    .pagination()
    .filter<EntityIndexFilter>()
    .sideloads()
    .enabledProp()
    .refetch(() => ApiSlice.pruneIndex(entity, ""))
    .buildConnection();

const createEntityDeleter = (entity: SupportedEntity) =>
  deleterAsync(entity, entityDelete, uuid => specificEntityParams(entity, uuid));

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
export const deleteProject = createEntityDeleter("projects");

const indexProjectConnection = createEntityIndexConnection<ProjectLightDto>("projects");
export const loadProjectIndex = connectionLoader(indexProjectConnection);
export const useProjectIndex = connectionHook(indexProjectConnection);

// Sites
const fullSiteConnection = createEntityGetConnection<SiteFullDto, EntityUpdateData>("sites");
export const loadFullSite = connectionLoader(fullSiteConnection);
export const useFullSite = connectionHook(fullSiteConnection);
export const deleteSite = createEntityDeleter("sites");
export const indexSiteConnection = createEntityIndexConnection<SiteLightDto>("sites");
export const loadSiteIndex = connectionLoader(indexSiteConnection);
export const useSiteIndex = connectionHook(indexSiteConnection);

// Nurseries
const fullNurseryConnection = createEntityGetConnection<NurseryFullDto, EntityUpdateData>("nurseries");
export const loadFullNursery = connectionLoader(fullNurseryConnection);
export const useFullNursery = connectionHook(fullNurseryConnection);
export const deleteNursery = createEntityDeleter("nurseries");
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
export const deleteProjectReport = createEntityDeleter("projectReports");

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
const siteReportListConnection = v3Endpoint("siteReports").list<SiteReportLightDto>().buildConnection();
/**
 * Delivers the cached light DTOs for site reports corresponding to the UUIDs in the props. Does
 * not attempt to load them from the server.
 */
export const useLightSiteReportList = connectionHook(siteReportListConnection);
export const loadLightSiteReportList = connectionLoader(siteReportListConnection);
export const deleteSiteReport = createEntityDeleter("siteReports");

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
const nurseryReportListConnection = v3Endpoint("nurseryReports").list<NurseryReportLightDto>().buildConnection();
/**
 * Delivers the cached light DTOs for nursery reports corresponding to the UUIDs in the props. Does
 * not attempt to load them from the server.
 */
export const useLightNurseryReportList = connectionHook(nurseryReportListConnection);
export const loadLightNurseryReportList = connectionLoader(nurseryReportListConnection);
export const deleteNurseryReport = createEntityDeleter("nurseryReports");

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
