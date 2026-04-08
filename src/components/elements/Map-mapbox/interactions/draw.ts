import MapboxDraw from "@mapbox/mapbox-gl-draw";
import bbox from "@turf/bbox";
import mapboxgl from "mapbox-gl";

import { loadPolygonGeoJson, loadProjectPolygonsGeoJson } from "@/connections/GeoJsonExport";
import { createProjectPolygonWithReplace, updateProjectPolygonResource } from "@/connections/ProjectPolygons";
import { createSitePolygonsResource } from "@/connections/SitePolygons";
import { CreateSitePolygonAttributesDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { GeoJsonExportDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

import { zoomToBbox } from "../adapters/camera";
import { convertToAcceptedGEOJSON } from "../adapters/geojson";
import { BBox } from "../GeoJSON";

const extractGeoJsonFromResponse = (
  response: GeoJsonExportDto | { data?: { attributes?: GeoJsonExportDto } } | undefined
): GeoJSON.FeatureCollection | undefined => {
  if (!response) return undefined;
  if ("type" in response && (response as any).type === "FeatureCollection")
    return response as unknown as GeoJSON.FeatureCollection;
  if ("data" in response && (response as any).data?.attributes?.type === "FeatureCollection")
    return (response as any).data.attributes as unknown as GeoJSON.FeatureCollection;
  return undefined;
};

export { convertToAcceptedGEOJSON } from "../adapters/geojson";
export { convertToGeoJSON } from "../adapters/geojson";

export const startDrawing = (draw: MapboxDraw, map: mapboxgl.Map): void => {
  draw.changeMode("draw_polygon");
  map.getCanvas().style.cursor = "crosshair";
};

export const stopDrawing = (draw: MapboxDraw, map: mapboxgl.Map): void => {
  draw.changeMode("simple_select");
  map.getCanvas().style.cursor = "auto";
};

export const addGeojsonToDraw = (
  geojson: any,
  uuid: string,
  cb: Function,
  currentDraw: MapboxDraw,
  map?: mapboxgl.Map
): void => {
  if (!geojson) return;

  const geojsonFormatted = convertToAcceptedGEOJSON(geojson);
  const addToDrawAndFilter = () => {
    if (!currentDraw) return;
    currentDraw.add(geojsonFormatted);
    const currentDrawFeatures = currentDraw.getAll();
    currentDraw.set(currentDrawFeatures);
    const featureId = currentDrawFeatures.features[0].id;
    currentDraw.changeMode("direct_select", { featureId: featureId as string });
    if (map) {
      zoomToBbox(bbox(geojsonFormatted) as BBox, map, false);
    }
    cb(uuid);
  };
  addToDrawAndFilter();
};

const getPolygonColor = (polygonStatus: string): string => {
  switch (polygonStatus) {
    case "draft":
      return "#E468EF";
    case "submitted":
      return "#2398d8";
    case "approved":
      return "#72d961";
    case "needs-more-information":
      return "#ff8938";
    default:
      return "#000000";
  }
};

export const drawTemporaryPolygon = (geojson: any, cb: Function, map: mapboxgl.Map, polygonVersion?: any): void => {
  if (!geojson) return;

  const geojsonFormatted = convertToAcceptedGEOJSON(geojson);
  if (polygonVersion?.poly_id && !polygonVersion?.is_active) {
    map.addSource("temp-polygon-source", { type: "geojson", data: geojsonFormatted });
    map.addLayer({
      id: "temp-polygon-source",
      type: "fill",
      source: "temp-polygon-source",
      layout: {},
      paint: { "fill-color": getPolygonColor(polygonVersion?.status), "fill-opacity": 0 }
    });
    map.addLayer({
      id: "temp-polygon-source-line",
      type: "line",
      source: "temp-polygon-source",
      layout: {},
      paint: {
        "line-color": getPolygonColor(polygonVersion?.status),
        "line-width": 2,
        "line-dasharray": [4, 2]
      }
    });
  }
  zoomToBbox(bbox(geojsonFormatted) as BBox, map, false);
  cb(polygonVersion?.poly_id as string);
};

export async function fetchPolygonGeometry(
  polygonUuid: string,
  geometryOnly: boolean = true,
  projectPitchUuid?: string
): Promise<any | null> {
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

export async function storePolygon(
  geojson: any,
  record: any,
  setPolygonFromMap?: any,
  refetchSitePolygons?: () => any
): Promise<void> {
  if (!geojson?.length) return;

  const attributes: CreateSitePolygonAttributesDto = {
    geometries: [
      {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: geojson[0].geometry,
            properties: { site_id: record.uuid }
          }
        ] as any
      }
    ]
  };

  try {
    const result = await createSitePolygonsResource(attributes);
    ApiSlice.pruneCache("boundingBoxes");
    ApiSlice.pruneIndex("boundingBoxes", "");
    if (refetchSitePolygons) await refetchSitePolygons();
    if (setPolygonFromMap) {
      setPolygonFromMap({ uuid: result.polygonUuid, isOpen: true, primary_uuid: result.primaryUuid });
    }
  } catch (error) {
    console.error("Failed to create site polygon:", error);
    throw error;
  }
}

export async function storePolygonProject(
  geojson: any,
  entityUuid: string,
  entityType: string,
  refetch: any,
  setPolygonFromMap: any
): Promise<void> {
  if (!geojson?.length) return;

  const geometries = [
    {
      type: "FeatureCollection",
      features: geojson.map((feature: any) => ({
        type: "Feature",
        geometry: feature.geometry,
        properties: { projectPitchUuid: entityUuid }
      }))
    }
  ];

  const response = await createProjectPolygonWithReplace({ geometries }, entityUuid);
  const polygonUuid = response.polygonUuid;
  if (polygonUuid) {
    refetch?.();
    setPolygonFromMap?.({
      uuid: polygonUuid,
      isOpen: true,
      entityName: "project-pitches",
      projectPitchUuid: entityUuid
    });
  }
}

export async function updatePolygonProjectGeometry(geojson: any, polygonUuid: string, refetch: any): Promise<void> {
  if (!geojson?.length || !polygonUuid) return;

  const geometries = [
    {
      type: "FeatureCollection",
      features: geojson.map((feature: any) => ({
        type: "Feature",
        geometry: feature.geometry,
        properties: {}
      }))
    }
  ];

  await updateProjectPolygonResource(polygonUuid, { geometries });
  const refetchResult = refetch?.();
  if (refetchResult && typeof refetchResult.then === "function") {
    await refetchResult;
  }
}
