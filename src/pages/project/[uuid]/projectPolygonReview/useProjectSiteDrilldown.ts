import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

// Treats an empty string (e.g. a stray `?site=`) as "no drill-in", so it never resolves to a site.
const asParam = (value: string | string[] | undefined): string | null => {
  const resolved = value == null ? null : Array.isArray(value) ? value[0] ?? null : value;
  return resolved != null && resolved !== "" ? resolved : null;
};

export type UseProjectSiteDrilldown = {
  /** The drilled-into site, from `?site=<uuid>`, or null at the site-rollup list. */
  siteUuid: string | null;
  /** Switches the project workspace in place to that site's review (`?site=<uuid>`). */
  drillInto: (siteUuid: string) => void;
};

/**
 * URL-driven drill-in state for project polygon review's "rollup" mode (plan §3.3/T5): `?site=<uuid>`
 * is shallow-pushed so the state is linkable and the browser back button works.
 *
 * Ported from the prototype's `navigate`/`asParam`
 * (`design/project-data-experience:src/components/semanticZoom/useSemanticZoom.ts` ~235-249, 364-366),
 * narrowed to the one query param this feature needs.
 */
export const useProjectSiteDrilldown = (): UseProjectSiteDrilldown => {
  const router = useRouter();
  const siteUuid = asParam(router.query.site);

  const navigate = useCallback(
    (nextSiteUuid: string | null) => {
      const query = { ...router.query } as Record<string, string>;
      if (nextSiteUuid == null) {
        delete query.site;
      } else {
        query.site = nextSiteUuid;
      }
      void router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
    },
    [router]
  );

  const drillInto = useCallback((nextSiteUuid: string) => navigate(nextSiteUuid), [navigate]);

  return useMemo(() => ({ siteUuid, drillInto }), [siteUuid, drillInto]);
};
