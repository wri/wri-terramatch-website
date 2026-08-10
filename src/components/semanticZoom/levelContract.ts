/**
 * The Semantic Zoom level contract, expressed as data rather than as logic scattered across
 * components.
 *
 * The feature's premise is that a number changes meaning as you descend Project -> Site ->
 * Polygon, and that the UI should say so out loud. That only holds if there is exactly one place
 * stating, for every indicator at every level, how it is aggregated, where it came from, and
 * whether a goal exists to compare it against. This file is that place, and it is meant to be
 * reviewable on its own by someone who does not read React.
 */

export const LEVELS = ["project", "site", "polygon"] as const;
export type Level = (typeof LEVELS)[number];

/**
 * How a value at this level is produced from the level below.
 *
 * `native` means the value is stored on the record itself and is not aggregated at all.
 */
export type AggregationRule = "native" | "sum" | "areaWeightedMean";

export const AGGREGATION_LABELS: Record<AggregationRule, string> = {
  native: "as measured",
  sum: "summed",
  areaWeightedMean: "area-weighted mean"
};

/**
 * Provenance tiers. These describe how a number came to exist, which is the difference between a
 * figure a partner typed into a report and one derived from imagery.
 *
 * `reported` is the only tier that is a claim rather than a measurement, and it is never merged
 * into the same row as a measured value.
 */
export type SourceTier = "field" | "satellite" | "modeled" | "reported" | "derived" | "notMeasured";

export const SOURCE_LABELS: Record<SourceTier, string> = {
  field: "Field measured",
  satellite: "Satellite derived",
  modeled: "Modeled",
  reported: "Reported",
  derived: "Aggregated",
  notMeasured: "Not measured"
};

export type IndicatorKey = "hectares" | "treeCover" | "treeCoverLoss" | "treeCount" | "fieldMonitoring" | "msuCarbon";

export type IndicatorContract = {
  key: IndicatorKey;
  label: string;
  unit: string | null;
  /**
   * False for the three indicators with no data in this snapshot. They must render an em-dash and
   * a "not measured" chip. Rendering 0 would turn absent data into a claim that nothing happened.
   */
  hasData: boolean;
  rule: Record<Level, AggregationRule>;
  source: Record<Level, SourceTier>;
  /** Goals exist only where the schema actually has them. */
  hasGoal: Record<Level, boolean>;
};

const NO_GOAL: Record<Level, boolean> = { project: false, site: false, polygon: false };

export const LEVEL_CONTRACT: Record<IndicatorKey, IndicatorContract> = {
  hectares: {
    key: "hectares",
    label: "Hectares under restoration",
    unit: "ha",
    hasData: true,
    rule: { project: "sum", site: "sum", polygon: "native" },
    source: { project: "derived", site: "derived", polygon: "field" },
    hasGoal: { project: true, site: true, polygon: false }
  },
  treeCover: {
    key: "treeCover",
    label: "Tree cover",
    unit: "%",
    hasData: true,
    // A percentage cannot be summed. Weighting by polygon area is what makes the site and project
    // figures mean anything.
    rule: { project: "areaWeightedMean", site: "areaWeightedMean", polygon: "native" },
    source: { project: "satellite", site: "satellite", polygon: "satellite" },
    hasGoal: NO_GOAL
  },
  treeCoverLoss: {
    key: "treeCoverLoss",
    label: "Tree cover loss",
    unit: "ha",
    hasData: true,
    // The original contract declared a geometric union here while the maths was a plain sum, so
    // the printed rule over-promised whenever polygons overlapped. The rollup endpoint sums each
    // polygon's per-year loss values, so the honest label is "summed". If a true union is wanted,
    // it is a geometry problem and this label has to change with it, not before it.
    rule: { project: "sum", site: "sum", polygon: "native" },
    source: { project: "satellite", site: "satellite", polygon: "satellite" },
    hasGoal: NO_GOAL
  },
  treeCount: {
    key: "treeCount",
    label: "Tree count (measured)",
    unit: "trees",
    hasData: false,
    rule: { project: "sum", site: "sum", polygon: "native" },
    source: { project: "notMeasured", site: "notMeasured", polygon: "notMeasured" },
    hasGoal: { project: true, site: false, polygon: false }
  },
  fieldMonitoring: {
    key: "fieldMonitoring",
    label: "Field monitoring",
    unit: null,
    hasData: false,
    rule: { project: "areaWeightedMean", site: "areaWeightedMean", polygon: "native" },
    source: { project: "notMeasured", site: "notMeasured", polygon: "notMeasured" },
    hasGoal: NO_GOAL
  },
  msuCarbon: {
    key: "msuCarbon",
    label: "MSU carbon",
    unit: "tCO2e",
    hasData: false,
    rule: { project: "sum", site: "sum", polygon: "native" },
    source: { project: "notMeasured", site: "notMeasured", polygon: "notMeasured" },
    hasGoal: NO_GOAL
  }
};

/** Stable render order for the indicator panel. Data-bearing indicators first. */
export const INDICATOR_ORDER: IndicatorKey[] = [
  "hectares",
  "treeCover",
  "treeCoverLoss",
  "treeCount",
  "fieldMonitoring",
  "msuCarbon"
];

export const indicatorsForLevel = (level: Level) =>
  INDICATOR_ORDER.map(key => {
    const contract = LEVEL_CONTRACT[key];
    return {
      contract,
      rule: contract.rule[level],
      ruleLabel: AGGREGATION_LABELS[contract.rule[level]],
      source: contract.source[level],
      sourceLabel: SOURCE_LABELS[contract.source[level]],
      hasGoal: contract.hasGoal[level]
    };
  });
