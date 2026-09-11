export * from "./adapters/geojson";
export * from "./adapters/geoserver";
export * from "./adapters/camera";
export * from "./layers/polygonLayers";
export * from "./layers/overlayLayers";
export * from "./layers/mediaSymbolLayer";
export * from "./layers/mediaMarkers";
export * from "./interactions/draw";
export * from "./interactions/popups";
export * from "./interactions/popupCoordinator";
export * from "./services/polygonService";

import {
  loadPolygonGeoJson,
  loadProjectPolygonsGeoJson,
  loadProjectSitePolygonsGeoJson,
  loadSitePolygonsGeoJson,
  POLYGON_GEOJSON_DOWNLOAD_QUERY_PARAMS,
  PolygonGeoJsonDownloadQueryParams
} from "@/connections/GeoJsonExport";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

import {
  extractGeoJsonFromResponse,
  GeoJsonExportApiResponse,
  isValidGeoJsonFeatureCollection
} from "./geojsonExportResponse";

export { extractGeoJsonFromResponse, isValidGeoJsonFeatureCollection };
export type { GeoJsonExportApiResponse };

export const formatPlannedStartDate = (plantStartDate: Date | null | undefined): string => {
  return plantStartDate != null
    ? plantStartDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC"
      })
    : "Unknown";
};

export const formatCommentaryDate = (date: Date | null | undefined): string => {
  return date != null
    ? date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
        hour: "numeric",
        minute: "numeric"
      })
    : "Unknown";
};

export const formatFileName = (inputString: string): string => {
  return inputString.toLowerCase().replace(/\s+/g, "_");
};

export function downloadGeoJsonFile(geojson: GeoJSON.FeatureCollection, filename: string): void {
  try {
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    Log.error("Failed to download GeoJSON file:", error);
    throw error;
  }
}

export async function downloadPolygonGeoJson(
  polygonUuid: string,
  filename?: string,
  options?: PolygonGeoJsonDownloadQueryParams
): Promise<void> {
  try {
    ApiSlice.pruneCache("geojsonExports", [polygonUuid]);
    const result = await loadPolygonGeoJson({
      uuid: polygonUuid,
      ...POLYGON_GEOJSON_DOWNLOAD_QUERY_PARAMS,
      ...options
    });
    const geojson = extractGeoJsonFromResponse(result.data);
    if (geojson == null) throw new Error("Failed to extract GeoJSON from response");
    downloadGeoJsonFile(geojson, formatFileName(filename ?? polygonUuid));
  } catch (error) {
    Log.error("Failed to download polygon GeoJSON:", error);
    throw error;
  }
}

export async function downloadProjectSitePolygonsGeoJson(
  projectUuid: string,
  projectName: string,
  options?: PolygonGeoJsonDownloadQueryParams
): Promise<void> {
  try {
    const result = await loadProjectSitePolygonsGeoJson({
      projectUuid,
      ...POLYGON_GEOJSON_DOWNLOAD_QUERY_PARAMS,
      ...options
    });
    const geojson = extractGeoJsonFromResponse(result.data);
    if (geojson == null) throw new Error("Failed to extract GeoJSON from response");
    downloadGeoJsonFile(geojson, formatFileName(projectName));
  } catch (error) {
    Log.error("Failed to download project site polygons GeoJSON:", error);
    throw error;
  }
}

export async function downloadSitePolygonsGeoJson(
  siteUuid: string,
  siteName: string,
  options?: PolygonGeoJsonDownloadQueryParams
): Promise<void> {
  try {
    const result = await loadSitePolygonsGeoJson({
      siteUuid,
      ...POLYGON_GEOJSON_DOWNLOAD_QUERY_PARAMS,
      ...options
    });
    const geojson = extractGeoJsonFromResponse(result.data);
    if (geojson == null) throw new Error("Failed to extract GeoJSON from response");
    downloadGeoJsonFile(geojson, formatFileName(siteName));
  } catch (error) {
    Log.error("Failed to download site polygons GeoJSON:", error);
    throw error;
  }
}

export async function fetchMultiplePolygonsGeoJson(
  polygonUuids: string[],
  options: PolygonGeoJsonDownloadQueryParams = POLYGON_GEOJSON_DOWNLOAD_QUERY_PARAMS
): Promise<GeoJSON.FeatureCollection> {
  try {
    ApiSlice.pruneCache("geojsonExports", polygonUuids);
    const results = await Promise.all(
      polygonUuids.map(uuid => loadPolygonGeoJson({ uuid, ...POLYGON_GEOJSON_DOWNLOAD_QUERY_PARAMS, ...options }))
    );
    const features: GeoJSON.Feature[] = [];
    results.forEach((result, index) => {
      const geojson = extractGeoJsonFromResponse(result.data);
      if (geojson?.features != null) {
        geojson.features.forEach(feature => {
          const properties = { ...(feature.properties ?? {}) };
          if (properties.uuid == null) {
            properties.uuid = polygonUuids[index];
          }
          features.push({ ...feature, properties });
        });
      }
    });
    return { type: "FeatureCollection", features };
  } catch (error) {
    Log.error("Failed to fetch multiple polygons GeoJSON:", error);
    throw error;
  }
}

export async function downloadMultiplePolygonsGeoJson(
  polygonUuids: string[],
  filename: string,
  options: PolygonGeoJsonDownloadQueryParams = POLYGON_GEOJSON_DOWNLOAD_QUERY_PARAMS
): Promise<void> {
  try {
    const combinedGeojson = await fetchMultiplePolygonsGeoJson(polygonUuids, options);
    if (combinedGeojson.features == null || combinedGeojson.features.length === 0) {
      throw new Error("No polygons found to download");
    }
    downloadGeoJsonFile(combinedGeojson, formatFileName(filename));
  } catch (error) {
    Log.error("Failed to download multiple polygons GeoJSON:", error);
    throw error;
  }
}

export async function downloadSiteGeoJsonPolygons(siteUuid: string, siteName: string): Promise<void> {
  await downloadSitePolygonsGeoJson(siteUuid, siteName);
}

export async function downloadProjectPolygonsGeoJson(
  projectPitchUuid: string,
  projectName: string,
  options?: PolygonGeoJsonDownloadQueryParams
): Promise<void> {
  try {
    const result = await loadProjectPolygonsGeoJson({ projectPitchUuid, ...options });
    const geojson = extractGeoJsonFromResponse(result.data);
    if (geojson == null) throw new Error("Failed to extract GeoJSON from response");
    if (geojson.features == null || geojson.features.length === 0) throw new Error("No polygons found to download");
    downloadGeoJsonFile(geojson, `${formatFileName(projectName)}_polygons`);
  } catch (error) {
    Log.error("Failed to download project polygons GeoJSON:", error);
    throw error;
  }
}

export type ValidationRecordV3 = {
  uuid: string;
  valid: boolean;
  checked: boolean;
  nonValidCriteria: Array<{ criteria_id: number }>;
};

export function parseValidationDataV3(
  sitePolygonData: SitePolygonLightDto[] | undefined,
  currentValidationSite: ValidationRecordV3[],
  validationLabels: Record<number, string>
) {
  const validationMap = new Map<string, ValidationRecordV3>();
  currentValidationSite.forEach(validation => {
    if (validation?.uuid != null) validationMap.set(validation.uuid, validation);
  });

  return (sitePolygonData ?? []).map(site => {
    const polyUuid = site.polygonUuid ?? "";
    const validation = validationMap.get(polyUuid);
    const polygonValidation =
      validation?.nonValidCriteria?.map(c => validationLabels[c.criteria_id] ?? null).filter(v => v != null) ?? [];

    return {
      uuid: polyUuid,
      title: site.name ?? "Unnamed Polygon",
      valid: validation ? validation.valid : false,
      isChecked: validation ? validation.checked : false,
      ...(polygonValidation.length > 0 ? { polygonValidation } : {})
    };
  });
}
