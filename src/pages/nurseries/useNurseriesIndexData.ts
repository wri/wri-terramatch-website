import { useMemo } from "react";

import { indexNurseryConnection, indexProjectConnection } from "@/connections/Entity";
import { useAllPages } from "@/hooks/useConnection";

import type { NurseryIndexData } from "./nurseryIndex.types";
import { buildNurseryProjectSections } from "./nurseryIndex.utils";

export const useNurseriesIndexData = (): NurseryIndexData => {
  const [projectsLoaded, projects, projectsFailure] = useAllPages(indexProjectConnection, {
    filter: {},
    enabled: true
  });
  const [nurseriesLoaded, nurseries, nurseriesFailure] = useAllPages(indexNurseryConnection, {
    filter: {},
    enabled: true
  });

  const sections = useMemo(() => buildNurseryProjectSections(nurseries, projects), [nurseries, projects]);

  return {
    projects,
    sections,
    loading: !(projectsLoaded && nurseriesLoaded),
    error: projectsFailure != null || nurseriesFailure != null
  };
};
