import { loadSitePolygons } from "@/connections/SitePolygons";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

const DEFAULT_POLYGON_BATCH_SIZE = 100;

type LoadSitePolygonsByUuidBatchParams = {
  entityName: "sites" | "projects";
  entityUuid: string;
  polygonUuids: string[];
  errorContext: string;
  batchSize?: number;
};

export const loadSitePolygonsByUuidBatch = async ({
  entityName,
  entityUuid,
  polygonUuids,
  errorContext,
  batchSize = DEFAULT_POLYGON_BATCH_SIZE
}: LoadSitePolygonsByUuidBatchParams): Promise<SitePolygonLightDto[]> => {
  const polygons: SitePolygonLightDto[] = [];

  for (let offset = 0; offset < polygonUuids.length; offset += batchSize) {
    const uuidBatch = polygonUuids.slice(offset, offset + batchSize);
    const response = await loadSitePolygons({
      entityName,
      entityUuid,
      enabled: true,
      filter: { "polygonUuid[]": uuidBatch },
      pageNumber: 1,
      pageSize: uuidBatch.length
    });

    if (response.loadFailure != null) {
      Log.error(errorContext, { entityName, entityUuid, loadFailure: response.loadFailure });
      continue;
    }

    polygons.push(...(response.data ?? []));
  }

  return polygons;
};
