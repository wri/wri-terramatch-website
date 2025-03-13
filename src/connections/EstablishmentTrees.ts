import { createSelector } from "reselect";

import { establishmentTreesFind } from "@/generated/v3/entityService/entityServiceComponents";
import { TreeEntityTypes } from "@/generated/v3/entityService/entityServiceConstants";
import { establishmentTreesFindFetchFailed } from "@/generated/v3/entityService/entityServicePredicates";
import { EstablishmentsTreesDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export type EstablishmentEntity = (typeof TreeEntityTypes.ESTABLISHMENT_ENTITIES)[number];

type EstablishmentTreesConnection = {
  establishmentTrees?: EstablishmentsTreesDto["establishmentTrees"][string];
  previousPlantingCounts?: Exclude<EstablishmentsTreesDto["previousPlantingCounts"], null>[string];

  establishmentTreesLoadFailed: boolean;
};

type EstablishmentTreesProps = {
  entity?: EstablishmentEntity;
  uuid?: string;
  collection?: string;
};

const establishmentTreesSelector = (entity?: EstablishmentEntity, uuid?: string) => (store: ApiDataStore) =>
  entity == null || uuid == null ? undefined : store.establishmentTrees?.[`${entity}|${uuid}`];
const establishmentTreesLoadFailed = (entity?: EstablishmentEntity, uuid?: string) => (store: ApiDataStore) =>
  entity == null || uuid == null
    ? false
    : establishmentTreesFindFetchFailed({ pathParams: { entity, uuid } })(store) != null;

const connectionIsLoaded = (
  { establishmentTrees, establishmentTreesLoadFailed }: EstablishmentTreesConnection,
  { entity, uuid, collection }: EstablishmentTreesProps
) =>
  collection == null ||
  entity == null ||
  // Prevents this connection from issuing an API request with an invalid entity type
  !TreeEntityTypes.ESTABLISHMENT_ENTITIES.includes(entity) ||
  uuid == null ||
  establishmentTrees != null ||
  establishmentTreesLoadFailed;

const establishmentTreesConnection: Connection<EstablishmentTreesConnection, EstablishmentTreesProps> = {
  load: (connection, props) => {
    if (!connectionIsLoaded(connection, props)) {
      establishmentTreesFind({ pathParams: { entity: props.entity!, uuid: props.uuid! } });
    }
  },

  isLoaded: connectionIsLoaded,

  selector: selectorCache(
    ({ entity, uuid, collection }) => `${entity}|${uuid}|${collection}`,
    ({ entity, uuid, collection }) =>
      createSelector(
        [establishmentTreesSelector(entity, uuid), establishmentTreesLoadFailed(entity, uuid)],
        (treesDto, establishmentTreesLoadFailed) => {
          const loadComplete = treesDto?.attributes?.establishmentTrees != null;
          const establishmentTrees =
            collection == null || !loadComplete ? undefined : treesDto.attributes.establishmentTrees[collection] ?? [];
          const previousPlantingCounts =
            collection == null || !loadComplete ? undefined : treesDto.attributes.previousPlantingCounts?.[collection];
          return { establishmentTrees, previousPlantingCounts, establishmentTreesLoadFailed };
        }
      )
  )
};

export const useEstablishmentTrees = connectionHook(establishmentTreesConnection);
