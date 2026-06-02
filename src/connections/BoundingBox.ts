import { isEmpty } from "lodash";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { clearPolygonSelectionZoomBboxCache } from "@/components/elements/Map-mapbox/polygonSelectionZoomBboxCache";
import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionLoader } from "@/connections/util/connectionShortcuts";
import { boundingBoxGet, BoundingBoxGetQueryParams } from "@/generated/v3/researchService/researchServiceComponents";
import { BoundingBoxDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import ApiSlice from "@/store/apiSlice";

const hasValidParams = ({
  polygonUuid,
  polygonUuids,
  siteUuid,
  projectUuid,
  landscapes,
  country,
  projectPitchUuid
}: BoundingBoxGetQueryParams = {}): boolean =>
  !isEmpty(polygonUuid) ||
  !isEmpty(polygonUuids) ||
  !isEmpty(siteUuid) ||
  !isEmpty(projectUuid) ||
  !isEmpty(landscapes) ||
  !isEmpty(country) ||
  !isEmpty(projectPitchUuid);

const boundingBoxConnection = v3Resource("boundingBoxes", boundingBoxGet)
  .singleByFilter<BoundingBoxDto, BoundingBoxGetQueryParams>()
  .enabledProp()
  .buildConnection();

export const pruneBoundingBoxesCache = (): void => {
  ApiSlice.pruneCache("boundingBoxes");
  ApiSlice.pruneIndex("boundingBoxes", "");
  clearPolygonSelectionZoomBboxCache();
};

export const loadBoundingBox = connectionLoader(boundingBoxConnection);

export const useBoundingBox = (filter: BoundingBoxGetQueryParams) => {
  const result = useConnection(boundingBoxConnection, { filter, enabled: hasValidParams(filter) });
  const { bbox } = result[1].data ?? {};
  return bbox as BBox | undefined;
};

export const normalizeBoundingBoxDto = (bbox: number[] | undefined): BBox | null => {
  if (bbox == null || bbox.length < 4) {
    return null;
  }

  const [west, south, east, north] = bbox;
  if (![west, south, east, north].every(value => typeof value === "number" && Number.isFinite(value))) {
    return null;
  }

  return [west, south, east, north];
};
