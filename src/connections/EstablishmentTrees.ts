import { createSelector } from "reselect";

import {
  establishmentTreesFind,
  EstablishmentTreesFindPathParams
} from "@/generated/v3/entityService/entityServiceComponents";
import { establishmentTreesFindFetchFailed } from "@/generated/v3/entityService/entityServicePredicates";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

type EstablishmentTreesConnection = {
  establishmentTrees?: string[];

  establishmentTreesLoadFailed: boolean;
};

type EstablishmentTreesProps = Partial<EstablishmentTreesFindPathParams>;

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
  { entity, uuid }: EstablishmentTreesProps
) => entity == null || uuid == null || establishmentTrees != null || establishmentTreesLoadFailed;

const establishmentTreesConnection: Connection<EstablishmentTreesConnection, EstablishmentTreesProps> = {
  load: (connection, props) => {
    if (!connectionIsLoaded(connection, props)) {
      establishmentTreesFind({ pathParams: { entity: props.entity!, uuid: props.uuid! } });
    }
  },

  isLoaded: connectionIsLoaded,

  selector: selectorCache(
    ({ entity, uuid }) => `${entity}|${uuid}`,
    ({ entity, uuid }) =>
      createSelector(
        [establishmentTreesSelector(entity, uuid), establishmentTreesLoadFailed(entity, uuid)],
        (treesDto, establishmentTreesLoadFailed) => ({
          establishmentTrees: treesDto?.attributes?.establishmentTrees,
          establishmentTreesLoadFailed
        })
      )
  )
};

export const useEstablimentTrees = connectionHook(establishmentTreesConnection);
