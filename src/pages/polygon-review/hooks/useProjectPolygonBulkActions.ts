import { useT } from "@transifex/react";
import { useCallback, useMemo } from "react";

import { pruneSitePolygonsCache } from "@/connections/SitePolygons";
import { usePolygonValidations } from "@/connections/Validation";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import { setPolygonTableHoveredUuid } from "@/context/polygonTableInteraction.store";
import type { SitePolygonLightDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { buildPolygonValidationsMap } from "../../site/[uuid]/components/Modals/validationCriteria";
import type { PolygonTableRow } from "../../site/[uuid]/components/PolygonTableRow";
import type { OverlapFixSelectionSummary } from "../../site/[uuid]/hooks/overlapFix.utils";
import { useSelectedSitePolygons } from "../../site/[uuid]/hooks/useSelectedSitePolygons";
import { useSitePolygonBulkActions } from "../../site/[uuid]/hooks/useSitePolygonBulkActions";
import { useSitePolygonReviewActions } from "../../site/[uuid]/hooks/useSitePolygonReviewActions";
import {
  useSitePolygonValidationPoll,
  useSitePolygonValidationState
} from "../../site/[uuid]/hooks/useSitePolygonValidationPolling";
import { getPolygonTableLoadingLabel } from "../../site/[uuid]/utils/polygonTableLoadingLabel";

const NO_OVERLAP_FIX_SUMMARY: OverlapFixSelectionSummary = {
  overlapCandidates: [],
  fixableCandidates: [],
  notFixableCandidates: []
};
const fetchNoOverlapValidations = async (): Promise<ValidationDto[] | undefined> => undefined;

const refetchPolygons = async () => {
  pruneSitePolygonsCache();
};

type UseProjectPolygonBulkActionsParams = {
  projectUuid: string | null;
  projectName: string | null;
  polygons: SitePolygonLightDto[];
  selectedRows: PolygonTableRow[];
  selectedRowIds: Set<string | number>;
  setSelectedRowIds: (ids: Set<string | number>) => void;
};

export const useProjectPolygonBulkActions = ({
  projectUuid,
  projectName,
  polygons,
  selectedRows,
  selectedRowIds,
  setSelectedRowIds
}: UseProjectPolygonBulkActionsParams) => {
  const t = useT();
  const entityUuid = projectUuid ?? "";
  const { isOpen: isEditPolygonOpen } = usePolygonEditDrawer();
  const {
    closeMapPopups,
    editPolygon,
    polygonApproveConfirmation,
    setPolygonApproveConfirmation,
    polygonRequestInformationConfirmation,
    setPolygonRequestInformationConfirmation
  } = useMapAreaContext();

  const clearBulkTableSelection = useCallback(() => {
    setSelectedRowIds(new Set());
    closeMapPopups();
    setPolygonTableHoveredUuid(null);
  }, [closeMapPopups, setSelectedRowIds]);

  const findTableSitePolygon = useCallback(
    (polygonId: string) => polygons.find(polygon => polygon.polygonUuid === polygonId || polygon.uuid === polygonId),
    [polygons]
  );

  const validationState = useSitePolygonValidationState({ findTableSitePolygon });

  const pagePolygonUuids = useMemo(
    () => polygons.map(polygon => polygon.polygonUuid).filter((uuid): uuid is string => uuid != null && uuid !== ""),
    [polygons]
  );
  const { validations: pageValidations, fetchValidations: fetchPageValidations } =
    usePolygonValidations(pagePolygonUuids);
  const polygonValidations = useMemo(
    () => buildPolygonValidationsMap([...pageValidations, ...validationState.supplementalValidations]),
    [pageValidations, validationState.supplementalValidations]
  );

  const selection = useSelectedSitePolygons({
    polygonsData: polygons,
    selectedRowIds,
    selectedRows,
    isEditPolygonOpen,
    editPolygonUuid: editPolygon.uuid !== "" ? editPolygon.uuid : null
  });

  const bulkActions = useSitePolygonBulkActions({
    entityName: "projects",
    entityUuid,
    downloadName: projectName,
    polygonsData: polygons,
    selectedRows,
    selectedSitePolygons: selection.selectedSitePolygons,
    selectedSitePolygonUuids: selection.selectedSitePolygonUuids,
    selectedGeometryPolygonUuids: selection.selectedGeometryPolygonUuids,
    selectedSubmittablePolygons: selection.selectedSubmittablePolygons,
    selectedSubmittablePolygonUuids: selection.selectedSubmittablePolygonUuids,
    selectedOverlapFixSummary: NO_OVERLAP_FIX_SUMMARY,
    hasSelectedOverlapFailure: false,
    clearBulkTableSelection,
    refetchPolygons,
    fetchAllValidationPages: fetchPageValidations,
    fetchOverlapValidations: fetchNoOverlapValidations,
    onOverlapFixResultsOpen: () => undefined,
    onValidationJobsStarted: validationState.handleValidationJobsStarted,
    onValidationPendingClear: validationState.clearValidationPending,
    onValidationUiCleared: validationState.handleValidationUiCleared
  });

  useSitePolygonValidationPoll({
    entityName: "projects",
    entityUuid,
    pendingValidationPolygonUuids: validationState.pendingValidationPolygonUuids,
    setPendingValidationPolygonUuids: validationState.setPendingValidationPolygonUuids,
    setSupplementalValidations: validationState.setSupplementalValidations,
    setValidationZoomPolygonUuids: validationState.setValidationZoomPolygonUuids,
    priorValidationStatusRef: validationState.priorValidationStatusRef,
    pendingValidationTrackBulkRef: validationState.pendingValidationTrackBulkRef,
    validationRunStartedAtRef: validationState.validationRunStartedAtRef,
    validationAfterCriteriaClearRef: validationState.validationAfterCriteriaClearRef,
    pendingValidationKeyRef: validationState.pendingValidationKeyRef,
    validationPollingGenerationRef: validationState.validationPollingGenerationRef,
    clearValidationPending: validationState.clearValidationPending,
    refetchPolygons,
    fetchPageValidations,
    fetchOverlapValidations: fetchNoOverlapValidations,
    isEditPolygonOpen,
    showValidationResultsModalIfPending: bulkActions.showValidationResultsModalIfPending,
    cancelPendingValidationResultsModal: bulkActions.cancelPendingValidationResultsModal,
    t
  });

  const reviewActions = useSitePolygonReviewActions({
    entityName: "projects",
    entityUuid,
    editPolygonUuid: editPolygon.uuid,
    selectedRows,
    findTableSitePolygon,
    approvePolygons: bulkActions.approvePolygons,
    requestInformationForPolygons: bulkActions.requestInformationForPolygons,
    clearBulkTableSelection,
    polygonApproveConfirmation,
    setPolygonApproveConfirmation,
    polygonRequestInformationConfirmation,
    setPolygonRequestInformationConfirmation,
    t
  });

  const { pendingValidationPolygonUuids } = validationState;
  const { isValidatingPolygons, isDeletingPolygons } = bulkActions;
  const isValidationInProgress = isValidatingPolygons || pendingValidationPolygonUuids.length > 0;

  return {
    refetchPolygons,
    bulkActions,
    reviewActions,
    polygonValidations,
    pendingValidationPolygonUuids,
    selectedGeometryPolygonUuids: selection.selectedGeometryPolygonUuids,
    clearBulkTableSelection,
    isTableLocked: isValidationInProgress || isDeletingPolygons,
    tableLoadingLabel: getPolygonTableLoadingLabel({
      t,
      isFixingOverlaps: false,
      fixingOverlapsCount: 0,
      isSubmittingPolygons: false,
      submittingPolygonCount: 0,
      isValidatingPolygons: isValidationInProgress,
      validatingPolygonCount: isValidatingPolygons
        ? bulkActions.validatingPolygonCount
        : pendingValidationPolygonUuids.length,
      isDeletingPolygons,
      deletingPolygonCount: bulkActions.deletingPolygonCount
    })
  };
};

export type ProjectPolygonBulkActions = ReturnType<typeof useProjectPolygonBulkActions>;
