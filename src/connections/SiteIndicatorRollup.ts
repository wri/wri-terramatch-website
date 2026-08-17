import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  getSiteIndicatorRollup,
  GetSiteIndicatorRollupQueryParams
} from "@/generated/v3/researchService/researchServiceComponents";
import { SiteIndicatorRollupDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useConnection } from "@/hooks/useConnection";

/**
 * Per-site indicator aggregates for a project, from one server-side GROUP BY.
 *
 * Semantic Zoom reads this instead of paging every polygon: one project holds 7,293 polygons on a
 * single site, which is ~83 pages of client fetching for numbers the database can produce in one
 * query. Measurements cover active, approved polygons only, matching what the rest of TerraMatch
 * reports, with inReviewCount carrying what was excluded.
 */
const siteIndicatorRollupConnection = v3Resource("siteIndicatorRollups", getSiteIndicatorRollup)
  .index<SiteIndicatorRollupDto>()
  // Not Filter<>: that helper strips pagination keys and requires them to exist. This endpoint
  // returns one row per site and is deliberately unpaginated.
  .filter<GetSiteIndicatorRollupQueryParams>()
  .enabledProp()
  .buildConnection();

export const loadSiteIndicatorRollup = connectionLoader(siteIndicatorRollupConnection);

export const useSiteIndicatorRollup = (projectUuid?: string) => {
  const enabled = projectUuid != null && projectUuid !== "";
  return useConnection(siteIndicatorRollupConnection, {
    enabled,
    filter: enabled ? { projectId: projectUuid } : undefined
  });
};
