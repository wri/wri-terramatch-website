import { createSelector } from "reselect";

import { entityGet, EntityGetPathParams, entityIndex } from "@/generated/v3/entityService/entityServiceComponents";
import { entityGetFetchFailed, entityIndexFetchFailed } from "@/generated/v3/entityService/entityServicePredicates";
import {
  ProjectFullDto,
  ProjectLightDto,
  SiteFullDto,
  SiteLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import ApiSlice, { ApiDataStore, PendingErrorState, StoreResourceMap } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

type EntityDtoType = ProjectFullDto | ProjectLightDto | SiteFullDto | SiteLightDto;

type EntityConnection<T extends EntityDtoType> = {
  entity?: T;
  fetchFailure?: PendingErrorState | null;
  refetch: () => void;
};

type EntityConnectionProps = {
  uuid: string;
};

type EntityIndexConnection<T extends EntityDtoType> = {
  entities?: T[];
  fetchFailure?: PendingErrorState | null;
  refetch: () => void;
};

type EntityIndexConnectionProps = {
  pageAfter?: string;
};

type SupportedEntity = EntityGetPathParams["entity"];

const entitySelector =
  <T extends EntityDtoType>(entityName: SupportedEntity) =>
  (store: ApiDataStore) =>
    store[entityName] as StoreResourceMap<T>;

const idsSelector = (entityName: SupportedEntity) => (store: ApiDataStore) => store.meta.filterIndexIds[entityName];

const entityGetParams = (entity: SupportedEntity, uuid: string) => ({ pathParams: { entity, uuid } });
const entityIndexParams = (entity: SupportedEntity, pageAfter?: string) => ({
  pathParams: { entity },
  queryParams: { "page[after]": pageAfter }
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

const createEntityIndexConnection = <T extends EntityDtoType>(
  entityName: SupportedEntity
): Connection<EntityIndexConnection<T>, EntityIndexConnectionProps> => ({
  load: (connection, { pageAfter }) => {
    if (!indexIsLoaded(connection)) entityIndex(entityIndexParams(entityName, pageAfter));
  },

  isLoaded: indexIsLoaded,

  selector: selectorCache(
    ({ pageAfter }) => pageAfter ?? "",
    ({ pageAfter }) =>
      createSelector(
        [
          idsSelector(entityName),
          entitySelector(entityName),
          entityIndexFetchFailed(entityIndexParams(entityName, pageAfter))
        ],
        (idsCacheStore, entitiesStore, fetchFailure) => {
          // For now, we don't have filter support, so all search queries should be ""
          const refetch = () => ApiSlice.pruneIndex(entityName, "");

          const ids = idsCacheStore[""]?.[pageAfter ?? ""];
          if (ids == null) return { refetch, fetchFailure };

          const entities = [] as T[];
          for (const id of ids) {
            // If we're missing any of the entities we're supposed to have, return nothing so the
            // index endpoint is queried again.
            if (entitiesStore[id] == null) return { refetch, fetchFailure };
            entities.push(entitiesStore[id].attributes as T);
          }

          return { entities, refetch, fetchFailure };
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
