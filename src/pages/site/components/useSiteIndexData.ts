import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { loadFullProject } from "@/connections/Entity";
import { toFramework } from "@/context/framework.provider";
import type { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useSiteProjectIndex } from "@/hooks/useProjectEntityIndex";

import type { SiteIndexProject } from "./siteIndex.types";
import { mapSiteToIndexSite, toSiteIndexProject } from "./siteIndex.utils";

export const SEARCH_DEBOUNCE_MS = 300;

type UseSiteIndexDataParams = {
  reloadNonce?: number;
  childrenReloadNonce?: number;
  search?: string;
  projectUuid?: string;
  enabled?: boolean;
};

const asFullProject = (project: ProjectFullDto | null | undefined): ProjectFullDto | undefined =>
  project != null && project.lightResource === false ? project : undefined;

export const useSiteIndexData = ({
  reloadNonce = 0,
  childrenReloadNonce = 0,
  search = "",
  projectUuid,
  enabled = true
}: UseSiteIndexDataParams = {}) => {
  const index = useSiteProjectIndex({ reloadNonce, childrenReloadNonce, search, projectUuid, enabled });
  const loadProjectChildren = index.onProjectOpened;
  const [fullProjectsById, setFullProjectsById] = useState<Map<string, ProjectFullDto>>(new Map());
  const fullProjectsRef = useRef(fullProjectsById);
  fullProjectsRef.current = fullProjectsById;

  useEffect(() => {
    setFullProjectsById(new Map());
  }, [reloadNonce]);

  const onProjectOpened = useCallback(
    async (projectId: string) => {
      await loadProjectChildren(projectId);
      if (fullProjectsRef.current.has(projectId)) return;

      const result = await loadFullProject({ id: projectId });
      const fullProject = asFullProject(result.data);
      if (fullProject == null) return;
      setFullProjectsById(current => {
        if (current.has(projectId)) return current;
        const next = new Map(current);
        next.set(projectId, fullProject);
        return next;
      });
    },
    [loadProjectChildren]
  );

  const toProject = useCallback(
    (projectId: string, project: Parameters<typeof toSiteIndexProject>[0], withSites: boolean): SiteIndexProject => {
      const sites = withSites
        ? (index.childrenByProjectId.get(projectId) ?? []).map(site =>
            mapSiteToIndexSite(site, toFramework(project.frameworkKey))
          )
        : [];

      return toSiteIndexProject(project, {
        fullProject: fullProjectsById.get(projectId),
        sites,
        sitesLoaded: index.childrenByProjectId.has(projectId),
        sitesLoading: index.loadingProjectIds.has(projectId)
      });
    },
    [fullProjectsById, index.childrenByProjectId, index.loadingProjectIds]
  );

  const viewProjects = useMemo(
    () => index.viewProjects.map(project => toProject(project.uuid, project, false)),
    [index.viewProjects, toProject]
  );

  const projects = useMemo(
    () => index.visibleProjects.map(project => toProject(project.uuid, project, true)),
    [index.visibleProjects, toProject]
  );

  return {
    loading: index.loading,
    loadingMore: index.loadingMore,
    hasMore: index.hasMore,
    loadMore: index.loadMore,
    viewProjects,
    projects,
    totalSiteCount: index.childTotal,
    onProjectOpened,
    error: index.error
  };
};
