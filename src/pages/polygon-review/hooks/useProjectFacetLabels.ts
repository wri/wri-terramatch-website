import { useT } from "@transifex/react";
import { startCase } from "lodash";
import { useCallback, useMemo } from "react";

import { useGadmOptions } from "@/connections/Gadm";
import { useReportingFrameworks } from "@/connections/ReportingFramework";
import { getProjectCohortOptions } from "@/constants/options/cohort";

import { ProjectContextFacet } from "../utils/projectContextFilter";

export const useProjectFacetLabels = () => {
  const t = useT();
  const [, { data: frameworks }] = useReportingFrameworks({});
  const countryOptions = useGadmOptions({ level: 0 });

  const labels = useMemo<Record<ProjectContextFacet, Map<string, string>>>(
    () => ({
      frameworkKey: new Map(
        (frameworks ?? []).flatMap(({ slug, name }) => (slug == null ? [] : [[slug, name] as const]))
      ),
      country: new Map((countryOptions ?? []).map(({ value, title }) => [String(value), title])),
      cohort: new Map(getProjectCohortOptions(t).map(({ value, title }) => [String(value), title]))
    }),
    [countryOptions, frameworks, t]
  );

  return useCallback(
    (facet: ProjectContextFacet, value: string) => labels[facet].get(value) ?? startCase(value),
    [labels]
  );
};
