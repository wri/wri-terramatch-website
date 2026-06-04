import { useMemo } from "react";

import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { PolygonTableRow } from "../components/PolygonTableRow";
import { mapSitePolygonToTableRow } from "../components/polygonTableRow.utils";

type UseSitePolygonTableDataParams = {
  polygonsData: SitePolygonLightDto[];
  t: (key: string, params?: Record<string, unknown>) => string;
};

export const useSitePolygonTableData = ({ polygonsData, t }: UseSitePolygonTableDataParams) => {
  const polygonRows = useMemo<PolygonTableRow[]>(
    () => polygonsData.map(polygon => mapSitePolygonToTableRow(polygon, t)),
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
      { key: "restorationPracticeSort", label: t("Restoration Practice"), sortable: true },
      { key: "targetLandUseSort", label: t("Target Land Use"), sortable: true },
      { key: "treeDistribution", label: t("Tree Distribution"), sortable: true },
      { key: "plantingDate", label: t("Planting Start Date"), sortable: true },
      { key: "treesPlanted", label: t("Trees Planted"), sortable: true },
      { key: "area", label: t("Area (ha)"), sortable: true },
      { key: "source", label: t("Source"), sortable: true }
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
