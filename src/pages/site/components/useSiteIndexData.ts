import { useEffect, useMemo } from "react";

import { indexProjectConnection, indexSiteConnection, projectSitesMetaIndexConnection } from "@/connections/Entity";
import { toFramework } from "@/context/framework.provider";
import { useAllPages, useConnection, useInfinitePages } from "@/hooks/useConnection";
import ApiSlice from "@/store/apiSlice";

import type { SiteIndexStatus, SiteIndexUpdate } from "./siteIndex.types";
import { toSiteIndexUpdateRequestStatus } from "./siteIndex.utils";

const PROJECT_PAGE_SIZE = 10;

export type SiteIndexQuery = {
  search: string;
  statusFilters: SiteIndexStatus[];
  updateFilter: SiteIndexUpdate | null;
  /** Only this project, for the project's sites tab. */
  projectUuid?: string;
  enabled: boolean;
  /** Set once the view dropdown has been opened; the project catalog is only loaded then. */
  catalogRequested?: boolean;
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
  updateFilter,
  projectUuid,
  enabled,
  catalogRequested = false,
  reloadNonce
}: SiteIndexQuery) => {
  const updateRequestStatus = toSiteIndexUpdateRequestStatus(updateFilter);
  const filter = useMemo(
    () => ({
      search: search === "" ? undefined : search,
      status: statusFilters.length > 0 ? statusFilters : undefined,
      updateRequestStatus: updateRequestStatus == null ? undefined : [updateRequestStatus],
      projectUuid
    }),
    [projectUuid, search, statusFilters, updateRequestStatus]
  );

  useEffect(() => {
    if (reloadNonce === 0) return;
    ApiSlice.pruneIndex("projectSitesMetas", "");
    ApiSlice.pruneIndex("sites", "");
  }, [reloadNonce]);

  const metaList = useInfinitePages(projectSitesMetaIndexConnection, { enabled, filter }, PROJECT_PAGE_SIZE);
  // On the all-projects page the total comes from a count request. On a single project the meta already has the
  // matching count, so that request is skipped.
  const [countLoaded, { indexTotal }] = useConnection(indexSiteConnection, {
    enabled: enabled && projectUuid == null,
    pageNumber: 1,
    pageSize: 1,
    filter
  });
  // The project list for the view dropdown and the add-site link. Only needed on the "All Projects" page.
  // The project list for the view dropdown and the add-site link. Loaded only once the dropdown opens, or when a
  // project is selected (the label and the add-site link need it).
  const [, projectRows] = useAllPages(indexProjectConnection, {
    enabled: enabled && (catalogRequested || projectUuid != null)
  });

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
    siteTotal: projectUuid == null ? indexTotal ?? 0 : metaList.data[0]?.sitesMatching ?? 0,
    hasMore: metaList.hasMore,
    loadingMore: metaList.loadingMore,
    loadMore: metaList.loadMore
  };
};
