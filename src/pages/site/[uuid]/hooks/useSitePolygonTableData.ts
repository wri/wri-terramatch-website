import { useMemo } from "react";

import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import {
  mapSitePolygonStatusToMappedTagState,
  mapSiteValidationStatusToTagState
} from "@/utils/mapStatusToTagStateEntity";

import {
  formatDistributionValue,
  isRestorationStrategy,
  isTargetLandUseType
} from "../components/polygonTable.constants";
import { PolygonTableRow } from "../components/PolygonTableRow";

type UseSitePolygonTableDataParams = {
  polygonsData: SitePolygonLightDto[];
  t: (key: string, params?: Record<string, unknown>) => string;
};

export const useSitePolygonTableData = ({ polygonsData, t }: UseSitePolygonTableDataParams) => {
  const polygonRows = useMemo<PolygonTableRow[]>(
    () =>
      polygonsData.map(polygon => ({
        id: polygon.polygonUuid ?? polygon.uuid,
        polygonName: polygon.name ?? t("Unnamed Polygon"),
        submission: mapSitePolygonStatusToMappedTagState(polygon.status),
        validation: mapSiteValidationStatusToTagState(polygon.validationStatus),
        restorationPractice: (polygon.practice ?? []).filter(isRestorationStrategy),
        targetLandUse: polygon.targetSys != null && isTargetLandUseType(polygon.targetSys) ? polygon.targetSys : null,
        plantingDate: polygon.plantStart != null && polygon.plantStart !== "" ? polygon.plantStart.split("T")[0] : "-",
        treeDistribution: (polygon.distr ?? []).map(formatDistributionValue),
        treesPlanted: polygon.numTrees ?? 0,
        area: polygon.calcArea ?? 0
      })),
    [polygonsData, t]
  );

  const { totalTreesPlanted, totalRestorationAreaHa } = useMemo(() => {
    let trees = 0;
    let area = 0;
    for (const polygon of polygonsData) {
      trees += polygon.numTrees ?? 0;
      area += polygon.calcArea ?? 0;
    }
    return {
      totalTreesPlanted: trees,
      totalRestorationAreaHa: Math.round(area * 100) / 100
    };
  }, [polygonsData]);

  const columns = useMemo(
    () => [
      { key: "polygonName", label: t("Polygon Name"), sortable: true },
      { key: "submission", label: t("Submission"), sortable: true },
      { key: "validation", label: t("Validation"), sortable: true },
      { key: "restorationPractice", label: t("Restoration Practice") },
      { key: "targetLandUse", label: t("Target Land Use"), sortable: true },
      { key: "plantingDate", label: t("Planting Date"), sortable: true },
      { key: "treeDistribution", label: t("Tree Distribution"), sortable: true },
      { key: "treesPlanted", label: t("Trees Planted"), sortable: true },
      { key: "area", label: t("Area (ha)"), sortable: true }
    ],
    [t]
  );

  return {
    polygonRows,
    columns,
    totalTreesPlanted,
    totalRestorationAreaHa
  };
};
