import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

export function computeBBoxFromCentroids(
  selectedUuids: string[],
  sitePolygonData: SitePolygonLightDto[] | undefined
): BBox | null {
  if (sitePolygonData == null || sitePolygonData.length === 0) return null;

  const selectedSet = new Set(selectedUuids);
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  let count = 0;

  for (const polygon of sitePolygonData) {
    const uuid = polygon.polygonUuid ?? polygon.uuid;
    if (uuid == null || !selectedSet.has(uuid)) continue;
    const lng = polygon.long;
    const lat = polygon.lat;
    if (lng == null || lat == null || isNaN(lng) || isNaN(lat)) continue;

    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    count++;
  }

  if (count === 0) return null;

  if (minLng === maxLng && minLat === maxLat) {
    const BUFFER = 0.005;
    return [minLng - BUFFER, minLat - BUFFER, maxLng + BUFFER, maxLat + BUFFER] as BBox;
  }

  const lngPad = (maxLng - minLng) * 0.1;
  const latPad = (maxLat - minLat) * 0.1;
  return [minLng - lngPad, minLat - latPad, maxLng + lngPad, maxLat + latPad] as BBox;
}

type ResolveMapExtentBboxParams = {
  selectedPolygonUuids?: string[];
  polygons: SitePolygonLightDto[];
  siteBbox?: BBox;
  projectBbox?: BBox;
  countryBbox?: BBox;
};

export function resolveMapExtentBbox({
  selectedPolygonUuids,
  polygons,
  siteBbox,
  projectBbox,
  countryBbox
}: ResolveMapExtentBboxParams): BBox | undefined {
  const selected = selectedPolygonUuids ?? [];
  if (selected.length > 0) {
    const selectionBbox = computeBBoxFromCentroids(selected, polygons);
    if (selectionBbox != null) {
      return selectionBbox;
    }
  }

  if (siteBbox != null) {
    return siteBbox;
  }
  if (projectBbox != null) {
    return projectBbox;
  }

  return countryBbox;
}
