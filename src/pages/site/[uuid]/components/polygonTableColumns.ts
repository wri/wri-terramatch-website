import { TableColumn } from "@/redesignComponents/dataDisplay/Table/Table";

type Translate = (key: string, params?: Record<string, unknown>) => string;

type PolygonTableColumnsOptions = {
  /** Adds the Site Name and Project Name columns used when the table spans more than one site. */
  showEntityColumns?: boolean;
};

export const buildPolygonTableColumns = (
  t: Translate,
  { showEntityColumns = false }: PolygonTableColumnsOptions = {}
): TableColumn[] => [
  { key: "polygonName", label: t("Polygon Name"), sortable: true, width: "17.75rem", sticky: true },
  { key: "submission", label: t("Submission"), sortable: true, width: "15.875rem" },
  { key: "validation", label: t("Validation"), sortable: true, width: "12.75rem" },
  ...(showEntityColumns
    ? [
        { key: "siteName", label: t("Site Name"), sortable: true, width: "12.75rem" },
        { key: "projectName", label: t("Project Name"), sortable: true, width: "12.75rem" }
      ]
    : []),
  { key: "restorationPracticeSort", label: t("Restoration Practice"), sortable: true, width: "15.5rem" },
  { key: "targetLandUseSort", label: t("Target Land Use"), sortable: true, width: "16.75rem" },
  { key: "treeDistributionSort", label: t("Tree Distribution"), sortable: true, width: "15.875rem" },
  { key: "plantingDate", label: t("Planting Start Date"), sortable: true, width: "12.5rem" },
  { key: "treesPlanted", label: t("Trees Planted"), sortable: true, width: "12.75rem" },
  { key: "area", label: t("Area (ha)"), sortable: true, width: "15.75rem" },
  { key: "submissionCycleSort", label: t("Submission Cycle"), sortable: true, width: "12rem" },
  { key: "source", label: t("Source"), sortable: true, width: "12rem" },
  { key: "disturbance", label: t("Disturbance"), sortable: true, width: "10rem" }
];
