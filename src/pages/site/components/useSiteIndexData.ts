import { useEffect, useMemo, useState } from "react";

import { loadFullProject, loadProjectIndex, loadSiteIndex } from "@/connections/Entity";
import type { ProjectFullDto, ProjectLightDto, SiteLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

import type { SiteIndexProject } from "./siteIndex.types";
import { groupSitesByProject } from "./siteIndex.utils";

type UseSiteIndexDataResult = {
  loading: boolean;
  projects: SiteIndexProject[];
};

const PAGE_SIZE = 100;

type IndexPage<T> = {
  data?: T[] | null;
  indexTotal?: number | null;
};

const loadAllIndexPages = async <T>(loadPage: (pageNumber: number) => Promise<IndexPage<T>>): Promise<T[]> => {
  const firstPage = await loadPage(1);
  const items = [...(firstPage.data ?? [])];
  const total = firstPage.indexTotal ?? items.length;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  for (let pageNumber = 2; pageNumber <= lastPage; pageNumber++) {
    const page = await loadPage(pageNumber);
    items.push(...(page.data ?? []));
  }

  return items;
};

export const useSiteIndexData = (reloadNonce = 0): UseSiteIndexDataResult => {
  const [loading, setLoading] = useState(true);
  const [projectIndex, setProjectIndex] = useState<ProjectLightDto[]>([]);
  const [sites, setSites] = useState<SiteLightDto[]>([]);
  const [fullProjectsById, setFullProjectsById] = useState<Map<string, ProjectFullDto>>(new Map());

  useEffect(() => {
    let cancelled = false;

    const loadIndex = async () => {
      setLoading(true);

      if (reloadNonce > 0) {
        ApiSlice.pruneIndex("projects", "");
        ApiSlice.pruneIndex("sites", "");
      }

      try {
        const [loadedProjects, loadedSites] = await Promise.all([
          loadAllIndexPages<ProjectLightDto>(pageNumber => loadProjectIndex({ pageNumber, pageSize: PAGE_SIZE })),
          loadAllIndexPages<SiteLightDto>(pageNumber => loadSiteIndex({ pageNumber, pageSize: PAGE_SIZE }))
        ]);

        if (cancelled) {
          return;
        }

        setProjectIndex(loadedProjects);
        setSites(loadedSites);
        setLoading(false);

        const fullProjects = await Promise.all(
          loadedProjects.map(async project => {
            try {
              const result = await loadFullProject({ id: project.uuid });
              return result.data ?? null;
            } catch (error) {
              Log.error("Failed to load full project for site index metrics", error);
              return null;
            }
          })
        );

        if (cancelled) {
          return;
        }

        const next = new Map<string, ProjectFullDto>();
        fullProjects.forEach(project => {
          if (project != null) {
            next.set(project.uuid, project);
          }
        });
        setFullProjectsById(next);
      } catch (error) {
        Log.error("Failed to load site index", error);
        if (!cancelled) {
          setProjectIndex([]);
          setSites([]);
          setFullProjectsById(new Map());
          setLoading(false);
        }
      }
    };

    void loadIndex();

    return () => {
      cancelled = true;
    };
  }, [reloadNonce]);

  const sections = useMemo(
    () => groupSitesByProject(projectIndex, sites, fullProjectsById),
    [fullProjectsById, projectIndex, sites]
  );

  return {
    loading,
    projects: sections
  };
};
