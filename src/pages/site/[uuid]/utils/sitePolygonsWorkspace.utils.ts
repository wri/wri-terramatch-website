import type { OverlapPolygonPoint } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import type { PolygonTableRow } from "../components/PolygonTableRow";
import { mapSitePolygonToTableRow } from "../components/polygonTableRow.utils";

/** Table page polygons plus any overlap polygons that aren't on the current page, so they can be selected. */
export const mergeSelectionPolygons = (
  tablePolygons: SitePolygonLightDto[],
  overlapPolygons: SitePolygonLightDto[]
): SitePolygonLightDto[] => {
  if (overlapPolygons.length === 0) {
    return tablePolygons;
  }
  const byId = new Map<string, SitePolygonLightDto>();
  for (const polygon of tablePolygons) {
    byId.set(polygon.polygonUuid ?? polygon.uuid, polygon);
  }
  for (const polygon of overlapPolygons) {
    const id = polygon.polygonUuid ?? polygon.uuid;
    if (!byId.has(id)) {
      byId.set(id, polygon);
    }
  }
  return Array.from(byId.values());
};

/** Table rows plus rows for overlap polygons that aren't on the current page. */
export const mergeSelectionTableRows = (
  tableRows: PolygonTableRow[],
  overlapPolygons: SitePolygonLightDto[],
  t: (key: string) => string
): PolygonTableRow[] => {
  if (overlapPolygons.length === 0) {
    return tableRows;
  }
  const rowsById = new Map<string, PolygonTableRow>();
  for (const row of tableRows) {
    rowsById.set(String(row.id), row);
  }
  for (const polygon of overlapPolygons) {
    const id = polygon.polygonUuid ?? polygon.uuid;
    if (id === "" || rowsById.has(id)) {
      continue;
    }
    rowsById.set(id, mapSitePolygonToTableRow(polygon, t));
  }
  return Array.from(rowsById.values());
};

/**
 * Overlap and disturbance markers for the map, one per polygon, with tooltips joined when a polygon has both.
 * The polygon open in the edit drawer gets no overlap marker.
 */
export const mergeMapAlertPolygons = (
  overlapPolygons: OverlapPolygonPoint[],
  disturbancePolygons: OverlapPolygonPoint[],
  editDrawerPolygonUuid: string | null
): OverlapPolygonPoint[] => {
  const byUuid = new Map<string, OverlapPolygonPoint>();

  for (const point of overlapPolygons) {
    if (point.polygonUuid === editDrawerPolygonUuid) {
      continue;
    }
    byUuid.set(point.polygonUuid, point);
  }

  for (const point of disturbancePolygons) {
    const existing = byUuid.get(point.polygonUuid);
    if (existing == null) {
      byUuid.set(point.polygonUuid, point);
      continue;
    }

    const tooltips = [existing.tooltip, point.tooltip].filter(
      (tooltip): tooltip is string => tooltip != null && tooltip !== ""
    );
    byUuid.set(point.polygonUuid, {
      ...existing,
      tooltip: tooltips.length > 0 ? tooltips.join(" · ") : undefined
    });
  }

  return Array.from(byUuid.values());
};
