import type { MappedTagState } from "@/redesignComponents/actions/Tags/MappedTag/MappedTag";

export type ApprovePolygonAreaInput = {
  area: number;
  submission: MappedTagState;
};

export type ApprovedProjectAreaStats = {
  currentArea: number;
  currentPercentage: number;
  afterApprovalArea: number;
  afterApprovalPercentage: number;
  projectGoal: number;
};

export const calculateApprovedProjectAreaStats = (
  projectGoal: number | null | undefined,
  currentApprovedArea: number | null | undefined,
  selectedPolygons: ApprovePolygonAreaInput[]
): ApprovedProjectAreaStats | null => {
  if (projectGoal == null || currentApprovedArea == null) {
    return null;
  }

  const areaBeingApproved = selectedPolygons
    .filter(polygon => polygon.submission !== "approved")
    .reduce((sum, polygon) => sum + (polygon.area ?? 0), 0);

  const afterApprovalArea = currentApprovedArea + areaBeingApproved;
  const currentPercentage = projectGoal > 0 ? (currentApprovedArea / projectGoal) * 100 : 0;
  const afterApprovalPercentage = projectGoal > 0 ? (afterApprovalArea / projectGoal) * 100 : 0;

  return {
    currentArea: currentApprovedArea,
    currentPercentage,
    afterApprovalArea,
    afterApprovalPercentage,
    projectGoal
  };
};
