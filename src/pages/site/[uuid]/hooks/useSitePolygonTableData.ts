import { useMemo } from "react";

import { SitePolygonLightDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { mapValidationDtoToTagState } from "../components/Modals/validationCriteria";
import { PolygonTableRow } from "../components/PolygonTableRow";
import { mapSitePolygonToTableRow } from "../components/polygonTableRow.utils";

type UseSitePolygonTableDataParams = {
  polygonsData: SitePolygonLightDto[];
  polygonValidations: Map<string, ValidationDto>;
  t: (key: string, params?: Record<string, unknown>) => string;
};

export const useSitePolygonTableData = ({ polygonsData, polygonValidations, t }: UseSitePolygonTableDataParams) => {
  const polygonRows = useMemo<PolygonTableRow[]>(
    () =>
      polygonsData.map(polygon => {
        const row = mapSitePolygonToTableRow(polygon, t);
        const polygonUuid = polygon.polygonUuid ?? polygon.uuid;
        const validationFromDto =
          polygonUuid != null ? mapValidationDtoToTagState(polygonValidations.get(polygonUuid)) : null;

        return validationFromDto != null ? { ...row, validation: validationFromDto } : row;
      }),
    [polygonsData, polygonValidations, t]
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
      { key: "polygonName", label: t("Polygon Name"), sortable: true, width: "17.75rem" },
      { key: "submission", label: t("Submission"), sortable: true, width: "15.875rem" },
      { key: "validation", label: t("Validation"), sortable: true, width: "12.75rem" },
      { key: "restorationPracticeSort", label: t("Restoration Practice"), sortable: true, width: "15.5rem" },
      { key: "targetLandUseSort", label: t("Target Land Use"), sortable: true, width: "16.75rem" },
      { key: "treeDistributionSort", label: t("Tree Distribution"), sortable: true, width: "15.875rem" },
      { key: "plantingDate", label: t("Planting Start Date"), sortable: true, width: "12.5rem" },
      { key: "treesPlanted", label: t("Trees Planted"), sortable: true, width: "12.75rem" },
      { key: "area", label: t("Area (ha)"), sortable: true, width: "15.75rem" },
      { key: "source", label: t("Source"), sortable: true, width: "12rem" }
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
