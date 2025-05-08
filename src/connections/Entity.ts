import { createSelector } from "reselect";

import {
  entityDelete,
  entityGet,
  EntityGetPathParams,
  entityIndex,
  EntityIndexQueryParams,
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
import { getStableQuery } from "@/generated/v3/utils";
import ApiSlice, { ApiDataStore, JsonApiResource, PendingErrorState, StoreResourceMap } from "@/store/apiSlice";
import { EntityName } from "@/types/common";
import { Connection } from "@/types/connection";
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
  uuid: string;
};

export type EntityIndexConnection<T extends EntityDtoType> = {
  entities?: T[];
  indexTotal?: number;
  fetchFailure?: PendingErrorState | null;
  refetch: () => void;
  included?: JsonApiResource[];
};

export type EntityIndexFilterKey = keyof Omit<
  EntityIndexQueryParams,
  "page[size]" | "page[number]" | "sort[field]" | "sort[direction]" | "sideloads"
>;
export type EntityIndexConnectionProps = {
  pageSize?: number;
  pageNumber?: number;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  filter?: Partial<Record<EntityIndexFilterKey, string>>;
  sideloads?: EntityIndexQueryParams["sideloads"];
};

export type SupportedEntity = EntityGetPathParams["entity"];

type PolygonStatus = EntityIndexQueryParams["polygonStatus"];

const entitySelector =
  <T extends EntityDtoType>(entityName: SupportedEntity) =>
  (store: ApiDataStore) =>
    store[entityName] as StoreResourceMap<T>;

const specificEntityParams = (entity: SupportedEntity, uuid: string) => ({ pathParams: { entity, uuid } });

const updateEntity = <U extends EntityUpdateData>(entity: U["type"], uuid: string, attributes: U["attributes"]) =>
  entityUpdate({ pathParams: { entity, uuid }, body: { data: { type: entity, id: uuid, attributes } as U } });

const entityIndexQuery = (props?: EntityIndexConnectionProps) => {
  const queryParams = {
    "page[number]": props?.pageNumber,
    "page[size]": props?.pageSize,
    sideloads: props?.sideloads
  } as EntityIndexQueryParams;
  if (props?.sortField != null) {
    queryParams["sort[field]"] = props.sortField;
    queryParams["sort[direction]"] = props.sortDirection ?? "ASC";
  }
  if (props?.filter != null) {
    for (const [key, value] of Object.entries(props.filter)) {
      if (key === "polygonStatus") queryParams.polygonStatus = value as PolygonStatus;
      else queryParams[key as Exclude<EntityIndexFilterKey, "polygonStatus">] = value;
    }
  }
  return queryParams;
};
const entityIndexParams = (entity: SupportedEntity, props?: EntityIndexConnectionProps) => ({
  pathParams: { entity },
  queryParams: entityIndexQuery(props)
});

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
  entityName: U["type"]
): Connection<EntityConnection<T, U>, EntityConnectionProps> => ({
  load: (connection, props) => {
    if (!entityIsLoaded(true)(connection, props)) entityGet(specificEntityParams(entityName, props.uuid));
  },

  isLoaded: entityIsLoaded(true),

  selector: selectorCache(
    ({ uuid }) => uuid,
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
          entity: entities[uuid]?.attributes as T,
          entityIsDeleted: uuid != null && deleted.includes(uuid),
          fetchFailure: getFailure ?? undefined,
          refetch: () => {
            if (uuid != null) ApiSlice.pruneCache(entityName, [uuid]);
          },
          entityIsUpdating: isUpdating,
          updateFailure: updateFailure ?? undefined,
          update: (attributes: Partial<U["attributes"]>) =>
            updateEntity<U>(entityName, uuid, attributes as U["attributes"])
        })
      )
  )
});

const indexIsLoaded = <T extends EntityDtoType>({ entities, fetchFailure }: EntityIndexConnection<T>) =>
  entities != null || fetchFailure != null;

const indexCacheKey = (props: EntityIndexConnectionProps) => getStableQuery(entityIndexQuery(props));

const createEntityIndexConnection = <T extends EntityDtoType>(
  entityName: SupportedEntity
): Connection<EntityIndexConnection<T>, EntityIndexConnectionProps> => ({
  load: (connection, props) => {
    if (!indexIsLoaded(connection)) entityIndex(entityIndexParams(entityName, props));
  },

  isLoaded: indexIsLoaded,

  selector: selectorCache(
    props => indexCacheKey(props),
    props =>
      createSelector(
        [
          entityIndexIndexMeta(entityName, entityIndexParams(entityName, props)),
          entitySelector(entityName),
          entityIndexFetchFailed(entityIndexParams(entityName, props))
        ],
        (indexMeta, entitiesStore, fetchFailure) => {
          // For now, we don't have filter support, so all search queries should be ""
          const refetch = () => ApiSlice.pruneIndex(entityName, "");
          if (indexMeta == null) return { refetch, fetchFailure };

          const entities = [] as T[];
          for (const id of indexMeta.ids) {
            // If we're missing any of the entities we're supposed to have, return nothing so the
            // index endpoint is queried again.
            if (entitiesStore[id] == null) return { refetch, fetchFailure };
            entities.push(entitiesStore[id].attributes as T);
          }

          // Get the included data if it exists in the response
          let included: JsonApiResource[] | undefined;
          if (indexMeta.included) {
            included = indexMeta.included;
          }

          return {
            entities,
            indexTotal: indexMeta.total,
            refetch,
            fetchFailure,
            included
          };
        }
      )
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
const indexProjectConnection = createEntityIndexConnection<ProjectLightDto>("projects");
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
const indexSiteConnection = createEntityIndexConnection<SiteLightDto>("sites");
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
const indexNurseryConnection = createEntityIndexConnection<NurseryLightDto>("nurseries");
export const loadNurseryIndex = connectionLoader(indexNurseryConnection);
export const useNurseryIndex = connectionHook(indexNurseryConnection);

// Project Reports
const indexProjectReportConnection = createEntityIndexConnection<ProjectReportLightDto>("projectReports");
export const loadProjectReportIndex = connectionLoader(indexProjectReportConnection);
const fullProjectReportConnection = createGetEntityConnection<ProjectReportFullDto, ProjectReportUpdateData>(
  "projectReports"
);
export const loadFullProjectReport = connectionLoader(fullProjectReportConnection);
export const useFullProjectReport = connectionHook(fullProjectReportConnection);
export const deleteProjectReport = connectedResourceDeleter(
  "projectReports",
  uuid => entityDeleteFetchFailed(specificEntityParams("projectReports", uuid)),
  uuid => (uuid == null ? null : entityDelete(specificEntityParams("projectReports", uuid)))
);

// Site Reports
const indexSiteReportConnection = createEntityIndexConnection<SiteReportLightDto>("siteReports");
export const loadSiteReportIndex = connectionLoader(indexSiteReportConnection);
export const useSiteReportIndex = connectionHook(indexSiteReportConnection);
const fullSiteReportConnection = createGetEntityConnection<SiteReportFullDto, SiteReportUpdateData>("siteReports");
export const loadFullSiteReport = connectionLoader(fullSiteReportConnection);
export const useFullSiteReport = connectionHook(fullSiteReportConnection);
export const deleteSiteReport = connectedResourceDeleter(
  "siteReports",
  uuid => entityDeleteFetchFailed(specificEntityParams("siteReports", uuid)),
  uuid => (uuid == null ? null : entityDelete(specificEntityParams("siteReports", uuid)))
);

// Nursery Reports
const indexNurseryReportConnection = createEntityIndexConnection<NurseryReportLightDto>("nurseryReports");
export const loadNurseryReportIndex = connectionLoader(indexNurseryReportConnection);
export const useNurseryReportIndex = connectionHook(indexNurseryReportConnection);
const fullNurseryReportConnection = createGetEntityConnection<NurseryReportFullDto, NurseryReportUpdateData>(
  "nurseryReports"
);
export const loadFullNurseryReport = connectionLoader(fullNurseryReportConnection);
export const useFullNurseryReport = connectionHook(fullNurseryReportConnection);
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
