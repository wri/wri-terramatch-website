import { useMemo } from "react";

import { connectionHook, connectionSelector } from "@/connections/util/connectionShortcuts";
import {
  entityAssociationIndex,
  EntityAssociationIndexPathParams,
  EntityAssociationIndexQueryParams,
  EntityAssociationIndexVariables
} from "@/generated/v3/entityService/entityServiceComponents";
import {
  DemographicDto,
  DisturbanceDto,
  InvasiveDto,
  MediaDto,
  SeedingDto,
  TreeSpeciesDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { getStableIndexPath } from "@/generated/v3/utils";
import { useConnection } from "@/hooks/useConnection";
import ApiSlice from "@/store/apiSlice";
import { Connected, Connection, Filter, PaginatedConnectionProps } from "@/types/connection";
import Log from "@/utils/log";

import {
  EnabledProp,
  FilterProp,
  IndexConnection,
  LoadFailureConnection,
  RefetchConnection,
  v3Resource
} from "./util/apiConnectionFactory";

export type EntityAssociationDtoType =
  | DemographicDto
  | TreeSpeciesDto
  | SeedingDto
  | MediaDto
  | DisturbanceDto
  | InvasiveDto;
export type SupportedEntity = EntityAssociationIndexPathParams["entity"];
export type SupportedAssociation = EntityAssociationIndexPathParams["association"];

type SideloadsProp = { sideloads?: EntityAssociationIndexQueryParams["sideloads"] };

type BaseEntityAssociationProps = {
  entity: SupportedEntity;
  uuid: string;
};

export type EntityAssociationIndexConnectionProps = BaseEntityAssociationProps &
  PaginatedConnectionProps &
  FilterProp<Filter<EntityAssociationIndexQueryParams>> &
  SideloadsProp &
  EnabledProp;

const createAssociationIndexConnection = <T extends EntityAssociationDtoType>(association: SupportedAssociation) =>
  v3Resource(association, entityAssociationIndex)
    .index<T, BaseEntityAssociationProps>(
      ({ entity, uuid }) => ({ pathParams: { entity, uuid, association } } as EntityAssociationIndexVariables)
    )
    .pagination()
    .filter<Filter<EntityAssociationIndexQueryParams>>()
    .sideloads()
    .refetch((props, variablesFactory) => {
      const variables = variablesFactory(props);
      if (variables == null) {
        Log.warn("Cannot prune cache, no variables returned from variables factory", { props });
        return;
      }

      const { stableUrl } = getStableIndexPath(entityAssociationIndex.url, variables);
      ApiSlice.pruneIndex(association, stableUrl);
    })
    .enabledProp()
    .buildConnection();

type CollectionProps = EntityAssociationIndexConnectionProps & {
  collection?: string;
};

type CollectionTypeProps = CollectionProps & {
  type?: string;
};

type FilteredEntityAssociationConnection<T extends EntityAssociationDtoType> = LoadFailureConnection & {
  data?: T;
};

/**
 * Create a hook that depends on the given connection, and filters the results based on type and/or
 * collection, returning the one member of the store that meets those criteria. Expects to find only
 * one association that matches the given collection and/or type. If more are found, an error is
 * logged and the first entry is returned.
 */
const collectionTypeHook =
  <T extends EntityAssociationDtoType>(
    connection: Connection<
      IndexConnection<T> & LoadFailureConnection & RefetchConnection,
      EntityAssociationIndexConnectionProps
    >
  ) =>
  (props: CollectionTypeProps): Connected<FilteredEntityAssociationConnection<T>> => {
    const [loaded, { data: associations, loadFailure }] = useConnection(connection, props);

    const data = useMemo(() => {
      if (!loaded) return undefined;

      const matches = ((associations as { collection?: string; type?: string }[]) ?? []).filter(
        ({ collection, type }) => collection === props.collection && type === props.type
      );
      if (matches.length > 1) {
        Log.error("Expecting to find only one collection / type match, but found many", { props, matches });
      }

      return matches[0] as T | undefined;
    }, [associations, loaded, props]);

    return loaded ? [true, { data, loadFailure }] : [false, {}];
  };

const demographicConnection = createAssociationIndexConnection<DemographicDto>("demographics");
const mediaConnection = createAssociationIndexConnection<MediaDto>("media");

/** Returns the one demographic that matches the given type / collection on the given entity */
export const useDemographic = collectionTypeHook(demographicConnection);
/** Returns all demographics for the given entity */
export const useDemographics = connectionHook(demographicConnection);
export const selectDemographics = connectionSelector(demographicConnection);
/** Returns the one media that matches the given type / collection on the given entity */
export const useMedia = collectionTypeHook(mediaConnection);
/** Returns all media for the given entity */
export const useMedias = connectionHook(mediaConnection);

const disturbanceConnection = createAssociationIndexConnection<DisturbanceDto>("disturbances");
export const useDisturbances = connectionHook(disturbanceConnection);

const invasiveConnection = createAssociationIndexConnection<InvasiveDto>("invasives");
export const useInvasives = connectionHook(invasiveConnection);

const treeSpeciesConnection = createAssociationIndexConnection<TreeSpeciesDto>("treeSpecies");
const seedingsConnection = createAssociationIndexConnection<SeedingDto>("seedings");

export type PlantDto = TreeSpeciesDto | SeedingDto;

/**
 * A single connection for fetching a type of plant data. If the collection is "seeds", the data comes from Seedings,
 * otherwise from TreeSpecies. Since these have become so similar in UI and data, it's likely that in a future
 * ticket we unify these tables.
 */
export const usePlants = <T extends PlantDto = PlantDto>(
  props: CollectionProps
): Connected<IndexConnection<T> & LoadFailureConnection> => {
  // We have to be careful here to be sure that if props.collection changes, we don't change the number of
  // hooks executed internally here, so we're directly using useConnection for both cases, and then filtering on
  // collection afterward
  const [loaded, { data: associations, loadFailure }] =
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

  return loaded ? [true, { data: filteredAssociations, loadFailure }] : [false, {}];
};
