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
import { useNotificationContext } from "@/context/notification.provider";
import {
  EMPTY_POLYGONS,
  PolygonEditDrawerDataSync,
  PolygonEditDrawerProvider,
  usePolygonEditDrawer
} from "@/context/polygonEditDrawer.provider";
import { openPolygonEditDrawerForSitePolygon } from "@/context/polygonEditDrawer.utils";
import { setPolygonTableHoveredUuid, useSyncPolygonTableSelectionStore } from "@/context/polygonTableInteraction.store";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useDate } from "@/hooks/useDate";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ResizeBox from "@/redesignComponents/containers/ResizableSplitView/ResizableBox";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import LoadingTable from "@/redesignComponents/dataDisplay/Table/components/LoadingTable";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { useTableSelection } from "@/redesignComponents/dataDisplay/Table/useTableSelection";
import {
  AreaHectaresIcon,
  DownloadIcon,
  LoadingIcon,
  PlusIcon,
  TreeIcon
} from "@/redesignComponents/foundations/Icons";
import UndoIcon from "@/redesignComponents/foundations/Icons/Function/UndoIcon";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

import DeletePolygon from "../components/Modals/DeletePolygon";
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
  buildOverlapFixResultPolygons,
  canAutoFixOverlapSelection,
  extractClippedVersions,
  getSelectedOverlapFixSummary,
  hasOverlapFailureInSelection,
  resolveActivePolygonAfterOverlapFix
} from "../hooks/overlapFix.utils";
import { useDownloadSitePolygons } from "../hooks/useDownloadSitePolygons";
import { useSitePolygonFilters } from "../hooks/useSitePolygonFilters";
import { useSitePolygonOverlap } from "../hooks/useSitePolygonOverlap";
import { useSitePolygonTableData } from "../hooks/useSitePolygonTableData";
import { useStartSitePolygonDrawing } from "../hooks/useStartSitePolygonDrawing";

interface SitePolygonsTabProps {
  site: SiteFullDto;
}

const TOAST_PLACEMENT = "bottom-end" as const;
const SAVE_COMPLETE_TOAST_MS = 5000;

const showProgressToast = (t: (key: string) => string, label: string) =>
  showToast({
    label,
    type: "info",
    placement: TOAST_PLACEMENT,
    duration: SAVE_COMPLETE_TOAST_MS,
    closableLabel: t("Close"),
    icon: <LoadingIcon boxSize={7} color="primary.700" animation="spin 1s linear infinite" />
  });

const showCompleteToast = (label: string) =>
  showToast({
    label,
    type: "success",
    placement: TOAST_PLACEMENT,
    duration: SAVE_COMPLETE_TOAST_MS
  });

export type { PolygonTableRow } from "../components/PolygonTableRow";

const SitePolygonsTabContent: FC<SitePolygonsTabProps> = ({ site }) => {
  const t = useT();
  const { format } = useDate();
  const { isOpen: isEditPolygonOpen, suppressMapSelectionHighlight } = usePolygonEditDrawer();
  const { isUserDrawingEnabled, setSiteData, resetSiteMapInteractionState, closeMapPopups, invalidatePolygonMapTiles } =
    useMapAreaContext();
  const { openNotification } = useNotificationContext();

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const pendingOverlapFixPolygonIdRef = useRef<string | null>(null);
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
  const [isStickyActive, setIsStickyActive] = useState(false);
  const [isDownloadingSelectedPolygons, setIsDownloadingSelectedPolygons] = useState(false);
  const [isBulkUpdatingPolygons, setIsBulkUpdatingPolygons] = useState(false);
  const [isValidatingPolygons, setIsValidatingPolygons] = useState(false);
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
  const isSitePolygonsLoading = isLoadingPolygons || isValidatingPolygons;

  const { allValidations, fetchAllValidationPages } = useAllSiteValidations(site.uuid);
  const polygonValidations = useMemo(() => buildPolygonValidationsMap(allValidations), [allValidations]);

  const { polygonRows, columns, totalTreesPlanted, totalRestorationAreaHa } = useSitePolygonTableData({
    polygonsData,
    t,
    format
  });
  const { polygonsWithOverlapCount, overlapPolygons, fetchOverlapValidations } = useSitePolygonOverlap({
    siteUuid: site.uuid,
    polygonsData
  });

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
    () => getSelectedOverlapFixSummary(selectedRows, polygonValidations, polygonsData),
    [selectedRows, polygonValidations, polygonsData]
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

  const handleOpenDeletePolygonModal = useCallback(() => {
    setDeletePolygonModal(true);
  }, []);

  const handleBulkDraw = useCallback(() => {
    openPolygonEditDrawerForSitePolygon();
  }, []);

  const handleBulkDelete = useCallback(async () => {
    if (selectedSitePolygonUuids.length === 0) {
      openNotification("error", t("Error!"), t("Could not find selected polygons to delete"));
      return;
    }

    try {
      showProgressToast(t, t("Deleting Polygons..."));
      await bulkDeleteSitePolygons(selectedSitePolygonUuids);
      closeMapPopups();
      setPolygonTableHoveredUuid(null);
      clearTableSelection();
      invalidatePolygonMapTiles();
      await refetchPolygons();
      showCompleteToast(t("Deletion Complete"));
    } catch (error) {
      Log.error("Failed to delete selected polygons:", error);
      openNotification("error", t("Error!"), t("Error deleting polygons"));
      throw error;
    }
  }, [
    clearTableSelection,
    closeMapPopups,
    invalidatePolygonMapTiles,
    openNotification,
    refetchPolygons,
    selectedSitePolygonUuids,
    t
  ]);

  const handlePolygonSubmittedModalChange = useCallback((open: boolean) => {
    setPolygonSubmittedModal(open);
    if (!open) {
      setSubmittedPolygonNames([]);
    }
  }, []);

  const handleRunValidation = useCallback(
    async (polygonUuids: string[]) => {
      if (polygonUuids.length === 0) return;
      try {
        setIsValidatingPolygons(true);
        await createPolygonValidation({ polygonUuids });
        ApiSlice.pruneCache("validations");
        pruneSitePolygonsCache();
        await Promise.all([refetchPolygons(), fetchAllValidationPages(true), fetchOverlapValidations(true)]);
      } catch (error) {
        Log.error("Failed to validate selected polygons:", error);
        openNotification("error", t("Error!"), t("Failed to validate polygons"));
        throw error;
      } finally {
        setIsValidatingPolygons(false);
      }
    },
    [fetchAllValidationPages, fetchOverlapValidations, openNotification, refetchPolygons, t]
  );

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

  const handleOverlapFix = useCallback(async () => {
    const { fixableCandidates, notFixableCandidates } = selectedOverlapFixSummary;

    if (fixableCandidates.length === 0) {
      openOverlapFixResultsModal({
        polygonsFixed: [],
        polygonsNotFixed: notFixableCandidates.map(({ id, name }) => ({ id, name }))
      });
      return;
    }

    showProgressToast(t, t("Fixing Polygon Overlaps..."));

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
      clearTableSelection();
      closeMapPopups();
      setPolygonTableHoveredUuid(null);
      showCompleteToast(t("Overlap Fix Complete"));
    } catch (error) {
      Log.error("Failed to fix selected polygon overlaps:", error);
      showToast({
        label: t("Failed to fix selected polygon overlaps"),
        type: "error",
        placement: TOAST_PLACEMENT,
        duration: SAVE_COMPLETE_TOAST_MS,
        closableLabel: t("Close")
      });
    }
  }, [
    clearTableSelection,
    closeMapPopups,
    fetchAllValidationPages,
    fetchOverlapValidations,
    invalidatePolygonMapTiles,
    openOverlapFixResultsModal,
    refetchPolygons,
    selectedOverlapFixSummary,
    site.uuid,
    t
  ]);

  const handleBulkSubmit = useCallback(async () => {
    if (hasSelectedOverlapFailure) {
      await handleOverlapFix();
      return;
    }

    if (selectedSubmittablePolygonUuids.length === 0) {
      openNotification("error", t("Error!"), t("No selected polygons are eligible for submission"));
      return;
    }

    const submittedNames = selectedSubmittablePolygons.map(polygon => polygon.name ?? t("Unnamed polygon"));

    try {
      showProgressToast(t, t("Submitting Polygons..."));
      await bulkUpdateSitePolygonStatus(selectedSubmittablePolygonUuids, POLYGON_PENDING_APPROVAL as PolygonStatus, "");
      pruneSitePolygonsCache();
      closeMapPopups();
      setPolygonTableHoveredUuid(null);
      clearTableSelection();
      invalidatePolygonMapTiles();
      setSubmittedPolygonNames(submittedNames);
      showCompleteToast(t("Submission Complete"));
      window.setTimeout(() => {
        setPolygonSubmittedModal(true);
      }, 0);
      void refetchPolygons();
    } catch (error) {
      Log.error("Failed to submit selected polygons:", error);
      openNotification("error", t("Error!"), t("Error submitting polygons"));
    }
  }, [
    clearTableSelection,
    closeMapPopups,
    handleOverlapFix,
    hasSelectedOverlapFailure,
    invalidatePolygonMapTiles,
    openNotification,
    refetchPolygons,
    selectedSubmittablePolygons,
    selectedSubmittablePolygonUuids,
    t
  ]);

  const handleBulkDownload = useCallback(async () => {
    if (selectedGeometryPolygonUuids.length === 0) {
      showToast({
        label: t("Could not find selected polygons to download"),
        type: "error",
        placement: "bottom-end",
        duration: 5000
      });
      return;
    }

    try {
      setIsDownloadingSelectedPolygons(true);
      showProgressToast(t, t("Downloading Polygons..."));
      const filename =
        selectedSitePolygons.length === 1
          ? selectedSitePolygons[0].name ?? "polygon"
          : `${site.name ?? "polygons"}-${new Date().toISOString().slice(0, 10)}`;
      await downloadMultiplePolygonsGeoJson(selectedGeometryPolygonUuids, filename);
      showCompleteToast(t("Download Complete"));
    } catch (error) {
      Log.error("Failed to download selected polygons:", error);
      showToast({
        label: t("Error downloading polygon"),
        type: "error",
        placement: "bottom-end",
        duration: 5000
      });
    } finally {
      setIsDownloadingSelectedPolygons(false);
    }
  }, [selectedGeometryPolygonUuids, selectedSitePolygons, site.name, t]);

  const handleBulkDownloadClick = useCallback(() => {
    void handleBulkDownload();
  }, [handleBulkDownload]);

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
      clearTableSelection();
      return;
    }
    setShowBulkEditDrawer(true);
  }, [clearTableSelection, openPolygonEditDrawerForRow, selectedRows]);

  const handleBulkEditSave = useCallback(
    async (attributeChanges: BulkSitePolygonAttributeChanges) => {
      if (selectedSitePolygonUuids.length === 0) {
        openNotification("error", t("Error!"), t("Could not find selected polygons to update"));
        return;
      }

      try {
        setIsBulkUpdatingPolygons(true);
        showProgressToast(t, t("Saving Changes..."));
        await bulkUpdateSitePolygonAttributes(selectedSitePolygonUuids, attributeChanges);
        closeMapPopups();
        setPolygonTableHoveredUuid(null);
        clearTableSelection();
        invalidatePolygonMapTiles();
        setShowBulkEditDrawer(false);
        await refetchPolygons();
        showCompleteToast(t("Changes Saved"));
      } catch (error) {
        Log.error("Failed to update selected polygon details:", error);
        openNotification("error", t("Error!"), t("Error updating polygon details"));
      } finally {
        setIsBulkUpdatingPolygons(false);
      }
    },
    [
      clearTableSelection,
      closeMapPopups,
      invalidatePolygonMapTiles,
      openNotification,
      refetchPolygons,
      selectedSitePolygonUuids,
      t
    ]
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

  useEffect(() => {
    if (!isUserDrawingEnabled) {
      setCanUndoPolygonDraw(false);
    }
  }, [isUserDrawingEnabled]);
  const startNewPolygonFlow = useCallback(() => {
    handleBulkDraw();
    startDrawing();
  }, [handleBulkDraw, startDrawing]);
  const { downloadAll, isDownloading: isDownloadingAllPolygons } = useDownloadSitePolygons({
    siteUuid: site.uuid,
    siteName: site.name
  });

  const handlePolygonClickedFromMap = useCallback(
    (uuid: string) => {
      setSelectedRowIds(prev => {
        if (prev.has(uuid)) return prev;
        const next = new Set(prev);
        next.add(uuid);
        return next;
      });
    },
    [setSelectedRowIds]
  );

  const polygonTableHighlight = useMemo(
    () => ({
      selectedPolygonUuids: suppressMapSelectionHighlight ? [] : selectedPolygonUuids,
      onPolygonClickedFromMap: handlePolygonClickedFromMap
    }),
    [selectedPolygonUuids, suppressMapSelectionHighlight, handlePolygonClickedFromMap]
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

  const loadingLabel =
    polygonLoadTotal > 0
      ? t("Loading polygons ({loaded}/{total})", { loaded: polygonLoadProgress, total: polygonLoadTotal })
      : t("Loading polygons");

  return (
    <>
      <PolygonEditDrawerDataSync
        polygons={polygonsData}
        onRefetchPolygons={refetchPolygons}
        onOverlapFixed={handleDrawerOverlapFixed}
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
          onCancel={clearTableSelection}
          onDelete={handleOpenDeletePolygonModal}
          onDownload={handleBulkDownloadClick}
          onEdit={handleBulkEditDetails}
          onViewPolygonDetails={openPolygonEditDrawerForRow}
          onRunValidation={handleRunValidation}
          onSubmit={handleBulkSubmit}
          isOverlapFixAction={hasSelectedOverlapFailure}
          canAutoFixOverlap={hasFixableSelectedOverlap}
        />

        {showBulkEditDrawer && (
          <PolygonBulkEditDrawer
            selectedPolygons={selectedRows}
            open
            onOpenChange={setShowBulkEditDrawer}
            isSaving={isBulkUpdatingPolygons}
            onSave={handleBulkEditSave}
          />
        )}

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
        {showSubmitPolygonsModal && (
          <SubmitPolygons
            open
            onOpenChange={setSubmitPolygonsModal}
            eligibleCount={selectedSubmittablePolygons.length}
            totalCount={selectedSitePolygons.length}
            onSubmit={handleBulkSubmit}
          />
        )}
        {showPolygonSubmittedModal && submittedPolygonNames.length > 0 && (
          <PolygonSubmitted
            open={showPolygonSubmittedModal}
            onOpenChange={handlePolygonSubmittedModalChange}
            polygons={submittedPolygonNames}
          />
        )}
        <DeletePolygon
          open={showDeletePolygonModal}
          onOpenChange={setDeletePolygonModal}
          polygons={selectedRows}
          onDelete={handleBulkDelete}
        />
        {showOverlapFixModal &&
          (overlapFixResults.polygonsFixed.length > 0 || overlapFixResults.polygonsNotFixed.length > 0) && (
            <OverlapFix
              open={showOverlapFixModal}
              onClose={handleOverlapFixModalClose}
              polygonsFixed={overlapFixResults.polygonsFixed}
              polygonsNotFixed={overlapFixResults.polygonsNotFixed}
              onViewPolygon={handleViewOverlapFixPolygon}
            />
          )}
        <UploadError open={showUploadErrorModal} onOpenChange={setUploadErrorModal} />
        <UploadPhotos open={showUploadPhotosModal} onOpenChange={setShowUploadPhotosModal} />

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
              isEditPolygonOpen
                ? // TODO: Update `top-[70px]` when the navbar is redesigned so this offset matches the new header height.
                  "!fixed top-[70px] bottom-0 left-0 right-0 z-[37] !h-[calc(100vh-66px)] w-screen rounded-none"
                : "h-full w-full !rounded-[0.25rem_0.25rem_0_0]"
            )}
            polygons={polygonsData}
            onRefetchPolygons={refetchPolygons}
            isLoadingPolygons={isSitePolygonsLoading}
            polygonTableHighlight={polygonTableHighlight}
            overlapPolygons={overlapPolygonsForMap}
          />
          {isEditPolygonOpen && isUserDrawingEnabled && canUndoPolygonDraw && (
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
                  onActionClick={() => {
                    setPolygonFilters(current => ({ ...current, hasOverlap: true }));
                  }}
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
