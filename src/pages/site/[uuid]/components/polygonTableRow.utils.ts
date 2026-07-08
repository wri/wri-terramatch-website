import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { TreeDistributionType } from "@/hooks/translation/useTreeDistributionOptions";
import {
  mapSitePolygonStatusToMappedTagState,
  mapSiteValidationStatusToTagState
} from "@/utils/mapStatusToTagStateEntity";

import {
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

const TARGET_LAND_USE_SORT_LABELS: Record<targetLandUseType, string> = {
  agroforest: "Agroforest",
  "agricultural-land": "Agricultural Land",
  grassland: "Grassland",
  mangrove: "Mangrove",
  "open-natural-ecosystem": "Open Natural Ecosystem",
  "natural-forest": "Natural Forest",
  peatland: "Peatland",
  "riparian-area-or-wetland": "Riparian Area / Wetland",
  silvopasture: "Silvopasture",
  "urban-forest": "Urban Forest",
  "woodlot-or-plantation": "Woodlot / Plantation"
};

const TREE_DISTRIBUTION_SORT_LABELS: Record<TreeDistributionType, string> = {
  "single-line": "Single Line",
  partial: "Partial",
  full: "Full Coverage"
};

const isTreeDistributionType = (value: string): value is TreeDistributionType =>
  value === "single-line" || value === "partial" || value === "full";

const formatPlantingDate = (plantStart: string | null | undefined): string => {
  if (plantStart == null || plantStart === "") {
    return "-";
  }
  return plantStart.split("T")[0];
};

const buildRestorationPracticeSortKey = (practices: restorationStrategyType[]): string =>
  toSortableJoinedList(practices.map(practice => RESTORATION_PRACTICE_SORT_LABELS[practice]));

const buildTreeDistributionSortKey = (distr: TreeDistributionType[]): string =>
  toSortableJoinedList(distr.map(value => TREE_DISTRIBUTION_SORT_LABELS[value]));

export const mapSitePolygonToTableRow = (polygon: SitePolygonLightDto, t: (key: string) => string): PolygonTableRow => {
  const restorationPractice = (polygon.practice ?? []).filter(isRestorationStrategy);
  const targetLandUse = polygon.targetSys != null && isTargetLandUseType(polygon.targetSys) ? polygon.targetSys : null;
  const treeDistribution = (polygon.distr ?? []).filter(isTreeDistributionType);

  return {
    id: polygon.polygonUuid ?? polygon.uuid,
    polygonName: polygon.name ?? t("Unnamed Polygon"),
    submission: mapSitePolygonStatusToMappedTagState(polygon.status),
    validation: mapSiteValidationStatusToTagState(polygon.validationStatus),
    restorationPractice,
    restorationPracticeSort: buildRestorationPracticeSortKey(restorationPractice),
    targetLandUse,
    targetLandUseSort: targetLandUse != null ? TARGET_LAND_USE_SORT_LABELS[targetLandUse] : "",
    treeDistribution,
    treeDistributionSort: buildTreeDistributionSortKey(treeDistribution),
    plantingDate: formatPlantingDate(polygon.plantStart),
    treesPlanted: polygon.numTrees ?? 0,
    area: polygon.calcArea ?? 0,
    source: formatPolygonSource(polygon.source)
  };
};
