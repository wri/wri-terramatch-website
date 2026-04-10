import { createProjectPolygonWithReplace } from "@/connections/ProjectPolygons";
import { createSitePolygonsResource } from "@/connections/SitePolygons";
import { CreateSitePolygonAttributesDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

export async function storePolygon(
  geojson: any,
  record: any,
  setPolygonFromMap?: any,
  refetchSitePolygons?: () => any
): Promise<void> {
  if (!geojson?.length) return;

  const attributes: CreateSitePolygonAttributesDto = {
    geometries: [
      {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: geojson[0].geometry,
            properties: { site_id: record.uuid }
          }
        ] as any
      }
    ]
  };

  try {
    const result = await createSitePolygonsResource(attributes);
    ApiSlice.pruneCache("boundingBoxes");
    ApiSlice.pruneIndex("boundingBoxes", "");
    if (refetchSitePolygons) await refetchSitePolygons();
    if (setPolygonFromMap) {
      setPolygonFromMap({ uuid: result.polygonUuid, isOpen: true, primary_uuid: result.primaryUuid });
    }
  } catch (error) {
    Log.error("Failed to create site polygon:", error);
    throw error;
  }
}

export async function storePolygonProject(
  geojson: any,
  entityUuid: string,
  entityType: string,
  refetch: any,
  setPolygonFromMap: any
): Promise<void> {
  if (!geojson?.length) return;

  const geometries = [
    {
      type: "FeatureCollection",
      features: geojson.map((feature: any) => ({
        type: "Feature",
        geometry: feature.geometry,
        properties: { projectPitchUuid: entityUuid }
      }))
    }
  ];

  const response = await createProjectPolygonWithReplace({ geometries }, entityUuid);
  const polygonUuid = response.polygonUuid;
  if (polygonUuid) {
    refetch?.();
    setPolygonFromMap?.({
      uuid: polygonUuid,
      isOpen: true,
      entityName: "project-pitches",
      projectPitchUuid: entityUuid
    });
  }
}
