import { useMemo } from "react";

import { useSiteReviewRollup } from "@/connections/SiteReviewRollup";
import { SiteReviewRollupDto } from "@/generated/v3/researchService/researchServiceSchemas";

// Row shape matches the `GET /research/v3/sitePolygons/siteReviewRollup?projectId=` DTO
// (see docs/plans/project-polygons-site-rollup-plan.md §2.3), so ProjectSiteRollupView /
// ProjectSiteRollupTable / SiteRollupMap consume it directly.
export type SiteReviewRollupRow = {
  siteUuid: string;
  siteName: string;
  siteStatus: string | null;
  activeTotal: number;
  passed: number;
  partial: number;
  failed: number;
  notChecked: number;
  approved: number;
  pendingApproval: number;
  draft: number;
  informationRequired: number;
  overlapCount: number;
  hectares: number;
  centroidLat: number | null;
  centroidLong: number | null;
};

export type UseProjectSiteRollup = {
  loaded: boolean;
  rows: SiteReviewRollupRow[];
  total: number;
  error: unknown;
};

const toRow = (dto: SiteReviewRollupDto): SiteReviewRollupRow => ({
  siteUuid: dto.siteUuid,
  siteName: dto.siteName ?? "",
  siteStatus: dto.siteStatus ?? null,
  activeTotal: dto.activeTotal ?? 0,
  passed: dto.passed ?? 0,
  partial: dto.partial ?? 0,
  failed: dto.failed ?? 0,
  notChecked: dto.notChecked ?? 0,
  approved: dto.approved ?? 0,
  pendingApproval: dto.pendingApproval ?? 0,
  draft: dto.draft ?? 0,
  informationRequired: dto.informationRequired ?? 0,
  overlapCount: dto.overlapCount ?? 0,
  hectares: dto.hectares ?? 0,
  centroidLat: dto.centroidLat ?? null,
  centroidLong: dto.centroidLong ?? null
});

/**
 * Per-site rollup for a project's polygon review, scoped ONLY to sites (never loads polygon rows —
 * that is exactly what rollup mode exists to avoid above PROJECT_SITE_ROLLUP_THRESHOLD).
 *
 * One request: `GET /research/v3/sitePolygons/siteReviewRollup?projectId=` (O(sites) server-side
 * GROUP BY) → one row per site with active total, validation/status buckets, overlap count, hectares
 * and a centroid. `total` = Σ activeTotal drives the flat-vs-rollup mode decision.
 */
export const useProjectSiteRollup = (projectUuid: string | null | undefined): UseProjectSiteRollup => {
  const [loaded, { data, loadFailure }] = useSiteReviewRollup(projectUuid ?? undefined);

  const rows = useMemo<SiteReviewRollupRow[]>(() => (data ?? []).map(toRow), [data]);
  const total = useMemo(() => rows.reduce((sum, row) => sum + row.activeTotal, 0), [rows]);

  return { loaded, rows, total, error: loadFailure ?? null };
};
