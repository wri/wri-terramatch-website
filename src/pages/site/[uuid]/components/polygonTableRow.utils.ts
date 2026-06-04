import { restorationStrategyType } from "@/constants/polygons";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import {
  mapSitePolygonStatusToMappedTagState,
  mapSiteValidationStatusToTagState
} from "@/utils/mapStatusToTagStateEntity";

import { TARGET_LAND_USE_LABELS } from "./polygonFilter.constants";
import {
  formatDistributionValue,
  formatPolygonSource,
  isRestorationStrategy,
  isTargetLandUseType,
  toSortableJoinedList
} from "./polygonTable.constants";
import { PolygonTableRow } from "./PolygonTableRow";

const RESTORATION_PRACTICE_SORT_LABELS: Record<restorationStrategyType, string> = {
  "tree-planting": "Tree planting",
  "sapling-planting": "Sapling planting",
  "assisted-natural-regeneration": "Assisted natural regeneration (ANR)",
  "direct-seeding": "Direct seeding"
};

const formatPlantingDate = (plantStart: string | null | undefined): string => {
  if (plantStart == null || plantStart === "") {
    return "-";
  }
  return plantStart.split("T")[0];
};

const buildRestorationPracticeSortKey = (practices: restorationStrategyType[]): string =>
  toSortableJoinedList(practices.map(practice => RESTORATION_PRACTICE_SORT_LABELS[practice]));

const buildTreeDistributionDisplay = (distr: string[] | null | undefined): string => {
  const labels = (distr ?? []).map(formatDistributionValue);
  return labels.length > 0 ? labels.join(", ") : "—";
};

export const mapSitePolygonToTableRow = (polygon: SitePolygonLightDto, t: (key: string) => string): PolygonTableRow => {
  const restorationPractice = (polygon.practice ?? []).filter(isRestorationStrategy);
  const targetLandUse = polygon.targetSys != null && isTargetLandUseType(polygon.targetSys) ? polygon.targetSys : null;

  return {
    id: polygon.polygonUuid ?? polygon.uuid,
    polygonName: polygon.name ?? t("Unnamed Polygon"),
    submission: mapSitePolygonStatusToMappedTagState(polygon.status),
    validation: mapSiteValidationStatusToTagState(polygon.validationStatus),
    restorationPractice,
    restorationPracticeSort: buildRestorationPracticeSortKey(restorationPractice),
    targetLandUse,
    targetLandUseSort: targetLandUse != null ? TARGET_LAND_USE_LABELS[targetLandUse] : "",
    treeDistribution: buildTreeDistributionDisplay(polygon.distr),
    plantingDate: formatPlantingDate(polygon.plantStart),
    treesPlanted: polygon.numTrees ?? 0,
    area: polygon.calcArea ?? 0,
    source: formatPolygonSource(polygon.source)
  };
};
