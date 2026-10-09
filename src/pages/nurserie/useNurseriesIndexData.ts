import { useNurseryProjectIndex } from "@/hooks/useProjectEntityIndex";
import { useStableRows } from "@/hooks/useStableRows";

import type { NurseryIndexData } from "./nurseryIndex.types";
import { createNurseryProjectSection, projectSupportsNurseries } from "./nurseryIndex.utils";

export type NurseriesIndexQuery = {
  search?: string;
  projectUuid?: string;
  enabled?: boolean;
  loadAllChildren?: boolean;
};

export const useNurseriesIndexData = (reloadNonce = 0, query: NurseriesIndexQuery = {}): NurseryIndexData => {
  const index = useNurseryProjectIndex({
    reloadNonce,
    search: query.search,
    projectUuid: query.projectUuid,
    enabled: query.enabled,
    loadAllChildren: query.loadAllChildren,
    includeProject: project => projectSupportsNurseries(project.frameworkKey)
  });

  // Rows keep their identity until their own project or nurseries change, so appending a batch of
  // projects doesn't re-render every section that is already on screen.
  const sections = useStableRows(
    index.visibleProjects,
    project => project.uuid,
    project => [project, index.childrenByProjectId.get(project.uuid)],
    project => ({
      ...createNurseryProjectSection(project, index.childrenByProjectId.get(project.uuid) ?? []),
      nurseriesLoaded: index.childrenByProjectId.has(project.uuid)
    })
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
    error: index.error,
    childrenPending: index.childrenPending
  };
};
