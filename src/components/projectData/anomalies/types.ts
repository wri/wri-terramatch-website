/**
 * The anomaly type, shared by every consumer of the watchlist.
 *
 * The product decision this file encodes is that a TerraMatch "anomaly" is one concept with two
 * origins, not two features bolted together. A polygon that failed geometry validation and a
 * project that has mapped 1.3% of its hectare goal are both things a reviewer needs to act on, so
 * they land in one flat list with one shape, one severity scale, and one count. `source` records
 * which origin a given anomaly came from so a filter can still separate them; nothing else in the
 * shape depends on the origin.
 *
 * Everything here is data. The compute layer produces these; the badge, table filter, and Actions
 * view read them. No side effect is described by this type — `suggestedAction` names a control the
 * Actions view should render, it does not perform anything.
 */

/** Which of the two merged signals produced the anomaly. */
export type AnomalySource = "validation" | "watchlist";

/**
 * One member per check. `geometryValidation` is the validation source; the rest are watchlist
 * checks. Kept as a string-literal union (not an enum) so it reads in JSON, in a URL filter, and
 * in a test assertion without a lookup.
 */
export type AnomalyType =
  | "geometryValidation"
  | "underMapped"
  | "overMapped"
  | "noActivityAfterPlantStart"
  | "implausibleDensity"
  | "treesVsHectaresDesync"
  | "hectaresProgressOutlier"
  | "reportsVsPolygons";

/** The entity an anomaly is attached to. Matches the Semantic Zoom level vocabulary. */
export type AnomalyLevel = "project" | "site" | "polygon";

/**
 * Severity is a fixed three-point scale, not a score. `high` is "this is almost certainly wrong or
 * blocked"; `medium` is "this looks off, a human should check"; `low` is reserved and currently
 * unused so the scale has somewhere to grow downward without a type change.
 */
export type AnomalySeverity = "high" | "medium" | "low";

/**
 * A declarative description of the control the Actions view should offer. It is intentionally not
 * a callback: the data layer must stay pure and serialisable, and the Actions view owns every side
 * effect. `kind` lets the view pick the right control and permission gate; `label` is the button
 * text.
 */
export type SuggestedActionKind = "review" | "approve" | "fix-data" | "investigate";

export type SuggestedAction = {
  label: string;
  kind: SuggestedActionKind;
};

export type Anomaly = {
  /**
   * Stable and deterministic: derived only from type, level, and entity uuid. The same input data
   * always yields the same id, so a badge count, a table filter, and the Actions view all agree on
   * what is one anomaly, and re-computing does not churn keys.
   */
  id: string;
  source: AnomalySource;
  type: AnomalyType;
  level: AnomalyLevel;
  /** The uuid of the project, site, or polygon this anomaly is about. */
  entityUuid: string;
  /** Human-readable name of that entity, for display without a second lookup. */
  entityName: string;
  severity: AnomalySeverity;
  /** Short headline, e.g. "Under-mapped: 1.3% of hectare goal". */
  title: string;
  /** One sentence stating the actual numbers behind the anomaly. Honest about what is measured. */
  detail: string;
  suggestedAction: SuggestedAction;
};

/** Deterministic id for an anomaly. Exported so tests and consumers can reconstruct it. */
export const anomalyId = (type: AnomalyType, level: AnomalyLevel, entityUuid: string): string =>
  `${type}:${level}:${entityUuid}`;
