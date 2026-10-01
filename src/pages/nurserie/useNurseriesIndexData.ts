import { useMemo } from "react";

import { useNurseryProjectIndex } from "@/hooks/useProjectEntityIndex";

import type { NurseryIndexData } from "./nurseryIndex.types";
import { createNurseryProjectSection, projectSupportsNurseries } from "./nurseryIndex.utils";

export type NurseriesIndexQuery = {
  search?: string;
  projectUuid?: string;
  enabled?: boolean;
};

export const useNurseriesIndexData = (reloadNonce = 0, query: NurseriesIndexQuery = {}): NurseryIndexData => {
  const index = useNurseryProjectIndex({
    reloadNonce,
    search: query.search,
    projectUuid: query.projectUuid,
    enabled: query.enabled,
    includeProject: project => projectSupportsNurseries(project.frameworkKey)
  });

  const sections = useMemo(
    () =>
      index.visibleProjects.map(project => ({
        ...createNurseryProjectSection(project, index.childrenByProjectId.get(project.uuid) ?? []),
        nurseriesLoaded: index.childrenByProjectId.has(project.uuid)
      })),
    [index.childrenByProjectId, index.visibleProjects]
  );

  return {
    projects: index.viewProjects,
    sections,
    loading: index.loading,
    loadingMore: index.loadingMore,
    hasMore: index.hasMore,
    loadMore: index.loadMore,
    onProjectOpened: index.onProjectOpened,
    nurseryTotal: index.childTotal,
    error: index.error
  };
};
