import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import classNames from "classnames";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import PolygonsMap from "@/components/elements/Map-mapbox/components/PolygonsMap";
import {
  type PolygonDrawCanUndoChangedDetail,
  dispatchUndoPolygonDrawEvent,
  POLYGON_DRAW_CAN_UNDO_CHANGED_EVENT
} from "@/components/elements/Map-mapbox/interactions/draftDrawEvents";
import { resolvePolygonTableRowId } from "@/components/elements/Map-mapbox/sitePolygonPopupUtils";
import { downloadMultiplePolygonsGeoJson } from "@/components/elements/Map-mapbox/utils";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { clipPolygonListAsync } from "@/connections/PolygonClipping";
import type { BulkSitePolygonAttributeChanges, PolygonStatus } from "@/connections/SitePolygons";
import {
  bulkDeleteSitePolygons,
  bulkUpdateSitePolygonAttributes,
  bulkUpdateSitePolygonStatus,
  loadAllSitePolygons,
  pruneSitePolygonsCache,
  useAllSitePolygons
} from "@/connections/SitePolygons";
import { createPolygonValidation, useAllSiteValidations } from "@/connections/Validation";
import { POLYGON_APPROVED, POLYGON_PENDING_APPROVAL } from "@/constants/polygonStatuses";
import { AnrMapOverlayProvider } from "@/context/anrMapOverlay.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { openPolygonPopupFromMapArea } from "@/context/mapArea.utils";
import { useNotificationContext } from "@/context/notification.provider";
import {
  EMPTY_POLYGONS,
  PolygonEditDrawerDataSync,
  PolygonEditDrawerProvider,
  usePolygonEditDrawer
} from "@/context/polygonEditDrawer.provider";
import { openPolygonEditDrawerForSitePolygon } from "@/context/polygonEditDrawer.utils";
import {
  consumePendingPolygonFocusUuid,
  setPolygonTableHoveredUuid,
  useSyncPolygonTableSelectionStore
} from "@/context/polygonTableInteraction.store";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ResizeBox from "@/redesignComponents/containers/ResizableSplitView/ResizableBox";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import LoadingTable from "@/redesignComponents/dataDisplay/Table/components/LoadingTable";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { useTableSelection } from "@/redesignComponents/dataDisplay/Table/useTableSelection";
import { AreaHectaresIcon, DownloadIcon, PlusIcon, TreeIcon } from "@/redesignComponents/foundations/Icons";
import UndoIcon from "@/redesignComponents/foundations/Icons/Function/UndoIcon";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

import DeletePolygon from "../components/Modals/DeletePolygon";
import EditPhotoDetails from "../components/Modals/GeotaggedPhotos/EditPhotoDetails";
import OverlapFix, { OverlapFixPolygon } from "../components/Modals/OverlapFix";
import PolygonSubmitted from "../components/Modals/PolygonSubmitted";
import SubmitPolygons from "../components/Modals/SubmitPolygons";
import UploadError from "../components/Modals/UploadError";
import UploadPhotos from "../components/Modals/UploadPhotos";
import UploadPolygons from "../components/Modals/UploadPolygons";
import { buildPolygonValidationsMap } from "../components/Modals/validationCriteria";
import PolygonBulkActionToolbar from "../components/PolygonBulkActionToolbar";
import PolygonBulkEditDrawer from "../components/PolygonBulkEditDrawer";
import type { PolygonOverlapFixParams } from "../components/polygonEdit.types";
import { prunePolygonValidationCache } from "../components/polygonEditSave";
import { PolygonTableInteractionActionsProvider } from "../components/polygonTableInteractionContext";
import { PolygonTableRow } from "../components/PolygonTableRow";
import { renderPolygonTableRow } from "../components/PolygonTableRowConnected";
import { getPolygonsTableStyles } from "../components/polygonTableStyles";
import PolygonToolbar from "../components/PolygonToolbar";
import {
  type OverlapFixSelectionSummary,
  buildOverlapFixResultPolygons,
  canAutoFixOverlapSelection,
  extractClippedVersions,
  getSelectedOverlapFixSummary,
  hasOverlapFailureInSelection,
  hasOverlapValidationFailure,
  resolveActivePolygonAfterOverlapFix
} from "../hooks/overlapFix.utils";
import { useDownloadSitePolygons } from "../hooks/useDownloadSitePolygons";
import { useSitePolygonFilters } from "../hooks/useSitePolygonFilters";
import { useSitePolygonOverlap } from "../hooks/useSitePolygonOverlap";
import { useSitePolygonTableData } from "../hooks/useSitePolygonTableData";
import { useStartSitePolygonDrawing } from "../hooks/useStartSitePolygonDrawing";
import {
  closePolygonProgressToast,
  getDeletingProgressLabel,
  getDownloadingPolygonsProgressLabel,
  getFixingOverlapsProgressLabel,
  getPolygonOperationToastLabels,
  getSubmittingProgressLabel,
  getValidatingProgressLabel,
  POLYGON_TOAST_IDS,
  showPolygonCompleteToast,
  showPolygonErrorToast,
  showPolygonProgressToast
} from "../utils/polygonOperationToasts";

interface SitePolygonsTabProps {
  site: SiteFullDto;
}

export type { PolygonTableRow } from "../components/PolygonTableRow";

const SitePolygonsTabContent: FC<SitePolygonsTabProps> = ({ site }) => {
  const t = useT();
  const toastLabels = useMemo(() => getPolygonOperationToastLabels(t), [t]);
  const { isOpen: isEditPolygonOpen, suppressMapSelectionHighlight } = usePolygonEditDrawer();
  const {
    isUserDrawingEnabled,
    editPolygon,
    setSiteData,
    resetSiteMapInteractionState,
    closeMapPopups,
    invalidatePolygonMapTiles,
    polygonSubmitConfirmation,
    setPolygonSubmitConfirmation,
    editPhotoDetailsMedia,
    setEditPhotoDetailsMedia,
    setShouldRefetchPolygonData
  } = useMapAreaContext();
  const { openNotification } = useNotificationContext();

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const pendingOverlapFixPolygonIdRef = useRef<string | null>(null);
  const pendingPolygonSubmittedModalRef = useRef(false);
  const [deletePayload, setDeletePayload] = useState<{
    polygons: PolygonTableRow[];
    sitePolygonUuids: string[];
  } | null>(null);
  const [submitPayload, setSubmitPayload] = useState<{
    submittablePolygonUuids: string[];
    submittedNames: string[];
    eligibleCount: number;
    totalCount: number;
  } | null>(null);
  const [bulkEditPayload, setBulkEditPayload] = useState<{
    polygons: PolygonTableRow[];
    sitePolygonUuids: string[];
  } | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOverlapFixModal, setOverlapFixModal] = useState(false);
  const [overlapFixResults, setOverlapFixResults] = useState<{
    polygonsFixed: OverlapFixPolygon[];
    polygonsNotFixed: OverlapFixPolygon[];
  }>({ polygonsFixed: [], polygonsNotFixed: [] });
  const [showSubmitPolygonsModal, setSubmitPolygonsModal] = useState(false);
  const [showPolygonSubmittedModal, setPolygonSubmittedModal] = useState(false);
  const [submittedPolygonNames, setSubmittedPolygonNames] = useState<string[]>([]);
  const [showDeletePolygonModal, setDeletePolygonModal] = useState(false);
  const [showUploadErrorModal, setUploadErrorModal] = useState(false);
  const [showUploadPhotosModal, setShowUploadPhotosModal] = useState(false);
  const [showBulkEditDrawer, setShowBulkEditDrawer] = useState(false);
  const [uploadedPolygonUuidToOpen, setUploadedPolygonUuidToOpen] = useState<string | null>(null);
  const [focusPolygonUuid, setFocusPolygonUuid] = useState<string | null>(null);
  const [isStickyActive, setIsStickyActive] = useState(false);
  const [isDownloadingSelectedPolygons, setIsDownloadingSelectedPolygons] = useState(false);
  const [isBulkUpdatingPolygons, setIsBulkUpdatingPolygons] = useState(false);
  const [isValidatingPolygons, setIsValidatingPolygons] = useState(false);
  const [validatingPolygonCount, setValidatingPolygonCount] = useState(0);
  const [isFixingOverlaps, setIsFixingOverlaps] = useState(false);
  const [fixingOverlapsCount, setFixingOverlapsCount] = useState(0);
  const [isDeletingPolygons, setIsDeletingPolygons] = useState(false);
  const [deletingPolygonCount, setDeletingPolygonCount] = useState(0);
  const [canUndoPolygonDraw, setCanUndoPolygonDraw] = useState(false);
  const {
    polygonSearch,
    polygonFilters,
    sitePolygonFilter,
    activeFilterLabels,
    setPolygonSearch,
    setPolygonFilters,
    handleClearPolygonFilters
  } = useSitePolygonFilters({ t });

  const {
    data: polygonsQueryData,
    isLoading: isLoadingPolygons,
    error: polygonLoadError,
    progress: polygonLoadProgress,
    total: polygonLoadTotal,
    refetch: refetchPolygons
  } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: site.uuid,
    enabled: site.uuid != null && site.uuid !== "",
    filter: sitePolygonFilter
  });

  const polygonsData = polygonsQueryData ?? EMPTY_POLYGONS;
  const isSitePolygonsLoading = isLoadingPolygons || isValidatingPolygons || isFixingOverlaps || isDeletingPolygons;

  const { allValidations, fetchAllValidationPages } = useAllSiteValidations(site.uuid);
  const polygonValidations = useMemo(() => buildPolygonValidationsMap(allValidations), [allValidations]);

  const { polygonRows, columns, totalTreesPlanted, totalRestorationAreaHa } = useSitePolygonTableData({
    polygonsData,
    t
  });
  const { polygonsWithOverlapCount, overlapPolygons, overlapValidations, fetchOverlapValidations } =
    useSitePolygonOverlap({
      siteUuid: site.uuid,
      polygonsData
    });

  const overlapPolygonValidations = useMemo(() => buildPolygonValidationsMap(overlapValidations), [overlapValidations]);

  const { selectedRows, selectedRowIds, setSelectedRowIds, handleRowSelected, onAllItemsSelected } =
    useTableSelection<PolygonTableRow>(true, polygonRows);

  const selectedPolygonUuids = useMemo(() => Array.from(selectedRowIds, id => String(id)), [selectedRowIds]);
  const overlapPolygonsForMap = useMemo(() => {
    if (selectedPolygonUuids.length === 0) {
      return [];
    }
    const selectedIds = new Set(selectedPolygonUuids);
    return overlapPolygons.filter(point => selectedIds.has(point.polygonUuid));
  }, [overlapPolygons, selectedPolygonUuids]);
  const {
    selectedSitePolygons,
    selectedSitePolygonUuids,
    selectedGeometryPolygonUuids,
    selectedSubmittablePolygons,
    selectedSubmittablePolygonUuids
  } = useMemo(() => {
    const sitePolygons: typeof polygonsData = [];
    const selectedSitePolygonUuids: string[] = [];
    const selectedGeometryPolygonUuids: string[] = [];
    const submittablePolygons: typeof polygonsData = [];

    for (const polygon of polygonsData) {
      const rowId = polygon.polygonUuid ?? polygon.uuid ?? "";
      if (!selectedRowIds.has(rowId)) {
        continue;
      }

      sitePolygons.push(polygon);

      if (polygon.uuid != null && polygon.uuid.length > 0) {
        selectedSitePolygonUuids.push(polygon.uuid);
      }
      if (polygon.polygonUuid != null && polygon.polygonUuid.length > 0) {
        selectedGeometryPolygonUuids.push(polygon.polygonUuid);
      }
      if (polygon.uuid != null && polygon.status !== POLYGON_PENDING_APPROVAL && polygon.status !== POLYGON_APPROVED) {
        submittablePolygons.push(polygon);
      }
    }

    return {
      selectedSitePolygons: sitePolygons,
      selectedSitePolygonUuids,
      selectedGeometryPolygonUuids,
      selectedSubmittablePolygons: submittablePolygons,
      selectedSubmittablePolygonUuids: submittablePolygons
        .map(polygon => polygon.uuid)
        .filter((uuid): uuid is string => uuid != null && uuid.length > 0)
    };
  }, [polygonsData, selectedRowIds]);

  const selectedOverlapFixSummary = useMemo(
    () => getSelectedOverlapFixSummary(selectedRows, overlapPolygonValidations, polygonsData),
    [selectedRows, overlapPolygonValidations, polygonsData]
  );
  const hasSelectedOverlapFailure = hasOverlapFailureInSelection(selectedOverlapFixSummary);
  const hasFixableSelectedOverlap = canAutoFixOverlapSelection(selectedOverlapFixSummary);

  const openPolygonEditDrawerByPolygonId = useCallback(
    (polygonId: string) => {
      const sitePolygon = polygonsData.find(polygon => polygon.polygonUuid === polygonId || polygon.uuid === polygonId);
      if (sitePolygon != null) {
        openPolygonEditDrawerForSitePolygon(sitePolygon, sitePolygon.name ?? undefined);
      }
    },
    [polygonsData]
  );

  const handleViewOverlapFixPolygon = useCallback(
    (polygonUuid: string) => {
      setOverlapFixModal(false);

      if (polygonFilters.hasOverlap) {
        pendingOverlapFixPolygonIdRef.current = polygonUuid;
        setPolygonFilters(current => ({ ...current, hasOverlap: false }));
        return;
      }

      openPolygonEditDrawerByPolygonId(polygonUuid);
    },
    [openPolygonEditDrawerByPolygonId, polygonFilters.hasOverlap, setPolygonFilters]
  );

  useEffect(() => {
    const pendingPolygonId = pendingOverlapFixPolygonIdRef.current;
    if (pendingPolygonId == null || polygonFilters.hasOverlap || isLoadingPolygons) {
      return;
    }

    pendingOverlapFixPolygonIdRef.current = null;
    openPolygonEditDrawerByPolygonId(pendingPolygonId);
  }, [openPolygonEditDrawerByPolygonId, polygonFilters.hasOverlap, isLoadingPolygons, polygonsData]);

  useEffect(() => {
    if (uploadedPolygonUuidToOpen == null || isLoadingPolygons) {
      return;
    }

    const uploadedPolygonExistsInTableData = polygonsData.some(
      polygon => polygon.uuid === uploadedPolygonUuidToOpen || polygon.polygonUuid === uploadedPolygonUuidToOpen
    );
    if (!uploadedPolygonExistsInTableData) {
      void loadAllSitePolygons({
        entityName: "sites",
        entityUuid: site.uuid,
        enabled: site.uuid != null && site.uuid !== ""
      })
        .then(allSitePolygons => {
          const uploadedPolygon = allSitePolygons.find(
            polygon => polygon.uuid === uploadedPolygonUuidToOpen || polygon.polygonUuid === uploadedPolygonUuidToOpen
          );
          if (uploadedPolygon == null) {
            return;
          }

          openPolygonEditDrawerForSitePolygon(uploadedPolygon, uploadedPolygon.name ?? undefined);
          setUploadedPolygonUuidToOpen(null);
        })
        .catch(error => {
          Log.error("Failed to auto-open uploaded polygon in edit drawer:", error);
        });
      return;
    }

    openPolygonEditDrawerByPolygonId(uploadedPolygonUuidToOpen);
    setUploadedPolygonUuidToOpen(null);
  }, [isLoadingPolygons, openPolygonEditDrawerByPolygonId, polygonsData, site.uuid, uploadedPolygonUuidToOpen]);

  useEffect(() => {
    if (isLoadingPolygons) {
      return;
    }

    const pendingFocusUuid = consumePendingPolygonFocusUuid();
    if (pendingFocusUuid == null || pendingFocusUuid === "") {
      return;
    }

    const rowId = resolvePolygonTableRowId(polygonsData, pendingFocusUuid);
    if (rowId == null) {
      return;
    }

    setPolygonTableHoveredUuid(rowId);
    setFocusPolygonUuid(pendingFocusUuid);
  }, [isLoadingPolygons, polygonsData]);

  const handleFocusPolygonConsumed = useCallback(() => {
    const focusedUuid = focusPolygonUuid;
    setFocusPolygonUuid(null);
    if (focusedUuid != null && focusedUuid !== "") {
      openPolygonPopupFromMapArea(focusedUuid);
    }
  }, [focusPolygonUuid]);

  const handleOverlapFixModalClose = useCallback(() => {
    setOverlapFixModal(false);
    window.setTimeout(() => {
      setOverlapFixResults({ polygonsFixed: [], polygonsNotFixed: [] });
    }, 0);
  }, []);

  const openOverlapFixResultsModal = useCallback(
    (results: { polygonsFixed: OverlapFixPolygon[]; polygonsNotFixed: OverlapFixPolygon[] }) => {
      if (results.polygonsFixed.length === 0 && results.polygonsNotFixed.length === 0) {
        return;
      }

      setOverlapFixResults(results);
      window.setTimeout(() => {
        setOverlapFixModal(true);
      }, 0);
    },
    []
  );

  useEffect(() => {
    setSiteData(site);
  }, [setSiteData, site]);

  useEffect(() => {
    return () => {
      resetSiteMapInteractionState();
    };
  }, [resetSiteMapInteractionState]);

  useEffect(() => {
    if (isLoadingPolygons) return;
    const visibleRowIds = new Set(polygonRows.map(row => row.id));
    setSelectedRowIds(prev => {
      const next = new Set(Array.from(prev).filter(id => visibleRowIds.has(String(id))));
      return next.size === prev.size ? prev : next;
    });
  }, [polygonRows, setSelectedRowIds, isLoadingPolygons]);

  const clearTableSelection = useCallback(() => {
    setSelectedRowIds(new Set<string>());
  }, [setSelectedRowIds]);

  const clearBulkTableSelection = useCallback(() => {
    clearTableSelection();
    closeMapPopups();
    setPolygonTableHoveredUuid(null);
  }, [clearTableSelection, closeMapPopups]);

  const handleSelectOverlapPolygons = useCallback(() => {
    const visiblePolygonIds = new Set(
      polygonsData
        .map(polygon => polygon.polygonUuid ?? polygon.uuid)
        .filter((id): id is string => id != null && id !== "")
    );
    const overlapRowIds = overlapValidations
      .filter(hasOverlapValidationFailure)
      .map(validation => validation.polygonUuid)
      .filter((id): id is string => id != null && id !== "" && visiblePolygonIds.has(id));
    setSelectedRowIds(new Set(overlapRowIds));
  }, [overlapValidations, polygonsData, setSelectedRowIds]);

  const handleOpenDeletePolygonModal = useCallback(() => {
    setDeletePayload({
      polygons: selectedRows,
      sitePolygonUuids: selectedSitePolygonUuids
    });
    clearBulkTableSelection();
    setDeletePolygonModal(true);
  }, [clearBulkTableSelection, selectedRows, selectedSitePolygonUuids]);

  const handleBulkDraw = useCallback(() => {
    openPolygonEditDrawerForSitePolygon();
  }, []);

  const handleBulkDelete = useCallback(async () => {
    const sitePolygonUuids = deletePayload?.sitePolygonUuids ?? [];
    if (sitePolygonUuids.length === 0) {
      openNotification("error", t("Error!"), t("Could not find selected polygons to delete"));
      return;
    }

    setIsDeletingPolygons(true);
    setDeletingPolygonCount(sitePolygonUuids.length);
    showPolygonProgressToast(t, getDeletingProgressLabel(t, sitePolygonUuids.length), POLYGON_TOAST_IDS.deleting);

    try {
      await bulkDeleteSitePolygons(sitePolygonUuids);
      setDeletePolygonModal(false);
      setDeletePayload(null);
      closeMapPopups();
      setPolygonTableHoveredUuid(null);
      invalidatePolygonMapTiles();
      await refetchPolygons();
      closePolygonProgressToast(POLYGON_TOAST_IDS.deleting);
      showPolygonCompleteToast(toastLabels.deletingComplete);
    } catch (error) {
      Log.error("Failed to delete selected polygons:", error);
      closePolygonProgressToast(POLYGON_TOAST_IDS.deleting);
      openNotification("error", t("Error!"), t("Error deleting polygons"));
      throw error;
    } finally {
      setIsDeletingPolygons(false);
      setDeletingPolygonCount(0);
    }
  }, [closeMapPopups, deletePayload, invalidatePolygonMapTiles, openNotification, refetchPolygons, t, toastLabels]);

  const handlePolygonSubmittedModalChange = useCallback((open: boolean) => {
    setPolygonSubmittedModal(open);
    if (!open) {
      setSubmittedPolygonNames([]);
    }
  }, []);

  const runPolygonValidation = useCallback(
    async (polygonUuids: string[]) => {
      if (polygonUuids.length === 0) {
        return;
      }

      await createPolygonValidation({ polygonUuids });
      ApiSlice.pruneCache("validations");
      pruneSitePolygonsCache();
      await Promise.all([refetchPolygons(), fetchAllValidationPages(true), fetchOverlapValidations(true)]);
    },
    [fetchAllValidationPages, fetchOverlapValidations, refetchPolygons]
  );

  const handleRunValidation = useCallback(
    async (polygonUuids: string[]) => {
      if (polygonUuids.length === 0) {
        return;
      }

      try {
        setValidatingPolygonCount(polygonUuids.length);
        setIsValidatingPolygons(true);
        await runPolygonValidation(polygonUuids);
      } catch (error) {
        Log.error("Failed to validate selected polygons:", error);
        openNotification("error", t("Error!"), t("Failed to validate polygons"));
        throw error;
      } finally {
        setIsValidatingPolygons(false);
        setValidatingPolygonCount(0);
      }
    },
    [openNotification, runPolygonValidation, t]
  );

  const handlePolygonDeletingChange = useCallback((isDeleting: boolean, count = 0) => {
    setIsDeletingPolygons(isDeleting);
    setDeletingPolygonCount(count);
  }, []);

  const handleDrawerOverlapFixed = useCallback(
    async (params: PolygonOverlapFixParams) => {
      pruneSitePolygonsCache();
      prunePolygonValidationCache(params.previousPolygonUuid);

      invalidatePolygonMapTiles();

      const refreshedPolygons = await loadAllSitePolygons({
        entityName: "sites",
        entityUuid: site.uuid,
        enabled: site.uuid != null && site.uuid !== ""
      });

      await Promise.all([refetchPolygons(), fetchAllValidationPages(true), fetchOverlapValidations(true)]);

      const updatedPolygon = resolveActivePolygonAfterOverlapFix(
        refreshedPolygons,
        {
          previousPolygonUuid: params.previousPolygonUuid,
          primaryUuid: params.primaryUuid,
          sitePolygonUuid: params.sitePolygonUuid
        },
        params.clippedVersions ?? []
      );

      if (updatedPolygon?.polygonUuid != null && updatedPolygon.polygonUuid !== "") {
        prunePolygonValidationCache(params.previousPolygonUuid, updatedPolygon.polygonUuid);
      }

      return updatedPolygon;
    },
    [fetchAllValidationPages, fetchOverlapValidations, invalidatePolygonMapTiles, refetchPolygons, site.uuid]
  );

  const handleOverlapFix = useCallback(
    async (overlapSummary: OverlapFixSelectionSummary) => {
      const { fixableCandidates, notFixableCandidates } = overlapSummary;

      if (fixableCandidates.length === 0) {
        openOverlapFixResultsModal({
          polygonsFixed: [],
          polygonsNotFixed: notFixableCandidates.map(({ id, name }) => ({ id, name }))
        });
        return;
      }

      setFixingOverlapsCount(fixableCandidates.length);
      setIsFixingOverlaps(true);
      showPolygonProgressToast(
        t,
        getFixingOverlapsProgressLabel(t, fixableCandidates.length),
        POLYGON_TOAST_IDS.fixingOverlaps
      );

      try {
        const response = await clipPolygonListAsync(fixableCandidates.map(candidate => candidate.id));
        const fixedVersions = extractClippedVersions(response);

        pruneSitePolygonsCache();
        ApiSlice.pruneCache("validations");
        invalidatePolygonMapTiles();

        const refreshedPolygons = await loadAllSitePolygons({
          entityName: "sites",
          entityUuid: site.uuid,
          enabled: site.uuid != null && site.uuid !== ""
        });

        const [, , refreshedOverlapValidations] = await Promise.all([
          refetchPolygons(),
          fetchAllValidationPages(true),
          fetchOverlapValidations(true)
        ]);

        openOverlapFixResultsModal(
          buildOverlapFixResultPolygons(
            fixedVersions,
            fixableCandidates,
            notFixableCandidates,
            refreshedPolygons,
            refreshedOverlapValidations
          )
        );
        closeMapPopups();
        setPolygonTableHoveredUuid(null);
        closePolygonProgressToast(POLYGON_TOAST_IDS.fixingOverlaps);
        showPolygonCompleteToast(toastLabels.fixingOverlapsComplete);
      } catch (error) {
        Log.error("Failed to fix selected polygon overlaps:", error);
        closePolygonProgressToast(POLYGON_TOAST_IDS.fixingOverlaps);
        showPolygonErrorToast(t("Failed to fix selected polygon overlaps"));
      } finally {
        setIsFixingOverlaps(false);
        setFixingOverlapsCount(0);
      }
    },
    [
      closeMapPopups,
      fetchAllValidationPages,
      fetchOverlapValidations,
      invalidatePolygonMapTiles,
      openOverlapFixResultsModal,
      refetchPolygons,
      site.uuid,
      t,
      toastLabels
    ]
  );

  const handleOpenSubmitPolygonsModal = useCallback(() => {
    if (hasSelectedOverlapFailure) {
      const overlapSummary = selectedOverlapFixSummary;
      clearBulkTableSelection();
      void handleOverlapFix(overlapSummary);
      return;
    }

    setSubmitPayload({
      submittablePolygonUuids: selectedSubmittablePolygonUuids,
      submittedNames: selectedSubmittablePolygons.map(polygon => polygon.name ?? t("Unnamed polygon")),
      eligibleCount: selectedSubmittablePolygons.length,
      totalCount: selectedSitePolygons.length
    });
    clearBulkTableSelection();
    setSubmitPolygonsModal(true);
  }, [
    clearBulkTableSelection,
    handleOverlapFix,
    hasSelectedOverlapFailure,
    selectedOverlapFixSummary,
    selectedSitePolygons.length,
    selectedSubmittablePolygonUuids,
    selectedSubmittablePolygons,
    t
  ]);

  const schedulePolygonSubmittedModal = useCallback(() => {
    window.setTimeout(() => {
      setPolygonSubmittedModal(true);
    }, 200);
  }, []);

  const handleSubmitPolygonsModalChange = useCallback(
    (open: boolean) => {
      setSubmitPolygonsModal(open);
      if (!open) {
        setSubmitPayload(null);
      }
      if (!open && pendingPolygonSubmittedModalRef.current) {
        pendingPolygonSubmittedModalRef.current = false;
        schedulePolygonSubmittedModal();
      }
    },
    [schedulePolygonSubmittedModal]
  );

  const handleMapPopupSubmitModalChange = useCallback(
    (open: boolean) => {
      if (open) {
        return;
      }
      setPolygonSubmitConfirmation(null);
      if (pendingPolygonSubmittedModalRef.current) {
        pendingPolygonSubmittedModalRef.current = false;
        schedulePolygonSubmittedModal();
      }
    },
    [schedulePolygonSubmittedModal, setPolygonSubmitConfirmation]
  );

  const handleConfirmMapPopupSubmit = useCallback(async () => {
    const sitePolygonUuid = polygonSubmitConfirmation?.sitePolygonUuid;
    if (sitePolygonUuid == null || sitePolygonUuid === "") {
      return;
    }

    const polygon = polygonsData.find(item => item.uuid === sitePolygonUuid);
    const polygonName = polygon?.name ?? t("Unnamed polygon");

    try {
      showPolygonProgressToast(t, getSubmittingProgressLabel(t, 1), POLYGON_TOAST_IDS.submitting);
      await bulkUpdateSitePolygonStatus([sitePolygonUuid], POLYGON_PENDING_APPROVAL as PolygonStatus, "");
      pruneSitePolygonsCache();
      closeMapPopups();
      invalidatePolygonMapTiles();
      setSubmittedPolygonNames([polygonName]);
      closePolygonProgressToast(POLYGON_TOAST_IDS.submitting);
      showPolygonCompleteToast(toastLabels.submittingComplete);
      pendingPolygonSubmittedModalRef.current = true;
      setShouldRefetchPolygonData(true);
      void refetchPolygons();
    } catch (error) {
      Log.error("Failed to submit polygon from map popup:", error);
      closePolygonProgressToast(POLYGON_TOAST_IDS.submitting);
      openNotification("error", t("Error!"), t("Error submitting polygon"));
      throw error;
    }
  }, [
    closeMapPopups,
    invalidatePolygonMapTiles,
    openNotification,
    polygonSubmitConfirmation?.sitePolygonUuid,
    polygonsData,
    refetchPolygons,
    setShouldRefetchPolygonData,
    t,
    toastLabels
  ]);

  const handleConfirmBulkSubmit = useCallback(async () => {
    const submittablePolygonUuids = submitPayload?.submittablePolygonUuids ?? [];
    if (submittablePolygonUuids.length === 0) {
      openNotification("error", t("Error!"), t("No selected polygons are eligible for submission"));
      return;
    }

    const submittedNames = submitPayload?.submittedNames ?? [];

    try {
      showPolygonProgressToast(
        t,
        getSubmittingProgressLabel(t, submittablePolygonUuids.length),
        POLYGON_TOAST_IDS.submitting
      );
      await bulkUpdateSitePolygonStatus(submittablePolygonUuids, POLYGON_PENDING_APPROVAL as PolygonStatus, "");
      pruneSitePolygonsCache();
      closeMapPopups();
      setPolygonTableHoveredUuid(null);
      invalidatePolygonMapTiles();
      setSubmittedPolygonNames(submittedNames);
      setSubmitPayload(null);
      closePolygonProgressToast(POLYGON_TOAST_IDS.submitting);
      showPolygonCompleteToast(toastLabels.submittingComplete);
      pendingPolygonSubmittedModalRef.current = true;
      void refetchPolygons();
    } catch (error) {
      Log.error("Failed to submit selected polygons:", error);
      closePolygonProgressToast(POLYGON_TOAST_IDS.submitting);
      openNotification("error", t("Error!"), t("Error submitting polygons"));
      throw error;
    }
  }, [closeMapPopups, invalidatePolygonMapTiles, openNotification, refetchPolygons, submitPayload, t, toastLabels]);

  const handleBulkDownload = useCallback(
    async (geometryPolygonUuids: string[], downloadSitePolygons: typeof selectedSitePolygons) => {
      if (geometryPolygonUuids.length === 0) {
        showToast({
          label: t("Could not find selected polygons to download"),
          type: "error",
          placement: "bottom",
          duration: 5000,
          maxWidth: "auto"
        });
        return;
      }

      try {
        setIsDownloadingSelectedPolygons(true);
        showPolygonProgressToast(
          t,
          getDownloadingPolygonsProgressLabel(t, geometryPolygonUuids.length),
          POLYGON_TOAST_IDS.downloading
        );
        const filename =
          downloadSitePolygons.length === 1
            ? downloadSitePolygons[0].name ?? "polygon"
            : `${site.name ?? "polygons"}-${new Date().toISOString().slice(0, 10)}`;
        await downloadMultiplePolygonsGeoJson(geometryPolygonUuids, filename);
        closePolygonProgressToast(POLYGON_TOAST_IDS.downloading);
        showPolygonCompleteToast(toastLabels.downloadingPolygonsComplete);
      } catch (error) {
        Log.error("Failed to download selected polygons:", error);
        closePolygonProgressToast(POLYGON_TOAST_IDS.downloading);
        showToast({
          label: t("Error downloading polygon"),
          type: "error",
          placement: "bottom",
          duration: 5000,
          maxWidth: "auto"
        });
      } finally {
        setIsDownloadingSelectedPolygons(false);
      }
    },
    [site.name, t, toastLabels]
  );

  const handleBulkDownloadClick = useCallback(() => {
    const geometryPolygonUuids = selectedGeometryPolygonUuids;
    const downloadSitePolygons = selectedSitePolygons;
    clearBulkTableSelection();
    void handleBulkDownload(geometryPolygonUuids, downloadSitePolygons);
  }, [clearBulkTableSelection, handleBulkDownload, selectedGeometryPolygonUuids, selectedSitePolygons]);

  const openPolygonEditDrawerForRow = useCallback(
    (row: PolygonTableRow) => {
      const sitePolygon = polygonsData.find(polygon => (polygon.polygonUuid ?? polygon.uuid) === row.id);
      openPolygonEditDrawerForSitePolygon(sitePolygon, row.polygonName);
    },
    [polygonsData]
  );

  const handleBulkEditDetails = useCallback(() => {
    if (selectedRows.length === 0) {
      return;
    }
    if (selectedRows.length === 1) {
      openPolygonEditDrawerForRow(selectedRows[0]);
      clearBulkTableSelection();
      return;
    }
    setBulkEditPayload({
      polygons: selectedRows,
      sitePolygonUuids: selectedSitePolygonUuids
    });
    clearBulkTableSelection();
    setShowBulkEditDrawer(true);
  }, [clearBulkTableSelection, openPolygonEditDrawerForRow, selectedRows, selectedSitePolygonUuids]);

  const handleBulkEditSave = useCallback(
    async (attributeChanges: BulkSitePolygonAttributeChanges) => {
      const sitePolygonUuids = bulkEditPayload?.sitePolygonUuids ?? [];
      if (sitePolygonUuids.length === 0) {
        openNotification("error", t("Error!"), t("Could not find selected polygons to update"));
        return;
      }

      try {
        setIsBulkUpdatingPolygons(true);
        showPolygonProgressToast(t, toastLabels.savingChangesProgress, POLYGON_TOAST_IDS.savingChanges);
        await bulkUpdateSitePolygonAttributes(sitePolygonUuids, attributeChanges);
        closeMapPopups();
        setPolygonTableHoveredUuid(null);
        invalidatePolygonMapTiles();
        setShowBulkEditDrawer(false);
        setBulkEditPayload(null);
        await refetchPolygons();
        closePolygonProgressToast(POLYGON_TOAST_IDS.savingChanges);
        showPolygonCompleteToast(toastLabels.savingChangesComplete);
      } catch (error) {
        Log.error("Failed to update selected polygon details:", error);
        closePolygonProgressToast(POLYGON_TOAST_IDS.savingChanges);
        openNotification("error", t("Error!"), t("Error updating polygon details"));
      } finally {
        setIsBulkUpdatingPolygons(false);
      }
    },
    [bulkEditPayload, closeMapPopups, invalidatePolygonMapTiles, openNotification, refetchPolygons, t, toastLabels]
  );

  const startDrawing = useStartSitePolygonDrawing({ onClearTableSelection: clearTableSelection });

  const handleUndoPolygonDraw = useCallback(() => {
    dispatchUndoPolygonDrawEvent();
  }, []);

  useEffect(() => {
    const handleCanUndoChanged = (event: Event) => {
      const { canUndo } = (event as CustomEvent<PolygonDrawCanUndoChangedDetail>).detail ?? {};
      setCanUndoPolygonDraw(canUndo === true);
    };

    window.addEventListener(POLYGON_DRAW_CAN_UNDO_CHANGED_EVENT, handleCanUndoChanged);
    return () => {
      window.removeEventListener(POLYGON_DRAW_CAN_UNDO_CHANGED_EVENT, handleCanUndoChanged);
      setCanUndoPolygonDraw(false);
    };
  }, []);

  const showPolygonUndoButton =
    isEditPolygonOpen &&
    canUndoPolygonDraw &&
    (isUserDrawingEnabled || (editPolygon.isOpen && editPolygon.uuid !== ""));

  const startNewPolygonFlow = useCallback(() => {
    handleBulkDraw();
    startDrawing();
  }, [handleBulkDraw, startDrawing]);
  const { downloadAll, isDownloading: isDownloadingAllPolygons } = useDownloadSitePolygons({
    siteUuid: site.uuid,
    siteName: site.name
  });

  const polygonTableHighlight = useMemo(
    () => ({
      selectedPolygonUuids: suppressMapSelectionHighlight ? [] : selectedPolygonUuids,
      focusPolygonUuid,
      onFocusPolygonConsumed: handleFocusPolygonConsumed
    }),
    [selectedPolygonUuids, suppressMapSelectionHighlight, focusPolygonUuid, handleFocusPolygonConsumed]
  );

  const handleClearHover = useCallback(() => {
    setPolygonTableHoveredUuid(null);
  }, []);

  const { selectedTreesPlanted, selectedRestorationAreaHa } = useMemo(
    () =>
      selectedRows.reduce(
        (acc, row) => ({
          selectedTreesPlanted: acc.selectedTreesPlanted + row.treesPlanted,
          selectedRestorationAreaHa: acc.selectedRestorationAreaHa + row.area
        }),
        { selectedTreesPlanted: 0, selectedRestorationAreaHa: 0 }
      ),
    [selectedRows]
  );

  const selectedRestorationAreaRounded = Math.round(selectedRestorationAreaHa * 100) / 100;
  const hasPolygonSelection = selectedRows.length > 0;

  const shouldShowNoResults = !isSitePolygonsLoading && polygonRows.length === 0;

  useSyncPolygonTableSelectionStore(selectedRowIds);

  const polygonsTableStyles = useMemo(() => getPolygonsTableStyles(isStickyActive), [isStickyActive]);

  const bulkToolbarSubmitLabel = useMemo(
    () => (hasSelectedOverlapFailure ? t("Fix Overlap") : t("Submit")),
    [hasSelectedOverlapFailure, t]
  );

  const isBulkSubmitDisabled =
    !hasSelectedOverlapFailure && hasPolygonSelection && selectedSubmittablePolygonUuids.length === 0;

  useEffect(() => {
    const container = tableContainerRef.current?.children[0]?.children[0];
    if (container == null) return;
    const handleScroll = () => {
      setIsStickyActive(container.scrollLeft > 0);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isSitePolygonsLoading, shouldShowNoResults]);

  const loadingLabels = {
    fixingOverlaps: getFixingOverlapsProgressLabel(t, fixingOverlapsCount),
    validating: getValidatingProgressLabel(t, validatingPolygonCount),
    deleting: getDeletingProgressLabel(t, deletingPolygonCount),
    withProgress: t("Loading polygons ({loaded}/{total})", { loaded: polygonLoadProgress, total: polygonLoadTotal }),
    default: t("Loading polygons")
  };

  let loadingLabelKey: keyof typeof loadingLabels = "default";

  if (isFixingOverlaps) {
    loadingLabelKey = "fixingOverlaps";
  } else if (isValidatingPolygons) {
    loadingLabelKey = "validating";
  } else if (isDeletingPolygons) {
    loadingLabelKey = "deleting";
  } else if (polygonLoadTotal > 0) {
    loadingLabelKey = "withProgress";
  }

  const loadingLabel = loadingLabels[loadingLabelKey];

  return (
    <>
      <PolygonEditDrawerDataSync
        polygons={polygonsData}
        onRefetchPolygons={refetchPolygons}
        onOverlapFixed={handleDrawerOverlapFixed}
        onRunValidation={runPolygonValidation}
        onPolygonDeletingChange={handlePolygonDeletingChange}
      />
      <PageContent className="bg-theme-neutral-100">
        <PageItem
          title={t("Polygons")}
          flexProps={{ width: "100%" }}
          buttonProps={{
            variant: "secondary",
            size: "small",
            children: t("Download All"),
            leftIcon: <DownloadIcon />,
            loading: isDownloadingAllPolygons,
            disabled: site.uuid == null || site.uuid === "",
            onClick: () => {
              void downloadAll();
            }
          }}
          multiActionButtonProps={{
            mainActionLabel: t("Add"),
            size: "small",
            leftIcon: <PlusIcon />,
            mainActionOnClick: startNewPolygonFlow,
            otherActions: [
              {
                label: t("Draw Polygon"),
                onClick: startNewPolygonFlow,
                value: "draw-polygon"
              },
              {
                label: t("Upload"),
                onClick: () => {
                  setShowUploadModal(true);
                },
                value: "upload"
              }
            ],
            variant: "primary"
          }}
        >
          <PolygonToolbar
            resultCount={polygonRows.length}
            polygonSearch={polygonSearch}
            polygonFilters={polygonFilters}
            activeFilterLabels={activeFilterLabels}
            onSearchChange={setPolygonSearch}
            onApplyFilters={setPolygonFilters}
            onClearFilters={handleClearPolygonFilters}
          />
        </PageItem>

        <PolygonBulkActionToolbar
          visible={hasPolygonSelection}
          itemCount={selectedRows.length}
          isBulkEditDrawerOpen={showBulkEditDrawer}
          submitLabel={bulkToolbarSubmitLabel}
          polygons={selectedRows}
          polygonValidations={polygonValidations}
          selectedGeometryPolygonUuids={selectedGeometryPolygonUuids}
          isDownloading={isDownloadingSelectedPolygons}
          isValidating={isValidatingPolygons}
          onCancel={clearBulkTableSelection}
          onClearSelection={clearBulkTableSelection}
          onDelete={handleOpenDeletePolygonModal}
          onDownload={handleBulkDownloadClick}
          onEdit={handleBulkEditDetails}
          onViewPolygonDetails={openPolygonEditDrawerForRow}
          onRunValidation={handleRunValidation}
          onSubmit={handleOpenSubmitPolygonsModal}
          isOverlapFixAction={hasSelectedOverlapFailure}
          canAutoFixOverlap={hasFixableSelectedOverlap}
          isSubmitDisabled={isBulkSubmitDisabled}
        />

        <PolygonBulkEditDrawer
          selectedPolygons={bulkEditPayload?.polygons ?? []}
          open={showBulkEditDrawer}
          onOpenChange={open => {
            setShowBulkEditDrawer(open);
            if (!open) {
              setBulkEditPayload(null);
            }
          }}
          isSaving={isBulkUpdatingPolygons}
          onSave={handleBulkEditSave}
        />

        <UploadPolygons
          open={showUploadModal}
          siteUuid={site.uuid}
          onOpenChange={setShowUploadModal}
          onUploadSuccess={({ createdSitePolygonUuid, uploadedFileCount }) => {
            if (createdSitePolygonUuid != null && uploadedFileCount === 1) {
              setUploadedPolygonUuidToOpen(createdSitePolygonUuid);
            }
            void refetchPolygons();
          }}
          onUploadError={() => {
            setUploadErrorModal(true);
          }}
        />
        <SubmitPolygons
          open={showSubmitPolygonsModal}
          onOpenChange={handleSubmitPolygonsModalChange}
          eligibleCount={submitPayload?.eligibleCount ?? 0}
          totalCount={submitPayload?.totalCount ?? 0}
          onSubmit={handleConfirmBulkSubmit}
        />
        <SubmitPolygons
          open={polygonSubmitConfirmation != null}
          onOpenChange={handleMapPopupSubmitModalChange}
          eligibleCount={polygonSubmitConfirmation?.eligibleCount ?? 0}
          totalCount={polygonSubmitConfirmation?.totalCount ?? 0}
          onSubmit={handleConfirmMapPopupSubmit}
        />
        <PolygonSubmitted
          open={showPolygonSubmittedModal && submittedPolygonNames.length > 0}
          onOpenChange={handlePolygonSubmittedModalChange}
          polygons={submittedPolygonNames}
        />
        <DeletePolygon
          open={showDeletePolygonModal}
          onOpenChange={open => {
            setDeletePolygonModal(open);
            if (!open) {
              setDeletePayload(null);
            }
          }}
          polygons={deletePayload?.polygons ?? []}
          onDelete={handleBulkDelete}
        />
        <OverlapFix
          open={
            showOverlapFixModal &&
            (overlapFixResults.polygonsFixed.length > 0 || overlapFixResults.polygonsNotFixed.length > 0)
          }
          onClose={handleOverlapFixModalClose}
          polygonsFixed={overlapFixResults.polygonsFixed}
          polygonsNotFixed={overlapFixResults.polygonsNotFixed}
          onViewPolygon={handleViewOverlapFixPolygon}
        />
        <UploadError open={showUploadErrorModal} onOpenChange={setUploadErrorModal} />
        <UploadPhotos open={showUploadPhotosModal} onOpenChange={setShowUploadPhotosModal} />
        {editPhotoDetailsMedia != null && (
          <EditPhotoDetails
            key={editPhotoDetailsMedia.uuid}
            open
            data={editPhotoDetailsMedia}
            onClose={() => setEditPhotoDetailsMedia(null)}
          />
        )}

        <ResizeBox
          initialHeight={100}
          minHeight={100}
          maxHeight={600}
          className={classNames({
            "!h-[calc(100vh-66px)] w-screen": isEditPolygonOpen
          })}
        >
          <PolygonsMap
            entityModel={site}
            type="sites"
            className={classNames(
              "overflow-hidden",
              isEditPolygonOpen
                ? // TODO: Update `top-[70px]` when the navbar is redesigned so this offset matches the new header height.
                  "!fixed top-[70px] bottom-0 left-0 right-0 z-[37] !h-[calc(100vh-66px)] w-screen rounded-none"
                : "h-full w-full !rounded-[0.25rem_0.25rem_0_0]"
            )}
            polygons={polygonsData}
            onRefetchPolygons={refetchPolygons}
            isLoadingPolygons={isSitePolygonsLoading}
            freezeCameraZoom={isSitePolygonsLoading}
            polygonTableHighlight={polygonTableHighlight}
            overlapPolygons={overlapPolygonsForMap}
          />
          {showPolygonUndoButton && (
            <Button
              variant="secondary"
              leftIcon={<UndoIcon />}
              className="fixed bottom-2 left-[calc(32rem+(100vw-32rem)/2)] z-[38] -translate-x-1/2"
              onClick={handleUndoPolygonDraw}
            >
              {t("Undo")}
            </Button>
          )}
        </ResizeBox>

        {polygonLoadError != null && (
          <InlineMessage
            className="mt-4"
            variant="error"
            label={t("Unable to load polygons")}
            caption={t("Please retry loading polygons.")}
            actionLabel={t("Retry")}
            onActionClick={() => {
              void refetchPolygons();
            }}
          />
        )}

        {shouldShowNoResults ? (
          <Box>
            <Text textStyle="400-bold">{t("No results found")}</Text>
            <Text textStyle="400">
              {t("We couldn’t find any site areas matching your search. Try a different keyword.")}
            </Text>
          </Box>
        ) : (
          <>
            <Flex className="items-center justify-between gap-4 mobile:flex-col">
              <Flex className="items-center gap-4 mobile:w-full mobile:flex-col">
                <MetricCard
                  color="secondary.600"
                  icon={<TreeIcon />}
                  variant="medium"
                  title={t("Trees Planted")}
                  progress={totalTreesPlanted}
                  goal={Math.max(totalTreesPlanted, 1)}
                  selection={hasPolygonSelection ? selectedTreesPlanted : undefined}
                  tooltipContent={t("This is the sum of trees planted as reported in the polygon attributes")}
                  className="min-w-[12.5rem] mobile:w-full mobile:min-w-full"
                />
                <MetricCard
                  color="secondary.700"
                  icon={<AreaHectaresIcon />}
                  variant="medium"
                  title={t("Restoration Area")}
                  progress={totalRestorationAreaHa}
                  goal={Math.max(totalRestorationAreaHa, 1)}
                  selection={hasPolygonSelection ? selectedRestorationAreaRounded : undefined}
                  tooltipContent={t("This is the sum of hectares from the selected polygons")}
                  className="min-w-[12.5rem] mobile:w-full mobile:min-w-full"
                />
              </Flex>
              {polygonsWithOverlapCount > 0 && (
                <InlineMessage
                  actionLabel={t("Select Polygons")}
                  isButtonRight
                  size="small"
                  label={
                    polygonsWithOverlapCount === 1
                      ? t("1 overlap detected")
                      : t("{count} overlaps detected", { count: polygonsWithOverlapCount })
                  }
                  onActionClick={handleSelectOverlapPolygons}
                  variant="error"
                />
              )}
            </Flex>
            <PolygonTableInteractionActionsProvider onSelectChange={handleRowSelected}>
              <Box onMouseLeave={handleClearHover} position="relative">
                <Table<PolygonTableRow>
                  css={polygonsTableStyles}
                  containerRef={tableContainerRef}
                  data={isSitePolygonsLoading ? [] : polygonRows}
                  columns={columns}
                  showPagination
                  pageSize={10}
                  selectable
                  selectedRows={selectedRows}
                  onAllItemsSelected={onAllItemsSelected}
                  renderRow={renderPolygonTableRow}
                />
                {isSitePolygonsLoading && (
                  <Box py={20}>
                    <LoadingTable text={loadingLabel} />
                  </Box>
                )}
              </Box>
            </PolygonTableInteractionActionsProvider>
          </>
        )}
      </PageContent>
    </>
  );
};

const SitePolygonsTab: FC<SitePolygonsTabProps> = ({ site }) => (
  <AnrMapOverlayProvider>
    <PolygonEditDrawerProvider>
      <SitePolygonsTabContent site={site} />
    </PolygonEditDrawerProvider>
  </AnrMapOverlayProvider>
);

export default SitePolygonsTab;
