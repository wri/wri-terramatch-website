import { EnabledProp, FilterProp, IdProp, SideloadsProp, v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader, creationHook } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import {
  entityCreate,
  EntityCreateError,
  EntityCreateResponse,
  EntityCreateVariables,
  entityDelete,
  entityGet,
  EntityGetPathParams,
  entityIndex,
  EntityIndexQueryParams,
  EntityIndexVariables,
  entityUpdate,
  EntityUpdateVariables
} from "@/generated/v3/entityService/entityServiceComponents";
import { SupportedEntities } from "@/generated/v3/entityService/entityServiceConstants";
import {
  DisturbanceReportCreateData,
  DisturbanceReportFullDto,
  DisturbanceReportLightDto,
  DisturbanceReportUpdateData,
  FinancialReportFullDto,
  FinancialReportLightDto,
  FinancialReportUpdateData,
  NurseryCreateData,
  NurseryFullDto,
  NurseryLightDto,
  NurseryReportFullDto,
  NurseryReportLightDto,
  NurseryReportUpdateData,
  NurseryUpdateData,
  ProjectCreateData,
  ProjectFullDto,
  ProjectLightDto,
  ProjectReportFullDto,
  ProjectReportLightDto,
  ProjectReportUpdateData,
  ProjectUpdateData,
  SiteCreateData,
  SiteFullDto,
  SiteLightDto,
  SiteReportFullDto,
  SiteReportLightDto,
  SiteReportUpdateData,
  SiteUpdateData,
  SrpReportFullDto,
  SrpReportLightDto,
  SrpReportUpdateData
} from "@/generated/v3/entityService/entityServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import { EntityName } from "@/types/common";
import { Filter, PaginatedConnectionProps } from "@/types/connection";

export type EntityFullDto =
  | ProjectFullDto
  | SiteFullDto
  | NurseryFullDto
  | ProjectReportFullDto
  | NurseryReportFullDto
  | SiteReportFullDto
  | FinancialReportFullDto
  | DisturbanceReportFullDto
  | SrpReportFullDto;
export type EntityLightDto =
  | ProjectLightDto
  | SiteLightDto
  | NurseryLightDto
  | ProjectReportLightDto
  | NurseryReportLightDto
  | SiteReportLightDto
  | FinancialReportLightDto
  | DisturbanceReportLightDto
  | SrpReportLightDto;
export type EntityDtoType = EntityFullDto | EntityLightDto;

export type EntityUpdateData =
  | ProjectUpdateData
  | SiteUpdateData
  | NurseryUpdateData
  | ProjectReportUpdateData
  | SiteReportUpdateData
  | NurseryReportUpdateData
  | FinancialReportUpdateData
  | DisturbanceReportUpdateData
  | SrpReportUpdateData;

export type EntityIndexConnectionProps = PaginatedConnectionProps &
  FilterProp<Filter<EntityIndexQueryParams>> &
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
    ? v3Resource(entity, entityGet).singleFullResource<D>(pathParamsFactory)
    : v3Resource(entity, entityGet).singleResource<D>(pathParamsFactory);
  return factory
    .isDeleted()
    .refetch(({ id }) => {
      if (id != null) ApiSlice.pruneCache(entity, [id]);
    })
    .update<U["attributes"], EntityUpdateVariables>(entityUpdate)
    .buildConnection();
};

const createEntityIndexConnection = <T extends EntityLightDto>(entity: SupportedEntity) =>
  v3Resource(entity, entityIndex)
    .index<T>(() => ({ pathParams: { entity } } as EntityIndexVariables))
    .pagination()
    .filter<Filter<EntityIndexQueryParams>>()
    .sideloads()
    .enabledProp()
    .refetch(() => ApiSlice.pruneIndex(entity, ""))
    .buildConnection();

const createEntityDeleter = (entity: SupportedEntity) =>
  deleterAsync(entity, entityDelete, uuid => specificEntityParams(entity, uuid));

export type EntityCreateData = EntityCreateVariables["body"]["data"];
type SpecificEntityCreateVariables<C extends EntityCreateData> = Omit<EntityCreateVariables, "body"> & {
  body: { data: C };
};
const createEntityCreateConnection = <D extends EntityDtoType, C extends EntityCreateData>(entity: C["type"]) => {
  return v3Resource<EntityCreateResponse, EntityCreateError, SpecificEntityCreateVariables<C>, {}>(entity, entityCreate)
    .create<D>(() => ({ pathParams: { entity } }))
    .buildConnection();
};

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
const lightProjectConnection = createEntityGetConnection<ProjectLightDto, ProjectUpdateData>("projects", false);
export const useLightProject = connectionHook(lightProjectConnection);
const indexProjectConnection = createEntityIndexConnection<ProjectLightDto>("projects");
export const loadProjectIndex = connectionLoader(indexProjectConnection);
export const useProjectIndex = connectionHook(indexProjectConnection);
export const useCreateProject = creationHook(
  createEntityCreateConnection<ProjectFullDto, ProjectCreateData>("projects")
);

// Sites
const fullSiteConnection = createEntityGetConnection<SiteFullDto, EntityUpdateData>("sites");
export const loadFullSite = connectionLoader(fullSiteConnection);
export const useFullSite = connectionHook(fullSiteConnection);
export const deleteSite = createEntityDeleter("sites");
export const indexSiteConnection = createEntityIndexConnection<SiteLightDto>("sites");
export const loadSiteIndex = connectionLoader(indexSiteConnection);
export const useSiteIndex = connectionHook(indexSiteConnection);
export const useCreateSite = creationHook(createEntityCreateConnection<SiteFullDto, SiteCreateData>("sites"));

// Nurseries
const fullNurseryConnection = createEntityGetConnection<NurseryFullDto, EntityUpdateData>("nurseries");
export const loadFullNursery = connectionLoader(fullNurseryConnection);
export const useFullNursery = connectionHook(fullNurseryConnection);
export const deleteNursery = createEntityDeleter("nurseries");
export const indexNurseryConnection = createEntityIndexConnection<NurseryLightDto>("nurseries");
export const loadNurseryIndex = connectionLoader(indexNurseryConnection);
export const useNurseryIndex = connectionHook(indexNurseryConnection);
export const useCreateNursery = creationHook(
  createEntityCreateConnection<NurseryFullDto, NurseryCreateData>("nurseries")
);

// Project Reports
const indexProjectReportConnection = createEntityIndexConnection<ProjectReportLightDto>("projectReports");
export const loadProjectReportIndex = connectionLoader(indexProjectReportConnection);
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
const fullSiteReportConnection = createEntityGetConnection<SiteReportFullDto, SiteReportUpdateData>("siteReports");
const lightSiteReportConnection = createEntityGetConnection<SiteReportLightDto, SiteReportUpdateData>(
  "siteReports",
  false
);
export const loadFullSiteReport = connectionLoader(fullSiteReportConnection);
export const useFullSiteReport = connectionHook(fullSiteReportConnection);
export const useLightSiteReport = connectionHook(lightSiteReportConnection);
const siteReportListConnection = v3Resource("siteReports").list<SiteReportLightDto>().buildConnection();
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
const nurseryReportListConnection = v3Resource("nurseryReports").list<NurseryReportLightDto>().buildConnection();
/**
 * Delivers the cached light DTOs for nursery reports corresponding to the UUIDs in the props. Does
 * not attempt to load them from the server.
 */
export const useLightNurseryReportList = connectionHook(nurseryReportListConnection);
export const loadLightNurseryReportList = connectionLoader(nurseryReportListConnection);
export const deleteNurseryReport = createEntityDeleter("nurseryReports");

// Financial Reports
export const indexFinancialReportConnection = createEntityIndexConnection<FinancialReportLightDto>("financialReports");
export const loadFinancialReportIndex = connectionLoader(indexFinancialReportConnection);
const fullFinancialReportConnection = createEntityGetConnection<FinancialReportFullDto, FinancialReportUpdateData>(
  "financialReports"
);
export const loadFullFinancialReport = connectionLoader(fullFinancialReportConnection);
export const useFullFinancialReport = connectionHook(fullFinancialReportConnection);
export const deleteFinancialReport = createEntityDeleter("financialReports");

// Disturbance Reports
export const indexDisturbanceReportConnection =
  createEntityIndexConnection<DisturbanceReportLightDto>("disturbanceReports");
export const loadDisturbanceReportIndex = connectionLoader(indexDisturbanceReportConnection);
const fullDisturbanceReportConnection = createEntityGetConnection<
  DisturbanceReportFullDto,
  DisturbanceReportUpdateData
>("disturbanceReports");
const lightDisturbanceReportConnection = createEntityGetConnection<
  DisturbanceReportLightDto,
  DisturbanceReportUpdateData
>("disturbanceReports", false);
export const loadFullDisturbanceReport = connectionLoader(fullDisturbanceReportConnection);
export const useFullDisturbanceReport = connectionHook(fullDisturbanceReportConnection);
export const useLightDisturbanceReport = connectionHook(lightDisturbanceReportConnection);
export const deleteDisturbanceReport = createEntityDeleter("disturbanceReports");
export const useCreateDisturbanceReport = creationHook(
  createEntityCreateConnection<DisturbanceReportFullDto, DisturbanceReportCreateData>("disturbanceReports")
);

// SRP Reports
export const indexSRPReportConnection = createEntityIndexConnection<SrpReportLightDto>("srpReports");
export const loadSRPReportIndex = connectionLoader(indexSRPReportConnection);
const fullSRPReportConnection = createEntityGetConnection<SrpReportFullDto, EntityUpdateData>("srpReports");
export const loadFullSRPReport = connectionLoader(fullSRPReportConnection);
export const useFullSRPReport = connectionHook(fullSRPReportConnection);
const srpReportListConnection = v3Resource("srpReports").list<SrpReportLightDto>().buildConnection();
/**
 * Delivers the cached light DTOs for disturbance reports corresponding to the UUIDs in the props. Does
 * not attempt to load them from the server.
 */
export const useLightSRPReportList = connectionHook(srpReportListConnection);
export const deleteSRPReport = createEntityDeleter("srpReports");

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
    case "financialReports":
      return useFullFinancialReport({ id });
    case "disturbanceReports":
      return useFullDisturbanceReport({ id });
    case "srpReports":
      return useFullSRPReport({ id });
    default:
      throw new Error(`Unsupported entity type [${entity}]`);
  }
};
