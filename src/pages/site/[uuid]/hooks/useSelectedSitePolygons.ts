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
  isEditPolygonOpen: boolean;
  editPolygonUuid: string | null;
};

export const useSelectedSitePolygons = ({
  polygonsData,
  selectedRowIds,
  selectedRows,
  overlapPolygons,
  isEditPolygonOpen,
  editPolygonUuid
}: UseSelectedSitePolygonsParams) => {
  const selectedPolygonUuids = useMemo(() => Array.from(selectedRowIds, id => String(id)), [selectedRowIds]);

  const editDrawerPolygonUuid = useMemo(() => {
    if (!isEditPolygonOpen || editPolygonUuid == null || editPolygonUuid === "") {
      return null;
    }
    const drawerPolygon = polygonsData.find(
      polygon => polygon.polygonUuid === editPolygonUuid || polygon.uuid === editPolygonUuid
    );
    return drawerPolygon?.polygonUuid ?? drawerPolygon?.uuid ?? null;
  }, [isEditPolygonOpen, editPolygonUuid, polygonsData]);

  const overlapPolygonsForMap = useMemo(() => {
    const overlapMapPolygonUuids = new Set(selectedPolygonUuids);
    if (editDrawerPolygonUuid != null) {
      overlapMapPolygonUuids.add(editDrawerPolygonUuid);
    }
    if (overlapMapPolygonUuids.size === 0) {
      return [];
    }

    return overlapPolygons.filter(point => overlapMapPolygonUuids.has(point.polygonUuid));
  }, [overlapPolygons, selectedPolygonUuids, editDrawerPolygonUuid]);

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
