import { createSelector } from "reselect";

import { entityGet, EntityGetPathParams } from "@/generated/v3/entityService/entityServiceComponents";
import { entityGetFetchFailed } from "@/generated/v3/entityService/entityServicePredicates";
import { ProjectFullDto, SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { ApiDataStore, PendingErrorState, StoreResourceMap } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

type EntityDtoTypes = ProjectFullDto | SiteFullDto;

type EntityConnection<T extends EntityDtoTypes> = {
  entity?: T;
  fetchFailure?: PendingErrorState;
};

type EntityConnectionProps = {
  uuid: string;
};

type SupportedEntity = EntityGetPathParams["entity"];

function entitySelector<T extends EntityDtoTypes>(entityName: SupportedEntity) {
  return (store: ApiDataStore) => store[entityName] as StoreResourceMap<T>;
}

const entityGetParams = (entity: SupportedEntity, uuid: string) => ({ pathParams: { entity, uuid } });

const entityIsLoaded = ({ entity, fetchFailure }: EntityConnection<any>, { uuid }: EntityConnectionProps) =>
  uuid == null || fetchFailure != null || entity != null;

const createEntityConnection = <T extends EntityDtoTypes>(
  entityName: SupportedEntity
): Connection<EntityConnection<T>, EntityConnectionProps> => ({
  load: (connection, props) => {
    if (!entityIsLoaded(connection, props)) entityGet(entityGetParams(entityName, props.uuid));
  },

  isLoaded: entityIsLoaded,

  selector: selectorCache(
    ({ uuid }) => uuid,
    ({ uuid }) =>
      createSelector(
        [entitySelector(entityName), entityGetFetchFailed(entityGetParams(entityName, uuid))],
        (entities, failure) => ({
          entity: entities[uuid]?.attributes as T,
          fetchFailure: failure ?? undefined
        })
      )
  )
});

const projectConnection = createEntityConnection<ProjectFullDto>("projects");
export const loadProject = connectionLoader(projectConnection);
export const useProject = connectionHook(projectConnection);
