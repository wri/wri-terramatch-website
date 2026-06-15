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
  return normalizeBoundingBoxDto(bbox) ?? undefined;
};

export type MapExtentEntityType = "sites" | "projects";

export type ResolveMapExtentBboxParams = {
  entityType: MapExtentEntityType;
  hasPolygons: boolean;
  modelBbox?: BBox | null;
  projectBbox?: BBox | null;
  projectUuid?: string | null;
  countryBbox?: BBox | null;
};

export const resolveMapExtentBbox = ({
  entityType,
  hasPolygons,
  modelBbox,
  projectBbox,
  projectUuid,
  countryBbox
}: ResolveMapExtentBboxParams): BBox | undefined => {
  if (hasPolygons) {
    return modelBbox ?? undefined;
  }

  if (modelBbox != null) {
    return modelBbox;
  }

  if (entityType === "sites") {
    if (projectBbox != null) {
      return projectBbox;
    }
    if (projectUuid != null && projectUuid !== "") {
      return undefined;
    }
  }

  return countryBbox ?? undefined;
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

const LARGE_EXTENT_LNG_SPAN_DEG = 15;
const LARGE_EXTENT_LAT_SPAN_DEG = 15;

export const isLargeExtentBbox = (bbox: BBox | undefined | null): boolean => {
  if (bbox == null || bbox.length < 4) {
    return false;
  }

  const [west, south, east, north] = bbox;
  const lngSpan = east - west;
  const latSpan = north - south;

  return lngSpan > LARGE_EXTENT_LNG_SPAN_DEG || latSpan > LARGE_EXTENT_LAT_SPAN_DEG;
};
