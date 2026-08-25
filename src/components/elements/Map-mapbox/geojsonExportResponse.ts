import { GeoJsonExportDto } from "@/generated/v3/researchService/researchServiceSchemas";

export type GeoJsonExportApiResponse = GeoJsonExportDto | { data?: { attributes?: GeoJsonExportDto } } | undefined;

const isFeatureCollection = (value: unknown): value is GeoJSON.FeatureCollection =>
  value != null &&
  typeof value === "object" &&
  "type" in value &&
  (value as GeoJSON.FeatureCollection).type === "FeatureCollection" &&
  Array.isArray((value as GeoJSON.FeatureCollection).features);

export const extractGeoJsonFromResponse = (
  response: GeoJsonExportApiResponse
): GeoJSON.FeatureCollection | undefined => {
  if (response == null) return undefined;
  if (isFeatureCollection(response)) return response;
  if ("data" in response && isFeatureCollection(response.data?.attributes)) {
    return response.data.attributes;
  }
  return undefined;
};

export const isValidGeoJsonFeatureCollection = (data: unknown): data is GeoJSON.FeatureCollection =>
  isFeatureCollection(data);
