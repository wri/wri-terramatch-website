export * from "./adapters/geojson";
export * from "./adapters/geoserver";
export * from "./adapters/camera";
export * from "./layers/polygonLayers";
export * from "./layers/overlayLayers";
export * from "./layers/mediaLayers";
export * from "./interactions/draw";
export * from "./interactions/popups";
export * from "./services/polygonService";

import {
  loadPolygonGeoJson,
  loadProjectPolygonsGeoJson,
  loadProjectSitePolygonsGeoJson,
  loadSitePolygonsGeoJson
} from "@/connections/GeoJsonExport";
import { GetSitePolygonsGeoJsonQueryParams } from "@/generated/v3/researchService/researchServiceComponents";
import { GeoJsonExportDto, SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

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

export const extractGeoJsonFromResponse = (
  response: GeoJsonExportDto | { data?: { attributes?: GeoJsonExportDto } } | undefined
): GeoJSON.FeatureCollection | undefined => {
  if (!response) return undefined;
  if ("type" in response && (response as any).type === "FeatureCollection") {
    return response as unknown as GeoJSON.FeatureCollection;
  }
  if ("data" in response && (response as any).data?.attributes) {
    const attributes = (response as any).data.attributes;
    if (attributes.type === "FeatureCollection") return attributes as unknown as GeoJSON.FeatureCollection;
  }
  return undefined;
};

export const isValidGeoJsonFeatureCollection = (data: any): data is GeoJSON.FeatureCollection => {
  return data != null && typeof data === "object" && data.type === "FeatureCollection" && Array.isArray(data.features);
};

export function downloadGeoJsonFile(geojson: GeoJSON.FeatureCollection | any, filename: string): void {
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
  options?: Omit<GetSitePolygonsGeoJsonQueryParams, "uuid" | "siteUuid">
): Promise<void> {
  try {
    const result = await loadPolygonGeoJson({ uuid: polygonUuid, ...options });
    const geojson = extractGeoJsonFromResponse(result.data);
    if (!geojson) throw new Error("Failed to extract GeoJSON from response");
    downloadGeoJsonFile(geojson, formatFileName(filename ?? polygonUuid));
  } catch (error) {
    Log.error("Failed to download polygon GeoJSON:", error);
    throw error;
  }
}

export async function downloadProjectSitePolygonsGeoJson(
  projectUuid: string,
  projectName: string,
  options?: Omit<GetSitePolygonsGeoJsonQueryParams, "uuid" | "projectUuid">
): Promise<void> {
  try {
    const result = await loadProjectSitePolygonsGeoJson({ projectUuid, ...options });
    const geojson = extractGeoJsonFromResponse(result.data);
    if (!geojson) throw new Error("Failed to extract GeoJSON from response");
    downloadGeoJsonFile(geojson, formatFileName(projectName));
  } catch (error) {
    Log.error("Failed to download project site polygons GeoJSON:", error);
    throw error;
  }
}

export async function downloadSitePolygonsGeoJson(
  siteUuid: string,
  siteName: string,
  options?: Omit<GetSitePolygonsGeoJsonQueryParams, "uuid" | "siteUuid">
): Promise<void> {
  try {
    const result = await loadSitePolygonsGeoJson({ siteUuid, ...options });
    const geojson = extractGeoJsonFromResponse(result.data);
    if (!geojson) throw new Error("Failed to extract GeoJSON from response");
    downloadGeoJsonFile(geojson, formatFileName(siteName));
  } catch (error) {
    Log.error("Failed to download site polygons GeoJSON:", error);
    throw error;
  }
}

export async function fetchMultiplePolygonsGeoJson(
  polygonUuids: string[],
  includeExtendedData: boolean = true
): Promise<GeoJSON.FeatureCollection> {
  try {
    const results = await Promise.all(polygonUuids.map(uuid => loadPolygonGeoJson({ uuid, includeExtendedData })));
    const features: GeoJSON.Feature[] = [];
    results.forEach((result, index) => {
      const geojson = extractGeoJsonFromResponse(result.data);
      if (geojson?.features) {
        geojson.features.forEach(feature => {
          if (!feature.properties) feature.properties = {};
          if (!feature.properties.uuid) feature.properties.uuid = polygonUuids[index];
          features.push(feature);
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
  includeExtendedData: boolean = true
): Promise<void> {
  try {
    const combinedGeojson = await fetchMultiplePolygonsGeoJson(polygonUuids, includeExtendedData);
    if (!combinedGeojson.features || combinedGeojson.features.length === 0) {
      throw new Error("No polygons found to download");
    }
    downloadGeoJsonFile(combinedGeojson, formatFileName(filename));
  } catch (error) {
    Log.error("Failed to download multiple polygons GeoJSON:", error);
    throw error;
  }
}

export async function downloadSiteGeoJsonPolygons(siteUuid: string, siteName: string): Promise<void> {
  await downloadSitePolygonsGeoJson(siteUuid, siteName, { includeExtendedData: true });
}

export async function downloadProjectPolygonsGeoJson(
  projectPitchUuid: string,
  projectName: string,
  options?: Omit<GetSitePolygonsGeoJsonQueryParams, "uuid" | "siteUuid" | "projectUuid">
): Promise<void> {
  try {
    const result = await loadProjectPolygonsGeoJson({ projectPitchUuid, ...options });
    const geojson = extractGeoJsonFromResponse(result.data);
    if (!geojson) throw new Error("Failed to extract GeoJSON from response");
    if (!geojson.features || geojson.features.length === 0) throw new Error("No polygons found to download");
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
