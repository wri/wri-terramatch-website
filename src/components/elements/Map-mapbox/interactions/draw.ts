import MapboxDraw from "@mapbox/mapbox-gl-draw";
import bbox from "@turf/bbox";
import { Map as MapboxMap } from "mapbox-gl";

import { loadPolygonGeoJson, loadProjectPolygonsGeoJson } from "@/connections/GeoJsonExport";
import { updateProjectPolygonResource } from "@/connections/ProjectPolygons";
import { GeoJsonExportDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

import { zoomToBbox } from "../adapters/camera";
import { convertToAcceptedGEOJSON } from "../adapters/geojson";
import { BBox } from "../GeoJSON";
import { applyMapDrawStatusStyles, getPolygonStatusColor, PolygonDrawStatus } from "../mapStyle";

/** Shape of a polygon version record as returned by the versions API. */
export type PolygonVersion = {
  polygonUuid?: string | null;
  isActive?: boolean;
  status?: string;
};

const extractGeoJsonFromResponse = (
  response: GeoJsonExportDto | { data?: { attributes?: GeoJsonExportDto } } | undefined
): GeoJSON.FeatureCollection | undefined => {
  if (response == null) return undefined;
  if ("type" in response && (response as { type: unknown }).type === "FeatureCollection")
    return response as unknown as GeoJSON.FeatureCollection;
  if ("data" in response) {
    const nested = (response as { data?: { attributes?: { type?: string } } }).data?.attributes;
    if (nested?.type === "FeatureCollection") return nested as unknown as GeoJSON.FeatureCollection;
  }
  return undefined;
};

export const startDrawing = (draw: MapboxDraw, map: MapboxMap): void => {
  draw.changeMode("draw_polygon");
  map.getCanvas().style.cursor = "crosshair";
};

export const stopDrawing = (draw: MapboxDraw, map: MapboxMap): void => {
  draw.changeMode("simple_select");
  map.getCanvas().style.cursor = "auto";
};

export const addGeojsonToDraw = (
  geojson: GeoJSON.FeatureCollection | GeoJSON.Feature | GeoJSON.Geometry,
  uuid: string,
  cb: (uuid: string) => void,
  currentDraw: MapboxDraw,
  map?: MapboxMap,
  polygonStatus?: PolygonDrawStatus
): void => {
  if (geojson == null) return;

  const geojsonFormatted = convertToAcceptedGEOJSON(geojson);
  if (currentDraw == null) return;

  currentDraw.add(geojsonFormatted);
  const currentDrawFeatures = currentDraw.getAll();
  currentDraw.set(currentDrawFeatures);
  const featureId = currentDrawFeatures.features[0].id;
  currentDraw.changeMode("direct_select", { featureId: featureId as string });

  if (map != null) {
    applyMapDrawStatusStyles(map, polygonStatus);
    zoomToBbox(bbox(geojsonFormatted) as BBox, map, false);
  }

  cb(uuid);
};

export const drawTemporaryPolygon = (
  geojson: GeoJSON.FeatureCollection | GeoJSON.Feature | GeoJSON.Geometry,
  cb: (polygonUuid: string) => void,
  map: MapboxMap,
  polygonVersion?: PolygonVersion
): void => {
  if (geojson == null) return;

  const geojsonFormatted = convertToAcceptedGEOJSON(geojson);
  if (polygonVersion?.polygonUuid != null && polygonVersion?.isActive !== true) {
    map.addSource("temp-polygon-source", { type: "geojson", data: geojsonFormatted });
    map.addLayer({
      id: "temp-polygon-source",
      type: "fill",
      source: "temp-polygon-source",
      layout: {},
      paint: { "fill-color": getPolygonStatusColor(polygonVersion?.status), "fill-opacity": 0 }
    });
    map.addLayer({
      id: "temp-polygon-source-line",
      type: "line",
      source: "temp-polygon-source",
      layout: {},
      paint: {
        "line-color": getPolygonStatusColor(polygonVersion?.status),
        "line-width": 2,
        "line-dasharray": [4, 2]
      }
    });
  }
  zoomToBbox(bbox(geojsonFormatted) as BBox, map, false);
  cb(polygonVersion?.polygonUuid ?? "");
};

export async function fetchPolygonGeometry(
  polygonUuid: string,
  geometryOnly: boolean = true,
  projectPitchUuid?: string
): Promise<GeoJSON.Geometry | null> {
  if (polygonUuid == null || polygonUuid === "") {
    Log.error("fetchPolygonGeometry called with undefined or empty polygonUuid");
    throw new Error("polygonUuid is required");
  }

  try {
    let result;
    if (projectPitchUuid != null) {
      result = await loadProjectPolygonsGeoJson({ projectPitchUuid, enabled: true });
    } else {
      result = await loadPolygonGeoJson({ uuid: polygonUuid, geometryOnly, includeExtendedData: false, enabled: true });
    }

    const geojson = extractGeoJsonFromResponse(result.data);
    if (geojson == null || geojson.features == null || geojson.features.length === 0) {
      Log.warn("No geometry found in GeoJSON response for polygon:", polygonUuid);
      return null;
    }
    return geojson.features[0].geometry;
  } catch (error) {
    Log.error("Failed to fetch polygon geometry:", error);
    throw error;
  }
}

export async function updatePolygonProjectGeometry(
  geojson: GeoJSON.Feature[],
  polygonUuid: string,
  refetch?: (() => void) | (() => Promise<void>) | (() => unknown)
): Promise<void> {
  if (geojson == null || geojson.length === 0 || polygonUuid == null || polygonUuid === "") return;

  const geometries = [
    {
      type: "FeatureCollection",
      features: geojson.map(feature => ({ type: "Feature", geometry: feature.geometry, properties: {} })) as any
    }
  ];

  await updateProjectPolygonResource(polygonUuid, { geometries });
  if (refetch != null) {
    const refetchResult = refetch();
    if (refetchResult instanceof Promise) await refetchResult;
  }
}
