import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import classNames from "classnames";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import PolygonsMap from "@/components/elements/Map-mapbox/components/PolygonsMap";
import { dispatchUndoPolygonDrawEvent } from "@/components/elements/Map-mapbox/interactions/draftDrawEvents";
import { downloadMultiplePolygonsGeoJson } from "@/components/elements/Map-mapbox/utils";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
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
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useDate } from "@/hooks/useDate";
import { getThemedColor } from "@/lib/theme";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ResizeBox from "@/redesignComponents/containers/ResizableSplitView/ResizableBox";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
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
import { PolygonRow, PolygonTableRow } from "../components/PolygonTableRow";
import PolygonToolbar from "../components/PolygonToolbar";
import {
  buildOverlapFixResultPolygons,
  canAutoFixOverlapSelection,
  extractClippedVersions,
  getSelectedOverlapFixSummary,
  hasOverlapFailureInSelection
} from "../hooks/overlapFix.utils";
import { useDownloadSitePolygons } from "../hooks/useDownloadSitePolygons";
import { useSitePolygonFilters } from "../hooks/useSitePolygonFilters";
import { useSitePolygonOverlap } from "../hooks/useSitePolygonOverlap";
import { useSitePolygonTableData } from "../hooks/useSitePolygonTableData";
import { useStartSitePolygonDrawing } from "../hooks/useStartSitePolygonDrawing";

interface SitePolygonsTabProps {
  site: SiteFullDto;
}

const TOAST_PLACEMENT = "top-end" as const;
const SAVE_COMPLETE_TOAST_MS = 5000;

export type { PolygonTableRow } from "../components/PolygonTableRow";

const SitePolygonsTabContent: FC<SitePolygonsTabProps> = ({ site }) => {
  const t = useT();
  const { format } = useDate();
  const { isOpen: isEditPolygonOpen, suppressMapSelectionHighlight } = usePolygonEditDrawer();
  const { isUserDrawingEnabled, setSiteData, resetSiteMapInteractionState, closeMapPopups, invalidatePolygonMapTiles } =
    useMapAreaContext();
  const { openNotification } = useNotificationContext();

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const pendingOverlapFixFocusUuidRef = useRef<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOverlapFixModal, setOverlapFixModal] = useState(false);
  const [overlapFixResults, setOverlapFixResults] = useState<{
    polygonsFixed: OverlapFixPolygon[];
    polygonsNotFixed: OverlapFixPolygon[];
  }>({ polygonsFixed: [], polygonsNotFixed: [] });
  const [focusPolygonUuid, setFocusPolygonUuid] = useState<string | null>(null);
  const [showSubmitPolygonsModal, setSubmitPolygonsModal] = useState(false);
  const [showPolygonSubmittedModal, setPolygonSubmittedModal] = useState(false);
  const [submittedPolygonNames, setSubmittedPolygonNames] = useState<string[]>([]);
  const [showDeletePolygonModal, setDeletePolygonModal] = useState(false);
  const [showUploadErrorModal, setUploadErrorModal] = useState(false);
  const [showUploadPhotosModal, setShowUploadPhotosModal] = useState(false);
  const [showBulkEditDrawer, setShowBulkEditDrawer] = useState(false);
  const [isStickyActive, setIsStickyActive] = useState(false);
  const [isDownloadingSelectedPolygons, setIsDownloadingSelectedPolygons] = useState(false);
  const [isBulkUpdatingPolygons, setIsBulkUpdatingPolygons] = useState(false);
  const [hoveredPolygonUuid, setHoveredPolygonUuid] = useState<string | null>(null);
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
  const {
    selectedSitePolygons,
    selectedSitePolygonUuids,
    selectedDownloadPolygonUuids,
    selectedSubmittablePolygons,
    selectedSubmittablePolygonUuids
  } = useMemo(() => {
    const sitePolygons = polygonsData.filter(polygon => selectedRowIds.has(polygon.polygonUuid ?? polygon.uuid ?? ""));
    const submittablePolygons = sitePolygons.filter(
      polygon =>
        polygon.uuid != null && polygon.status !== POLYGON_PENDING_APPROVAL && polygon.status !== POLYGON_APPROVED
    );

    return {
      selectedSitePolygons: sitePolygons,
      selectedSitePolygonUuids: sitePolygons
        .map(polygon => polygon.uuid)
        .filter((uuid): uuid is string => uuid != null && uuid.length > 0),
      selectedDownloadPolygonUuids: sitePolygons
        .map(polygon => polygon.polygonUuid)
        .filter((uuid): uuid is string => uuid != null && uuid.length > 0),
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

  const handleFocusPolygonConsumed = useCallback(() => {
    setFocusPolygonUuid(null);
  }, []);

  const handleViewOverlapFixPolygon = useCallback(
    (polygonUuid: string) => {
      setOverlapFixModal(false);

      if (polygonFilters.hasOverlap) {
        pendingOverlapFixFocusUuidRef.current = polygonUuid;
        setPolygonFilters(current => ({ ...current, hasOverlap: false }));
        return;
      }

      setFocusPolygonUuid(polygonUuid);
    },
    [polygonFilters.hasOverlap, setPolygonFilters]
  );

  useEffect(() => {
    const pendingUuid = pendingOverlapFixFocusUuidRef.current;
    if (pendingUuid == null || polygonFilters.hasOverlap || isLoadingPolygons) {
      return;
    }

    pendingOverlapFixFocusUuidRef.current = null;
    setFocusPolygonUuid(pendingUuid);
  }, [polygonFilters.hasOverlap, isLoadingPolygons, polygonsData]);

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

  const handleBulkDraw = useCallback(() => {
    openPolygonEditDrawerForSitePolygon();
  }, []);

  const handleBulkDelete = useCallback(async () => {
    if (selectedSitePolygonUuids.length === 0) {
      openNotification("error", t("Error!"), t("Could not find selected polygons to delete"));
      return;
    }

    try {
      await bulkDeleteSitePolygons(selectedSitePolygonUuids);
      closeMapPopups();
      setHoveredPolygonUuid(null);
      clearTableSelection();
      invalidatePolygonMapTiles();
      await refetchPolygons();
      openNotification("success", t("Success!"), t("Polygons deleted successfully"));
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
      await createPolygonValidation({ polygonUuids });
      ApiSlice.pruneCache("validations");
      pruneSitePolygonsCache();
      await Promise.all([refetchPolygons(), fetchAllValidationPages(true), fetchOverlapValidations(true)]);
    },
    [refetchPolygons, fetchAllValidationPages, fetchOverlapValidations]
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

    showToast({
      label: t("Fixing overlaps..."),
      type: "info",
      placement: TOAST_PLACEMENT,
      duration: SAVE_COMPLETE_TOAST_MS,
      closableLabel: t("Close"),
      icon: <LoadingIcon boxSize={7} color="primary.700" animation="spin 1s linear infinite" />
    });

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
      setHoveredPolygonUuid(null);
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
      await bulkUpdateSitePolygonStatus(selectedSubmittablePolygonUuids, POLYGON_PENDING_APPROVAL as PolygonStatus, "");
      pruneSitePolygonsCache();
      closeMapPopups();
      setHoveredPolygonUuid(null);
      clearTableSelection();
      invalidatePolygonMapTiles();
      setSubmittedPolygonNames(submittedNames);
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
    if (selectedDownloadPolygonUuids.length === 0) {
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
      const filename =
        selectedSitePolygons.length === 1
          ? selectedSitePolygons[0].name ?? "polygon"
          : `${site.name ?? "polygons"}-${new Date().toISOString().slice(0, 10)}`;
      await downloadMultiplePolygonsGeoJson(selectedDownloadPolygonUuids, filename);
      showToast({
        label: t("Polygon successfully downloaded"),
        type: "success",
        placement: "bottom-end",
        duration: 5000
      });
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
  }, [selectedDownloadPolygonUuids, selectedSitePolygons, site.name, t]);

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
      return;
    }
    setShowBulkEditDrawer(true);
  }, [openPolygonEditDrawerForRow, selectedRows]);

  const handleBulkEditSave = useCallback(
    async (attributeChanges: BulkSitePolygonAttributeChanges) => {
      if (selectedSitePolygonUuids.length === 0) {
        openNotification("error", t("Error!"), t("Could not find selected polygons to update"));
        return;
      }

      try {
        setIsBulkUpdatingPolygons(true);
        await bulkUpdateSitePolygonAttributes(selectedSitePolygonUuids, attributeChanges);
        closeMapPopups();
        setHoveredPolygonUuid(null);
        clearTableSelection();
        invalidatePolygonMapTiles();
        setShowBulkEditDrawer(false);
        await refetchPolygons();
        showToast({
          label: t("Changes Saved"),
          type: "success",
          placement: TOAST_PLACEMENT,
          duration: SAVE_COMPLETE_TOAST_MS
        });
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
      hoveredPolygonUuid,
      selectedPolygonUuids: suppressMapSelectionHighlight ? [] : selectedPolygonUuids,
      onHoveredPolygonFromMap: setHoveredPolygonUuid,
      onPolygonClickedFromMap: handlePolygonClickedFromMap,
      focusPolygonUuid,
      onFocusPolygonConsumed: handleFocusPolygonConsumed
    }),
    [
      hoveredPolygonUuid,
      selectedPolygonUuids,
      suppressMapSelectionHighlight,
      handlePolygonClickedFromMap,
      focusPolygonUuid,
      handleFocusPolygonConsumed
    ]
  );

  const handleClearHover = useCallback(() => {
    setHoveredPolygonUuid(null);
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

  const shouldShowNoResults = !isLoadingPolygons && polygonRows.length === 0;

  const selectableRenderRow = useCallback(
    (row: PolygonTableRow, rowProps?: Record<string, unknown>) => (
      <PolygonRow
        row={row}
        rowProps={rowProps}
        isSelected={selectedRowIds.has(row.id)}
        isHovered={hoveredPolygonUuid === row.id}
        onHover={setHoveredPolygonUuid}
        onSelectChange={handleRowSelected}
      />
    ),
    [handleRowSelected, hoveredPolygonUuid, selectedRowIds]
  );

  const getPolygonsTableStyles = (isStickyTableActive: boolean) => ({
    "& table td": { height: "3rem" },
    "& table th:first-of-type": {
      position: "sticky",
      left: 0,
      zIndex: 2,
      background: getThemedColor("neutral", 200)
    },
    "& table td:first-of-type": {
      position: "sticky",
      left: 0,
      zIndex: 2,
      background: getThemedColor("neutral", 100),
      transition: "background-color 0.15s ease-in-out"
    },
    "& table th:nth-of-type(2)": {
      position: "sticky",
      left: "3rem",
      zIndex: 2,
      background: getThemedColor("neutral", 200),
      padding: 0
    },
    "& table td:nth-of-type(2)": {
      position: "sticky",
      left: "3rem",
      zIndex: 2,
      background: getThemedColor("neutral", 100),
      padding: 0,
      transition: "background-color 0.15s ease-in-out"
    },
    "& table tbody tr:hover td:nth-of-type(2), & table tbody tr:hover td:first-of-type, & table tbody tr[aria-selected='true'] td:nth-of-type(2), & table tbody tr[aria-selected='true'] td:first-of-type":
      {
        background: getThemedColor("primary", 100)
      },
    "& table th:nth-of-type(2) > div, & table td:nth-of-type(2) div": {
      position: "relative",
      padding: "0.75rem",
      display: "flex",
      alignItems: "center",
      height: "100%"
    },
    ...(isStickyTableActive && {
      "& table th:nth-of-type(2), & table td:nth-of-type(2)": {
        boxShadow: `inset -0.063rem 0 0 0 ${getThemedColor("neutral", 400)}`
      }
    })
  });

  useEffect(() => {
    const container = tableContainerRef.current?.children[0]?.children[0];
    if (container == null) return;
    const handleScroll = () => {
      setIsStickyActive(container.scrollLeft > 0);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isLoadingPolygons, shouldShowNoResults]);

  const loadingLabel =
    polygonLoadTotal > 0
      ? t("Loading polygons ({loaded}/{total})", { loaded: polygonLoadProgress, total: polygonLoadTotal })
      : t("Loading polygons");

  return (
    <>
      <PolygonEditDrawerDataSync polygons={polygonsData} onRefetchPolygons={refetchPolygons} />
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
          submitLabel={hasSelectedOverlapFailure ? t("Fix Overlap") : t("Submit")}
          polygons={selectedRows}
          polygonValidations={polygonValidations}
          selectedPolygonUuids={selectedDownloadPolygonUuids}
          isDownloading={isDownloadingSelectedPolygons}
          onCancel={clearTableSelection}
          onDelete={() => setDeletePolygonModal(true)}
          onDownload={() => void handleBulkDownload()}
          onEdit={handleBulkEditDetails}
          onViewPolygonDetails={openPolygonEditDrawerForRow}
          onRunValidation={handleRunValidation}
          onSubmit={handleBulkSubmit}
          isOverlapFixAction={hasSelectedOverlapFailure}
          canAutoFixOverlap={hasFixableSelectedOverlap}
        />

        <PolygonBulkEditDrawer
          selectedPolygons={selectedRows}
          open={showBulkEditDrawer}
          onOpenChange={setShowBulkEditDrawer}
          isSaving={isBulkUpdatingPolygons}
          onSave={handleBulkEditSave}
        />

        <UploadPolygons
          open={showUploadModal}
          siteUuid={site.uuid}
          onOpenChange={setShowUploadModal}
          onUploadSuccess={() => {
            void refetchPolygons();
          }}
          onUploadError={() => {
            setUploadErrorModal(true);
          }}
        />
        <SubmitPolygons
          open={showSubmitPolygonsModal}
          onOpenChange={setSubmitPolygonsModal}
          eligibleCount={selectedSubmittablePolygons.length}
          totalCount={selectedSitePolygons.length}
          onSubmit={handleBulkSubmit}
        />
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
              "h-full w-full  ",
              isEditPolygonOpen
                ? // TODO: Update `top-[70px]` when the navbar is redesigned so this offset matches the new header height.
                  "fixed top-[70px] bottom-0 left-0 right-0 z-[37] !h-[calc(100vh-66px)] w-screen rounded-none"
                : "h-full w-full !rounded-[0.25rem_0.25rem_0_0]"
            )}
            polygons={polygonsData}
            onRefetchPolygons={refetchPolygons}
            polygonTableHighlight={polygonTableHighlight}
            overlapPolygons={overlapPolygons}
          />
          {isEditPolygonOpen && isUserDrawingEnabled && (
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

        {isLoadingPolygons ? (
          <Box className="py-4">
            <LoadingContainer loading />
            <Text textStyle="400" color="neutral.700" className="mt-2">
              {loadingLabel}
            </Text>
          </Box>
        ) : shouldShowNoResults ? (
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
                  actionLabel={t("Selected Polygons")}
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
            <Box onMouseLeave={handleClearHover}>
              <Table<PolygonTableRow>
                css={getPolygonsTableStyles(isStickyActive)}
                containerRef={tableContainerRef}
                data={polygonRows}
                columns={columns}
                showPagination
                pageSize={10}
                selectable
                selectedRows={selectedRows}
                onAllItemsSelected={onAllItemsSelected}
                renderRow={selectableRenderRow}
              />
            </Box>
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
