import { v3Resource } from "@/connections/util/apiConnectionFactory";
import {
  getSiteReviewRollup,
  GetSiteReviewRollupQueryParams
} from "@/generated/v3/researchService/researchServiceComponents";
import { SiteReviewRollupDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useConnection } from "@/hooks/useConnection";

/**
 * Per-site review rollup for a project, from one server-side GROUP BY (O(sites), not O(polygons)):
 * one row per site with active polygon total, validation/status buckets, overlap count, hectares and
 * a centroid. Powers the project-level site rollup view without loading any polygon rows. Basis is
 * ALL active polygons (the review basis), not the approved-only basis the rest of TerraMatch reports.
 */
const siteReviewRollupConnection = v3Resource("siteReviewRollups", getSiteReviewRollup)
  .index<SiteReviewRollupDto>()
  // Not Filter<>: that helper strips/requires pagination keys. This endpoint returns one row per
  // site and is deliberately unpaginated.
  .filter<GetSiteReviewRollupQueryParams>()
  .enabledProp()
  .buildConnection();

export const useSiteReviewRollup = (projectUuid?: string) => {
  const enabled = projectUuid != null && projectUuid !== "";
  return useConnection(siteReviewRollupConnection, {
    enabled,
    filter: enabled ? { projectId: projectUuid } : undefined
  });
};
