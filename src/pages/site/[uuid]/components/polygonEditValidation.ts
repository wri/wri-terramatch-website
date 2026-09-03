import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

export type RequiredPolygonAttribute = "restorationPractice" | "targetLandUse" | "treeDistribution";

export type RequiredPolygonAttributeValues = {
  restorationPractice: string[] | null | undefined;
  targetLandUseSystem: string[] | null | undefined;
  treeDistribution: string[] | null | undefined;
};

export const isNonEmptyAttributeList = (values: string[] | null | undefined): boolean =>
  (values ?? []).some(value => value.trim().length > 0);

export const normalizeTargetSystem = (value: string | null | undefined): string[] => {
  if (value == null || value === "") {
    return [];
  }

  return value
    .split(",")
    .map(item => item.trim())
    .filter(item => item.length > 0);
};

export const requiredPolygonAttributesFromSitePolygon = (
  polygon: Pick<SitePolygonLightDto, "practice" | "targetSys" | "distr"> | null | undefined
): RequiredPolygonAttributeValues => ({
  restorationPractice: polygon?.practice,
  targetLandUseSystem: normalizeTargetSystem(polygon?.targetSys),
  treeDistribution: polygon?.distr
});

export const getMissingRequiredPolygonAttribute = (
  values: RequiredPolygonAttributeValues
): RequiredPolygonAttribute | null => {
  if (!isNonEmptyAttributeList(values.restorationPractice)) {
    return "restorationPractice";
  }
  if (!isNonEmptyAttributeList(values.targetLandUseSystem)) {
    return "targetLandUse";
  }
  if (!isNonEmptyAttributeList(values.treeDistribution)) {
    return "treeDistribution";
  }

  return null;
};

export const hasRequiredPolygonAttributes = (values: RequiredPolygonAttributeValues): boolean =>
  getMissingRequiredPolygonAttribute(values) == null;
