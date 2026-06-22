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
};

export type PolygonEditFormValues = {
  polygonName: string;
  plantStartDate: DateValue[];
  restorationPractice: string[];
  targetLandUseSystem: string[];
  treeDistribution: string[];
  treesPlanted: string;
};

export const isValidPolygonName = (polygonName: string): boolean => polygonName.trim().length > 0;

export const isValidPlantStartDate = (plantStartDate: DateValue[]): boolean => plantStartDate.length > 0;

export type DateValueToIsoString = (value: DateValue | undefined) => string | undefined;

type SitePolygonCreateFeature = GeoJSON.Feature<GeoJSON.Geometry, CreatePolygonFeatureProperties>;

type SitePolygonCreateFeatureCollection = {
  type: "FeatureCollection";
  features: SitePolygonCreateFeature[];
};

export const buildAttributeChanges = (
  form: PolygonEditFormValues,
  dateValueToIso: DateValueToIsoString
): AttributeChangesDto => ({
  polyName: form.polygonName,
  plantStart: dateValueToIso(form.plantStartDate[0]),
  practice: form.restorationPractice,
  targetSys: form.targetLandUseSystem.join(", "),
  distr: form.treeDistribution,
  numTrees: Number(form.treesPlanted ?? 0)
});

export const buildCreatePolygonFeatureProperties = (
  siteId: string,
  form: PolygonEditFormValues,
  dateValueToIso: DateValueToIsoString
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

  return properties;
};

export const buildCreateSitePolygonAttributes = (
  siteId: string,
  geometry: GeoJSON.Geometry,
  form: PolygonEditFormValues,
  dateValueToIso: DateValueToIsoString
): CreateSitePolygonAttributesDto => {
  const featureCollection: SitePolygonCreateFeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry,
        properties: buildCreatePolygonFeatureProperties(siteId, form, dateValueToIso)
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
};

export const saveNewSitePolygon = (params: SaveNewPolygonParams): Promise<SitePolygonLightDto> => {
  const attributes = buildCreateSitePolygonAttributes(
    params.siteId,
    params.geometry,
    params.form,
    params.dateValueToIso
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
};

export const saveExistingPolygonVersion = (params: SaveExistingPolygonVersionParams): Promise<SitePolygonLightDto> => {
  const attributeChanges = buildAttributeChanges(params.form, params.dateValueToIso);
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
