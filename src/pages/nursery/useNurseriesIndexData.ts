import { useEffect, useMemo } from "react";

import { indexProjectConnection, projectNurseriesMetaIndexConnection, useNurseryCounts } from "@/connections/Entity";
import { useAllPages, useInfinitePages } from "@/hooks/useConnection";
import ApiSlice from "@/store/apiSlice";

import { projectSupportsNurseries } from "./nurseryIndex.utils";

const PROJECT_PAGE_SIZE = 10;

export type NurseriesIndexQuery = {
  search: string;
  statuses: string[];
  updates: string[];
  /** Only this project, for the project's nurseries tab. */
  projectUuid?: string;
  enabled: boolean;
  /** Bumped after a bulk action, so the lists and counts are fetched again. */
  reloadNonce: number;
};

/**
 * Index data for the nurseries page. Like the reports index, the server applies the filters: the project list
 * comes from the nurseries meta endpoint, and each project section loads its own nurseries when it opens.
 */
export const useNurseriesIndexData = ({
  search,
  statuses,
  updates,
  projectUuid,
  enabled,
  reloadNonce
}: NurseriesIndexQuery) => {
  const filter = useMemo(
    () => ({
      search: search === "" ? undefined : search,
      status: statuses.length > 0 ? statuses : undefined,
      updateRequestStatus: updates.length > 0 ? updates : undefined,
      projectUuid
    }),
    [projectUuid, search, statuses, updates]
  );

  useEffect(() => {
    if (reloadNonce === 0) return;
    ApiSlice.pruneIndex("projectNurseriesMetas", "");
    ApiSlice.pruneIndex("nurseries", "");
    ApiSlice.pruneCache("entityCounts");
  }, [reloadNonce]);

  const metaList = useInfinitePages(projectNurseriesMetaIndexConnection, { enabled, filter }, PROJECT_PAGE_SIZE);
  const [countLoaded, { data: counts }] = useNurseryCounts(filter, enabled);
  const [, projectRows] = useAllPages(indexProjectConnection, { enabled });

  const metas = useMemo(
    () => metaList.data.filter(meta => projectSupportsNurseries(meta.frameworkKey)),
    [metaList.data]
  );
  const projects = useMemo(
    () => projectRows.filter(project => projectSupportsNurseries(project.frameworkKey)),
    [projectRows]
  );

  return {
    loading: !enabled || !metaList.loaded || !countLoaded,
    error: metaList.loadFailure != null,
    metas,
    projects,
    nurseryTotal: counts?.total ?? 0,
    hasMore: metaList.hasMore,
    loadingMore: metaList.loadingMore,
    loadMore: metaList.loadMore
  };
};
