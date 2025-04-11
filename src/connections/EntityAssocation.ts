import { useMemo } from "react";
import { createSelector } from "reselect";

import {
  entityAssociationIndex,
  EntityAssociationIndexPathParams,
  EntityAssociationIndexQueryParams
} from "@/generated/v3/entityService/entityServiceComponents";
import {
  DemographicDto,
  MediaDto,
  SeedingDto,
  TreeSpeciesDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import {
  entityAssociationIndexFetchFailed,
  entityAssociationIndexIndexMeta
} from "@/generated/v3/entityService/entityServiceSelectors";
import { useConnection } from "@/hooks/useConnection";
import { ApiDataStore, PendingErrorState, StoreResourceMap } from "@/store/apiSlice";
import { Connected, Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import Log from "@/utils/log";
import { selectorCache } from "@/utils/selectorCache";

export type EntityAssociationDtoType = DemographicDto | TreeSpeciesDto | SeedingDto | MediaDto;
export type SupportedEntity = EntityAssociationIndexPathParams["entity"];
export type SupportedAssociation = EntityAssociationIndexPathParams["association"];

export type EntityAssociationIndexConnection<T extends EntityAssociationDtoType> = {
  associations?: T[];
  indexTotal?: number;
  fetchFailure?: PendingErrorState | null;
};

export type EntityAssociationIndexConnectionProps = {
  entity: SupportedEntity;
  uuid: string;
  queryParams?: EntityAssociationIndexQueryParams;
};

const associationSelector =
  <T extends EntityAssociationDtoType>(association: SupportedAssociation) =>
  (store: ApiDataStore) =>
    store[association] as StoreResourceMap<T>;

const associationGetParams = (
  association: SupportedAssociation,
  { entity, uuid, queryParams }: EntityAssociationIndexConnectionProps
) => ({
  pathParams: { entity, uuid, association },
  queryParams
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
          entityAssociationIndexIndexMeta(association, associationGetParams(association, props)),
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

const demographicConnection = createAssociationIndexConnection<DemographicDto>("demographics");
const mediaConnection = createAssociationIndexConnection<MediaDto>("media");

/** Returns the one demographic that matches the given type / collection on the given entity */
export const useDemographic = collectionTypeHook(demographicConnection);
/** Returns all demographics for the given entity */
export const useDemographics = connectionHook(demographicConnection);
/** Returns the one media that matches the given type / collection on the given entity */
export const useMedia = collectionTypeHook(mediaConnection);
/** Returns all media for the given entity */
export const useMedias = connectionHook(mediaConnection);

const treeSpeciesConnection = createAssociationIndexConnection<TreeSpeciesDto>("treeSpecies");
const seedingsConnection = createAssociationIndexConnection<SeedingDto>("seedings");

type PlantDto = TreeSpeciesDto | SeedingDto;
/**
 * A single connection for fetching a type of plant data. If the collection is "seeds", the data comes from Seedings,
 * otherwise from TreeSpecies. Since these have become so similar in UI and data, it's likely that in a future
 * ticket we unify these tables.
 */
export const usePlants = <T extends PlantDto = PlantDto>(
  props: CollectionProps
): Connected<EntityAssociationIndexConnection<T>> => {
  // We have to be careful here to be sure that if props.collection changes, we don't change the number of
  // hooks executed internally here, so we're directly using useConnection for both cases, and then filtering on
  // collection afterward
  const [loaded, { associations, fetchFailure }] =
    props.collection === "seeds"
      ? useConnection(seedingsConnection, props)
      : useConnection(treeSpeciesConnection, props);

  const filteredAssociations = useMemo(() => {
    if (!loaded) return undefined;
    if (props.collection === "seeds") return associations as T[];

    return ((associations as { collection?: string }[]) ?? []).filter(
      ({ collection }) => collection === props.collection
    ) as T[];
  }, [associations, loaded, props.collection]);

  return loaded ? [true, { associations: filteredAssociations, fetchFailure }] : [false, {}];
};
