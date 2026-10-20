import { useMemo } from "react";

import { indexNurseryConnection, useFullProject } from "@/connections/Entity";
import type { ProjectNurseriesMetaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useInfinitePages } from "@/hooks/useConnection";

import { getSeedlingsGoal, toNurseryIndexRows } from "./nurseryIndex.utils";

const NURSERY_PAGE_SIZE = 100;

export type NurseryProjectFilters = {
  search: string;
  statuses: string[];
  updates: string[];
};

/**
 * Loads one project's nurseries, a page at a time, with the same filters the index applies on the server.
 * Only enabled once the project section is opened.
 */
export const useNurseryProjectRows = (
  meta: ProjectNurseriesMetaDto,
  filters: NurseryProjectFilters,
  enabled: boolean
) => {
  const { search, statuses, updates } = filters;
  const filter = useMemo(
    () => ({
      projectUuid: meta.uuid,
      search: search === "" ? undefined : search,
      status: statuses.length > 0 ? statuses : undefined,
      updateRequestStatus: updates.length > 0 ? updates : undefined
    }),
    [meta.uuid, search, statuses, updates]
  );

  const nurseries = useInfinitePages(indexNurseryConnection, { enabled, filter }, NURSERY_PAGE_SIZE);
  const [goalLoaded, { data: fullProject }] = useFullProject({ id: meta.uuid, enabled });

  const rows = useMemo(
    () => toNurseryIndexRows(nurseries.data, { uuid: meta.uuid, frameworkKey: meta.frameworkKey }),
    [meta.frameworkKey, meta.uuid, nurseries.data]
  );

  return {
    loaded: nurseries.loaded,
    rows,
    hasMore: nurseries.hasMore,
    loadingMore: nurseries.loadingMore,
    loadMore: nurseries.loadMore,
    loadFailure: nurseries.loadFailure,
    goalLoaded,
    goal: getSeedlingsGoal(fullProject?.lightResource === false ? fullProject : undefined)
  };
};
