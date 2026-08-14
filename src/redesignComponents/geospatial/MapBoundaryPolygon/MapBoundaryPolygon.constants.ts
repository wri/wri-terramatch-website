export const STATUSES = [
  "Draft",
  "Pending Approval",
  "Information Required",
  "Approved",
  "Deleted",
  "External"
] as const;

export const STYLES = ["Default", "Hover", "Selected", "Editable", "Selected Overlap"] as const;

export type BoundaryStatus = (typeof STATUSES)[number];
export type PolygonStyle = (typeof STYLES)[number];

export const STATUS_COLORS: Record<BoundaryStatus, string> = {
  Draft: "neutralActive.3",
  "Pending Approval": "neutralActive.1",
  "Information Required": "attention.1",
  Approved: "positive.1",
  Deleted: "neutral.400",
  External: "neutralPassive.2"
};

export const FILL_OPACITY: Record<PolygonStyle, number> = {
  Default: 0.3,
  Hover: 0.6,
  Selected: 1,
  Editable: 0.4,
  "Selected Overlap": 0.7
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
  styles: ReadonlyArray<PolygonStyle | null>;
};

export const ROWS: MatrixRow[] = [
  { status: "Draft", styles: STYLES },
  { status: "Pending Approval", styles: STYLES },
  { status: "Information Required", styles: STYLES },
  { status: "Approved", styles: STYLES },
  { status: "Deleted", styles: ["Default", "Hover", null, null, null] },
  { status: "External", styles: [null, null, null, null, "Selected Overlap"] }
];

export const ROW_TEMPLATE = `repeat(${ROWS.length}, 8.25rem)`;
