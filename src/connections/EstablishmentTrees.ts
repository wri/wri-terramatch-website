import { createSelector } from "reselect";

import {
  establishmentTreesFind,
  EstablishmentTreesFindPathParams
} from "@/generated/v3/entityService/entityServiceComponents";
import { establishmentTreesFindFetchFailed } from "@/generated/v3/entityService/entityServicePredicates";
import { EstablishmentsTreesDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

type EstablishmentTreesConnection = {
  establishmentTrees?: EstablishmentsTreesDto["establishmentTrees"][string];
  previousPlantingCounts?: Exclude<EstablishmentsTreesDto["previousPlantingCounts"], null>[string];

  establishmentTreesLoadFailed: boolean;
};

type EstablishmentTreesProps = Partial<EstablishmentTreesFindPathParams> & {
  collection?: string;
};

export type EstablishmentEntityType = EstablishmentTreesFindPathParams["entity"] | undefined;
const establishmentTreesSelector =
  (entity: EstablishmentEntityType, uuid: string | undefined) => (store: ApiDataStore) =>
    entity == null || uuid == null ? undefined : store.establishmentTrees?.[`${entity}|${uuid}`];
const establishmentTreesLoadFailed =
  (entity: EstablishmentEntityType, uuid: string | undefined) => (store: ApiDataStore) =>
    entity == null || uuid == null
      ? false
      : establishmentTreesFindFetchFailed({ pathParams: { entity, uuid } })(store) != null;

const connectionIsLoaded = (
  { establishmentTrees, establishmentTreesLoadFailed }: EstablishmentTreesConnection,
  { entity, uuid, collection }: EstablishmentTreesProps
) => collection == null || entity == null || uuid == null || establishmentTrees != null || establishmentTreesLoadFailed;

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
