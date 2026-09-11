import { useCallback, useEffect, useState } from "react";

import { loadSitePolygonCount } from "@/connections/SitePolygons";
import { PolygonValidationStatus } from "@/pages/site/[uuid]/components/polygonFilter.constants";
import Log from "@/utils/log";

// Validation-status buckets for the project summary. Approvable = passed + partial (admins can
// approve "Partially Passed"); needs-work = failed + not_checked. Values match the API's
// validationStatus[] filter and PolygonFilterState's PolygonValidationStatus.
export type ProjectPolygonStatusCounts = {
  total: number;
  passed: number;
  partial: number;
  failed: number;
  notChecked: number;
  approvable: number; // passed + partial
  needsWork: number; // failed + not_checked
};

const EMPTY: ProjectPolygonStatusCounts = {
  total: 0,
  passed: 0,
  partial: 0,
  failed: 0,
  notChecked: 0,
  approvable: 0,
  needsWork: 0
};

/**
 * Cheap server-side counts for a project's polygons, by validation status, WITHOUT loading the rows.
 * Fires one count-only (pageSize 1, reads indexTotal) request per bucket in parallel — a handful of
 * requests regardless of whether the project has 20 or 20,000 polygons. Powers the summary tiles and
 * the "large project" load gate on the project polygon-review screen.
 */
export const useProjectPolygonStatusCounts = (projectUuid: string, enabled: boolean = true) => {
  const [counts, setCounts] = useState<ProjectPolygonStatusCounts>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchCounts = useCallback(async () => {
    if (!enabled || projectUuid == null || projectUuid === "") {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const base = { entityName: "projects" as const, entityUuid: projectUuid, enabled: true };
      // Key is the query-param field `validationStatus` (no brackets) — the property NestJS binds on,
      // matching useSitePolygonFilters (the "[]" in the API docs is Swagger metadata only). Cast like
      // that hook does, since the generated type keys the field as "validationStatus[]".
      const byStatus = (status: PolygonValidationStatus) =>
        loadSitePolygonCount({ ...base, filter: { validationStatus: [status] } as Record<string, unknown> });
      const [total, passed, partial, failed, notChecked] = await Promise.all([
        loadSitePolygonCount(base),
        byStatus("passed"),
        byStatus("partial"),
        byStatus("failed"),
        byStatus("not_checked")
      ]);
      setCounts({
        total,
        passed,
        partial,
        failed,
        notChecked,
        approvable: passed + partial,
        needsWork: failed + notChecked
      });
    } catch (e) {
      Log.error("Failed to load project polygon status counts", e);
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [projectUuid, enabled]);

  useEffect(() => {
    void fetchCounts();
  }, [fetchCounts]);

  return { counts, isLoading, error, refetch: fetchCounts };
};
