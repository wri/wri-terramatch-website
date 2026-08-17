import { SiteIndicatorRollupDto, SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { Anomaly, anomalyId, AnomalyLevel, AnomalySeverity, AnomalyType, SuggestedAction } from "./types";

/**
 * The anomaly engine.
 *
 * A pure function: it takes already-fetched, typed data and returns the merged anomaly list. There
 * are no hooks and no fetching here — `useProjectAnomalies` owns all of that — so this module can
 * be unit-tested with plain objects and reasoned about without a network in the loop.
 *
 * Two rules run throughout, borrowed from the Semantic Zoom aggregation layer:
 *   - null means NOT MEASURED, never zero. A check whose inputs are null is SKIPPED, not fired. We
 *     would rather miss an anomaly than manufacture one from absent data.
 *   - every threshold below is a defensible heuristic, not policy. Each is a named constant with a
 *     comment saying so, so the product team can move it in one place.
 */

// --- Thresholds. Heuristics, not policy. Change here, nowhere else. ---

/** Mapped area below this fraction of the hectare goal reads as under-mapped. */
const UNDER_MAPPED_RATIO = 0.5;
/** Mapped area above this fraction of the hectare goal reads as over-mapped. */
const OVER_MAPPED_RATIO = 1.5;
/** Trees per hectare above this is implausibly dense for restoration planting. */
const IMPLAUSIBLE_TREES_PER_HECTARE = 2500;
/** Mapped hectares above this multiple of the goal is physically implausible. */
const HECTARES_OVERSHOOT_RATIO = 3;
/**
 * How long after the earliest plant-start we still tolerate zero mapped/approved area before
 * flagging it. There is no product policy for "too long", so this is an explicit heuristic.
 */
const STUCK_MONTHS = 12;
/** treesVsHectaresDesync: one progress figure must exceed the other by this factor to be "extreme". */
const DESYNC_FACTOR = 2;
/** treesVsHectaresDesync: and the two must also differ by at least this many percentage points. */
const DESYNC_ABSOLUTE_GAP = 0.5;

export type ComputeAnomaliesInput = {
  project: {
    uuid: string;
    name: string;
    /** ProjectFullDto.totalHectaresRestoredGoal — null when no goal was set. */
    totalHectaresRestoredGoal: number | null;
    /** ProjectFullDto.treesPlantedCount — reported, null when not reported. */
    treesPlantedCount: number | null;
    /** ProjectFullDto.treesGrownGoal — null when no goal was set. */
    treesGrownGoal: number | null;
  };
  /** One row per site with at least one approved polygon (server-side GROUP BY). */
  rollups: SiteIndicatorRollupDto[];
  /** Every active polygon for the project, any status. Carries plantStart, numTrees, validation. */
  polygons: SitePolygonLightDto[];
  /**
   * Per-site hectare goals, keyed by siteUuid. The current data feeds do not carry a site-level
   * hectare goal (rollups and polygons have none, and ProjectFullDto's goal is project-wide), so
   * this is left undefined in production and the site-level under/over-mapped and hectares-overshoot
   * checks stay dormant. It exists so those checks are real, exercised code the moment a site goal
   * source appears — the unit tests drive them through here.
   */
  siteHectareGoals?: Record<string, number | null>;
  /** Injectable clock so the plant-start heuristics are deterministic in tests. */
  now?: Date;
};

/** A site normalised from the two sources, so the checks read one shape. */
type SiteView = {
  siteUuid: string;
  siteName: string;
  /** Approved polygon count. Authoritative from the rollup; derived from polygons when absent. */
  approvedPolygons: number;
  /** Sum of approved polygons' calcArea. Null when nothing approved carries an area. */
  mappedHectares: number | null;
  /** Earliest plant-start across this site's polygons (any status). Null when none carry one. */
  earliestPlantStart: Date | null;
};

const monthsBetween = (from: Date, to: Date): number =>
  (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());

const parseDate = (iso: string | null | undefined): Date | null => {
  if (iso == null || iso === "") return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Sum of non-null hectares across rollup rows. Null when NO row carries a value (not measured). */
const sumMappedHectares = (rows: SiteIndicatorRollupDto[]): number | null => {
  const measured = rows.filter(row => row.hectares != null);
  if (measured.length === 0) return null;
  return measured.reduce((total, row) => total + (row.hectares as number), 0);
};

const SUGGESTED_ACTIONS: Record<AnomalyType, SuggestedAction> = {
  geometryValidation: { label: "Fix geometry", kind: "fix-data" },
  underMapped: { label: "Investigate coverage", kind: "investigate" },
  overMapped: { label: "Investigate coverage", kind: "investigate" },
  noActivityAfterPlantStart: { label: "Investigate site", kind: "investigate" },
  implausibleDensity: { label: "Check tree count", kind: "fix-data" },
  treesVsHectaresDesync: { label: "Investigate progress", kind: "investigate" },
  hectaresProgressOutlier: { label: "Investigate progress", kind: "investigate" },
  reportsVsPolygons: { label: "Reconcile report", kind: "review" }
};

type AnomalyDraft = {
  type: AnomalyType;
  source: Anomaly["source"];
  level: AnomalyLevel;
  entityUuid: string;
  entityName: string;
  severity: AnomalySeverity;
  title: string;
  detail: string;
};

const build = (draft: AnomalyDraft): Anomaly => ({
  id: anomalyId(draft.type, draft.level, draft.entityUuid),
  source: draft.source,
  type: draft.type,
  level: draft.level,
  entityUuid: draft.entityUuid,
  entityName: draft.entityName,
  severity: draft.severity,
  title: draft.title,
  detail: draft.detail,
  suggestedAction: SUGGESTED_ACTIONS[draft.type]
});

const pct = (ratio: number): string => `${(ratio * 100).toFixed(1)}%`;

const SEVERITY_ORDER: Record<AnomalySeverity, number> = { high: 0, medium: 1, low: 2 };
const LEVEL_ORDER: Record<AnomalyLevel, number> = { project: 0, site: 1, polygon: 2 };

/**
 * Builds the site views the site-level checks read, merging the two sources.
 *
 * Approved counts and mapped hectares come from the rollup (one row per site that has approved
 * polygons). Plant-start lives only on the polygon records, so it is gathered from the polygons
 * list. A site that has polygons but no rollup row has zero approved polygons by definition, and
 * still needs to be seen — that is exactly the noActivity case — so the union of both sources is
 * walked, not just the rollup.
 */
const buildSiteViews = (rollups: SiteIndicatorRollupDto[], polygons: SitePolygonLightDto[]): SiteView[] => {
  const earliestPlantStart = new Map<string, Date>();
  const nameFromPolygons = new Map<string, string>();
  const approvedFromPolygons = new Map<string, number>();

  for (const polygon of polygons) {
    const siteUuid = polygon.siteId;
    if (siteUuid == null) continue;

    if (polygon.siteName != null && !nameFromPolygons.has(siteUuid)) {
      nameFromPolygons.set(siteUuid, polygon.siteName);
    }
    if (polygon.status === "approved") {
      approvedFromPolygons.set(siteUuid, (approvedFromPolygons.get(siteUuid) ?? 0) + 1);
    }
    const plantStart = parseDate(polygon.plantStart);
    if (plantStart != null) {
      const existing = earliestPlantStart.get(siteUuid);
      if (existing == null || plantStart < existing) earliestPlantStart.set(siteUuid, plantStart);
    }
  }

  const rollupBySite = new Map(rollups.map(row => [row.siteUuid, row]));
  const siteUuids = new Set<string>([
    ...rollupBySite.keys(),
    ...nameFromPolygons.keys(),
    ...approvedFromPolygons.keys()
  ]);

  return [...siteUuids].map(siteUuid => {
    const rollup = rollupBySite.get(siteUuid);
    return {
      siteUuid,
      siteName: rollup?.siteName ?? nameFromPolygons.get(siteUuid) ?? siteUuid,
      approvedPolygons: rollup?.polygons ?? approvedFromPolygons.get(siteUuid) ?? 0,
      mappedHectares: rollup?.hectares ?? null,
      earliestPlantStart: earliestPlantStart.get(siteUuid) ?? null
    };
  });
};

// --- Validation source: one anomaly per failed/partial polygon. ---

const validationAnomalies = (polygons: SitePolygonLightDto[]): Anomaly[] => {
  const out: Anomaly[] = [];
  for (const polygon of polygons) {
    // Only "failed" and "partial" are anomalies. "passed" and null (not yet validated) are not.
    const severity: AnomalySeverity | null =
      polygon.validationStatus === "failed" ? "high" : polygon.validationStatus === "partial" ? "medium" : null;
    if (severity == null) continue;

    const name = polygon.name ?? polygon.polygonUuid ?? polygon.uuid;
    out.push(
      build({
        type: "geometryValidation",
        source: "validation",
        level: "polygon",
        entityUuid: polygon.uuid,
        entityName: name,
        severity,
        title: severity === "high" ? "Geometry validation failed" : "Geometry validation partial",
        detail:
          severity === "high"
            ? `Polygon "${name}" failed geometry validation and needs its boundary fixed before it can be approved.`
            : `Polygon "${name}" passed geometry validation only partially; some checks did not pass.`
      })
    );
  }
  return out;
};

// --- Watchlist source ---

/** underMapped / overMapped for one level, given its mapped area and its goal. */
const mappingAnomalies = (
  level: AnomalyLevel,
  entityUuid: string,
  entityName: string,
  mappedHectares: number | null,
  goal: number | null
): Anomaly[] => {
  // Skip unless both sides are real numbers. A null goal or unmeasured area is not an anomaly.
  if (mappedHectares == null || goal == null || goal <= 0) return [];
  const ratio = mappedHectares / goal;

  if (ratio < UNDER_MAPPED_RATIO) {
    return [
      build({
        type: "underMapped",
        source: "watchlist",
        level,
        entityUuid,
        entityName,
        severity: "high",
        title: `Under-mapped: ${pct(ratio)} of hectare goal`,
        detail: `Approved polygons cover ${mappedHectares.toFixed(1)} ha, ${pct(ratio)} of the ${goal.toFixed(
          1
        )} ha goal (threshold ${pct(UNDER_MAPPED_RATIO)}).`
      })
    ];
  }
  if (ratio > OVER_MAPPED_RATIO) {
    return [
      build({
        type: "overMapped",
        source: "watchlist",
        level,
        entityUuid,
        entityName,
        severity: "medium",
        title: `Over-mapped: ${pct(ratio)} of hectare goal`,
        detail: `Approved polygons cover ${mappedHectares.toFixed(1)} ha, ${pct(ratio)} of the ${goal.toFixed(
          1
        )} ha goal (threshold ${pct(OVER_MAPPED_RATIO)}).`
      })
    ];
  }
  return [];
};

/**
 * hectaresProgressOutlier for one level. Both halves are goal-relative, so a null goal skips the
 * whole check — which is why the site level is dormant today (no site hectare goal in the feed).
 * The zero-mapped case that has no goal is caught instead by noActivityAfterPlantStart, which is
 * deliberately goal-free, so the two do not double-report.
 */
const hectaresProgressOutlierAnomalies = (
  level: AnomalyLevel,
  entityUuid: string,
  entityName: string,
  mappedHectares: number | null,
  goal: number | null,
  earliestPlantStart: Date | null,
  now: Date
): Anomaly[] => {
  if (goal == null || goal <= 0) return [];

  // Overshoot half: mapped area is measured and physically implausible against the goal.
  if (mappedHectares != null) {
    const ratio = mappedHectares / goal;
    if (ratio > HECTARES_OVERSHOOT_RATIO) {
      return [
        build({
          type: "hectaresProgressOutlier",
          source: "watchlist",
          level,
          entityUuid,
          entityName,
          severity: "high",
          title: `Hectares ${ratio.toFixed(1)}x over goal`,
          detail: `Approved polygons cover ${mappedHectares.toFixed(1)} ha against a ${goal.toFixed(
            1
          )} ha goal (${ratio.toFixed(1)}x, threshold ${HECTARES_OVERSHOOT_RATIO}x).`
        })
      ];
    }
  }

  // Stuck half: 0% progress (nothing mapped) long after planting should have begun.
  const nothingMapped = mappedHectares == null || mappedHectares === 0;
  if (nothingMapped && earliestPlantStart != null) {
    const monthsElapsed = monthsBetween(earliestPlantStart, now);
    if (monthsElapsed > STUCK_MONTHS) {
      return [
        build({
          type: "hectaresProgressOutlier",
          source: "watchlist",
          level,
          entityUuid,
          entityName,
          severity: "medium",
          title: "Stuck at 0% of hectare goal",
          detail: `No approved hectares against a ${goal.toFixed(
            1
          )} ha goal, ${monthsElapsed} months after the earliest plant-start (heuristic ${STUCK_MONTHS} months).`
        })
      ];
    }
  }
  return [];
};

const treesVsHectaresDesyncAnomaly = (input: ComputeAnomaliesInput, mappedHectares: number | null): Anomaly | null => {
  const { project } = input;
  const treesGoal = project.treesGrownGoal;
  const hectaresGoal = project.totalHectaresRestoredGoal;

  // Both progress ratios must be computable, or the comparison is meaningless.
  if (project.treesPlantedCount == null || treesGoal == null || treesGoal <= 0) return null;
  if (mappedHectares == null || hectaresGoal == null || hectaresGoal <= 0) return null;

  const treesProgress = project.treesPlantedCount / treesGoal;
  const hectaresProgress = mappedHectares / hectaresGoal;

  const larger = Math.max(treesProgress, hectaresProgress);
  const smaller = Math.min(treesProgress, hectaresProgress);
  const absoluteGap = larger - smaller;
  // Extreme = one is more than DESYNC_FACTOR the other AND they differ by a wide absolute margin.
  const factorExtreme = smaller <= 0 ? larger > 0 : larger / smaller > DESYNC_FACTOR;
  if (!factorExtreme || absoluteGap <= DESYNC_ABSOLUTE_GAP) return null;

  return build({
    type: "treesVsHectaresDesync",
    source: "watchlist",
    level: "project",
    entityUuid: project.uuid,
    entityName: project.name,
    severity: "medium",
    title: "Trees and hectares progress disagree",
    detail: `Trees planted are at ${pct(treesProgress)} of goal while mapped hectares are at ${pct(
      hectaresProgress
    )}; the two should track each other.`
  });
};

/**
 * implausibleDensity, per polygon. numTrees per hectare above the threshold reads as a data error.
 * Skips any polygon with a null or zero numTrees or calcArea: about a quarter of polygons carry no
 * numTrees (all of them on some projects), so coverage of this check is partial by nature — that
 * is expected, not a bug.
 */
const densityAnomalies = (polygons: SitePolygonLightDto[]): Anomaly[] => {
  const out: Anomaly[] = [];
  for (const polygon of polygons) {
    const { numTrees, calcArea } = polygon;
    if (numTrees == null || numTrees === 0 || calcArea == null || calcArea === 0) continue;

    const density = numTrees / calcArea;
    if (density <= IMPLAUSIBLE_TREES_PER_HECTARE) continue;

    const name = polygon.name ?? polygon.polygonUuid ?? polygon.uuid;
    out.push(
      build({
        type: "implausibleDensity",
        source: "watchlist",
        level: "polygon",
        entityUuid: polygon.uuid,
        entityName: name,
        severity: "medium",
        title: `Implausible density: ${Math.round(density)} trees/ha`,
        detail: `Polygon "${name}" records ${numTrees} trees over ${calcArea.toFixed(2)} ha (${Math.round(
          density
        )} trees/ha, threshold ${IMPLAUSIBLE_TREES_PER_HECTARE}).`
      })
    );
  }
  return out;
};

/**
 * noActivityAfterPlantStart, per site. A site with zero approved polygons whose earliest plant-start
 * is in the past.
 *
 * Limitation: there is no site-level "expected plant-start" field in the data we fetch. plantStart
 * lives on the individual polygon records, so "the site's earliest plant-start" is derived as the
 * min plantStart across that site's polygons (any status). When a site carries no plantStart at all
 * we fall back to flagging purely on "zero approved polygons" and say so in the detail, since we
 * cannot confirm the timing.
 */
const noActivityAnomalies = (sites: SiteView[], now: Date): Anomaly[] => {
  const out: Anomaly[] = [];
  for (const site of sites) {
    if (site.approvedPolygons > 0) continue;

    const plantStart = site.earliestPlantStart;
    if (plantStart != null) {
      if (plantStart >= now) continue; // Planting has not started yet; zero approved is expected.
      const monthsElapsed = monthsBetween(plantStart, now);
      out.push(
        build({
          type: "noActivityAfterPlantStart",
          source: "watchlist",
          level: "site",
          entityUuid: site.siteUuid,
          entityName: site.siteName,
          severity: "medium",
          title: "No approved polygons after plant-start",
          detail: `Site "${site.siteName}" has no approved polygons ${monthsElapsed} months after its earliest plant-start.`
        })
      );
    } else {
      out.push(
        build({
          type: "noActivityAfterPlantStart",
          source: "watchlist",
          level: "site",
          entityUuid: site.siteUuid,
          entityName: site.siteName,
          severity: "medium",
          title: "No approved polygons",
          detail: `Site "${site.siteName}" has no approved polygons; no plant-start is recorded on its polygons, so the timing cannot be confirmed.`
        })
      );
    }
  }
  return out;
};

// reportsVsPolygons — INTENTIONALLY NOT IMPLEMENTED.
//
// The tree-count half would compare project.treesPlantedCount (a reported total) against the sum of
// polygon numTrees. But numTrees is null on roughly a quarter of polygons in general and on ALL of
// them for some projects (e.g. the Rwanda 2023 demo), so the polygon sum is not a faithful total.
// Comparing a complete reported figure to a partial polygon sum would manufacture a "desync" out of
// missing data, which is exactly the failure the null-handling rules above exist to prevent. The
// hectares half is deliberately excluded too: a prior analysis
// (indicator_monitoring_prototyping/12_semantic_zoom_composability_analysis.md) found that
// "reconciliation" compared a sum to itself. This check stays a stub until a trustworthy reported
// tree source that is independent of the polygon sum exists.

export const computeAnomalies = (input: ComputeAnomaliesInput): Anomaly[] => {
  const now = input.now ?? new Date();
  const { project, rollups, polygons } = input;
  const siteGoals = input.siteHectareGoals ?? {};

  const projectMappedHectares = sumMappedHectares(rollups);
  const sites = buildSiteViews(rollups, polygons);
  const projectEarliestPlantStart = sites.reduce<Date | null>((earliest, site) => {
    if (site.earliestPlantStart == null) return earliest;
    if (earliest == null || site.earliestPlantStart < earliest) return site.earliestPlantStart;
    return earliest;
  }, null);

  const anomalies: Anomaly[] = [
    ...validationAnomalies(polygons),
    ...densityAnomalies(polygons),
    ...noActivityAnomalies(sites, now),

    // Project-level watchlist checks.
    ...mappingAnomalies(
      "project",
      project.uuid,
      project.name,
      projectMappedHectares,
      project.totalHectaresRestoredGoal
    ),
    ...hectaresProgressOutlierAnomalies(
      "project",
      project.uuid,
      project.name,
      projectMappedHectares,
      project.totalHectaresRestoredGoal,
      projectEarliestPlantStart,
      now
    )
  ];

  const desync = treesVsHectaresDesyncAnomaly(input, projectMappedHectares);
  if (desync != null) anomalies.push(desync);

  // Site-level goal-relative checks. Dormant in production (siteGoals is empty), live in tests.
  for (const site of sites) {
    const goal = siteGoals[site.siteUuid] ?? null;
    anomalies.push(
      ...mappingAnomalies("site", site.siteUuid, site.siteName, site.mappedHectares, goal),
      ...hectaresProgressOutlierAnomalies(
        "site",
        site.siteUuid,
        site.siteName,
        site.mappedHectares,
        goal,
        site.earliestPlantStart,
        now
      )
    );
  }

  // Sort: severity high -> low, then level project -> site -> polygon. Stable within a bucket.
  return anomalies.sort((a, b) => {
    const bySeverity = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    if (bySeverity !== 0) return bySeverity;
    return LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level];
  });
};
