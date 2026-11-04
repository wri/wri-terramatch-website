import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { useLightSite } from "@/connections/Entity";

import {
  EMPTY_POLYGON_FILTERS,
  PolygonFilterState,
  toSiteFilterOption
} from "../../site/[uuid]/components/polygonFilter.constants";
import { omitPolygonReviewQuery, parsePolygonReviewQuery } from "../utils/polygonReviewUrl";

export type InitialPolygonReviewState = {
  projectUuid: string;
  polygonFilters: PolygonFilterState;
};

/**
 * Resolves the Polygon Review query params into the project context and filters the page starts with
 * (`initialState`, null when the URL asks for nothing). A `siteUuid` scopes the page to that site's project with the
 * site filter applied. `clearInitialStateQuery` removes those params once the page no longer shows that scope.
 */
export const useInitialPolygonReviewState = (enabled: boolean) => {
  const router = useRouter();
  const { siteUuid } = useMemo(
    () => parsePolygonReviewQuery(router.isReady ? router.query : {}),
    [router.isReady, router.query]
  );

  const [, { data: site }] = useLightSite({ id: siteUuid, enabled: enabled && siteUuid != null });

  const initialState = useMemo<InitialPolygonReviewState | null>(() => {
    if (siteUuid == null || site == null || site.projectUuid == null) return null;

    return {
      projectUuid: site.projectUuid,
      polygonFilters: { ...EMPTY_POLYGON_FILTERS, sites: [toSiteFilterOption(site)] }
    };
  }, [site, siteUuid]);

  const clearInitialStateQuery = useCallback(() => {
    void router.replace({ pathname: router.pathname, query: omitPolygonReviewQuery(router.query) }, undefined, {
      shallow: true
    });
  }, [router]);

  return { initialState, clearInitialStateQuery };
};
