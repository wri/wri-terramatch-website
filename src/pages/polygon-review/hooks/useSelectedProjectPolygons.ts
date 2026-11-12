import { useT } from "@transifex/react";
import { uniqBy } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";

import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

import { loadSitePolygonsByUuidBatch } from "../../site/[uuid]/hooks/sitePolygonBatchLoad.utils";
import { getPolygonRowId, toPolygonReviewTableRow } from "../utils/polygonReviewTableRow";

const NO_POLYGONS: SitePolygonLightDto[] = [];

type UseSelectedProjectPolygonsParams = {
  projectUuid: string | null;
  pagePolygons: SitePolygonLightDto[];
  selectedRowIds: Set<string | number>;
};

export const useSelectedProjectPolygons = ({
  projectUuid,
  pagePolygons,
  selectedRowIds
}: UseSelectedProjectPolygonsParams) => {
  const t = useT();
  const [offPagePolygons, setOffPagePolygons] = useState<SitePolygonLightDto[]>(NO_POLYGONS);
  const [pendingLoads, setPendingLoads] = useState(0);
  const requestedIdsRef = useRef(new Set<string>());

  const pagePolygonIds = useMemo(() => new Set(pagePolygons.map(getPolygonRowId)), [pagePolygons]);

  useEffect(() => {
    if (selectedRowIds.size === 0) {
      requestedIdsRef.current = new Set();
      setOffPagePolygons(NO_POLYGONS);
      return;
    }
    if (projectUuid == null) return;

    const requestedIds = requestedIdsRef.current;
    const idsToLoad = Array.from(selectedRowIds, String).filter(id => !pagePolygonIds.has(id) && !requestedIds.has(id));
    if (idsToLoad.length === 0) return;

    idsToLoad.forEach(id => requestedIds.add(id));
    setPendingLoads(count => count + 1);
    loadSitePolygonsByUuidBatch({
      entityName: "projects",
      entityUuid: projectUuid,
      polygonUuids: idsToLoad,
      errorContext: "Failed to load selected polygons outside the current page"
    })
      .then(loaded => {
        if (requestedIdsRef.current === requestedIds) {
          setOffPagePolygons(current => uniqBy([...current, ...loaded], getPolygonRowId));
        }
      })
      .catch(error => Log.error("Failed to load selected polygons outside the current page", error))
      .finally(() => setPendingLoads(count => count - 1));
  }, [pagePolygonIds, projectUuid, selectedRowIds]);

  const selectionPolygons = useMemo(
    () => uniqBy([...pagePolygons, ...offPagePolygons], getPolygonRowId),
    [offPagePolygons, pagePolygons]
  );
  const selectedRows = useMemo(
    () =>
      selectionPolygons
        .filter(polygon => selectedRowIds.has(getPolygonRowId(polygon)))
        .map(polygon => toPolygonReviewTableRow(polygon, t)),
    [selectedRowIds, selectionPolygons, t]
  );

  return { selectionPolygons, selectedRows, isSelectionLoading: pendingLoads > 0 };
};
