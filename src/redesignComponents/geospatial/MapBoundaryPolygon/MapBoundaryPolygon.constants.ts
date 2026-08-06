export const STATUSES = [
  "Draft",
  "Pending Approval",
  "Information Required",
  "Approved",
  "Deleted",
  "External Site"
] as const;

export const INTERACTION_STATES = ["default", "hover", "selected", "editable", "selected-overlap"] as const;
export const POLYGON_STATES = [...INTERACTION_STATES, "external"] as const;

export type BoundaryStatus = (typeof STATUSES)[number];
export type PolygonState = (typeof POLYGON_STATES)[number];

export const STATUS_COLORS: Record<BoundaryStatus, string> = {
  Draft: "neutralActive.3",
  "Pending Approval": "neutralActive.1",
  "Information Required": "attention.1",
  Approved: "positive.1",
  Deleted: "neutral.400",
  "External Site": "neutralPassive.2"
};

export const STATE_LABELS: Record<PolygonState, string> = {
  default: "Default",
  hover: "Hover",
  selected: "Selected",
  editable: "Editable",
  "selected-overlap": "Selected Overlap",
  external: "External"
};

export const FILL_OPACITY: Record<PolygonState, number> = {
  default: 0.3,
  hover: 0.6,
  selected: 1,
  editable: 0.4,
  "selected-overlap": 0.7,
  external: 0
};

export const POLYGON_VERTICES = [
  [0.6, 164.7],
  [96.4, 216.6],
  [200.6, 216.6],
  [168.7, 129.5],
  [200.6, 42.5],
  [96.4, 0.6],
  [34.2, 70.9]
];

type MatrixRow = {
  status: BoundaryStatus;
  states: ReadonlyArray<PolygonState | null>;
};

export const ROWS: MatrixRow[] = [
  { status: "Draft", states: INTERACTION_STATES },
  { status: "Pending Approval", states: INTERACTION_STATES },
  { status: "Information Required", states: INTERACTION_STATES },
  { status: "Approved", states: INTERACTION_STATES },
  { status: "Deleted", states: ["default", "hover", null, null, null] },
  { status: "External Site", states: [null, null, null, null, "external"] }
];

export const ROW_TEMPLATE = `repeat(${ROWS.length}, 8.25rem)`;
