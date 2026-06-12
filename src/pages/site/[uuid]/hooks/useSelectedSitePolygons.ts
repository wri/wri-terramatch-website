import { useMemo } from "react";

import type { OverlapPolygonPoint } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { isSitePolygonSubmittable } from "@/utils/sitePolygonSubmit";

import type { PolygonTableRow } from "../components/PolygonTableRow";

type UseSelectedSitePolygonsParams = {
  polygonsData: SitePolygonLightDto[];
  selectedRowIds: Set<string | number>;
  selectedRows: PolygonTableRow[];
  overlapPolygons: OverlapPolygonPoint[];
};

export const useSelectedSitePolygons = ({
  polygonsData,
  selectedRowIds,
  selectedRows,
  overlapPolygons
}: UseSelectedSitePolygonsParams) => {
  const selectedPolygonUuids = useMemo(() => Array.from(selectedRowIds, id => String(id)), [selectedRowIds]);

  const overlapPolygonsForMap = useMemo(() => {
    if (selectedPolygonUuids.length === 0) {
      return [];
    }

    const selectedIds = new Set(selectedPolygonUuids);
    return overlapPolygons.filter(point => selectedIds.has(point.polygonUuid));
  }, [overlapPolygons, selectedPolygonUuids]);

  const selectedPolygonData = useMemo(() => {
    const sitePolygons: SitePolygonLightDto[] = [];
    const selectedSitePolygonUuids: string[] = [];
    const selectedGeometryPolygonUuids: string[] = [];
    const submittablePolygons: SitePolygonLightDto[] = [];

    for (const polygon of polygonsData) {
      const rowId = polygon.polygonUuid ?? polygon.uuid ?? "";
      if (!selectedRowIds.has(rowId)) {
        continue;
      }

      sitePolygons.push(polygon);

      if (polygon.uuid != null && polygon.uuid.length > 0) {
        selectedSitePolygonUuids.push(polygon.uuid);
      }

      if (polygon.polygonUuid != null && polygon.polygonUuid.length > 0) {
        selectedGeometryPolygonUuids.push(polygon.polygonUuid);
      }

      if (polygon.uuid != null && isSitePolygonSubmittable(polygon)) {
        submittablePolygons.push(polygon);
      }
    }

    return {
      selectedSitePolygons: sitePolygons,
      selectedSitePolygonUuids,
      selectedGeometryPolygonUuids,
      selectedSubmittablePolygons: submittablePolygons,
      selectedSubmittablePolygonUuids: submittablePolygons
        .map(polygon => polygon.uuid)
        .filter((uuid): uuid is string => uuid != null && uuid.length > 0)
    };
  }, [polygonsData, selectedRowIds]);

  const { selectedTreesPlanted, selectedRestorationAreaHa } = useMemo(
    () =>
      selectedRows.reduce(
        (acc, row) => ({
          selectedTreesPlanted: acc.selectedTreesPlanted + row.treesPlanted,
          selectedRestorationAreaHa: acc.selectedRestorationAreaHa + row.area
        }),
        { selectedTreesPlanted: 0, selectedRestorationAreaHa: 0 }
      ),
    [selectedRows]
  );

  return {
    selectedPolygonUuids,
    overlapPolygonsForMap,
    selectedTreesPlanted,
    selectedRestorationAreaRounded: Math.round(selectedRestorationAreaHa * 100) / 100,
    ...selectedPolygonData
  };
};
