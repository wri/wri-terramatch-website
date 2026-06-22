import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { connectionHook, connectionSelector } from "@/connections/util/connectionShortcuts";
import {
  entityAssociationIndex,
  EntityAssociationIndexPathParams,
  EntityAssociationIndexQueryParams,
  EntityAssociationIndexVariables
} from "@/generated/v3/entityService/entityServiceComponents";
import {
  DisturbanceDto,
  InvasiveDto,
  MediaDto,
  SeedingDto,
  TrackingDto,
  TreeSpeciesDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { getStableIndexPath } from "@/generated/v3/utils";
import { useConnection } from "@/hooks/useConnection";
import { useStableProps } from "@/hooks/useStableProps";
import { useValueChanged } from "@/hooks/useValueChanged";
import ApiSlice from "@/store/apiSlice";
import { Connected, Connection, Filter, PaginatedConnectionProps } from "@/types/connection";
import Log from "@/utils/log";
import { valueWiseEqual } from "@/utils/valueWiseEqual";

import {
  EnabledProp,
  FilterProp,
  IndexConnection,
  LoadFailureConnection,
  RefetchConnection,
  v3Resource
} from "./util/apiConnectionFactory";

export type EntityAssociationDtoType =
  | TrackingDto
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
  domain?: string;
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

      const matches = ((associations as { collection?: string; type?: string; domain?: string }[]) ?? []).filter(
        ({ collection, type, domain }) =>
          valueWiseEqual(
            { domain, type, collection },
            { domain: props.domain, type: props.type, collection: props.collection }
          )
      );
      if (matches.length > 1) {
        Log.error("Expecting to find only one collection / type match, but found many", { props, matches });
      }

      return matches[0] as T | undefined;
    }, [associations, loaded, props]);

    return loaded ? [true, { data, loadFailure }] : [false, {}];
  };

const trackingConnection = createAssociationIndexConnection<TrackingDto>("trackings");
const mediaConnection = createAssociationIndexConnection<MediaDto>("media");

/** Returns the one tracking that matches the given type / collection on the given entity */
export const useTracking = collectionTypeHook(trackingConnection);
/** Returns all trackings for the given entity */
export const useTrackings = connectionHook(trackingConnection);
export const selectTrackings = connectionSelector(trackingConnection);
/** Returns the one media that matches the given type / collection on the given entity */
export const useMedia = collectionTypeHook(mediaConnection);
/** Returns all media for the given entity */
export const useMedias = connectionHook(mediaConnection);

const ALL_MEDIAS_PAGE_SIZE = 100;

type EntityMediasConnectionState = IndexConnection<MediaDto> & LoadFailureConnection & RefetchConnection;

export type EntityMediasConnectionProps = Omit<EntityAssociationIndexConnectionProps, "pageNumber" | "pageSize">;

/**
 * Loads all pages of entity media (not just the first page). Use this when the full media list is
 * needed, e.g. rendering all geotagged photos on a map.
 */
export const useAllMedias = (
  props: EntityMediasConnectionProps
): Connected<EntityMediasConnectionState> | readonly [false, Partial<EntityMediasConnectionState>] => {
  const stableProps = useStableProps(props);
  const [pageNumber, setPageNumber] = useState(1);
  const [pagesByNumber, setPagesByNumber] = useState<Record<number, MediaDto[]>>({});
  const advancedFromPageRef = useRef<number | null>(null);

  const resetPagination = useCallback(() => {
    setPageNumber(1);
    setPagesByNumber({});
    advancedFromPageRef.current = null;
  }, []);

  const [pageLoaded, { data: pageData, indexTotal, refetch: connectionRefetch, loadFailure }] = useConnection(
    mediaConnection,
    {
      ...stableProps,
      pageNumber,
      pageSize: ALL_MEDIAS_PAGE_SIZE
    }
  );

  useValueChanged(stableProps, resetPagination);

  useEffect(() => {
    if (pageData == null) return;
    setPagesByNumber(current => (pageNumber === 1 ? { 1: pageData } : { ...current, [pageNumber]: pageData }));
  }, [pageData, pageNumber]);

  useEffect(() => {
    if (!pageLoaded || indexTotal == null || pageData == null) return;

    const maxPage = Math.ceil(indexTotal / ALL_MEDIAS_PAGE_SIZE);
    if (pageNumber >= maxPage || advancedFromPageRef.current === pageNumber) return;

    advancedFromPageRef.current = pageNumber;
    setPageNumber(currentPage => currentPage + 1);
  }, [pageLoaded, indexTotal, pageNumber, pageData]);

  const refetch = useCallback(() => {
    resetPagination();
    connectionRefetch?.();
  }, [connectionRefetch, resetPagination]);

  const data = useMemo(
    () =>
      Object.keys(pagesByNumber)
        .map(Number)
        .sort((a, b) => a - b)
        .flatMap(page => pagesByNumber[page] ?? []),
    [pagesByNumber]
  );

  const result = { data, refetch, indexTotal, loadFailure };

  if (indexTotal == null || !pageLoaded) {
    return data.length > 0 ? [false, result] : [false, {}];
  }
  if (pageNumber === 1 && indexTotal === 0) return [true, result];

  const allPagesLoaded = pageNumber === Math.ceil(indexTotal / ALL_MEDIAS_PAGE_SIZE);
  return allPagesLoaded ? [true, result] : data.length > 0 ? [false, result] : [false, {}];
};

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
