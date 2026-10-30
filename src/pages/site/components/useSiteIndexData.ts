import { useEffect, useMemo } from "react";

import { indexProjectConnection, projectSitesMetaIndexConnection, useSiteCounts } from "@/connections/Entity";
import { toFramework } from "@/context/framework.provider";
import { useAllPages, useInfinitePages } from "@/hooks/useConnection";
import ApiSlice from "@/store/apiSlice";

import type { SiteIndexStatus, SiteIndexUpdate } from "./siteIndex.types";
import { toSiteIndexUpdateRequestStatuses } from "./siteIndex.utils";

const PROJECT_PAGE_SIZE = 10;

export type SiteIndexQuery = {
  search: string;
  statusFilters: SiteIndexStatus[];
  updateFilters: SiteIndexUpdate[];
  /** Only this project, for the project's sites tab. */
  projectUuid?: string;
  enabled: boolean;
  /** Bumped after a bulk action, so the lists and counts are fetched again. */
  reloadNonce: number;
};

/**
 * Index data for the sites page. Like the reports index, the server applies the filters: the project list
 * comes from the sites meta endpoint, and each project section loads its own sites when it opens.
 */
export const useSiteIndexData = ({
  search,
  statusFilters,
  updateFilters,
  projectUuid,
  enabled,
  reloadNonce
}: SiteIndexQuery) => {
  const updateRequestStatuses = useMemo(() => toSiteIndexUpdateRequestStatuses(updateFilters), [updateFilters]);
  const filter = useMemo(
    () => ({
      search: search === "" ? undefined : search,
      status: statusFilters.length > 0 ? statusFilters : undefined,
      updateRequestStatus: updateRequestStatuses.length === 0 ? undefined : updateRequestStatuses,
      projectUuid
    }),
    [projectUuid, search, statusFilters, updateRequestStatuses]
  );

  useEffect(() => {
    if (reloadNonce === 0) return;
    ApiSlice.pruneIndex("projectSitesMetas", "");
    ApiSlice.pruneIndex("sites", "");
    ApiSlice.pruneCache("entityCounts");
  }, [reloadNonce]);

  const metaList = useInfinitePages(projectSitesMetaIndexConnection, { enabled, filter }, PROJECT_PAGE_SIZE);
  // On the all-projects page the total comes from a count request. On a single project the meta already has the
  // matching count, so that request is skipped.
  const [countLoaded, { data: counts }] = useSiteCounts(filter, enabled && projectUuid == null);
  // The project list for the view dropdown and the add-site link. It is always loaded, because a user with a
  // single project is sent straight to that project's view and needs to know the count up front.
  const [, projectRows] = useAllPages(indexProjectConnection, { enabled });

  const metas = metaList.data;
  const projects = useMemo(
    () =>
      projectRows.map(project => ({
        id: project.uuid,
        name: project.name ?? "-",
        frameworkKey: toFramework(project.frameworkKey)
      })),
    [projectRows]
  );

  return {
    loading: !enabled || !metaList.loaded || (projectUuid == null && !countLoaded),
    error: metaList.loadFailure != null,
    metas,
    projects,
    siteTotal: projectUuid == null ? counts?.total ?? 0 : metaList.data[0]?.sitesMatching ?? 0,
    hasMore: metaList.hasMore,
    loadingMore: metaList.loadingMore,
    loadMore: metaList.loadMore
  };
};
