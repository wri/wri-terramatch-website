import { useMemo } from "react";

import { indexSiteConnection, useFullProject } from "@/connections/Entity";
import { toFramework } from "@/context/framework.provider";
import type { ProjectSitesMetaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useInfinitePages } from "@/hooks/useConnection";

import type { SiteIndexStatus, SiteIndexUpdate } from "./siteIndex.types";
import { buildProjectMetrics, mapSiteToIndexSite, toSiteIndexUpdateRequestStatus } from "./siteIndex.utils";

const SITE_PAGE_SIZE = 100;

export type SiteProjectFilters = {
  search: string;
  statusFilters: SiteIndexStatus[];
  updateFilter: SiteIndexUpdate | null;
};

/**
 * Loads one project's sites, a page at a time, with the same filters the index applies on the server, and the
 * project's header metrics. Only enabled once the project section is opened.
 */
export const useSiteProjectRows = (meta: ProjectSitesMetaDto, filters: SiteProjectFilters, enabled: boolean) => {
  const { search, statusFilters, updateFilter } = filters;
  const updateRequestStatus = toSiteIndexUpdateRequestStatus(updateFilter);
  const filter = useMemo(
    () => ({
      projectUuid: meta.uuid,
      search: search === "" ? undefined : search,
      status: statusFilters.length > 0 ? statusFilters : undefined,
      updateRequestStatus: updateRequestStatus == null ? undefined : [updateRequestStatus]
    }),
    [meta.uuid, search, statusFilters, updateRequestStatus]
  );

  const sites = useInfinitePages(indexSiteConnection, { enabled, filter }, SITE_PAGE_SIZE);
  const [metricsLoaded, { data: fullProjectData }] = useFullProject({ id: meta.uuid, enabled });
  const fullProject = fullProjectData?.lightResource === false ? fullProjectData : undefined;

  const frameworkKey = toFramework(meta.frameworkKey);
  const rows = useMemo(
    () => sites.data.map(site => mapSiteToIndexSite(site, frameworkKey)),
    [frameworkKey, sites.data]
  );
  const metrics = useMemo(
    () =>
      buildProjectMetrics(frameworkKey, fullProject, {
        treesPlanted: meta.treesPlantedTotal,
        hectaresRestored: meta.hectaresRestoredTotal
      }),
    [frameworkKey, fullProject, meta.hectaresRestoredTotal, meta.treesPlantedTotal]
  );

  return {
    loaded: sites.loaded,
    rows,
    hasMore: sites.hasMore,
    loadingMore: sites.loadingMore,
    loadMore: sites.loadMore,
    loadFailure: sites.loadFailure,
    metricsLoaded,
    metrics
  };
};
