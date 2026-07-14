import type { DateValue } from "@ark-ui/react";

import { pruneBoundingBoxesCache } from "@/connections/BoundingBox";
import { createPolygonVersion, createSitePolygonsResource, pruneSitePolygonsCache } from "@/connections/SitePolygons";
import type {
  AttributeChangesDto,
  CreateSitePolygonAttributesDto,
  CreateSitePolygonRequestDto,
  SitePolygonLightDto
} from "@/generated/v3/researchService/researchServiceSchemas";
import ApiSlice from "@/store/apiSlice";

export type CreatePolygonFeatureProperties = {
  siteId: string;
  polyName?: string;
  plantStart?: string;
  practice?: string[];
  targetSys?: string;
  distr?: string[];
  numTrees?: number;
  submissionCycle?: string;
};

export type PolygonEditFormValues = {
  polygonName: string;
  plantStartDate: DateValue[];
  restorationPractice: string[];
  targetLandUseSystem: string[];
  treeDistribution: string[];
  treesPlanted: string;
  submissionCycle: string[];
};

export type BuildAttributeChangesOptions = {
  includeSubmissionCycle?: boolean;
};

export const isValidPolygonName = (polygonName: string): boolean => polygonName.trim().length > 0;

export const isValidPlantStartDate = (plantStartDate: DateValue[]): boolean => plantStartDate.length > 0;

export type DateValueToIsoString = (value: DateValue | undefined) => string | undefined;

const normalizeStringArray = (values: string[] | null | undefined): string[] =>
  (values ?? [])
    .map(value => value.trim())
    .filter(value => value.length > 0)
    .sort();

const areStringArraysEqual = (left: string[], right: string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index]);

const normalizePlantStartDate = (value: string | null | undefined): string => value?.split("T")[0] ?? "";

export const arePolygonEditFormValuesEqual = (
  left: PolygonEditFormValues,
  right: PolygonEditFormValues,
  dateValueToIso: DateValueToIsoString
): boolean => {
  if (left.polygonName.trim() !== right.polygonName.trim()) {
    return false;
  }

  const leftPlantStart = normalizePlantStartDate(dateValueToIso(left.plantStartDate[0]));
  const rightPlantStart = normalizePlantStartDate(dateValueToIso(right.plantStartDate[0]));
  if (leftPlantStart !== rightPlantStart) {
    return false;
  }

  if (
    !areStringArraysEqual(
      normalizeStringArray(left.restorationPractice),
      normalizeStringArray(right.restorationPractice)
    )
  ) {
    return false;
  }

  if (left.targetLandUseSystem.join(", ").trim() !== right.targetLandUseSystem.join(", ").trim()) {
    return false;
  }

  if (
    !areStringArraysEqual(normalizeStringArray(left.treeDistribution), normalizeStringArray(right.treeDistribution))
  ) {
    return false;
  }

  if (left.submissionCycle.join(", ").trim() !== right.submissionCycle.join(", ").trim()) {
    return false;
  }

  const leftNumTrees = left.treesPlanted.trim() === "" ? 0 : Number(left.treesPlanted);
  const rightNumTrees = right.treesPlanted.trim() === "" ? 0 : Number(right.treesPlanted);

  return leftNumTrees === rightNumTrees;
};

export const hasUnsavedFormChanges = (
  baseline: PolygonEditFormValues | null | undefined,
  current: PolygonEditFormValues,
  geometryChanged: boolean,
  dateValueToIso: DateValueToIsoString
): boolean => {
  if (geometryChanged) {
    return true;
  }

  if (baseline == null) {
    return false;
  }

  return !arePolygonEditFormValuesEqual(baseline, current, dateValueToIso);
};

export const hasUnsavedPolygonChanges = (
  polygon: SitePolygonLightDto | undefined,
  form: PolygonEditFormValues,
  geometryChanged: boolean,
  dateValueToIso: DateValueToIsoString
): boolean => {
  if (geometryChanged) {
    return true;
  }

  if (polygon == null) {
    return false;
  }

  if (form.polygonName.trim() !== (polygon.name ?? "").trim()) {
    return true;
  }

  const formPlantStart = normalizePlantStartDate(dateValueToIso(form.plantStartDate[0]));
  const savedPlantStart = normalizePlantStartDate(polygon.plantStart);
  if (formPlantStart !== savedPlantStart) {
    return true;
  }

  if (!areStringArraysEqual(normalizeStringArray(form.restorationPractice), normalizeStringArray(polygon.practice))) {
    return true;
  }

  const formTargetSys = form.targetLandUseSystem.join(", ").trim();
  const savedTargetSys = (polygon.targetSys ?? "").trim();
  if (formTargetSys !== savedTargetSys) {
    return true;
  }

  if (!areStringArraysEqual(normalizeStringArray(form.treeDistribution), normalizeStringArray(polygon.distr))) {
    return true;
  }

  const formSubmissionCycle = form.submissionCycle.join(", ").trim();
  const savedSubmissionCycle = (polygon.submissionCycle ?? "").trim();
  if (formSubmissionCycle !== savedSubmissionCycle) {
    return true;
  }

  const formNumTrees = form.treesPlanted.trim() === "" ? 0 : Number(form.treesPlanted);
  const savedNumTrees = polygon.numTrees ?? 0;
  if (formNumTrees !== savedNumTrees) {
    return true;
  }

  return false;
};

export type SavePolygonFlowOptions = {
  closeOnSave?: boolean;
  deferSuccessToast?: boolean;
};

type SitePolygonCreateFeature = GeoJSON.Feature<GeoJSON.Geometry, CreatePolygonFeatureProperties>;

type SitePolygonCreateFeatureCollection = {
  type: "FeatureCollection";
  features: SitePolygonCreateFeature[];
};

export const buildAttributeChanges = (
  form: PolygonEditFormValues,
  dateValueToIso: DateValueToIsoString,
  options?: BuildAttributeChangesOptions
): AttributeChangesDto => {
  const changes: AttributeChangesDto = {
    polyName: form.polygonName,
    plantStart: dateValueToIso(form.plantStartDate[0]),
    practice: form.restorationPractice,
    targetSys: form.targetLandUseSystem.join(", "),
    distr: form.treeDistribution,
    numTrees: Number(form.treesPlanted ?? 0)
  };

  if (options?.includeSubmissionCycle === true) {
    changes.submissionCycle = form.submissionCycle.join(", ");
  }

  return changes;
};

export const buildCreatePolygonFeatureProperties = (
  siteId: string,
  form: PolygonEditFormValues,
  dateValueToIso: DateValueToIsoString,
  options?: BuildAttributeChangesOptions
): CreatePolygonFeatureProperties => {
  const properties: CreatePolygonFeatureProperties = { siteId };
  const polygonNameValue = form.polygonName.trim();
  const plantStartValue = dateValueToIso(form.plantStartDate[0]);

  if (polygonNameValue.length > 0) properties.polyName = polygonNameValue;
  if (plantStartValue != null && plantStartValue !== "") properties.plantStart = plantStartValue;
  if (form.restorationPractice.length > 0) properties.practice = form.restorationPractice;
  if (form.targetLandUseSystem.length > 0) properties.targetSys = form.targetLandUseSystem.join(", ");
  if (form.treeDistribution.length > 0) properties.distr = form.treeDistribution;
  if (form.treesPlanted.trim() !== "") properties.numTrees = Number(form.treesPlanted);
  if (options?.includeSubmissionCycle === true && form.submissionCycle.length > 0) {
    properties.submissionCycle = form.submissionCycle.join(", ");
  }

  return properties;
};

export const buildCreateSitePolygonAttributes = (
  siteId: string,
  geometry: GeoJSON.Geometry,
  form: PolygonEditFormValues,
  dateValueToIso: DateValueToIsoString,
  options?: BuildAttributeChangesOptions
): CreateSitePolygonAttributesDto => {
  const featureCollection: SitePolygonCreateFeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry,
        properties: buildCreatePolygonFeatureProperties(siteId, form, dateValueToIso, options)
      }
    ]
  };

  return {
    geometries: [featureCollection as unknown as CreateSitePolygonRequestDto]
  };
};

export type PolygonCacheCleanupOptions = {
  polygonUuid?: string | null;
  previousPolygonUuid?: string | null;
  geometryChanged: boolean;
  invalidatePolygonMapTiles: () => void;
};

export const prunePolygonValidationCache = (...polygonUuids: Array<string | null | undefined>): void => {
  const uuids = [...new Set(polygonUuids.filter((uuid): uuid is string => uuid != null && uuid !== ""))];

  if (uuids.length > 0) {
    ApiSlice.pruneCache("validations", uuids);
  }

  ApiSlice.pruneIndex("validations", "");
};

export const runPolygonCacheCleanup = ({
  polygonUuid,
  previousPolygonUuid,
  geometryChanged,
  invalidatePolygonMapTiles
}: PolygonCacheCleanupOptions): void => {
  pruneSitePolygonsCache();
  prunePolygonValidationCache(polygonUuid, previousPolygonUuid);

  const geometryUuids = [polygonUuid, previousPolygonUuid].filter(
    (uuid): uuid is string => uuid != null && uuid !== ""
  );

  if (geometryUuids.length > 0) {
    ApiSlice.pruneCache("geojsonExports", geometryUuids);
  }

  if (geometryChanged) {
    pruneBoundingBoxesCache();
    invalidatePolygonMapTiles();
  }
};

export type SaveNewPolygonParams = {
  siteId: string;
  geometry: GeoJSON.Geometry;
  form: PolygonEditFormValues;
  dateValueToIso: DateValueToIsoString;
  isAdmin?: boolean;
};

export const saveNewSitePolygon = (params: SaveNewPolygonParams): Promise<SitePolygonLightDto> => {
  const attributes = buildCreateSitePolygonAttributes(
    params.siteId,
    params.geometry,
    params.form,
    params.dateValueToIso,
    { includeSubmissionCycle: params.isAdmin === true }
  );
  return createSitePolygonsResource(attributes);
};

export type SaveExistingPolygonVersionParams = {
  primaryUuid: string;
  siteId: string;
  form: PolygonEditFormValues;
  geometryChanged: boolean;
  currentGeometry?: GeoJSON.Geometry;
  dateValueToIso: DateValueToIsoString;
  isAdmin?: boolean;
};

export const saveExistingPolygonVersion = (params: SaveExistingPolygonVersionParams): Promise<SitePolygonLightDto> => {
  const attributeChanges = buildAttributeChanges(params.form, params.dateValueToIso, {
    includeSubmissionCycle: params.isAdmin === true
  });
  const versionGeometry =
    params.geometryChanged && params.currentGeometry != null
      ? {
          type: "Feature" as const,
          geometry: params.currentGeometry,
          properties: { siteId: params.siteId }
        }
      : undefined;

  return createPolygonVersion({
    primaryUuid: params.primaryUuid,
    changeReason: params.geometryChanged
      ? "Updated polygon geometry and attributes from edit drawer"
      : "Updated polygon attributes from edit drawer",
    attributeChanges,
    ...(versionGeometry != null ? { geometry: versionGeometry } : {})
  });
};
