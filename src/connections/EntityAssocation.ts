import { useMemo } from "react";
import { createSelector } from "reselect";

import {
  entityAssociationIndex,
  EntityAssociationIndexPathParams
} from "@/generated/v3/entityService/entityServiceComponents";
import { entityAssociationIndexFetchFailed } from "@/generated/v3/entityService/entityServicePredicates";
import { DemographicDto, SeedingDto, TreeSpeciesDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import { ApiDataStore, indexMetaSelector, PendingErrorState, StoreResourceMap } from "@/store/apiSlice";
import { Connected, Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import Log from "@/utils/log";
import { selectorCache } from "@/utils/selectorCache";

export type EntityAssociationDtoType = DemographicDto | TreeSpeciesDto | SeedingDto;
export type SupportedEntity = EntityAssociationIndexPathParams["entity"];
export type SupportedAssociation = EntityAssociationIndexPathParams["association"];

export type EntityAssociationIndexConnection<T extends EntityAssociationDtoType> = {
  associations?: T[];
  fetchFailure?: PendingErrorState | null;
};

export type EntityAssociationIndexConnectionProps = {
  entity: SupportedEntity;
  uuid: string;
};

const associationSelector =
  <T extends EntityAssociationDtoType>(association: SupportedAssociation) =>
  (store: ApiDataStore) =>
    store[association] as StoreResourceMap<T>;

const associationGetParams = (
  association: SupportedAssociation,
  { entity, uuid }: EntityAssociationIndexConnectionProps
) => ({
  pathParams: { entity, uuid, association }
});

const indexIsLoaded = <T extends EntityAssociationDtoType>({
  associations,
  fetchFailure
}: EntityAssociationIndexConnection<T>) => associations != null || fetchFailure != null;

const createAssociationIndexConnection = <T extends EntityAssociationDtoType>(
  association: SupportedAssociation
): Connection<EntityAssociationIndexConnection<T>, EntityAssociationIndexConnectionProps> => ({
  load: (connection, props) => {
    if (!indexIsLoaded(connection)) entityAssociationIndex(associationGetParams(association, props));
  },

  isLoaded: indexIsLoaded,

  selector: selectorCache(
    ({ entity, uuid }) => `${entity}:${uuid}`,
    props =>
      createSelector(
        [
          indexMetaSelector(association, associationGetParams(association, props)),
          associationSelector(association),
          entityAssociationIndexFetchFailed(associationGetParams(association, props))
        ],
        (indexMeta, associationsStore, fetchFailure) => {
          if (indexMeta == null) return { fetchFailure };

          const associations = [] as T[];
          for (const id of indexMeta.ids) {
            // if we're missing any of the associations we're supposed to have, return nothing so the
            // index endpoint is queried again.
            if (associationsStore[id] == null) return { fetchFailure };
            associations.push(associationsStore[id].attributes as T);
          }

          return { associations, fetchFailure };
        }
      )
  )
});

type CollectionProps = EntityAssociationIndexConnectionProps & {
  collection?: string;
};

type CollectionTypeProps = CollectionProps & {
  type?: string;
};

type FilteredEntityAssociationConnection<T extends EntityAssociationDtoType> = Omit<
  EntityAssociationIndexConnection<T>,
  "associations"
> & { association?: T };

/**
 * Create a hook that depends on the given connection, and filters the results based on type and/or
 * collection, returning the one member of the store that meets those criteria. Expects to find only
 * one association that matches the given collection and/or type. If more are found, an error is
 * logged and the first entry is returned.
 */
const collectionTypeHook =
  <T extends EntityAssociationDtoType>(
    connection: Connection<EntityAssociationIndexConnection<T>, EntityAssociationIndexConnectionProps>
  ) =>
  (props: CollectionTypeProps): Connected<FilteredEntityAssociationConnection<T>> => {
    const [loaded, { associations, fetchFailure }] = useConnection(connection, props);

    const association = useMemo(() => {
      if (!loaded) return undefined;

      const matches = ((associations as { collection?: string; type?: string }[]) ?? []).filter(
        ({ collection, type }) => collection === props.collection && type === props.type
      );
      if (matches.length > 1) {
        Log.error("Expecting to find only one collection / type match, but found many", { props, matches });
      }

      return matches[0] as T | undefined;
    }, [associations, loaded, props]);

    return loaded ? [true, { association, fetchFailure }] : [false, {}];
  };

/**
 * Create a hook that filters the given association results based on a given collection
 */
const collectionFilterHook =
  <T extends EntityAssociationDtoType>(
    connection: Connection<EntityAssociationIndexConnection<T>, EntityAssociationIndexConnectionProps>
  ) =>
  (props: CollectionProps): Connected<EntityAssociationIndexConnection<T>> => {
    const [loaded, { associations, fetchFailure }] = useConnection(connection, props);

    const filteredAssociations = useMemo(() => {
      if (!loaded) return undefined;

      return ((associations as { collection?: string }[]) ?? []).filter(
        ({ collection }) => collection === props.collection
      ) as T[];
    }, [associations, loaded, props.collection]);

    return loaded ? [true, { associations: filteredAssociations, fetchFailure }] : [false, {}];
  };

const demographicConnection = createAssociationIndexConnection<DemographicDto>("demographics");
/** Returns the one demographic that matches the given type / collection on the given entity */
export const useDemographic = collectionTypeHook(demographicConnection);
/** Returns all demographics for the given entity */
export const useDemographics = connectionHook(demographicConnection);

const treeSpeciesConnection = createAssociationIndexConnection<TreeSpeciesDto>("treeSpecies");
export const useTreeSpecies = collectionFilterHook(treeSpeciesConnection);

const seedingsConnection = createAssociationIndexConnection<SeedingDto>("seedings");
export const useSeedings = connectionHook(seedingsConnection);
