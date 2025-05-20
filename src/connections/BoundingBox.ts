import { createSelector } from "reselect";

import { boundingBoxGet } from "@/generated/v3/entityService/entityServiceComponents";
import { BoundingBoxDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { boundingBoxGetFetchFailed } from "@/generated/v3/entityService/entityServiceSelectors";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

type BoundingBoxConnection = {
  bbox?: BoundingBoxDto["bbox"];
  boundingBoxFailed: boolean;
};

type BoundingBoxProps = {
  polygonUuid?: string;
  siteUuid?: string;
  projectUuid?: string;
  projectUuids?: string[];
  landscapes?: string[];
  country?: string;
};

// Create a unique key for caching based on the query parameters
const getBoundingBoxKey = (props: BoundingBoxProps): string => {
  const { polygonUuid, siteUuid, projectUuid, projectUuids, landscapes, country } = props;

  return [polygonUuid, siteUuid, projectUuid, projectUuids?.join(","), landscapes?.join(","), country]
    .filter(Boolean)
    .join("|");
};

const boundingBoxSelector = (props: BoundingBoxProps) => (store: ApiDataStore) => {
  const key = getBoundingBoxKey(props);
  return key ? store.boundingBoxes?.[key] : undefined;
};

const boundingBoxLoadFailed = (props: BoundingBoxProps) => (store: ApiDataStore) => {
  if (!hasValidParams(props)) return false;
  return boundingBoxGetFetchFailed({ queryParams: getQueryParams(props) })(store) != null;
};

// Check if at least one valid parameter is provided
const hasValidParams = (props: BoundingBoxProps): boolean => {
  return !!(
    props.polygonUuid ||
    props.siteUuid ||
    props.projectUuid ||
    (props.projectUuids && props.projectUuids.length > 0) ||
    (props.landscapes && props.landscapes.length > 0) ||
    props.country
  );
};

// Convert props to query parameters for the API call
const getQueryParams = (props: BoundingBoxProps) => {
  const { polygonUuid, siteUuid, projectUuid, projectUuids, landscapes, country } = props;

  return {
    polygonUuid,
    siteUuid,
    projectUuid,
    projectUuids,
    landscapes,
    country
  };
};

const connectionIsLoaded = ({ bbox, boundingBoxFailed }: BoundingBoxConnection, props: BoundingBoxProps) =>
  !hasValidParams(props) || bbox !== undefined || boundingBoxFailed;

const boundingBoxConnection: Connection<BoundingBoxConnection, BoundingBoxProps> = {
  load: (connection, props) => {
    if (!connectionIsLoaded(connection, props) && hasValidParams(props)) {
      boundingBoxGet({ queryParams: getQueryParams(props) });
    }
  },

  isLoaded: connectionIsLoaded,

  selector: selectorCache(getBoundingBoxKey, props =>
    createSelector([boundingBoxSelector(props), boundingBoxLoadFailed(props)], (boundingBoxData, boundingBoxFailed) => {
      const bbox = boundingBoxData?.attributes?.bbox;
      return { bbox, boundingBoxFailed };
    })
  )
};

export const useBoundingBox = connectionHook(boundingBoxConnection);
