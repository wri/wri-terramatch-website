import { chunk } from "lodash";

import { loadSitePolygons } from "@/connections/SitePolygons";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { mapInGroups } from "@/utils/array";
import Log from "@/utils/log";

const DEFAULT_POLYGON_BATCH_SIZE = 100;
const MAX_PARALLEL_BATCHES = 4;

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
  const batches = await mapInGroups(chunk(polygonUuids, batchSize), MAX_PARALLEL_BATCHES, async uuidBatch => {
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
      return [];
    }

    return response.data ?? [];
  });

  return batches.flat();
};
