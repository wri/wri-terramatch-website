import { createSelector } from "reselect";

import { ApiConnectionFactory, EnabledProp, FilterProp } from "@/connections/util/api-connection-factory";
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
import {
  entityDeleteFetchFailed,
  entityGetFetchFailed,
  entityIndexFetchFailed,
  entityIndexIndexMeta,
  entityUpdateFetchFailed,
  entityUpdateIsFetching
} from "@/generated/v3/entityService/entityServiceSelectors";
import ApiSlice, { ApiDataStore, PendingErrorState, StoreResourceMap } from "@/store/apiSlice";
import { EntityName } from "@/types/common";
import { Connection, PaginatedConnectionProps } from "@/types/connection";
import { connectedResourceDeleter, resourcesDeletedSelector } from "@/utils/connectedResourceDeleter";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

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

export type EntityConnection<T extends EntityDtoType, U extends EntityUpdateData> = {
  entity?: T;
  entityIsDeleted: boolean;
  fetchFailure?: PendingErrorState | null;
  refetch: () => void;
  update: (updateAttributes: Partial<U["attributes"]>) => void;
  entityIsUpdating: boolean;
  entityUpdateFailure?: PendingErrorState | null;
};

type EntityConnectionProps = {
  uuid?: string;
};

export type EntityListConnection<T extends EntityLightDto> = {
  entities?: T[];
};

export type EntityListProps = {
  uuids?: string[];
};

type EntityIndexFilterKey = keyof Omit<
  EntityIndexQueryParams,
  "page[size]" | "page[number]" | "sort[field]" | "sort[direction]" | "sideloads"
>;
export type EntityIndexConnectionProps = PaginatedConnectionProps &
  FilterProp<EntityIndexFilterKey> &
  EnabledProp & {
    sideloads?: EntityIndexQueryParams["sideloads"];
  };

export type SupportedEntity = EntityGetPathParams["entity"];

const entitySelector =
  <T extends EntityDtoType>(entityName: SupportedEntity) =>
  (store: ApiDataStore) =>
    store[entityName] as StoreResourceMap<T>;

const specificEntityParams = (entity: SupportedEntity, uuid?: string) => ({ pathParams: { entity, uuid: uuid ?? "" } });

const updateEntity = <U extends EntityUpdateData>(entity: U["type"], uuid: string, attributes: U["attributes"]) =>
  entityUpdate({ pathParams: { entity, uuid }, body: { data: { type: entity, id: uuid, attributes } as U } });

const entityIsLoaded =
  (requireFullEntity: boolean) =>
  <T extends EntityDtoType, U extends EntityUpdateData>(
    { entity, entityIsDeleted, fetchFailure }: EntityConnection<T, U>,
    { uuid }: EntityConnectionProps
  ) => {
    if (uuid == null || uuid.trim() === "" || entityIsDeleted || fetchFailure != null) return true;
    if (entity == null) return false;
    return !requireFullEntity || !entity.lightResource;
  };

const createGetEntityConnection = <T extends EntityDtoType, U extends EntityUpdateData>(
  entityName: U["type"],
  requireFullEntity: boolean = true
): Connection<EntityConnection<T, U>, EntityConnectionProps> => ({
  load: (connection, props) => {
    if (!entityIsLoaded(requireFullEntity)(connection, props)) entityGet(specificEntityParams(entityName, props.uuid));
  },

  isLoaded: entityIsLoaded(requireFullEntity),

  selector: selectorCache(
    ({ uuid }) => uuid ?? "",
    ({ uuid }) =>
      createSelector(
        [
          entitySelector(entityName),
          resourcesDeletedSelector(entityName),
          entityGetFetchFailed(specificEntityParams(entityName, uuid)),
          entityUpdateIsFetching(specificEntityParams(entityName, uuid)),
          entityUpdateFetchFailed(specificEntityParams(entityName, uuid))
        ],
        (entities, deleted, getFailure, isUpdating, updateFailure) => ({
          entity: uuid == null ? undefined : (entities[uuid]?.attributes as T),
          entityIsDeleted: uuid != null && deleted.includes(uuid),
          fetchFailure: getFailure ?? undefined,
          refetch: () => {
            if (uuid != null) ApiSlice.pruneCache(entityName, [uuid]);
          },
          entityIsUpdating: isUpdating,
          updateFailure: updateFailure ?? undefined,
          update: (attributes: Partial<U["attributes"]>) =>
            uuid == null ? undefined : updateEntity<U>(entityName, uuid, attributes as U["attributes"])
        })
      )
  )
});

const createEntityIndexConnection = <T extends EntityLightDto>(entity: SupportedEntity) =>
  ApiConnectionFactory.index<T, EntityIndexVariables>(
    entity,
    entityIndex,
    entityIndexIndexMeta,
    () => ({ pathParams: { entity } } as EntityIndexVariables)
  )
    .pagination()
    .filters({
      search: "string",
      searchFilter: "string",
      country: "string",
      status: "string",
      updateRequestStatus: "string",
      projectUuid: "string",
      nurseryUuid: "string",
      siteUuid: "string",
      landscape: "array",
      organisationType: "array",
      cohort: "array",
      polygonStatus: "string",
      nothingToReport: "boolean",
      shortName: "string"
    })
    .addProps<{ sideloads?: EntityIndexQueryParams["sideloads"] }>(({ sideloads }) => ({
      queryParams: { sideloads }
    }))
    .enabledFlag()
    .refetch(() => ApiSlice.pruneIndex(entity, ""))
    .fetchFailure(entityIndexFetchFailed)
    .buildConnection();

const createEntityListConnection = <T extends EntityLightDto>(
  entityName: SupportedEntity
): Connection<EntityListConnection<T>, EntityListProps> => ({
  selector: selectorCache(
    ({ uuids }) => (uuids ?? []).join(),
    ({ uuids }) =>
      createSelector([entitySelector(entityName)], entitiesStore => ({
        entities: (uuids ?? []).map(uuid => entitiesStore[uuid]?.attributes as T)
      }))
  )
});

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
const fullProjectConnection = createGetEntityConnection<ProjectFullDto, ProjectUpdateData>("projects");
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
const fullSiteConnection = createGetEntityConnection<SiteFullDto, EntityUpdateData>("sites");
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
const fullNurseryConnection = createGetEntityConnection<NurseryFullDto, EntityUpdateData>("nurseries");
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
const fullProjectReportConnection = createGetEntityConnection<ProjectReportFullDto, ProjectReportUpdateData>(
  "projectReports"
);
const lightProjectReportConnection = createGetEntityConnection<ProjectReportLightDto, ProjectReportUpdateData>(
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
const fullSiteReportConnection = createGetEntityConnection<SiteReportFullDto, SiteReportUpdateData>("siteReports");
const lightSiteReportConnection = createGetEntityConnection<SiteReportLightDto, SiteReportUpdateData>(
  "siteReports",
  false
);
export const loadFullSiteReport = connectionLoader(fullSiteReportConnection);
export const useFullSiteReport = connectionHook(fullSiteReportConnection);
export const useLightSiteReport = connectionHook(lightSiteReportConnection);
const siteReportListConnection = createEntityListConnection<SiteReportLightDto>("siteReports");
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
const fullNurseryReportConnection = createGetEntityConnection<NurseryReportFullDto, NurseryReportUpdateData>(
  "nurseryReports"
);
const lightNurseryReportConnection = createGetEntityConnection<NurseryReportLightDto, NurseryReportUpdateData>(
  "nurseryReports",
  false
);
export const loadFullNurseryReport = connectionLoader(fullNurseryReportConnection);
export const useFullNurseryReport = connectionHook(fullNurseryReportConnection);
export const useLightNurseryReport = connectionHook(lightNurseryReportConnection);
const nurseryReportListConnection = createEntityListConnection<NurseryReportLightDto>("nurseryReports");
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
export const useFullEntity = (entity: SupportedEntity, uuid: string) => {
  switch (entity) {
    case "projects":
      return useFullProject({ uuid });
    case "sites":
      return useFullSite({ uuid });
    case "nurseries":
      return useFullNursery({ uuid });
    case "projectReports":
      return useFullProjectReport({ uuid });
    case "siteReports":
      return useFullSiteReport({ uuid });
    case "nurseryReports":
      return useFullNurseryReport({ uuid });
    default:
      throw new Error(`Unsupported entity type [${entity}]`);
  }
};
