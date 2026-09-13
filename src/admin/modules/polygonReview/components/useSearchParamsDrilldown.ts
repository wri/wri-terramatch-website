import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { UseProjectSiteDrilldown } from "@/pages/project/[uuid]/projectPolygonReview/useProjectSiteDrilldown";

/**
 * react-router (HashRouter) implementation of the project-review drill-in state, for the admin
 * "Polygon Review" page. Mirrors the Next-router `useProjectSiteDrilldown` but reads/writes `?site=`
 * through react-admin's in-hash search params, preserving the sibling `?project=` param. Keeping the
 * state in the URL makes the drilled-in view shareable, refresh-safe, and back-button friendly.
 */
export const useSearchParamsDrilldown = (): UseProjectSiteDrilldown => {
  const [searchParams, setSearchParams] = useSearchParams();
  const siteUuid = searchParams.get("site");

  const navigate = useCallback(
    (nextSiteUuid: string | null) => {
      const next = new URLSearchParams(searchParams);
      if (nextSiteUuid == null) {
        next.delete("site");
      } else {
        next.set("site", nextSiteUuid);
      }
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const drillInto = useCallback((nextSiteUuid: string) => navigate(nextSiteUuid), [navigate]);
  const backToSites = useCallback(() => navigate(null), [navigate]);

  return useMemo(() => ({ siteUuid, drillInto, backToSites }), [siteUuid, drillInto, backToSites]);
};
