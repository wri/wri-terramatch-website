import { createSelector } from "reselect";

import { boundingBoxGet } from "@/generated/v3/researchService/researchServiceComponents";
import { BoundingBoxDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { boundingBoxGetFetchFailed } from "@/generated/v3/researchService/researchServiceSelectors";
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
  landscapes?: string[];
  country?: string;
  projectPitchUuid?: string;
};

const getBoundingBoxKey = (props: BoundingBoxProps): string => {
  const { polygonUuid, siteUuid, projectUuid, country, landscapes, projectPitchUuid } = props;
  return [polygonUuid, siteUuid, projectUuid, projectPitchUuid, country, landscapes?.join(",")]
    .filter(Boolean)
    .join(",");
};

const boundingBoxSelector = (props: BoundingBoxProps) => (store: ApiDataStore) => {
  const key = getBoundingBoxKey(props);
  return key == null ? undefined : store.boundingBoxes?.[key];
};

const boundingBoxLoadFailed = (props: BoundingBoxProps) => (store: ApiDataStore) => {
  if (!hasValidParams(props)) return false;
  return boundingBoxGetFetchFailed({ queryParams: getQueryParams(props) })(store) != null;
};

const hasValidParams = ({
  polygonUuid,
  siteUuid,
  projectUuid,
  landscapes,
  country,
  projectPitchUuid
}: BoundingBoxProps): boolean =>
  (polygonUuid != null && polygonUuid !== "") ||
  (siteUuid != null && siteUuid !== "") ||
  (projectUuid != null && projectUuid !== "") ||
  (projectPitchUuid != null && projectPitchUuid !== "") ||
  (landscapes?.length ?? 0) > 0 ||
  (country != null && country !== "");

const getQueryParams = (props: BoundingBoxProps) => {
  const { polygonUuid, siteUuid, projectUuid, landscapes, country, projectPitchUuid } = props;

  return {
    polygonUuid,
    siteUuid,
    projectUuid,
    projectPitchUuid,
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
