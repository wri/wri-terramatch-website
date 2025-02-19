import { createSelector } from "reselect";

import {
  entityGet,
  EntityGetPathParams,
  entityIndex,
  EntityIndexQueryParams
} from "@/generated/v3/entityService/entityServiceComponents";
import { entityGetFetchFailed, entityIndexFetchFailed } from "@/generated/v3/entityService/entityServicePredicates";
import {
  ProjectFullDto,
  ProjectLightDto,
  SiteFullDto,
  SiteLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { getStableQuery } from "@/generated/v3/utils";
import ApiSlice, { ApiDataStore, PendingErrorState, StoreResourceMap } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export type EntityFullDto = ProjectFullDto | SiteFullDto;
export type EntityLightDto = ProjectLightDto | SiteLightDto;
export type EntityDtoType = EntityFullDto | EntityLightDto;

type EntityConnection<T extends EntityDtoType> = {
  entity?: T;
  fetchFailure?: PendingErrorState | null;
  refetch: () => void;
};

type EntityConnectionProps = {
  uuid: string;
};

export type EntityIndexConnection<T extends EntityDtoType> = {
  entities?: T[];
  indexTotal?: number;
  fetchFailure?: PendingErrorState | null;
  refetch: () => void;
};

type EntityIndexFilterKey = keyof Omit<
  EntityIndexQueryParams,
  "page[size]" | "page[number]" | "sort[field]" | "sort[direction]"
>;
export type EntityIndexConnectionProps = {
  pageSize?: number;
  pageNumber?: number;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  filter?: Record<EntityIndexFilterKey, string>;
};

export type SupportedEntity = EntityGetPathParams["entity"];

const entitySelector =
  <T extends EntityDtoType>(entityName: SupportedEntity) =>
  (store: ApiDataStore) =>
    store[entityName] as StoreResourceMap<T>;

const pageMetaSelector = (entityName: SupportedEntity, props: EntityIndexConnectionProps) => (store: ApiDataStore) => {
  const { queryParams } = entityIndexParams(entityName, props);
  delete queryParams["page[number]"];
  const query = getStableQuery(queryParams);
  return store.meta.indices[entityName][query]?.[props.pageNumber ?? 0];
};

const entityGetParams = (entity: SupportedEntity, uuid: string) => ({ pathParams: { entity, uuid } });
const entityIndexQuery = (props?: EntityIndexConnectionProps) => {
  const queryParams = { "page[number]": props?.pageNumber, "page[size]": props?.pageSize } as EntityIndexQueryParams;
  if (props?.sortField != null) {
    queryParams["sort[field]"] = props.sortField;
    queryParams["sort[direction]"] = props.sortDirection ?? "ASC";
  }
  if (props?.filter != null) {
    for (const [key, value] of Object.entries(props.filter)) {
      queryParams[key as EntityIndexFilterKey] = value;
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
  <T extends EntityDtoType>({ entity, fetchFailure }: EntityConnection<T>, { uuid }: EntityConnectionProps) => {
    if (uuid == null || fetchFailure != null) return true;
    if (entity == null) return false;
    return !requireFullEntity || !entity.lightResource;
  };

const createGetEntityConnection = <T extends EntityDtoType>(
  entityName: SupportedEntity,
  requireFullEntity: boolean
): Connection<EntityConnection<T>, EntityConnectionProps> => ({
  load: (connection, props) => {
    if (!entityIsLoaded(requireFullEntity)(connection, props)) entityGet(entityGetParams(entityName, props.uuid));
  },

  isLoaded: entityIsLoaded(requireFullEntity),

  selector: selectorCache(
    ({ uuid }) => uuid,
    ({ uuid }) =>
      createSelector(
        [entitySelector(entityName), entityGetFetchFailed(entityGetParams(entityName, uuid))],
        (entities, failure) => ({
          entity: entities[uuid]?.attributes as T,
          fetchFailure: failure ?? undefined,
          refetch: () => {
            if (uuid != null) ApiSlice.pruneCache(entityName, [uuid]);
          }
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
          pageMetaSelector(entityName, props),
          entitySelector(entityName),
          entityIndexFetchFailed(entityIndexParams(entityName, props))
        ],
        (pageMeta, entitiesStore, fetchFailure) => {
          // For now, we don't have filter support, so all search queries should be ""
          const refetch = () => ApiSlice.pruneIndex(entityName, "");
          if (pageMeta == null) return { refetch, fetchFailure };

          const entities = [] as T[];
          for (const id of pageMeta.ids) {
            // If we're missing any of the entities we're supposed to have, return nothing so the
            // index endpoint is queried again.
            if (entitiesStore[id] == null) return { refetch, fetchFailure };
            entities.push(entitiesStore[id].attributes as T);
          }

          return { entities, indexTotal: pageMeta.meta.total, refetch, fetchFailure };
        }
      )
  )
});

// The "light" version of entity connections will return the full DTO if it's what's cached in the store. However,
// the type of the entity will use the Light DTO. For the "full" version of the entity connection, if the version that's
// currently cached is the "light" version, it will issue a request to the server to get the full version.
const fullProjectConnection = createGetEntityConnection<ProjectFullDto>("projects", true);
export const loadFullProject = connectionLoader(fullProjectConnection);
export const useFullProject = connectionHook(fullProjectConnection);
const lightProjectConnection = createGetEntityConnection<ProjectLightDto>("projects", false);
export const loadLightProject = connectionLoader(lightProjectConnection);
export const useLightProject = connectionHook(lightProjectConnection);

// For indexes, we only support the light dto
const indexProjectConnection = createEntityIndexConnection<ProjectLightDto>("projects");
export const loadProjectIndex = connectionLoader(indexProjectConnection);
export const useProjectIndex = connectionHook(indexProjectConnection);
