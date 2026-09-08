import { showToast } from "@worldresources/wri-design-systems";
import { useEffect, useMemo, useState } from "react";

import { loadNurseryIndex, loadProjectIndex } from "@/connections/Entity";
import type { NurseryLightDto, ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import ApiSlice from "@/store/apiSlice";

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

  const sections = useMemo(() => buildNurseryProjectSections(nurseries, projects), [nurseries, projects]);

  return {
    projects,
    sections,
    loading,
    error
  };
};
