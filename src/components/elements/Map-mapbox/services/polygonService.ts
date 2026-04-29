import { pruneBoundingBoxesCache } from "@/connections/BoundingBox";
import { createProjectPolygonWithReplace } from "@/connections/ProjectPolygons";
import { createSitePolygonsResource } from "@/connections/SitePolygons";
import { CreateSitePolygonAttributesDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

import type { PolygonFromMapState } from "../Map.d";

type PolygonFeature = Pick<GeoJSON.Feature, "geometry">;

export async function storePolygon(
  geojson: PolygonFeature[],
  record: { uuid?: string },
  setPolygonFromMap?: (value: PolygonFromMapState & { primary_uuid?: string }) => void,
  refetchSitePolygons?: () => void | Promise<void>
): Promise<void> {
  if (geojson == null || geojson.length === 0) return;

  const attributes: CreateSitePolygonAttributesDto = {
    geometries: [
      {
        type: "FeatureCollection",
        features: [{ type: "Feature", geometry: geojson[0].geometry, properties: { site_id: record.uuid } }] as any
      }
    ]
  };

  try {
    const result = await createSitePolygonsResource(attributes);
    pruneBoundingBoxesCache();
    if (refetchSitePolygons != null) await refetchSitePolygons();
    if (setPolygonFromMap != null) {
      setPolygonFromMap({
        uuid: result.polygonUuid,
        isOpen: true,
        primary_uuid: result.primaryUuid
      } as PolygonFromMapState & {
        primary_uuid?: string;
      });
    }
  } catch (error) {
    Log.error("Failed to create site polygon:", error);
    throw error;
  }
}

export async function storePolygonProject(
  geojson: PolygonFeature[],
  entityUuid: string,
  entityType: string,
  refetch: (() => void) | (() => Promise<void>),
  setPolygonFromMap: (value: PolygonFromMapState) => void
): Promise<void> {
  if (geojson == null || geojson.length === 0) return;

  const geometries = [
    {
      type: "FeatureCollection",
      features: geojson.map(feature => ({
        type: "Feature",
        geometry: feature.geometry,
        properties: { projectPitchUuid: entityUuid }
      })) as any
    }
  ];

  const response = await createProjectPolygonWithReplace({ geometries }, entityUuid);
  const polygonUuid = response.polygonUuid;
  if (polygonUuid != null) {
    refetch?.();
    setPolygonFromMap?.({
      uuid: polygonUuid,
      isOpen: true,
      entityName: "project-pitches",
      projectPitchUuid: entityUuid
    });
  }
}
