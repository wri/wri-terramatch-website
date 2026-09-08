import { showToast } from "@worldresources/wri-design-systems";
import { useEffect, useMemo, useState } from "react";

import { loadFullProject, loadNurseryIndex, loadProjectIndex } from "@/connections/Entity";
import type {
  NurseryLightDto,
  ProjectFullDto,
  ProjectLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

import type { NurseryIndexData } from "./nurseryIndex.types";
import { buildNurseryProjectSections } from "./nurseryIndex.utils";

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

export const useNurseriesIndexData = (reloadNonce = 0): NurseryIndexData => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [projects, setProjects] = useState<ProjectLightDto[]>([]);
  const [nurseries, setNurseries] = useState<NurseryLightDto[]>([]);
  const [fullProjectsById, setFullProjectsById] = useState<Map<string, ProjectFullDto>>(new Map());

  useEffect(() => {
    let cancelled = false;

    const loadIndex = async () => {
      setLoading(true);
      setError(false);

      if (reloadNonce > 0) {
        ApiSlice.pruneIndex("projects", "");
        ApiSlice.pruneIndex("nurseries", "");
      }

      try {
        const [loadedProjects, loadedNurseries] = await Promise.all([
          loadAllIndexPages<ProjectLightDto>(pageNumber => loadProjectIndex({ pageNumber, pageSize: PAGE_SIZE })),
          loadAllIndexPages<NurseryLightDto>(pageNumber => loadNurseryIndex({ pageNumber, pageSize: PAGE_SIZE }))
        ]);

        if (cancelled) {
          return;
        }

        setProjects(loadedProjects);
        setNurseries(loadedNurseries);
        setLoading(false);
      } catch (loadError) {
        showToast({
          label: "Failed to load nursery index",
          type: "error",
          placement: "bottom"
        });
        if (!cancelled) {
          setProjects([]);
          setNurseries([]);
          setFullProjectsById(new Map());
          setError(true);
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
    () => buildNurseryProjectSections(nurseries, projects, fullProjectsById),
    [fullProjectsById, nurseries, projects]
  );
  const projectUuidsKey = useMemo(
    () =>
      Array.from(new Set(sections.map(section => section.projectUuid).filter((uuid): uuid is string => uuid != null)))
        .sort()
        .join(","),
    [sections]
  );

  useEffect(() => {
    if (loading || error) return;

    const uuids = projectUuidsKey === "" ? [] : projectUuidsKey.split(",");
    if (uuids.length === 0) {
      setFullProjectsById(new Map());
      return;
    }

    let cancelled = false;

    const loadFullProjects = async () => {
      const fullProjects = await Promise.all(
        uuids.map(async uuid => {
          try {
            const result = await loadFullProject({ id: uuid });
            return result.data ?? null;
          } catch (loadError) {
            Log.error("Failed to load full project for nursery index metrics", loadError);
            return null;
          }
        })
      );

      if (cancelled) return;

      const next = new Map<string, ProjectFullDto>();
      fullProjects.forEach(project => {
        if (project != null) next.set(project.uuid, project);
      });
      setFullProjectsById(next);
    };

    void loadFullProjects();

    return () => {
      cancelled = true;
    };
  }, [error, loading, projectUuidsKey]);

  return {
    projects,
    sections,
    loading,
    error
  };
};
